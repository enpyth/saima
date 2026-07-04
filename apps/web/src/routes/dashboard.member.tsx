import { createFileRoute, useLocation, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'

import { DashboardShell } from '../components/dashboard-shell'
import { dashboardDefaults } from '../lib/dashboard-nav'

export const Route = createFileRoute('/dashboard/member')({ component: MemberDashboard })

function MemberDashboard() {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (location.pathname === '/dashboard/member') {
      void navigate({ to: dashboardDefaults.member })
    }
  }, [location.pathname, navigate])

  return (
    <DashboardShell
      role="member"
      title="Member dashboard"
      description="Publish courses, set half-hour availability, and review bookings."
    />
  )
}
