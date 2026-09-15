import type { TicketInventory } from '@saima/shared'

import ticketSalesConfig from '../config/ticket-sales.json'

export type TicketSaleConfigOption = {
  slug: string
  name: string
  description: string | null
  priceCents: number
  capacityUnitsPerTicket: number
  sortOrder: number
  saleStartsAt?: string | null
  saleEndsAt?: string | null
}

export type TicketSaleConfig = {
  eventPublicId: string
  currency: string
  capacity: number
  saleStartsAt: string | null
  saleEndsAt: string | null
  isActive: boolean
  secretKey?: string
  ticketTypes: TicketSaleConfigOption[]
}

export type EventTicketStatusTier = {
  name: string
  slug: string
  description: string | null
  priceCents: number
  currency: string
  capacityUnitsPerTicket: number
  sold: number
  reserved: number
  remainingTickets: number
  soldOut: boolean
}

export type EventTicketStatusSummary = {
  eventPublicId: string
  totalCapacity: number
  remainingCapacityUnits: number
  usedCapacityUnits: number
  totalSoldTickets: number
  totalReservedTickets: number
  sellThroughRate: number
  tiers: EventTicketStatusTier[]
}

export const ticketSales = ticketSalesConfig satisfies TicketSaleConfig[]

export function getTicketSaleConfig(eventPublicId: string): TicketSaleConfig | null {
  return ticketSales.find((sale) => sale.eventPublicId === eventPublicId) ?? null
}

export function getTicketSaleOptions(eventPublicId: string): TicketSaleConfigOption[] {
  return [...(getTicketSaleConfig(eventPublicId)?.ticketTypes ?? [])].sort((a, b) => a.sortOrder - b.sortOrder)
}

export function verifyTicketSaleSecret(eventPublicId: string, providedKey: string | null | undefined): boolean {
  if (!providedKey || typeof providedKey !== 'string') {
    return false
  }

  const config = getTicketSaleConfig(eventPublicId)
  if (!config || !config.secretKey) {
    return false
  }

  return config.secretKey.trim().toLowerCase() === providedKey.trim().toLowerCase()
}

export function calculateTicketAvailabilitySummary(
  eventPublicId: string,
  capacity: number,
  ticketInventories: TicketInventory[],
): EventTicketStatusSummary {
  const config = getTicketSaleConfig(eventPublicId)
  const ticketOptions = getTicketSaleOptions(eventPublicId)
  const currency = config?.currency ?? 'AUD'
  const totalCapacity = capacity || config?.capacity || 0

  const inventoryBySlug = new Map(ticketInventories.map((inv) => [inv.slug, inv]))
  const firstInventoryRemaining = ticketInventories[0]?.remaining
  const remainingCapacityUnits =
    typeof firstInventoryRemaining === 'number'
      ? firstInventoryRemaining
      : totalCapacity

  let totalSoldTickets = 0
  let totalReservedTickets = 0

  const tiers: EventTicketStatusTier[] = ticketOptions.map((opt) => {
    const inv = inventoryBySlug.get(opt.slug)
    const sold = inv?.sold ?? 0
    const reserved = inv?.reserved ?? 0
    totalSoldTickets += sold
    totalReservedTickets += reserved

    const units = opt.capacityUnitsPerTicket > 0 ? opt.capacityUnitsPerTicket : 1
    const remainingTickets = Math.floor(remainingCapacityUnits / units)
    const soldOut = remainingCapacityUnits < units

    return {
      name: opt.name,
      slug: opt.slug,
      description: opt.description,
      priceCents: opt.priceCents,
      currency,
      capacityUnitsPerTicket: opt.capacityUnitsPerTicket,
      sold,
      reserved,
      remainingTickets,
      soldOut,
    }
  })

  const usedCapacityUnits = Math.max(0, totalCapacity - remainingCapacityUnits)
  const sellThroughRate =
    totalCapacity > 0 ? Math.round((usedCapacityUnits / totalCapacity) * 1000) / 10 : 0

  return {
    eventPublicId,
    totalCapacity,
    remainingCapacityUnits,
    usedCapacityUnits,
    totalSoldTickets,
    totalReservedTickets,
    sellThroughRate,
    tiers,
  }
}

