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
  ticketTypes: TicketSaleConfigOption[]
}

export const ticketSales = ticketSalesConfig satisfies TicketSaleConfig[]

export function getTicketSaleConfig(eventPublicId: string): TicketSaleConfig | null {
  return ticketSales.find((sale) => sale.eventPublicId === eventPublicId) ?? null
}

export function getTicketSaleOptions(eventPublicId: string): TicketSaleConfigOption[] {
  return [...(getTicketSaleConfig(eventPublicId)?.ticketTypes ?? [])].sort((a, b) => a.sortOrder - b.sortOrder)
}
