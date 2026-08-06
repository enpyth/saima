import { ORPCError } from '@orpc/server'

import { supabaseAdmin } from '../supabase'
import { mapCourseWithSlots } from './mappers'
import type { CourseRow, CourseSlotRow } from './rows'
import { getRows } from './supabase-result'

const activeCourseSlotStatuses = ['available', 'booked'] as const

type CourseSlotStatus = (typeof activeCourseSlotStatuses)[number]

export function toHalfHourRange(startsAt: string, endsAt: string) {
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

export async function getOwnedCourse(courseId: string, memberId: string) {
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

export function attachSlots(courses: CourseRow[], slots: CourseSlotRow[]) {
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

export async function listPublicCourses() {
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

  return attachSlots(courses, slots).map(mapCourseWithSlots)
}
