import { ORPCError } from '@orpc/server'

import { getTicketQuantityLimit } from './ticket-quantity'
import type { ConfiguredTicketType, TicketOrderQuantity } from './ticket-types'

type FreeTicketRecipientProfile = {
  id: string
  email: string
  full_name: string
}

export function normalizeEmail(value: string) {
  return value.trim().toLowerCase()
}

export function filterFreeTicketRecipientProfiles(
  profiles: FreeTicketRecipientProfile[],
  adminEmails: ReadonlySet<string>,
) {
  return profiles
    .filter((profile) => adminEmails.has(normalizeEmail(profile.email)))
    .map((profile) => ({
      id: profile.id,
      email: normalizeEmail(profile.email),
      fullName: profile.full_name,
    }))
}

export function assertFreeTicketRecipientAllowed<T extends Pick<FreeTicketRecipientProfile, 'email'>>(
  profile: T | null,
  adminEmails: ReadonlySet<string>,
): asserts profile is T {
  if (!profile || !adminEmails.has(normalizeEmail(profile.email))) {
    throw new ORPCError('FORBIDDEN', { message: 'Free tickets can only be issued to ADMIN_EMAILS profiles.' })
  }
}

export function assertFreeTicketQuantity(ticketType: Pick<ConfiguredTicketType, 'capacityUnitsPerTicket'>, quantity: number) {
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > getTicketQuantityLimit(ticketType.capacityUnitsPerTicket)) {
    throw new ORPCError('BAD_REQUEST', { message: 'Choose a valid quantity for this ticket type.' })
  }
}

export function getReservedCapacityUnits(eventPublicId: string, orders: TicketOrderQuantity[]) {
  return orders
    .filter(
      (order) =>
        order.event_public_id === eventPublicId &&
        (order.status === 'confirmed' || order.status === 'pending_payment'),
    )
    .reduce((total, order) => total + order.quantity * (order.capacity_units_per_ticket ?? 1), 0)
}

export function assertFreeTicketCapacity(
  ticketType: Pick<ConfiguredTicketType, 'eventPublicId' | 'capacity' | 'capacityUnitsPerTicket'>,
  quantity: number,
  orders: TicketOrderQuantity[],
) {
  const reservedCapacityUnits = getReservedCapacityUnits(ticketType.eventPublicId, orders)

  if (reservedCapacityUnits + quantity * ticketType.capacityUnitsPerTicket > ticketType.capacity) {
    throw new ORPCError('CONFLICT', { message: 'Not enough tickets remaining.' })
  }
}
