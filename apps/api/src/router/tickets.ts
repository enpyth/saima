import { ORPCError, os } from '@orpc/server'
import { getTicketQuantityLimit, type TicketCheckInResult, type TicketSaleInventory, type TicketSaleStat } from '@saima/shared'
import type Stripe from 'stripe'
import { z } from 'zod'

import { env } from '../env'
import { supabaseAdmin } from '../supabase'
import { confirmTicketOrderFromSession, getStripeClient } from '../stripe'
import {
  getConfiguredTicketTypeById,
  getConfiguredTicketTypes,
  summarizeConfiguredTicketTypes,
  summarizeTicketInventory,
} from '../tickets/ticket-types'
import { buildInvalidTicketCheckInResult, buildTicketCheckInResult } from '../tickets/ticket-checkin'
import { mapTicketOrderWithDetails } from './mappers'
import { adminOnly, authed } from './procedures'
import type { EventRow, TicketOrderRow } from './rows'
import { text, uuid } from './schemas'
import { getRows } from './supabase-result'

async function getTicketTypeSummaries(eventPublicId?: string) {
  const ticketTypes = getConfiguredTicketTypes(eventPublicId)
  if (ticketTypes.length === 0) {
    return []
  }

  const orders = await getTicketOrderQuantities([...new Set(ticketTypes.map((ticketType) => ticketType.eventPublicId))])

  return summarizeConfiguredTicketTypes(ticketTypes, orders)
}

async function getTicketInventory(eventPublicId: string) {
  const ticketTypes = getConfiguredTicketTypes(eventPublicId).filter((ticketType) => ticketType.isActive)
  if (ticketTypes.length === 0) {
    return []
  }

  const orders = await getTicketOrderQuantities([eventPublicId])

  return summarizeTicketInventory(ticketTypes, orders)
}

async function getTicketOrderQuantities(eventPublicIds: string[]) {
  const query = supabaseAdmin
    .from('ticket_orders')
    .select('event_public_id,ticket_type_id,quantity,capacity_units_per_ticket,status')

  try {
    return await getRows<
      Pick<TicketOrderRow, 'event_public_id' | 'ticket_type_id' | 'quantity' | 'capacity_units_per_ticket' | 'status'>[]
    >(eventPublicIds.length === 1 ? query.eq('event_public_id', eventPublicIds[0] ?? '') : query.in('event_public_id', eventPublicIds))
  } catch (error) {
    if (!isMissingCapacityUnitsColumnError(error)) {
      throw error
    }
  }

  const fallbackQuery = supabaseAdmin
    .from('ticket_orders')
    .select('event_public_id,ticket_type_id,quantity,status')

  return getRows<Pick<TicketOrderRow, 'event_public_id' | 'ticket_type_id' | 'quantity' | 'status'>[]>(
    eventPublicIds.length === 1
      ? fallbackQuery.eq('event_public_id', eventPublicIds[0] ?? '')
      : fallbackQuery.in('event_public_id', eventPublicIds),
  )
}

function isMissingCapacityUnitsColumnError(error: unknown) {
  return error instanceof Error && error.message.includes('capacity_units_per_ticket') && error.message.includes('does not exist')
}

export const ticketsRouter = {
  saleForEvent: os.input(z.object({ eventPublicId: text })).handler(async ({ input }): Promise<TicketSaleInventory> => {
    const event = await getRows<EventRow>(
      supabaseAdmin
        .from('events')
        .select('public_id,title,starts_at')
        .eq('public_id', input.eventPublicId)
        .eq('is_published', true)
        .single(),
    )
    const configuredSale = getConfiguredTicketTypes(input.eventPublicId)[0]

    return {
      eventPublicId: event.public_id,
      eventTitle: event.title,
      startsAt: event.starts_at,
      capacity: configuredSale?.capacity ?? 0,
      ticketInventories: await getTicketInventory(input.eventPublicId),
    }
  }),
  createCheckoutSession: authed
    .input(
      z.object({
        ticketTypeId: uuid,
        purchaserName: text,
        purchaserEmail: z.string().trim().email(),
        purchaserPhone: z.string().trim().optional(),
        quantity: z.number().int().min(1).max(100),
      }),
    )
    .handler(async ({ context, input }) => {
      const ticketType = getConfiguredTicketTypeById(input.ticketTypeId)
      if (!ticketType) {
        throw new ORPCError('BAD_REQUEST', { message: 'Ticket type not found.' })
      }
      if (input.quantity > getTicketQuantityLimit(ticketType.capacityUnitsPerTicket)) {
        throw new ORPCError('BAD_REQUEST', { message: 'Choose a valid quantity for this ticket type.' })
      }

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
          p_event_public_id: ticketType.eventPublicId,
          p_unit_price_cents: ticketType.priceCents,
          p_capacity: ticketType.capacity,
          p_capacity_units_per_ticket: ticketType.capacityUnitsPerTicket,
          p_sale_starts_at: ticketType.saleStartsAt,
          p_sale_ends_at: ticketType.saleEndsAt,
          p_is_active: ticketType.isActive,
          p_purchaser_user_id: context.user.id,
          p_purchaser_name: input.purchaserName,
          p_purchaser_email: input.purchaserEmail,
          p_purchaser_phone: input.purchaserPhone ?? null,
          p_quantity: input.quantity,
        }),
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
                unit_amount: ticketType.priceCents,
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

    const events = await getRows<Array<EventRow & { location: string }>>(
      supabaseAdmin
        .from('events')
        .select('public_id,title,starts_at,location')
        .in(
          'public_id',
          [...new Set(orders.map((order) => order.event_public_id))],
        ),
    )
    const ticketTypes = orders.map((order) => getConfiguredTicketTypeById(order.ticket_type_id)).filter((ticketType) => ticketType !== null)

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
        capacityUnitsPerTicket: ticketType.capacityUnitsPerTicket,
        sold: ticketType.sold,
        reserved: ticketType.reserved,
        remaining: ticketType.remaining,
        revenueCents: ticketType.sold * ticketType.priceCents,
      }
    })
  }),
  checkInByToken: adminOnly
    .input(z.object({ token: text }))
    .handler(async ({ context, input }): Promise<TicketCheckInResult> => {
      const order = await getRows<TicketOrderRow | null>(
        supabaseAdmin
          .from('ticket_orders')
          .select('*')
          .eq('qr_token', input.token)
          .maybeSingle(),
      )

      if (!order) {
        return buildInvalidTicketCheckInResult()
      }

      if (order.status !== 'confirmed') {
        return buildInvalidTicketCheckInResult('Ticket has not been paid.')
      }

      const [event, ticketType] = await Promise.all([
        getRows<(EventRow & { location: string }) | null>(
          supabaseAdmin
            .from('events')
            .select('public_id,title,starts_at,location')
            .eq('public_id', order.event_public_id)
            .maybeSingle(),
        ),
        Promise.resolve(getConfiguredTicketTypeById(order.ticket_type_id)),
      ])
      const mappedTicketType = ticketType
        ? { id: ticketType.id, name: ticketType.name, description: ticketType.description ?? null }
        : null

      if (order.checked_in_at) {
        return buildTicketCheckInResult({
          status: 'already_checked_in',
          order,
          event,
          ticketType: mappedTicketType,
        })
      }

      const checkedInOrder = await getRows<TicketOrderRow | null>(
        supabaseAdmin
          .from('ticket_orders')
          .update({
            checked_in_at: new Date().toISOString(),
            checked_in_by: context.user.id,
          })
          .eq('id', order.id)
          .eq('status', 'confirmed')
          .is('checked_in_at', null)
          .select('*')
          .maybeSingle(),
      )

      return buildTicketCheckInResult({
        status: checkedInOrder ? 'checked_in' : 'already_checked_in',
        order: checkedInOrder ?? order,
        event,
        ticketType: mappedTicketType,
      })
    }),
}
