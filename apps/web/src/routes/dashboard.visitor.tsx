import { createFileRoute, useLocation, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'

import { DashboardShell } from '../components/dashboard-shell'
import { dashboardDefaults } from '../lib/dashboard-nav'

export const Route = createFileRoute('/dashboard/visitor')({ component: VisitorDashboard })

function VisitorDashboard() {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (location.pathname === '/dashboard/visitor') {
      void navigate({ to: dashboardDefaults.visitor })
    }
  }, [location.pathname, navigate])

  return (
    <DashboardShell
      role="visitor"
      title="Visitor dashboard"
      description="Apply for membership, book courses, and review your history."
    />
  )
}
