import { describe, expect, it } from 'bun:test'

import {
  mapBookingWithDetails,
  mapCourseWithSlots,
  mapProfile,
  mapTicketOrderWithDetails,
} from './mappers'

describe('router response mappers', () => {
  it('maps profile rows to camelCase profile contracts', () => {
    expect(
      mapProfile({
        id: 'user-1',
        email: 'ada@example.com',
        role: 'member',
        full_name: 'Ada Lovelace',
        phone: null,
        instruments: ['Piano'],
        bio: 'Teacher',
        country_or_region: 'AU',
        public_profile: true,
        avatar_key: 'profile-avatar/user-1/a.jpg',
        avatar_url: 'https://cdn.example/a.jpg',
        cover_image_key: null,
        cover_image_url: null,
        created_at: '2026-01-01T00:00:00.000Z',
        updated_at: '2026-01-02T00:00:00.000Z',
      }),
    ).toEqual({
      id: 'user-1',
      email: 'ada@example.com',
      role: 'member',
      fullName: 'Ada Lovelace',
      phone: null,
      instruments: ['Piano'],
      bio: 'Teacher',
      countryOrRegion: 'AU',
      publicProfile: true,
      avatarKey: 'profile-avatar/user-1/a.jpg',
      avatarUrl: 'https://cdn.example/a.jpg',
      coverImageKey: null,
      coverImageUrl: null,
    })
  })

  it('maps courses, host profiles, and slots without leaking database field names', () => {
    expect(
      mapCourseWithSlots({
        id: 'course-1',
        member_id: 'member-1',
        title: 'Piano coaching',
        summary: 'Technique',
        instrument: 'Piano',
        level: 'Intermediate',
        location: 'Studio A',
        status: 'published',
        cover_image_key: null,
        cover_image_url: null,
        created_at: '2026-01-01T00:00:00.000Z',
        updated_at: '2026-01-02T00:00:00.000Z',
        profiles: {
          id: 'member-1',
          full_name: 'Ada Member',
          email: 'ada@example.com',
          avatar_url: null,
        },
        course_slots: [
          {
            id: 'slot-1',
            course_id: 'course-1',
            member_id: 'member-1',
            starts_at: '2026-07-04T00:00:00.000Z',
            ends_at: '2026-07-04T00:30:00.000Z',
            status: 'available',
            created_at: '2026-01-03T00:00:00.000Z',
          },
        ],
      }),
    ).toEqual({
      id: 'course-1',
      memberId: 'member-1',
      title: 'Piano coaching',
      summary: 'Technique',
      instrument: 'Piano',
      level: 'Intermediate',
      location: 'Studio A',
      status: 'published',
      coverImageKey: null,
      coverImageUrl: null,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-02T00:00:00.000Z',
      profile: {
        id: 'member-1',
        fullName: 'Ada Member',
        email: 'ada@example.com',
        avatarUrl: null,
      },
      courseSlots: [
        {
          id: 'slot-1',
          courseId: 'course-1',
          memberId: 'member-1',
          startsAt: '2026-07-04T00:00:00.000Z',
          endsAt: '2026-07-04T00:30:00.000Z',
          status: 'available',
          createdAt: '2026-01-03T00:00:00.000Z',
        },
      ],
    })
  })

  it('maps booking relation aliases to semantic camelCase names', () => {
    expect(
      mapBookingWithDetails({
        id: 'booking-1',
        course_id: 'course-1',
        slot_id: 'slot-1',
        visitor_id: 'visitor-1',
        status: 'confirmed',
        created_at: '2026-01-04T00:00:00.000Z',
        profiles: { id: 'visitor-1', email: 'visitor@example.com', full_name: 'Visitor One' },
        courses: {
          id: 'course-1',
          title: 'Piano coaching',
          summary: 'Technique',
          instrument: 'Piano',
          level: 'Intermediate',
          location: 'Studio A',
          member_id: 'member-1',
          profiles: { id: 'member-1', email: 'member@example.com', full_name: 'Member One' },
        },
        course_slots: {
          id: 'slot-1',
          course_id: 'course-1',
          member_id: 'member-1',
          starts_at: '2026-07-04T00:00:00.000Z',
          ends_at: '2026-07-04T00:30:00.000Z',
          status: 'booked',
          created_at: '2026-01-03T00:00:00.000Z',
        },
      }),
    ).toMatchObject({
      id: 'booking-1',
      courseId: 'course-1',
      slotId: 'slot-1',
      visitorId: 'visitor-1',
      createdAt: '2026-01-04T00:00:00.000Z',
      profile: { fullName: 'Visitor One' },
      course: { memberId: 'member-1', profile: { fullName: 'Member One' } },
      courseSlot: { startsAt: '2026-07-04T00:00:00.000Z' },
    })
  })

  it('maps ticket orders and related event data to camelCase', () => {
    expect(
      mapTicketOrderWithDetails({
        id: 'order-1',
        ticket_type_id: 'ticket-1',
        event_public_id: '20261016',
        purchaser_user_id: 'visitor-1',
        purchaser_name: 'Visitor One',
        purchaser_email: 'visitor@example.com',
        purchaser_phone: null,
        quantity: 2,
        capacity_units_per_ticket: 1,
        unit_price_cents: 2500,
        total_price_cents: 5000,
        status: 'confirmed',
        stripe_checkout_session_id: 'cs_1',
        stripe_payment_intent_id: 'pi_1',
        paid_at: '2026-01-05T00:00:00.000Z',
        qr_token: 'ticket-token',
        confirmation_email_sent_at: '2026-01-05T00:01:00.000Z',
        confirmation_email_resend_id: 'email-1',
        checked_in_at: '2026-10-16T08:30:00.000Z',
        checked_in_by: 'admin-1',
        created_at: '2026-01-04T00:00:00.000Z',
        ticket_types: { id: 'ticket-1', name: 'Adult', description: null },
        events: {
          public_id: '20261016',
          title: 'Concert',
          starts_at: '2026-10-16T09:00:00.000Z',
          location: 'Hall',
        },
      }),
    ).toMatchObject({
      id: 'order-1',
      ticketTypeId: 'ticket-1',
      eventPublicId: '20261016',
      purchaserName: 'Visitor One',
      totalPriceCents: 5000,
      paidAt: '2026-01-05T00:00:00.000Z',
      qrToken: 'ticket-token',
      confirmationEmailSentAt: '2026-01-05T00:01:00.000Z',
      confirmationEmailResendId: 'email-1',
      checkedInAt: '2026-10-16T08:30:00.000Z',
      checkedInBy: 'admin-1',
      ticketType: { id: 'ticket-1', name: 'Adult' },
      event: { publicId: '20261016', startsAt: '2026-10-16T09:00:00.000Z' },
    })
  })
})
