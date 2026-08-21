import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import type { TicketInventory, TicketType } from '@saima/shared'

export type ConfiguredTicketOption = {
  slug: string
  name: string
  description: string | null
  priceCents: number
  capacityUnitsPerTicket: number
  sortOrder: number
  saleStartsAt?: string | null
  saleEndsAt?: string | null
}

export type ConfiguredTicketSale = {
  eventPublicId: string
  currency: string
  capacity: number
  saleStartsAt: string | null
  saleEndsAt: string | null
  isActive: boolean
  ticketTypes: ConfiguredTicketOption[]
}

export type ConfiguredTicketType = ConfiguredTicketOption & {
  id: string
  eventPublicId: string
  currency: string
  capacity: number
  saleStartsAt: string | null
  saleEndsAt: string | null
  isActive: boolean
}

export type TicketOrderQuantity = {
  event_public_id: string
  ticket_type_id: string
  quantity: number
  capacity_units_per_ticket?: number | null
  status: string
}

const ticketSalesConfigPath = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../../../web/src/config/ticket-sales.json',
)

export const configuredTicketSales = parseTicketSalesConfig(
  JSON.parse(readFileSync(ticketSalesConfigPath, 'utf8')),
)

const ticketTypeIdNamespace = 'saima-ticket-type'

export function createTicketTypeId(eventPublicId: string, slug: string) {
  const hash = createHash('sha1').update(`${ticketTypeIdNamespace}:${eventPublicId}:${slug}`).digest('hex')
  return [
    hash.slice(0, 8),
    hash.slice(8, 12),
    `5${hash.slice(13, 16)}`,
    `${((Number.parseInt(hash.slice(16, 18), 16) & 0x3f) | 0x80).toString(16)}${hash.slice(18, 20)}`,
    hash.slice(20, 32),
  ].join('-')
}

export function getConfiguredTicketSale(eventPublicId: string): ConfiguredTicketSale | null {
  return configuredTicketSales.find((sale) => sale.eventPublicId === eventPublicId) ?? null
}

export function getConfiguredTicketTypes(eventPublicId?: string): ConfiguredTicketType[] {
  return configuredTicketSales
    .filter((sale) => !eventPublicId || sale.eventPublicId === eventPublicId)
    .flatMap((sale) =>
      sale.ticketTypes.map((ticketType) => ({
        ...ticketType,
        id: createTicketTypeId(sale.eventPublicId, ticketType.slug),
        eventPublicId: sale.eventPublicId,
        currency: sale.currency,
        capacity: sale.capacity,
        capacityUnitsPerTicket: ticketType.capacityUnitsPerTicket,
        saleStartsAt: ticketType.saleStartsAt === undefined ? sale.saleStartsAt : ticketType.saleStartsAt,
        saleEndsAt: ticketType.saleEndsAt === undefined ? sale.saleEndsAt : ticketType.saleEndsAt,
        isActive: sale.isActive,
      })),
    )
    .sort((a, b) => a.sortOrder - b.sortOrder)
}

export function getConfiguredTicketTypeById(ticketTypeId: string): ConfiguredTicketType | null {
  return getConfiguredTicketTypes().find((ticketType) => ticketType.id === ticketTypeId) ?? null
}

export function summarizeConfiguredTicketTypes(
  ticketTypes: ConfiguredTicketType[],
  orders: TicketOrderQuantity[],
): TicketType[] {
  const inventoryById = summarizeTicketInventory(ticketTypes, orders)

  return ticketTypes.map((ticketType) => {
    const eventOrders = orders.filter(
      (order) =>
        order.event_public_id === ticketType.eventPublicId &&
        (order.status === 'confirmed' || order.status === 'pending_payment'),
    )
    const sold = eventOrders
      .filter((order) => order.ticket_type_id === ticketType.id && order.status === 'confirmed')
      .reduce((total, order) => total + order.quantity, 0)
    const reserved = eventOrders
      .filter((order) => order.ticket_type_id === ticketType.id && order.status === 'pending_payment')
      .reduce((total, order) => total + order.quantity, 0)
    const inventory = inventoryById.find((item) => item.ticketTypeId === ticketType.id)

    return {
      id: ticketType.id,
      eventPublicId: ticketType.eventPublicId,
      name: ticketType.name,
      description: ticketType.description,
      priceCents: ticketType.priceCents,
      currency: ticketType.currency,
      capacity: ticketType.capacity,
      capacityUnitsPerTicket: ticketType.capacityUnitsPerTicket,
      sold,
      reserved,
      remaining: inventory?.remaining ?? ticketType.capacity,
      saleStartsAt: ticketType.saleStartsAt,
      saleEndsAt: ticketType.saleEndsAt,
      isActive: ticketType.isActive,
    }
  })
}

export function summarizeTicketInventory(
  ticketTypes: ConfiguredTicketType[],
  orders: TicketOrderQuantity[],
): TicketInventory[] {
  return ticketTypes.map((ticketType) => {
    const eventOrders = orders.filter(
      (order) =>
        order.event_public_id === ticketType.eventPublicId &&
        (order.status === 'confirmed' || order.status === 'pending_payment'),
    )
    const sold = eventOrders
      .filter((order) => order.ticket_type_id === ticketType.id && order.status === 'confirmed')
      .reduce((total, order) => total + order.quantity, 0)
    const reserved = eventOrders
      .filter((order) => order.ticket_type_id === ticketType.id && order.status === 'pending_payment')
      .reduce((total, order) => total + order.quantity, 0)
    const eventReservedOrSold = eventOrders.reduce((total, order) => {
      const orderedTicketType = getConfiguredTicketTypeById(order.ticket_type_id)
      const capacityUnits = order.capacity_units_per_ticket ?? orderedTicketType?.capacityUnitsPerTicket ?? 1

      return total + order.quantity * capacityUnits
    }, 0)

    return {
      eventPublicId: ticketType.eventPublicId,
      ticketTypeId: ticketType.id,
      slug: ticketType.slug,
      sold,
      reserved,
      remaining: Math.max(ticketType.capacity - eventReservedOrSold, 0),
    }
  })
}

function parseTicketSalesConfig(value: unknown): ConfiguredTicketSale[] {
  if (!Array.isArray(value)) {
    throw new Error('Ticket sales config must be an array.')
  }

  return value.map((sale) => parseTicketSale(sale))
}

function parseTicketSale(value: unknown): ConfiguredTicketSale {
  if (!isRecord(value)) {
    throw new Error('Ticket sale config entries must be objects.')
  }

  return {
    eventPublicId: readString(value, 'eventPublicId'),
    currency: readString(value, 'currency'),
    capacity: readPositiveInteger(value, 'capacity'),
    saleStartsAt: readNullableString(value, 'saleStartsAt'),
    saleEndsAt: readNullableString(value, 'saleEndsAt'),
    isActive: readBoolean(value, 'isActive'),
    ticketTypes: readTicketTypes(value.ticketTypes),
  }
}

function readTicketTypes(value: unknown): ConfiguredTicketOption[] {
  if (!Array.isArray(value)) {
    throw new Error('Ticket sale config ticketTypes must be an array.')
  }

  return value.map((ticketType) => {
    if (!isRecord(ticketType)) {
      throw new Error('Ticket type config entries must be objects.')
    }

    return {
      slug: readString(ticketType, 'slug'),
      name: readString(ticketType, 'name'),
      description: readNullableString(ticketType, 'description'),
      priceCents: readNonNegativeInteger(ticketType, 'priceCents'),
      capacityUnitsPerTicket: readNonNegativeInteger(ticketType, 'capacityUnitsPerTicket'),
      sortOrder: readNonNegativeInteger(ticketType, 'sortOrder'),
      saleStartsAt: readOptionalNullableString(ticketType, 'saleStartsAt'),
      saleEndsAt: readOptionalNullableString(ticketType, 'saleEndsAt'),
    }
  })
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function readString(value: Record<string, unknown>, key: string): string {
  const field = value[key]
  if (typeof field !== 'string' || field.trim() === '') {
    throw new Error(`Ticket sales config field ${key} must be a non-empty string.`)
  }

  return field
}

function readNullableString(value: Record<string, unknown>, key: string): string | null {
  const field = value[key]
  if (field === null) {
    return null
  }
  if (typeof field !== 'string' || field.trim() === '') {
    throw new Error(`Ticket sales config field ${key} must be a string or null.`)
  }

  return field
}

function readOptionalNullableString(value: Record<string, unknown>, key: string): string | null | undefined {
  return key in value ? readNullableString(value, key) : undefined
}

function readBoolean(value: Record<string, unknown>, key: string): boolean {
  const field = value[key]
  if (typeof field !== 'boolean') {
    throw new Error(`Ticket sales config field ${key} must be a boolean.`)
  }

  return field
}

function readPositiveInteger(value: Record<string, unknown>, key: string): number {
  const field = value[key]
  if (typeof field !== 'number' || !Number.isInteger(field) || field <= 0) {
    throw new Error(`Ticket sales config field ${key} must be a positive integer.`)
  }

  return field
}

function readNonNegativeInteger(value: Record<string, unknown>, key: string): number {
  const field = value[key]
  if (typeof field !== 'number' || !Number.isInteger(field) || field < 0) {
    throw new Error(`Ticket sales config field ${key} must be a non-negative integer.`)
  }

  return field
}
