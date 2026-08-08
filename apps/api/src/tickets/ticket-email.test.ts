import { describe, expect, it } from 'bun:test'

import {
  buildTicketCheckInUrl,
  buildTicketConfirmationEmail,
  shouldSendTicketConfirmationEmail,
} from './ticket-email'

describe('ticket confirmation email', () => {
  it('builds an admin check-in URL from the ticket QR token', () => {
    expect(buildTicketCheckInUrl('abc123', 'https://saima.example/')).toBe(
      'https://saima.example/dashboard/admin/ticket-checkin?token=abc123',
    )
  })

  it('embeds the QR code with a CID attachment reference', () => {
    const email = buildTicketConfirmationEmail({
      checkInUrl: 'https://saima.example/dashboard/admin/ticket-checkin?token=abc123',
      qrContentId: 'ticket-qr',
      order: {
        purchaserName: 'Visitor One',
        quantity: 2,
        totalPriceCents: 5000,
      },
      event: {
        title: 'Concert',
        startsAt: '2026-10-16T09:00:00.000Z',
        location: 'Hall',
      },
      ticketType: {
        name: 'General admission',
      },
    })

    expect(email.subject).toBe('Your ticket for Concert')
    expect(email.html).toContain('src="cid:ticket-qr"')
    expect(email.html).toContain('General admission')
    expect(email.text).toContain('https://saima.example/dashboard/admin/ticket-checkin?token=abc123')
  })

  it('only sends when a confirmed order has not already been emailed', () => {
    expect(shouldSendTicketConfirmationEmail({ status: 'confirmed', confirmationEmailSentAt: null })).toBe(true)
    expect(
      shouldSendTicketConfirmationEmail({
        status: 'confirmed',
        confirmationEmailSentAt: '2026-01-05T00:01:00.000Z',
      }),
    ).toBe(false)
    expect(shouldSendTicketConfirmationEmail({ status: 'pending_payment', confirmationEmailSentAt: null })).toBe(false)
  })
})
