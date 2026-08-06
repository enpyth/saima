import { ORPCError, os } from '@orpc/server'
import { z } from 'zod'

import { supabaseAdmin } from '../supabase'
import { attachSlots, getOwnedCourse, listPublicCourses, toHalfHourRange } from './course-helpers'
import { mapCourseSlot, mapCourseWithSlots } from './mappers'
import { adminOnly, memberOnly } from './procedures'
import type { CourseRow, CourseSlotRow } from './rows'
import { courseStatus, text, uuid } from './schemas'
import { getRows } from './supabase-result'

export const coursesRouter = {
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

    return attachSlots(courses, slots).map(mapCourseWithSlots)
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

    return attachSlots(courses, slots).map(mapCourseWithSlots)
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
      getRows<CourseRow>(
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
      ).then((course) => mapCourseWithSlots({ ...course, course_slots: [] })),
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

      return getRows<CourseRow>(
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
      ).then((course) => mapCourseWithSlots({ ...course, course_slots: [] }))
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
}

export const courseSlotsRouter = {
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

      return getRows<CourseSlotRow[]>(
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
      ).then((slots) => slots.map(mapCourseSlot))
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

      return getRows<CourseSlotRow[]>(
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
      ).then((slots) => slots.map(mapCourseSlot))
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
}

export const availabilitySlotsRouter = {
  listPublic: os.handler(async () => {
    const courses = await listPublicCourses()
    return courses.flatMap((course) =>
      course.courseSlots.map((slot) => ({
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
      return getRows<CourseSlotRow>(
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
      ).then(mapCourseSlot)
    }),
}
