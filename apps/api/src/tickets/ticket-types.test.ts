import { describe, expect, it } from 'bun:test'

import {
  configuredTicketSales,
  getConfiguredTicketTypeById,
  getConfiguredTicketTypes,
  summarizeConfiguredTicketTypes,
  summarizeTicketInventory,
} from './ticket-types'

describe('configured ticket types', () => {
  it('stores 20261016 as one sale with simple ticket option slugs', () => {
    const eventTicketTypes = getConfiguredTicketTypes('20261016')

    expect(configuredTicketSales).toHaveLength(1)
    expect(configuredTicketSales[0]).toMatchObject({
      eventPublicId: '20261016',
      capacity: 500,
      currency: 'AUD',
    })
    expect(eventTicketTypes.map((ticketType) => ticketType.name)).toEqual([
      'General admission',
      'Student',
      'Family',
    ])
    expect(eventTicketTypes.map((ticketType) => ticketType.slug)).toEqual(['general', 'student', 'family'])
    expect(eventTicketTypes.map((ticketType) => ticketType.capacityUnitsPerTicket)).toEqual([1, 1, 4])
    expect(eventTicketTypes.map((ticketType) => ticketType.id)).toEqual([
      '2ff47892-1776-583d-8c45-212d3d6f83e9',
      '586a71dc-7174-5956-9ea9-1de251755657',
      'da7b82ae-3575-5a29-9cac-940bcab50406',
    ])
    expect(eventTicketTypes.map((ticketType) => ticketType.id).every((id) => /^[0-9a-f]{8}-[0-9a-f]{4}-5[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(id))).toBe(true)
    expect(eventTicketTypes.every((ticketType) => ticketType.capacity === 500)).toBe(true)
  })

  it('looks up ticket type details for checkout and order display', () => {
    const studentId = getConfiguredTicketTypes('20261016').find((ticketType) => ticketType.slug === 'student')?.id

    expect(studentId).toBeTruthy()
    expect(getConfiguredTicketTypeById(studentId ?? '')).toMatchObject({
      eventPublicId: '20261016',
      name: 'Student',
      priceCents: 2500,
    })
    expect(getConfiguredTicketTypeById('00000000-0000-5000-8000-000000000000')).toBeNull()
  })

  it('summarizes type sales against shared event capacity units', () => {
    const [general, student, family] = getConfiguredTicketTypes('20261016')
    const orders = [
      {
        event_public_id: '20261016',
        ticket_type_id: general?.id ?? '',
        quantity: 2,
        capacity_units_per_ticket: 1,
        status: 'confirmed',
      },
      {
        event_public_id: '20261016',
        ticket_type_id: general?.id ?? '',
        quantity: 1,
        capacity_units_per_ticket: 1,
        status: 'pending_payment',
      },
      {
        event_public_id: '20261016',
        ticket_type_id: student?.id ?? '',
        quantity: 5,
        capacity_units_per_ticket: 1,
        status: 'confirmed',
      },
      {
        event_public_id: '20261016',
        ticket_type_id: family?.id ?? '',
        quantity: 2,
        capacity_units_per_ticket: 4,
        status: 'confirmed',
      },
    ]
    const summaries = summarizeConfiguredTicketTypes(getConfiguredTicketTypes('20261016'), orders)
    const inventories = summarizeTicketInventory(getConfiguredTicketTypes('20261016'), orders)

    expect(summaries[0]).toMatchObject({ name: 'General admission', capacity: 500, sold: 2, reserved: 1, remaining: 484 })
    expect(summaries[1]).toMatchObject({ name: 'Student', sold: 5, reserved: 0, remaining: 484 })
    expect(summaries[2]).toMatchObject({ name: 'Family', sold: 2, capacityUnitsPerTicket: 4, priceCents: 9000, remaining: 484 })
    expect(inventories).toEqual([
      {
        eventPublicId: '20261016',
        ticketTypeId: general?.id,
        slug: 'general',
        sold: 2,
        reserved: 1,
        remaining: 484,
      },
      {
        eventPublicId: '20261016',
        ticketTypeId: student?.id,
        slug: 'student',
        sold: 5,
        reserved: 0,
        remaining: 484,
      },
      {
        eventPublicId: '20261016',
        ticketTypeId: family?.id,
        slug: 'family',
        sold: 2,
        reserved: 0,
        remaining: 484,
      },
    ])
  })
})
