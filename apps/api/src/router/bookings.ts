import { ORPCError } from '@orpc/server'
import { z } from 'zod'

import { supabaseAdmin } from '../supabase'
import { mapBookingWithDetails } from './mappers'
import { authed, memberOnly } from './procedures'
import type { BookingRow } from './rows'
import { uuid } from './schemas'
import { getRows } from './supabase-result'

export const bookingsRouter = {
  mine: authed.handler(({ context }) =>
    getRows<BookingRow[]>(
      supabaseAdmin
        .from('bookings')
        .select('*, courses(id,title,summary,instrument,level,location,member_id,profiles(id,full_name,email)), course_slots(id,starts_at,ends_at,status)')
        .eq('visitor_id', context.user.id)
        .order('created_at', { ascending: false }),
    ).then((bookings) => bookings.map(mapBookingWithDetails)),
  ),
  forMember: memberOnly.handler(async ({ context }) => {
    const courses = await getRows<Array<{ id: string }>>(
      supabaseAdmin.from('courses').select('id').eq('member_id', context.user.id),
    )

    if (courses.length === 0) {
      return []
    }

    return getRows<BookingRow[]>(
      supabaseAdmin
        .from('bookings')
        .select('*, profiles(id,email,full_name), courses(id,title,location), course_slots(id,starts_at,ends_at,status)')
        .in(
          'course_id',
          courses.map((course) => course.id),
        )
        .order('created_at', { ascending: false }),
    ).then((bookings) => bookings.map(mapBookingWithDetails))
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
}
