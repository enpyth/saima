import { calculateTicketSaleOverview, getTicketQuantityLimit, type TicketSaleStat } from '@saima/shared'
import { describe, expect, it } from 'vitest'

import { getTicketSaleConfig, getTicketSaleOptions } from './ticket-sales-config'

const baseStat: TicketSaleStat = {
  eventPublicId: '20261016',
  eventTitle: 'A Dream for Every Child',
  startsAt: '2026-10-16T09:30:00.000Z',
  ticketTypeId: '2ff47892-1776-583d-8c45-212d3d6f83e9',
  ticketTypeName: 'General admission',
  priceCents: 3500,
  currency: 'AUD',
  capacity: 100,
  capacityUnitsPerTicket: 1,
  sold: 0,
  reserved: 0,
  remaining: 100,
  revenueCents: 0,
}

describe('ticket sales overview', () => {
  it('sums sales and revenue while counting shared event capacity once', () => {
    const overview = calculateTicketSaleOverview([
      { ...baseStat, capacity: 200, sold: 80, reserved: 5, remaining: 87, revenueCents: 280000 },
      { ...baseStat, ticketTypeId: '586a71dc-7174-5956-9ea9-1de251755657', ticketTypeName: 'Student', capacity: 200, sold: 25, reserved: 0, remaining: 87, revenueCents: 125000 },
      { ...baseStat, ticketTypeId: 'da7b82ae-3575-5a29-9cac-940bcab50406', ticketTypeName: 'Family', capacity: 200, capacityUnitsPerTicket: 4, sold: 2, reserved: 0, remaining: 87, revenueCents: 18000 },
    ])

    expect(overview).toEqual({
      totalCapacity: 200,
      totalSold: 113,
      totalRemaining: 87,
      totalRevenueCents: 423000,
      sellThroughRate: 56.5,
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

describe('ticket sales config', () => {
  it('loads 20261016 ticket options from the web config file', () => {
    const sale = getTicketSaleConfig('20261016')
    const ticketOptions = getTicketSaleOptions('20261016')

    expect(sale).toMatchObject({
      eventPublicId: '20261016',
      currency: 'AUD',
      capacity: 500,
      isActive: true,
    })
    expect(ticketOptions.map((ticketOption) => ticketOption.slug)).toEqual([
      'general',
      'student',
      'family',
      'price-adjustment',
    ])
    expect(ticketOptions.map((ticketOption) => ticketOption.name)).toEqual([
      'General admission',
      'Student',
      'Family',
      'Price adjustment',
    ])
    expect(ticketOptions.find((ticketOption) => ticketOption.slug === 'family')).toMatchObject({
      priceCents: 10000,
      capacityUnitsPerTicket: 4,
    })
    expect(ticketOptions.find((ticketOption) => ticketOption.slug === 'price-adjustment')).toMatchObject({
      priceCents: 100,
      capacityUnitsPerTicket: 0,
    })
    expect(getTicketQuantityLimit(ticketOptions.find((ticketOption) => ticketOption.slug === 'price-adjustment')?.capacityUnitsPerTicket ?? 1)).toBe(100)
  })

  it('returns empty options for events without a ticket config', () => {
    expect(getTicketSaleConfig('missing-event')).toBeNull()
    expect(getTicketSaleOptions('missing-event')).toEqual([])
  })
})
