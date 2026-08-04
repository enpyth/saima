import { calculateTicketSaleOverview, type TicketSaleStat } from '@saima/shared'
import { describe, expect, it } from 'vitest'

const baseStat: TicketSaleStat = {
  eventPublicId: '20261016',
  eventTitle: 'A Dream for Every Child',
  startsAt: '2026-10-16T09:30:00.000Z',
  ticketTypeId: 'd7b739e2-3b19-4ab4-bdcf-5eb27f0fcb47',
  ticketTypeName: 'General admission',
  priceCents: 3500,
  currency: 'AUD',
  capacity: 100,
  sold: 0,
  reserved: 0,
  remaining: 100,
  revenueCents: 0,
}

describe('ticket sales overview', () => {
  it('sums sales, capacity, remaining tickets, and revenue', () => {
    const overview = calculateTicketSaleOverview([
      { ...baseStat, capacity: 200, sold: 80, reserved: 5, remaining: 115, revenueCents: 280000 },
      { ...baseStat, ticketTypeId: 'bd62f622-0c97-4556-bd5f-f67b5835cf3d', capacity: 50, sold: 25, reserved: 0, remaining: 25, revenueCents: 125000 },
    ])

    expect(overview).toEqual({
      totalCapacity: 250,
      totalSold: 105,
      totalRemaining: 140,
      totalRevenueCents: 405000,
      sellThroughRate: 42,
    })
  })

  it('keeps zero-capacity dashboards stable', () => {
    expect(calculateTicketSaleOverview([])).toEqual({
      totalCapacity: 0,
      totalSold: 0,
      totalRemaining: 0,
      totalRevenueCents: 0,
      sellThroughRate: 0,
    })
  })
})
