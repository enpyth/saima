import type {
  AdminUser,
  BookingWithDetails,
  CourseSlot,
  CourseWithSlots,
  MembershipApplication,
  MembershipApplicationWithProfile,
  Profile,
  ProfileSummary,
  PublicEvent,
  TicketOrderWithDetails,
} from '@saima/shared'

import type {
  BookingRow,
  CourseRow,
  CourseSlotRow,
  MembershipApplicationRow,
  ProfileRow,
  ProfileSummaryRow,
  PublicEventRow,
  TicketOrderRow,
} from './rows'

function firstRelation<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) {
    return value[0] ?? null
  }
  return value ?? null
}

export function mapProfileSummary(row: ProfileSummaryRow | null | undefined): ProfileSummary | null {
  if (!row) {
    return null
  }

  return {
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    avatarUrl: row.avatar_url,
    role: row.role,
  }
}

export function mapProfile(row: ProfileRow): Profile {
  return {
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    role: row.role,
    phone: row.phone,
    instruments: row.instruments,
    bio: row.bio,
    countryOrRegion: row.country_or_region,
    publicProfile: row.public_profile ?? false,
    avatarKey: row.avatar_key,
    avatarUrl: row.avatar_url,
    coverImageKey: row.cover_image_key,
    coverImageUrl: row.cover_image_url,
  }
}

export function mapPublicEvent(row: PublicEventRow): PublicEvent {
  return {
    id: row.id,
    publicId: row.public_id,
    title: row.title,
    summary: row.summary,
    startsAt: row.starts_at,
    location: row.location,
    isPublished: row.is_published,
    coverImageKey: row.cover_image_key,
    coverImageUrl: row.cover_image_url,
  }
}

export function mapCourseSlot(row: CourseSlotRow): CourseSlot {
  return {
    id: row.id,
    courseId: row.course_id,
    memberId: row.member_id,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    status: row.status === 'booked' ? 'booked' : 'available',
    createdAt: row.created_at,
  }
}

export function mapCourseWithSlots(
  row: CourseRow & { course_slots?: CourseSlotRow[] },
): CourseWithSlots {
  return {
    id: row.id,
    memberId: row.member_id,
    title: row.title,
    summary: row.summary,
    instrument: row.instrument,
    level: row.level,
    location: row.location,
    status: row.status,
    coverImageKey: row.cover_image_key,
    coverImageUrl: row.cover_image_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    profile: mapProfileSummary(firstRelation(row.profiles)),
    courseSlots: (row.course_slots ?? []).map(mapCourseSlot),
  }
}

export function mapMembershipApplication(row: MembershipApplicationRow): MembershipApplication {
  return {
    id: row.id,
    userId: row.user_id,
    fullName: row.full_name,
    email: row.email,
    instruments: row.instruments,
    experience: row.experience,
    motivation: row.motivation,
    status: row.status,
    createdAt: row.created_at,
  }
}

export function mapMembershipApplicationWithProfile(
  row: MembershipApplicationRow,
): MembershipApplicationWithProfile {
  return {
    ...mapMembershipApplication(row),
    profile: mapProfileSummary(firstRelation(row.profiles)),
  }
}

export function mapBookingWithDetails(row: BookingRow): BookingWithDetails {
  const course = firstRelation(row.courses)
  const courseSlot = firstRelation(row.course_slots)

  return {
    id: row.id,
    courseId: row.course_id,
    slotId: row.slot_id,
    visitorId: row.visitor_id,
    status: row.status,
    createdAt: row.created_at,
    profile: mapProfileSummary(firstRelation(row.profiles)),
    course: course
      ? {
          id: course.id,
          title: course.title,
          summary: course.summary ?? '',
          instrument: course.instrument ?? '',
          level: course.level ?? '',
          location: course.location,
          memberId: course.member_id ?? '',
          profile: mapProfileSummary(firstRelation(course.profiles)),
        }
      : null,
    courseSlot: courseSlot ? mapCourseSlot(courseSlot) : null,
  }
}

export function mapTicketOrderWithDetails(
  row: TicketOrderRow & {
    ticket_types?: { id: string; name: string; description: string | null } | null
    events?: { public_id: string; title: string; starts_at: string; location: string } | null
  },
): TicketOrderWithDetails {
  return {
    id: row.id,
    ticketTypeId: row.ticket_type_id,
    eventPublicId: row.event_public_id,
    purchaserUserId: row.purchaser_user_id,
    purchaserName: row.purchaser_name,
    purchaserEmail: row.purchaser_email,
    purchaserPhone: row.purchaser_phone,
    quantity: row.quantity,
    unitPriceCents: row.unit_price_cents,
    totalPriceCents: row.total_price_cents,
    status: row.status,
    stripeCheckoutSessionId: row.stripe_checkout_session_id,
    stripePaymentIntentId: row.stripe_payment_intent_id,
    paidAt: row.paid_at,
    qrToken: row.qr_token,
    confirmationEmailSentAt: row.confirmation_email_sent_at,
    confirmationEmailResendId: row.confirmation_email_resend_id,
    checkedInAt: row.checked_in_at,
    checkedInBy: row.checked_in_by,
    createdAt: row.created_at,
    ticketType: row.ticket_types
      ? {
          id: row.ticket_types.id,
          name: row.ticket_types.name,
          description: row.ticket_types.description,
        }
      : null,
    event: row.events
      ? {
          publicId: row.events.public_id,
          title: row.events.title,
          startsAt: row.events.starts_at,
          location: row.events.location,
        }
      : null,
  }
}

export function mapAdminUser(row: ProfileRow): AdminUser {
  return {
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    role: row.role,
    publicProfile: row.public_profile ?? false,
    createdAt: row.created_at ?? '',
  }
}
