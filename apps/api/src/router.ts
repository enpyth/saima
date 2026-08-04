import { ORPCError, os } from '@orpc/server'
import type { Role, TicketSaleStat, TicketType } from '@saima/shared'
import type Stripe from 'stripe'
import { z } from 'zod'

import type { ApiContext } from './context'
import { env } from './env'
import { createPresignedUploadUrl, getPublicR2Url } from './r2'
import { syncProfileForUser } from './profile-sync'
import { supabaseAdmin } from './supabase'
import { confirmTicketOrderFromSession, getStripeClient } from './stripe'

const authed = os.$context<ApiContext>().use(({ context, next }) => {
  if (!context.user) {
    throw new ORPCError('UNAUTHORIZED')
  }
  return next({
    context: {
      user: context.user,
    },
  })
})

const requireRole = (roles: Role[]) =>
  authed.use(({ context, next }) => {
    if (!roles.includes(context.user.role)) {
      throw new ORPCError('FORBIDDEN')
    }
    return next()
  })

const adminOnly = requireRole(['admin'])
const memberOnly = requireRole(['member', 'admin'])

const uuid = z.string().uuid()
const text = z.string().trim().min(1)
const imageContentTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] as const
const courseStatus = z.enum(['draft', 'published', 'archived'])
const activeCourseSlotStatuses = ['available', 'booked'] as const

type CourseSlotStatus = (typeof activeCourseSlotStatuses)[number]

type CourseRow = {
  id: string
  member_id: string
  title: string
  summary: string
  instrument: string
  level: string
  location: string
  status: 'draft' | 'published' | 'archived'
  cover_image_key: string | null
  cover_image_url: string | null
  created_at: string
  updated_at: string
  profiles?: {
    id: string
    full_name: string
    email: string
    avatar_url: string | null
  } | Array<{
    id: string
    full_name: string
    email: string
    avatar_url: string | null
  }> | null
}

type CourseSlotRow = {
  id: string
  course_id: string
  member_id: string
  starts_at: string
  ends_at: string
  status: string
  created_at: string
}

type TicketTypeRow = {
  id: string
  event_public_id: string
  name: string
  description: string | null
  price_cents: number
  currency: string
  capacity: number
  sale_starts_at: string | null
  sale_ends_at: string | null
  is_active: boolean
  created_at: string
}

type TicketOrderRow = {
  id: string
  ticket_type_id: string
  event_public_id: string
  purchaser_user_id: string | null
  purchaser_name: string
  purchaser_email: string
  purchaser_phone: string | null
  quantity: number
  unit_price_cents: number
  total_price_cents: number
  status: 'pending_payment' | 'confirmed' | 'cancelled'
  stripe_checkout_session_id: string | null
  stripe_payment_intent_id: string | null
  paid_at: string | null
  created_at: string
}

type EventRow = {
  public_id: string
  title: string
  starts_at: string
}

async function getRows<T>(query: PromiseLike<{ data: T | null; error: unknown }>): Promise<T> {
  const { data, error } = await query
  if (error) {
    const message =
      typeof error === 'object' && error && 'message' in error && typeof error.message === 'string'
        ? error.message
        : 'Supabase query failed'
    throw new ORPCError('INTERNAL_SERVER_ERROR', { message })
  }
  return data as T
}

function toHalfHourRange(startsAt: string, endsAt: string) {
  const starts = new Date(startsAt)
  const ends = new Date(endsAt)

  if (Number.isNaN(starts.getTime()) || Number.isNaN(ends.getTime())) {
    throw new ORPCError('BAD_REQUEST', { message: 'Invalid availability time.' })
  }

  if (starts >= ends) {
    throw new ORPCError('BAD_REQUEST', { message: 'End time must be after start time.' })
  }

  if (starts.getUTCMinutes() !== 0 && starts.getUTCMinutes() !== 30) {
    throw new ORPCError('BAD_REQUEST', { message: 'Availability must start on the hour or half hour.' })
  }

  if (starts.getUTCSeconds() !== 0 || starts.getUTCMilliseconds() !== 0) {
    throw new ORPCError('BAD_REQUEST', { message: 'Availability start time must not include seconds.' })
  }

  const slots: Array<{ startsAt: string; endsAt: string }> = []
  for (let cursor = starts.getTime(); cursor < ends.getTime(); cursor += 30 * 60 * 1000) {
    const slotEnd = cursor + 30 * 60 * 1000
    if (slotEnd > ends.getTime()) {
      break
    }
    slots.push({
      startsAt: new Date(cursor).toISOString(),
      endsAt: new Date(slotEnd).toISOString(),
    })
  }

  if (slots.length === 0) {
    throw new ORPCError('BAD_REQUEST', { message: 'Create at least one 30 minute slot.' })
  }

  if (slots.length > 96) {
    throw new ORPCError('BAD_REQUEST', { message: 'Create at most 96 half-hour slots at once.' })
  }

  return slots
}

async function getOwnedCourse(courseId: string, memberId: string) {
  const course = await getRows<{ id: string; member_id: string }>(
    supabaseAdmin
      .from('courses')
      .select('id,member_id')
      .eq('id', courseId)
      .single(),
  )

  if (course.member_id !== memberId) {
    throw new ORPCError('FORBIDDEN', { message: 'You can only manage your own courses.' })
  }

  return course
}

function attachSlots(courses: CourseRow[], slots: CourseSlotRow[]) {
  return courses.map((course) => ({
    ...course,
    profiles: Array.isArray(course.profiles) ? course.profiles[0] ?? null : course.profiles ?? null,
    course_slots: slots.filter(
      (slot): slot is CourseSlotRow & { status: CourseSlotStatus } =>
        slot.course_id === course.id &&
        activeCourseSlotStatuses.includes(slot.status as CourseSlotStatus),
    ),
  }))
}

function summarizeTicketTypes(ticketTypes: TicketTypeRow[], orders: Pick<TicketOrderRow, 'ticket_type_id' | 'quantity' | 'status'>[]): TicketType[] {
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

async function listPublicCourses() {
  const courses = await getRows<CourseRow[]>(
    supabaseAdmin
      .from('courses')
      .select(
        'id,member_id,title,summary,instrument,level,location,status,cover_image_key,cover_image_url,created_at,updated_at,profiles(id,full_name,email,avatar_url)',
      )
      .eq('status', 'published')
      .order('created_at', { ascending: false }),
  )

  if (courses.length === 0) {
    return []
  }

  const slots = await getRows<CourseSlotRow[]>(
    supabaseAdmin
      .from('course_slots')
      .select('id,course_id,member_id,starts_at,ends_at,status,created_at')
      .in(
        'course_id',
        courses.map((course) => course.id),
      )
      .eq('status', 'available')
      .gte('starts_at', new Date().toISOString())
      .order('starts_at', { ascending: true }),
  )

  return attachSlots(courses, slots)
}

export const router = {
  health: os.handler(() => ({
    ok: true,
    name: 'saima-api',
  })),

  events: {
    listPublic: os.handler(() =>
      getRows(
        supabaseAdmin
          .from('events')
          .select('id,public_id,title,summary,starts_at,location,is_published,cover_image_key,cover_image_url')
          .eq('is_published', true)
          .order('starts_at', { ascending: true }),
      ),
    ),
    create: adminOnly
      .input(
        z.object({
          title: text,
          publicId: z.string().trim().min(1).regex(/^[a-z0-9-]+$/),
          summary: text,
          startsAt: z.string().datetime(),
          location: text,
          isPublished: z.boolean().default(true),
          coverImageKey: z.string().trim().optional(),
          coverImageUrl: z.string().url().optional(),
        }),
      )
      .handler(({ input }) =>
        getRows(
          supabaseAdmin
            .from('events')
            .insert({
              public_id: input.publicId,
              title: input.title,
              summary: input.summary,
              starts_at: input.startsAt,
              location: input.location,
              is_published: input.isPublished,
              cover_image_key: input.coverImageKey ?? null,
              cover_image_url: input.coverImageUrl ?? null,
            })
            .select()
            .single(),
        ),
      ),
    setCover: adminOnly
      .input(
        z.object({
          id: uuid,
          coverImageKey: text,
          coverImageUrl: z.string().url(),
        }),
      )
      .handler(({ input }) =>
        getRows(
          supabaseAdmin
            .from('events')
            .update({
              cover_image_key: input.coverImageKey,
              cover_image_url: input.coverImageUrl,
            })
            .eq('id', input.id)
            .select()
            .single(),
        ),
      ),
  },

  tickets: {
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

      return orders.map((order) => ({
        ...order,
        ticket_types: ticketTypes.find((ticketType) => ticketType.id === order.ticket_type_id) ?? null,
        events: events.find((event) => event.public_id === order.event_public_id) ?? null,
      }))
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
  },

  profile: {
    sync: authed.handler(async ({ context }) => {
      const { data, error } = await supabaseAdmin.auth.admin.getUserById(context.user.id)
      if (!error && data.user) {
        try {
          const profile = await syncProfileForUser(data.user)
          if (profile) {
            return profile
          }
        } catch (syncError) {
          console.error('Profile sync failed:', syncError)
        }
      }

      return {
        id: context.user.id,
        email: context.user.email,
        role: context.user.role,
        full_name: context.user.fullName,
        avatar_url: context.user.avatarUrl,
      }
    }),
    me: authed.handler(({ context }) =>
      getRows(
        supabaseAdmin
          .from('profiles')
          .select('*')
          .eq('id', context.user.id)
          .single(),
      ),
    ),
    update: authed
      .input(
        z.object({
          fullName: text,
          phone: z.string().trim().optional(),
          instruments: z.array(text).default([]),
          bio: z.string().trim().optional(),
          countryOrRegion: z.string().trim().optional(),
          publicProfile: z.boolean().default(false),
        }),
      )
      .handler(({ context, input }) =>
        getRows(
          supabaseAdmin
            .from('profiles')
            .update({
              full_name: input.fullName,
              phone: input.phone ?? null,
              instruments: input.instruments,
              bio: input.bio ?? null,
              country_or_region: input.countryOrRegion ?? null,
              public_profile: input.publicProfile,
            })
            .eq('id', context.user.id)
            .select()
            .single(),
        ),
    ),
    updateMedia: authed
      .input(
        z.object({
          avatarKey: z.string().trim().optional(),
          avatarUrl: z.string().url().optional(),
          coverImageKey: z.string().trim().optional(),
          coverImageUrl: z.string().url().optional(),
        }),
      )
      .handler(({ context, input }) =>
        getRows(
          supabaseAdmin
            .from('profiles')
            .update({
              avatar_key: input.avatarKey,
              avatar_url: input.avatarUrl,
              cover_image_key: input.coverImageKey,
              cover_image_url: input.coverImageUrl,
            })
            .eq('id', context.user.id)
            .select()
            .single(),
        ),
      ),
  },

  membershipApplications: {
    mine: authed.handler(({ context }) =>
      getRows(
        supabaseAdmin
          .from('membership_applications')
          .select('*')
          .eq('user_id', context.user.id)
          .order('created_at', { ascending: false })
          .limit(1),
      ),
    ),
    create: authed
      .input(
        z.object({
          fullName: text,
          email: z.string().email(),
          instruments: z.array(text).min(1),
          experience: text,
          motivation: text,
        }),
      )
      .handler(({ context, input }) =>
        getRows(
          supabaseAdmin
            .from('membership_applications')
            .insert({
              user_id: context.user.id,
              full_name: input.fullName,
              email: input.email.toLowerCase(),
              instruments: input.instruments,
              experience: input.experience,
              motivation: input.motivation,
              status: 'pending',
            })
            .select()
            .single(),
        ),
      ),
    list: adminOnly.handler(() =>
      getRows(
        supabaseAdmin
          .from('membership_applications')
          .select('*, profiles(id,email,full_name,role)')
          .order('created_at', { ascending: false }),
      ),
    ),
    decide: adminOnly
      .input(
        z.object({
          id: uuid,
          status: z.enum(['approved', 'rejected', 'needs_info']),
        }),
      )
      .handler(async ({ input }) => {
        const application = await getRows<{ user_id: string }>(
          supabaseAdmin
            .from('membership_applications')
            .update({ status: input.status })
            .eq('id', input.id)
            .select('user_id')
            .single(),
        )

        if (input.status === 'approved') {
          await getRows(
            supabaseAdmin
              .from('profiles')
              .update({ role: 'member' })
              .eq('id', application.user_id)
              .select('id')
              .single(),
          )
        }

        return { ok: true }
      }),
  },

  courses: {
    listPublic: os.handler(listPublicCourses),
    listAll: adminOnly.handler(async () => {
      const courses = await getRows<CourseRow[]>(
        supabaseAdmin
          .from('courses')
          .select(
            'id,member_id,title,summary,instrument,level,location,status,cover_image_key,cover_image_url,created_at,updated_at,profiles(id,full_name,email,avatar_url)',
          )
          .order('created_at', { ascending: false }),
      )

      if (courses.length === 0) {
        return []
      }

      const slots = await getRows<CourseSlotRow[]>(
        supabaseAdmin
          .from('course_slots')
          .select('id,course_id,member_id,starts_at,ends_at,status,created_at')
          .in(
            'course_id',
            courses.map((course) => course.id),
          )
          .gte('starts_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
          .order('starts_at', { ascending: true }),
      )

      return attachSlots(courses, slots)
    }),
    listMine: memberOnly.handler(async ({ context }) => {
      const courses = await getRows<CourseRow[]>(
        supabaseAdmin
          .from('courses')
          .select(
            'id,member_id,title,summary,instrument,level,location,status,cover_image_key,cover_image_url,created_at,updated_at',
          )
          .eq('member_id', context.user.id)
          .order('created_at', { ascending: false }),
      )

      if (courses.length === 0) {
        return []
      }

      const slots = await getRows<CourseSlotRow[]>(
        supabaseAdmin
          .from('course_slots')
          .select('id,course_id,member_id,starts_at,ends_at,status,created_at')
          .in(
            'course_id',
            courses.map((course) => course.id),
          )
          .gte('starts_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
          .order('starts_at', { ascending: true }),
      )

      return attachSlots(courses, slots)
    }),
    create: memberOnly
      .input(
        z.object({
          title: text,
          summary: text,
          instrument: text,
          level: text.default('All levels'),
          location: text,
          status: courseStatus.default('published'),
        }),
      )
      .handler(({ context, input }) =>
        getRows(
          supabaseAdmin
            .from('courses')
            .insert({
              member_id: context.user.id,
              title: input.title,
              summary: input.summary,
              instrument: input.instrument,
              level: input.level,
              location: input.location,
              status: input.status,
            })
            .select()
            .single(),
        ),
      ),
    update: memberOnly
      .input(
        z.object({
          id: uuid,
          title: text,
          summary: text,
          instrument: text,
          level: text,
          location: text,
          status: courseStatus,
        }),
      )
      .handler(async ({ context, input }) => {
        await getOwnedCourse(input.id, context.user.id)

        return getRows(
          supabaseAdmin
            .from('courses')
            .update({
              title: input.title,
              summary: input.summary,
              instrument: input.instrument,
              level: input.level,
              location: input.location,
              status: input.status,
              updated_at: new Date().toISOString(),
            })
            .eq('id', input.id)
            .select()
            .single(),
        )
      }),
    setStatus: memberOnly
      .input(
        z.object({
          id: uuid,
          status: courseStatus,
        }),
      )
      .handler(async ({ context, input }) => {
        await getOwnedCourse(input.id, context.user.id)

        return getRows(
          supabaseAdmin
            .from('courses')
            .update({ status: input.status, updated_at: new Date().toISOString() })
            .eq('id', input.id)
            .select('id,status')
            .single(),
        )
      }),
  },

  courseSlots: {
    createMany: memberOnly
      .input(
        z.object({
          courseId: uuid,
          startsAt: z.array(z.string().datetime()).min(1).max(96),
        }),
      )
      .handler(async ({ context, input }) => {
        await getOwnedCourse(input.courseId, context.user.id)
        const slots = input.startsAt.flatMap((startsAt) => {
          const start = new Date(startsAt)
          const end = new Date(start.getTime() + 30 * 60 * 1000)
          return toHalfHourRange(start.toISOString(), end.toISOString())
        })

        return getRows(
          supabaseAdmin
            .from('course_slots')
            .upsert(
              slots.map((slot) => ({
                course_id: input.courseId,
                member_id: context.user.id,
                starts_at: slot.startsAt,
                ends_at: slot.endsAt,
                status: 'available',
              })),
              { onConflict: 'course_id,starts_at', ignoreDuplicates: true },
            )
            .select(),
        )
      }),
    createRange: memberOnly
      .input(
        z.object({
          courseId: uuid,
          startsAt: z.string().datetime(),
          endsAt: z.string().datetime(),
        }),
      )
      .handler(async ({ context, input }) => {
        await getOwnedCourse(input.courseId, context.user.id)
        const slots = toHalfHourRange(input.startsAt, input.endsAt)

        return getRows(
          supabaseAdmin
            .from('course_slots')
            .upsert(
              slots.map((slot) => ({
                course_id: input.courseId,
                member_id: context.user.id,
                starts_at: slot.startsAt,
                ends_at: slot.endsAt,
                status: 'available',
              })),
              { onConflict: 'course_id,starts_at', ignoreDuplicates: true },
            )
            .select(),
        )
      }),
    cancel: memberOnly.input(z.object({ id: uuid })).handler(async ({ context, input }) => {
      const slot = await getRows<{ id: string; member_id: string; status: string }>(
        supabaseAdmin
          .from('course_slots')
          .select('id,member_id,status')
          .eq('id', input.id)
          .single(),
      )

      if (slot.member_id !== context.user.id) {
        throw new ORPCError('FORBIDDEN', { message: 'You can only manage your own slots.' })
      }

      if (slot.status !== 'available') {
        throw new ORPCError('CONFLICT', { message: 'Only available slots can be removed.' })
      }

      await getRows(
        supabaseAdmin
          .from('course_slots')
          .delete()
          .eq('id', input.id)
          .select('id')
          .single(),
      )

      return { ok: true }
    }),
  },

  availabilitySlots: {
    listPublic: os.handler(async () => {
      const courses = await listPublicCourses()
      return courses.flatMap((course) =>
        course.course_slots.map((slot) => ({
          ...slot,
          title: course.title,
          location: course.location,
          capacity: 1,
        })),
      )
    }),
    create: memberOnly
      .input(
        z.object({
          courseId: uuid,
          title: text,
          startsAt: z.string().datetime(),
          endsAt: z.string().datetime(),
          capacity: z.number().int().min(1).max(20).default(1),
        }),
      )
      .handler(async ({ context, input }) => {
        await getOwnedCourse(input.courseId, context.user.id)
        const [slot] = toHalfHourRange(input.startsAt, input.endsAt)
        return getRows(
          supabaseAdmin
            .from('course_slots')
            .insert({
              course_id: input.courseId,
              member_id: context.user.id,
              starts_at: slot.startsAt,
              ends_at: slot.endsAt,
              status: 'available',
            })
            .select()
            .single(),
        )
      }),
  },

  bookings: {
    mine: authed.handler(({ context }) =>
      getRows(
        supabaseAdmin
          .from('bookings')
          .select('*, courses(id,title,summary,instrument,level,location,member_id,profiles(id,full_name,email)), course_slots(id,starts_at,ends_at,status)')
          .eq('visitor_id', context.user.id)
          .order('created_at', { ascending: false }),
      ),
    ),
    forMember: memberOnly.handler(async ({ context }) => {
      const courses = await getRows<Array<{ id: string }>>(
        supabaseAdmin.from('courses').select('id').eq('member_id', context.user.id),
      )

      if (courses.length === 0) {
        return []
      }

      return getRows(
        supabaseAdmin
          .from('bookings')
          .select('*, profiles(id,email,full_name), courses(id,title,location), course_slots(id,starts_at,ends_at,status)')
          .in(
            'course_id',
            courses.map((course) => course.id),
          )
          .order('created_at', { ascending: false }),
      )
    }),
    create: authed.input(z.object({ slotId: uuid })).handler(async ({ context, input }) => {
      const slot = await getRows<{ id: string; status: string; member_id: string }>(
        supabaseAdmin
          .from('course_slots')
          .select('id,status,member_id')
          .eq('id', input.slotId)
          .single(),
      )

      if (slot.status !== 'available') {
        throw new ORPCError('CONFLICT', { message: 'This slot is no longer available.' })
      }

      if (slot.member_id === context.user.id) {
        throw new ORPCError('FORBIDDEN', { message: 'You cannot book your own course slot.' })
      }

      return getRows(
        supabaseAdmin.rpc('book_course_slot', {
          p_slot_id: input.slotId,
          p_visitor_id: context.user.id,
        }),
      )
    }),
  },

  media: {
    createUploadUrl: authed
      .input(
        z.object({
          purpose: z.enum(['profile-avatar', 'profile-cover', 'event-cover']),
          fileName: text,
          contentType: z.enum(imageContentTypes),
          size: z.number().int().min(1).max(5 * 1024 * 1024),
        }),
      )
      .handler(async ({ context, input }) => {
        const extension = input.fileName.split('.').pop()?.toLowerCase() ?? 'jpg'
        const safeExtension = extension.replace(/[^a-z0-9]/g, '') || 'jpg'
        const key = `${input.purpose}/${context.user.id}/${crypto.randomUUID()}.${safeExtension}`

        try {
          const uploadUrl = await createPresignedUploadUrl({
            key,
            contentType: input.contentType,
          })

          return {
            key,
            uploadUrl,
            publicUrl: getPublicR2Url(key),
          }
        } catch (error) {
          throw new ORPCError('INTERNAL_SERVER_ERROR', {
            message: error instanceof Error ? error.message : 'Could not create upload URL.',
          })
        }
      }),
  },

  adminUsers: {
    list: adminOnly.handler(() =>
      getRows(
        supabaseAdmin
          .from('profiles')
          .select('id,email,full_name,role,public_profile,created_at')
          .order('created_at', { ascending: false }),
      ),
    ),
    setRole: adminOnly
      .input(
        z.object({
          id: uuid,
          role: z.enum(['visitor', 'member', 'admin']),
        }),
      )
      .handler(({ input }) =>
        getRows(
          supabaseAdmin
            .from('profiles')
            .update({ role: input.role })
            .eq('id', input.id)
            .select('id,role')
            .single(),
        ),
      ),
  },
}

export type AppRouter = typeof router
