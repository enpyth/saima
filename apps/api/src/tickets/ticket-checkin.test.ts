import { describe, expect, it } from 'bun:test'

import { buildTicketCheckInResult } from './ticket-checkin'

const baseOrder = {
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
  status: 'confirmed' as const,
  stripe_checkout_session_id: 'cs_1',
  stripe_payment_intent_id: 'pi_1',
  paid_at: '2026-01-05T00:00:00.000Z',
  qr_token: 'ticket-token',
  confirmation_email_sent_at: null,
  confirmation_email_resend_id: null,
  checked_in_at: null,
  checked_in_by: null,
  created_at: '2026-01-04T00:00:00.000Z',
}

const event = {
  public_id: '20261016',
  title: 'Concert',
  starts_at: '2026-10-16T09:00:00.000Z',
  location: 'Hall',
}

const ticketType = { id: 'ticket-1', name: 'General admission', description: null }

describe('ticket check-in result builder', () => {
  it('maps a first scan as checked in', () => {
    const result = buildTicketCheckInResult({
      status: 'checked_in',
      order: { ...baseOrder, checked_in_at: '2026-10-16T08:30:00.000Z', checked_in_by: 'admin-1' },
      event,
      ticketType,
    })

    expect(result).toMatchObject({
      status: 'checked_in',
      message: 'Ticket checked in.',
      ticket: {
        id: 'order-1',
        quantity: 2,
        checkedInAt: '2026-10-16T08:30:00.000Z',
        event: { title: 'Concert' },
      },
    })
  })

  it('maps a repeated scan as already checked in', () => {
    const result = buildTicketCheckInResult({
      status: 'already_checked_in',
      order: { ...baseOrder, checked_in_at: '2026-10-16T08:30:00.000Z', checked_in_by: 'admin-1' },
      event,
      ticketType,
    })

    expect(result.status).toBe('already_checked_in')
    expect(result.message).toContain('already checked in')
  })
})
