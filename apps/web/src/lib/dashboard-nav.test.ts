import { describe, expect, it } from 'vitest'

import {
  dashboardDefaults,
  dashboardNav,
  getActiveDashboardItem,
  getDashboardItems,
} from './dashboard-nav'

describe('dashboard navigation config', () => {
  it('returns the expected navigation items by role', () => {
    expect(getDashboardItems('admin').map((item) => item.id)).toEqual([
      'ticket-sales',
      'applications',
      'users',
      'events',
      'bookings',
    ])
    expect(getDashboardItems('member').map((item) => item.id)).toEqual([
      'courses',
      'availability',
      'bookings',
      'profile',
    ])
    expect(getDashboardItems('visitor').map((item) => item.id)).toEqual([
      'tickets',
      'bookings',
      'membership',
    ])
  })

  it('keeps role dashboard defaults stable', () => {
    expect(dashboardDefaults).toEqual({
      admin: '/dashboard/admin/ticket-sales',
      member: '/dashboard/member/courses',
      visitor: '/dashboard/visitor/tickets',
    })
  })

  it('finds the active item from the current URL', () => {
    expect(getActiveDashboardItem('admin', '/dashboard/admin/users')?.id).toBe('users')
    expect(getActiveDashboardItem('member', '/dashboard/member/courses')?.id).toBe('courses')
    expect(getActiveDashboardItem('visitor', '/dashboard/visitor/membership')?.id).toBe(
      'membership',
    )
    expect(getActiveDashboardItem('visitor', '/dashboard/member/courses')).toBeUndefined()
  })

  it('uses full dashboard paths for every item', () => {
    for (const [role, items] of Object.entries(dashboardNav)) {
      for (const item of items) {
        expect(item.to).toMatch(new RegExp(`^/dashboard/${role}/[a-z-]+$`))
      }
    }
  })
})
