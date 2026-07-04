import { createFileRoute, useLocation, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'

import { DashboardShell } from '../components/dashboard-shell'
import { dashboardDefaults } from '../lib/dashboard-nav'

export const Route = createFileRoute('/dashboard/admin')({ component: AdminDashboard })

function AdminDashboard() {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (location.pathname === '/dashboard/admin') {
      void navigate({ to: dashboardDefaults.admin })
    }
  }, [location.pathname, navigate])

  return (
    <DashboardShell
      role="admin"
      title="Admin dashboard"
      description="Manage SAIMA operations, people, and permissions."
    />
  )
}
