import type { TicketCheckInResult, TicketCheckInStatus } from '@saima/shared'

import { mapTicketOrderWithDetails } from '../router/mappers'
import type { EventRow, TicketOrderRow } from '../router/rows'

type CheckInEvent = EventRow & { location: string }
type CheckInTicketType = { id: string; name: string; description: string | null }

export function buildTicketCheckInResult(input: {
  status: Exclude<TicketCheckInStatus, 'invalid'>
  order: TicketOrderRow
  event: CheckInEvent | null
  ticketType: CheckInTicketType | null
}): TicketCheckInResult {
  return {
    status: input.status,
    message:
      input.status === 'checked_in'
        ? 'Ticket checked in.'
        : `Ticket was already checked in${input.order.checked_in_at ? ` at ${formatDateTime(input.order.checked_in_at)}` : ''}.`,
    ticket: mapTicketOrderWithDetails({
      ...input.order,
      events: input.event,
      ticket_types: input.ticketType,
    }),
  }
}

export function buildInvalidTicketCheckInResult(message = 'Ticket QR code is invalid.'): TicketCheckInResult {
  return {
    status: 'invalid',
    message,
  }
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('en-AU', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}
