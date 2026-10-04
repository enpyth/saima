import { ORPCError } from '@orpc/server'
import { describe, expect, it } from 'bun:test'

import {
  assertFreeTicketCapacity,
  assertFreeTicketQuantity,
  assertFreeTicketRecipientAllowed,
  assertFreeTicketsSecretAllowed,
  filterFreeTicketRecipientProfiles,
} from './free-tickets'
import { getConfiguredTicketTypes, type TicketOrderQuantity } from './ticket-types'

const adminEmails = new Set(['admin@example.com', 'second@example.com'])

describe('free ticket helpers', () => {
  it('filters eligible recipients to existing profiles whose email is in ADMIN_EMAILS', () => {
    expect(
      filterFreeTicketRecipientProfiles(
        [
          { id: '1', email: 'Admin@Example.com', full_name: 'Admin One' },
          { id: '2', email: 'visitor@example.com', full_name: 'Visitor One' },
          { id: '3', email: 'second@example.com', full_name: 'Second Admin' },
        ],
        adminEmails,
      ),
    ).toEqual([
      { id: '1', email: 'admin@example.com', fullName: 'Admin One' },
      { id: '3', email: 'second@example.com', fullName: 'Second Admin' },
    ])
  })

  it('rejects free ticket recipients outside ADMIN_EMAILS', () => {
    expect(() => assertFreeTicketRecipientAllowed({ email: 'visitor@example.com' }, adminEmails)).toThrow(ORPCError)
    expect(() => assertFreeTicketRecipientAllowed(null, adminEmails)).toThrow(ORPCError)
  })

  it('rejects invalid free ticket quantities', () => {
    const general = getConfiguredTicketTypes('20261016').find((ticketType) => ticketType.slug === 'general')

    expect(general).toBeTruthy()
    expect(() => assertFreeTicketQuantity(general!, 0)).toThrow(ORPCError)
    expect(() => assertFreeTicketQuantity(general!, 11)).toThrow(ORPCError)
    expect(() => assertFreeTicketQuantity(general!, 5)).not.toThrow()
  })

  it('validates free tickets secret key and rejects invalid or missing keys', () => {
    expect(() => assertFreeTicketsSecretAllowed('saima-20261016-free', 'saima-20261016-free')).not.toThrow()
    expect(() => assertFreeTicketsSecretAllowed('saima-20261016-free', '  SAIMA-20261016-FREE  ')).not.toThrow()
    expect(() => assertFreeTicketsSecretAllowed('saima-20261016-free', 'wrong-key')).toThrow(ORPCError)
    expect(() => assertFreeTicketsSecretAllowed('saima-20261016-free', '')).toThrow(ORPCError)
    expect(() => assertFreeTicketsSecretAllowed('saima-20261016-free', null)).toThrow(ORPCError)
    expect(() => assertFreeTicketsSecretAllowed(undefined, 'any-key')).toThrow(ORPCError)
  })

  it('rejects free tickets when there is not enough remaining capacity', () => {
    const family = getConfiguredTicketTypes('20261016').find((ticketType) => ticketType.slug === 'family')
    const orders: TicketOrderQuantity[] = [
      {
        event_public_id: '20261016',
        ticket_type_id: 'general',
        quantity: 499,
        capacity_units_per_ticket: 1,
        status: 'confirmed',
      },
    ]

    expect(family).toBeTruthy()
    expect(() => assertFreeTicketCapacity(family!, 1, orders)).toThrow(ORPCError)
  })

  it('allows free tickets when capacity remains', () => {
    const general = getConfiguredTicketTypes('20261016').find((ticketType) => ticketType.slug === 'general')
    const orders: TicketOrderQuantity[] = [
      {
        event_public_id: '20261016',
        ticket_type_id: 'general',
        quantity: 490,
        capacity_units_per_ticket: 1,
        status: 'confirmed',
      },
    ]

    expect(general).toBeTruthy()
    expect(() => assertFreeTicketCapacity(general!, 10, orders)).not.toThrow()
  })
})
