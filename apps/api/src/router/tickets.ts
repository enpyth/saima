import { ORPCError, os } from '@orpc/server'
import type { TicketSaleStat, TicketType } from '@saima/shared'
import type Stripe from 'stripe'
import { z } from 'zod'

import { env } from '../env'
import { supabaseAdmin } from '../supabase'
import { confirmTicketOrderFromSession, getStripeClient } from '../stripe'
import { mapTicketOrderWithDetails } from './mappers'
import { adminOnly, authed } from './procedures'
import type { EventRow, TicketOrderRow, TicketTypeRow } from './rows'
import { text, uuid } from './schemas'
import { getRows } from './supabase-result'

function summarizeTicketTypes(
  ticketTypes: TicketTypeRow[],
  orders: Pick<TicketOrderRow, 'ticket_type_id' | 'quantity' | 'status'>[],
): TicketType[] {
  return ticketTypes.map((ticketType) => {
    const sold = orders
      .filter((order) => order.ticket_type_id === ticketType.id && order.status === 'confirmed')
      .reduce((total, order) => total + order.quantity, 0)
    const reserved = orders
      .filter((order) => order.ticket_type_id === ticketType.id && order.status === 'pending_payment')
      .reduce((total, order) => total + order.quantity, 0)

    return {
      id: ticketType.id,
      eventPublicId: ticketType.event_public_id,
      name: ticketType.name,
      description: ticketType.description,
      priceCents: ticketType.price_cents,
      currency: ticketType.currency,
      capacity: ticketType.capacity,
      sold,
      reserved,
      remaining: Math.max(ticketType.capacity - sold - reserved, 0),
      saleStartsAt: ticketType.sale_starts_at,
      saleEndsAt: ticketType.sale_ends_at,
      isActive: ticketType.is_active,
    }
  })
}

async function getTicketTypeSummaries(eventPublicId?: string) {
  let query = supabaseAdmin
    .from('ticket_types')
    .select('id,event_public_id,name,description,price_cents,currency,capacity,sale_starts_at,sale_ends_at,is_active,created_at')
    .order('created_at', { ascending: true })

  if (eventPublicId) {
    query = query.eq('event_public_id', eventPublicId)
  }

  const ticketTypes = await getRows<TicketTypeRow[]>(query)
  if (ticketTypes.length === 0) {
    return []
  }

  const orders = await getRows<Pick<TicketOrderRow, 'ticket_type_id' | 'quantity' | 'status'>[]>(
    supabaseAdmin
      .from('ticket_orders')
      .select('ticket_type_id,quantity,status')
      .in(
        'ticket_type_id',
        ticketTypes.map((ticketType) => ticketType.id),
      ),
  )

  return summarizeTicketTypes(ticketTypes, orders)
}

export const ticketsRouter = {
  saleForEvent: os.input(z.object({ eventPublicId: text })).handler(async ({ input }) => {
    const event = await getRows<EventRow>(
      supabaseAdmin
        .from('events')
        .select('public_id,title,starts_at')
        .eq('public_id', input.eventPublicId)
        .eq('is_published', true)
        .single(),
    )
    const ticketTypes = (await getTicketTypeSummaries(input.eventPublicId)).filter((ticketType) => ticketType.isActive)

    return {
      eventPublicId: event.public_id,
      eventTitle: event.title,
      startsAt: event.starts_at,
      ticketTypes,
    }
  }),
  createCheckoutSession: authed
    .input(
      z.object({
        ticketTypeId: uuid,
        purchaserName: text,
        purchaserEmail: z.string().trim().email(),
        purchaserPhone: z.string().trim().optional(),
        quantity: z.number().int().min(1).max(10),
      }),
    )
    .handler(async ({ context, input }) => {
      let stripe
      try {
        stripe = getStripeClient()
      } catch (error) {
        throw new ORPCError('INTERNAL_SERVER_ERROR', {
          message: error instanceof Error ? error.message : 'Stripe is not configured.',
        })
      }

      const order = await getRows<TicketOrderRow>(
        supabaseAdmin.rpc('create_pending_ticket_order', {
          p_ticket_type_id: input.ticketTypeId,
          p_purchaser_user_id: context.user.id,
          p_purchaser_name: input.purchaserName,
          p_purchaser_email: input.purchaserEmail,
          p_purchaser_phone: input.purchaserPhone ?? null,
          p_quantity: input.quantity,
        }),
      )
      const ticketType = await getRows<TicketTypeRow>(
        supabaseAdmin
          .from('ticket_types')
          .select('id,event_public_id,name,description,price_cents,currency,capacity,sale_starts_at,sale_ends_at,is_active,created_at')
          .eq('id', order.ticket_type_id)
          .single(),
      )
      const event = await getRows<EventRow>(
        supabaseAdmin
          .from('events')
          .select('public_id,title,starts_at')
          .eq('public_id', order.event_public_id)
          .single(),
      )
      let session: Stripe.Checkout.Session

      try {
        session = await stripe.checkout.sessions.create({
          mode: 'payment',
          client_reference_id: order.id,
          customer_email: order.purchaser_email,
          success_url: `${env.webOrigin}/dashboard/visitor/tickets?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${env.webOrigin}/events/${order.event_public_id}?checkout=cancelled`,
          metadata: {
            ticket_order_id: order.id,
            ticket_type_id: order.ticket_type_id,
            event_public_id: order.event_public_id,
          },
          payment_intent_data: {
            metadata: {
              ticket_order_id: order.id,
              ticket_type_id: order.ticket_type_id,
              event_public_id: order.event_public_id,
            },
          },
          line_items: [
            {
              price_data: {
                currency: ticketType.currency.toLowerCase(),
                unit_amount: ticketType.price_cents,
                product_data: {
                  name: `${event.title} - ${ticketType.name}`,
                  description: ticketType.description ?? undefined,
                },
              },
              quantity: order.quantity,
            },
          ],
        })
      } catch (error) {
        await supabaseAdmin.from('ticket_orders').update({ status: 'cancelled' }).eq('id', order.id)
        throw error
      }

      const { error } = await supabaseAdmin
        .from('ticket_orders')
        .update({ stripe_checkout_session_id: session.id })
        .eq('id', order.id)

      if (error) {
        throw new ORPCError('INTERNAL_SERVER_ERROR', { message: error.message })
      }

      if (!session.url) {
        throw new ORPCError('INTERNAL_SERVER_ERROR', { message: 'Stripe did not return a checkout URL.' })
      }

      return {
        orderId: order.id,
        checkoutUrl: session.url,
      }
    }),
  syncCheckoutSession: authed
    .input(z.object({ sessionId: text }))
    .handler(async ({ context, input }) => {
      const stripe = getStripeClient()
      const session = await stripe.checkout.sessions.retrieve(input.sessionId)
      const orderId = session.metadata?.ticket_order_id ?? session.client_reference_id

      if (!orderId) {
        throw new ORPCError('BAD_REQUEST', { message: 'Stripe session is missing ticket order metadata.' })
      }

      const order = await getRows<Pick<TicketOrderRow, 'id' | 'purchaser_user_id' | 'status'>>(
        supabaseAdmin
          .from('ticket_orders')
          .select('id,purchaser_user_id,status')
          .eq('id', orderId)
          .single(),
      )

      if (order.purchaser_user_id !== context.user.id) {
        throw new ORPCError('FORBIDDEN', { message: 'This ticket order belongs to another account.' })
      }

      if (order.status === 'confirmed') {
        return { status: 'confirmed' as const }
      }

      const confirmed = await confirmTicketOrderFromSession(session)
      return { status: confirmed ? 'confirmed' as const : order.status }
    }),
  mine: authed.handler(async ({ context }) => {
    const pendingOrders = await getRows<Pick<TicketOrderRow, 'stripe_checkout_session_id'>[]>(
      supabaseAdmin
        .from('ticket_orders')
        .select('stripe_checkout_session_id')
        .eq('purchaser_user_id', context.user.id)
        .eq('status', 'pending_payment')
        .not('stripe_checkout_session_id', 'is', null),
    )

    if (pendingOrders.length > 0) {
      try {
        const stripe = getStripeClient()
        await Promise.all(
          pendingOrders.flatMap((order) =>
            order.stripe_checkout_session_id
              ? [
                  stripe.checkout.sessions
                    .retrieve(order.stripe_checkout_session_id)
                    .then((session) => confirmTicketOrderFromSession(session)),
                ]
              : [],
          ),
        )
      } catch (error) {
        console.error('Ticket payment sync failed:', error)
      }
    }

    const orders = await getRows<TicketOrderRow[]>(
      supabaseAdmin
        .from('ticket_orders')
        .select('*')
        .eq('purchaser_user_id', context.user.id)
        .eq('status', 'confirmed')
        .order('created_at', { ascending: false }),
    )

    if (orders.length === 0) {
      return []
    }

    const [ticketTypes, events] = await Promise.all([
      getRows<Array<Pick<TicketTypeRow, 'id' | 'name' | 'description'>>>(
        supabaseAdmin
          .from('ticket_types')
          .select('id,name,description')
          .in(
            'id',
            [...new Set(orders.map((order) => order.ticket_type_id))],
          ),
      ),
      getRows<Array<EventRow & { location: string }>>(
        supabaseAdmin
          .from('events')
          .select('public_id,title,starts_at,location')
          .in(
            'public_id',
            [...new Set(orders.map((order) => order.event_public_id))],
          ),
      ),
    ])

    return orders.map((order) =>
      mapTicketOrderWithDetails({
        ...order,
        ticket_types: ticketTypes.find((ticketType) => ticketType.id === order.ticket_type_id) ?? null,
        events: events.find((event) => event.public_id === order.event_public_id) ?? null,
      }),
    )
  }),
  salesStats: adminOnly.handler(async (): Promise<TicketSaleStat[]> => {
    const [events, ticketTypes] = await Promise.all([
      getRows<EventRow[]>(
        supabaseAdmin
          .from('events')
          .select('public_id,title,starts_at')
          .order('starts_at', { ascending: true }),
      ),
      getTicketTypeSummaries(),
    ])

    return ticketTypes.map((ticketType) => {
      const event = events.find((eventRow) => eventRow.public_id === ticketType.eventPublicId)

      return {
        eventPublicId: ticketType.eventPublicId,
        eventTitle: event?.title ?? ticketType.eventPublicId,
        startsAt: event?.starts_at ?? '',
        ticketTypeId: ticketType.id,
        ticketTypeName: ticketType.name,
        priceCents: ticketType.priceCents,
        currency: ticketType.currency,
        capacity: ticketType.capacity,
        sold: ticketType.sold,
        reserved: ticketType.reserved,
        remaining: ticketType.remaining,
        revenueCents: ticketType.sold * ticketType.priceCents,
      }
    })
  }),
}
