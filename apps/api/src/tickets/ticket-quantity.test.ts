import { describe, expect, it } from 'bun:test'

import { getTicketQuantityLimit } from './ticket-quantity'

describe('ticket quantity limit', () => {
  it('limits regular ticket types to 10 tickets', () => {
    expect(getTicketQuantityLimit(1)).toBe(10)
    expect(getTicketQuantityLimit(4)).toBe(10)
  })

  it('allows larger quantities for zero-capacity price adjustments', () => {
    expect(getTicketQuantityLimit(0)).toBe(100)
  })
})
