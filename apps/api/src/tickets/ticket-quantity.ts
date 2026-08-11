const defaultTicketQuantityLimit = 10
const zeroCapacityTicketQuantityLimit = 100

export function getTicketQuantityLimit(capacityUnitsPerTicket: number) {
  return capacityUnitsPerTicket === 0 ? zeroCapacityTicketQuantityLimit : defaultTicketQuantityLimit
}
