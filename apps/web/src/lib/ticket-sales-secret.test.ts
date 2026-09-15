import type { TicketInventory } from '@saima/shared'
import { describe, expect, it } from 'vitest'

import {
  calculateTicketAvailabilitySummary,
  verifyTicketSaleSecret,
} from './ticket-sales-config'

describe('verifyTicketSaleSecret', () => {
  it('returns true for a valid secret key matching the event configuration', () => {
    expect(verifyTicketSaleSecret('20261016', 'saima-20261016-status')).toBe(true)
  })

  it('trims whitespace around the provided key', () => {
    expect(verifyTicketSaleSecret('20261016', '  saima-20261016-status  ')).toBe(true)
  })

  it('is case-insensitive for user convenience', () => {
    expect(verifyTicketSaleSecret('20261016', 'SAIMA-20261016-STATUS')).toBe(true)
  })

  it('returns false for an incorrect key', () => {
    expect(verifyTicketSaleSecret('20261016', 'wrong-password')).toBe(false)
  })

  it('returns false for empty, null, or undefined keys', () => {
    expect(verifyTicketSaleSecret('20261016', '')).toBe(false)
    expect(verifyTicketSaleSecret('20261016', null)).toBe(false)
    expect(verifyTicketSaleSecret('20261016', undefined)).toBe(false)
  })

  it('returns false for an unknown event or an event without a configured secret key', () => {
    expect(verifyTicketSaleSecret('non-existent-event', 'saima-20261016-status')).toBe(false)
    expect(verifyTicketSaleSecret('20261024', 'any-key')).toBe(false)
  })
})

describe('calculateTicketAvailabilitySummary', () => {
  const sampleInventories: TicketInventory[] = [
    {
      eventPublicId: '20261016',
      ticketTypeId: 'general-id',
      slug: 'general',
      sold: 10,
      reserved: 2,
      remaining: 470,
    },
    {
      eventPublicId: '20261016',
      ticketTypeId: 'student-id',
      slug: 'student',
      sold: 4,
      reserved: 0,
      remaining: 470,
    },
    {
      eventPublicId: '20261016',
      ticketTypeId: 'family-id',
      slug: 'family',
      sold: 3, // 3 * 4 units = 12 units
      reserved: 1, // 1 * 4 units = 4 units
      remaining: 470,
    },
  ]

  it('calculates total capacity, remaining units, sold tickets, and per-tier breakdown', () => {
    const summary = calculateTicketAvailabilitySummary('20261016', 500, sampleInventories)

    expect(summary.totalCapacity).toBe(500)
    expect(summary.remainingCapacityUnits).toBe(470)
    // 500 total - 470 remaining = 30 units used (10 general + 2 general reserved = 12, 4 student = 4, 3*4 family + 1*4 reserved = 16. Total = 32 units used)
    expect(summary.totalSoldTickets).toBe(17) // 10 general + 4 student + 3 family
    expect(summary.totalReservedTickets).toBe(3) // 2 general + 1 family
    expect(summary.usedCapacityUnits).toBe(30) // 500 - 470
    expect(summary.sellThroughRate).toBe(6) // (30 / 500) * 100

    expect(summary.tiers).toHaveLength(3)

    const generalTier = summary.tiers.find((t) => t.slug === 'general')
    expect(generalTier).toBeDefined()
    expect(generalTier?.sold).toBe(10)
    expect(generalTier?.reserved).toBe(2)
    expect(generalTier?.capacityUnitsPerTicket).toBe(1)
    expect(generalTier?.remainingTickets).toBe(470) // 470 / 1
    expect(generalTier?.soldOut).toBe(false)

    const familyTier = summary.tiers.find((t) => t.slug === 'family')
    expect(familyTier).toBeDefined()
    expect(familyTier?.sold).toBe(3)
    expect(familyTier?.reserved).toBe(1)
    expect(familyTier?.capacityUnitsPerTicket).toBe(4)
    expect(familyTier?.remainingTickets).toBe(117) // Math.floor(470 / 4)
    expect(familyTier?.soldOut).toBe(false)
  })

  it('handles sold out events correctly', () => {
    const soldOutInventories: TicketInventory[] = [
      {
        eventPublicId: '20261016',
        ticketTypeId: 'general-id',
        slug: 'general',
        sold: 500,
        reserved: 0,
        remaining: 0,
      },
      {
        eventPublicId: '20261016',
        ticketTypeId: 'student-id',
        slug: 'student',
        sold: 0,
        reserved: 0,
        remaining: 0,
      },
      {
        eventPublicId: '20261016',
        ticketTypeId: 'family-id',
        slug: 'family',
        sold: 0,
        reserved: 0,
        remaining: 0,
      },
    ]

    const summary = calculateTicketAvailabilitySummary('20261016', 500, soldOutInventories)

    expect(summary.remainingCapacityUnits).toBe(0)
    expect(summary.usedCapacityUnits).toBe(500)
    expect(summary.sellThroughRate).toBe(100)
    expect(summary.tiers.every((t) => t.soldOut)).toBe(true)
    expect(summary.tiers.every((t) => t.remainingTickets === 0)).toBe(true)
  })

  it('handles empty or missing inventory gracefully', () => {
    const summary = calculateTicketAvailabilitySummary('20261016', 500, [])

    expect(summary.totalCapacity).toBe(500)
    expect(summary.remainingCapacityUnits).toBe(500)
    expect(summary.usedCapacityUnits).toBe(0)
    expect(summary.totalSoldTickets).toBe(0)
    expect(summary.sellThroughRate).toBe(0)
  })
})
