import type { Role } from '@saima/shared'

export type DashboardNavItem = {
  id: string
  label: string
  description: string
  to: `/dashboard/${Role}/${string}`
}

export const dashboardNav = {
  admin: [
    {
      id: 'ticket-sales',
      label: 'Ticket sales',
      description: 'Review sales statistics',
      to: '/dashboard/admin/ticket-sales',
    },
    {
      id: 'free-tickets',
      label: 'Free Tickets',
      description: 'Issue complimentary tickets',
      to: '/dashboard/admin/free-tickets',
    },
    {
      id: 'ticket-checkin',
      label: 'Ticket check-in',
      description: 'Validate QR tickets',
      to: '/dashboard/admin/ticket-checkin',
    },
    {
      id: 'applications',
      label: 'Applications',
      description: 'Review membership requests',
      to: '/dashboard/admin/applications',
    },
    {
      id: 'users',
      label: 'Users',
      description: 'Manage roles and access',
      to: '/dashboard/admin/users',
    },
    {
      id: 'events',
      label: 'Events',
      description: 'Manage public event media',
      to: '/dashboard/admin/events',
    },
    {
      id: 'bookings',
      label: 'Bookings',
      description: 'Monitor course operations',
      to: '/dashboard/admin/bookings',
    },
  ],
  member: [
    {
      id: 'courses',
      label: 'Courses',
      description: 'Publish and manage courses',
      to: '/dashboard/member/courses',
    },
    {
      id: 'availability',
      label: 'Availability',
      description: 'Publish bookable time slots',
      to: '/dashboard/member/availability',
    },
    {
      id: 'bookings',
      label: 'Bookings',
      description: 'Review visitor reservations',
      to: '/dashboard/member/bookings',
    },
    {
      id: 'profile',
      label: 'Profile',
      description: 'Manage public profile media',
      to: '/dashboard/member/profile',
    },
  ],
  visitor: [
    {
      id: 'tickets',
      label: 'Tickets',
      description: 'View event tickets',
      to: '/dashboard/visitor/tickets',
    },
    {
      id: 'bookings',
      label: 'Bookings',
      description: 'View course reservations',
      to: '/dashboard/visitor/bookings',
    },
    {
      id: 'membership',
      label: 'Membership',
      description: 'Apply to become a member',
      to: '/dashboard/visitor/membership',
    },
  ],
} satisfies Record<Role, DashboardNavItem[]>

export const dashboardDefaults = {
  admin: '/dashboard/admin/ticket-sales',
  member: '/dashboard/member/courses',
  visitor: '/dashboard/visitor/tickets',
} satisfies Record<Role, DashboardNavItem['to']>

export function getDashboardItems(role: Role) {
  return dashboardNav[role]
}

export function getActiveDashboardItem(role: Role, pathname: string) {
  return getDashboardItems(role).find((item) => pathname === item.to)
}
