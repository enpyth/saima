import { Link, Outlet, useLocation } from '@tanstack/react-router'
import type { Role } from '@saima/shared'

import { getActiveDashboardItem, getDashboardItems } from '../lib/dashboard-nav'
import { RoleGate } from './role-gate'

type DashboardShellProps = {
  role: Role
  title: string
  description: string
}

export function DashboardShell({ role, title, description }: DashboardShellProps) {
  const location = useLocation()
  const activeItem = getActiveDashboardItem(role, location.pathname)

  return (
    <RoleGate allowed={[role]}>
      <main className="workspace dashboard-workspace">
        <aside className="sidebar dashboard-sidebar">
          <div>
            <span className="eyebrow">{role}</span>
            <h2>{title}</h2>
            <p className="muted">{description}</p>
          </div>
          <nav className="dashboard-nav" aria-label={`${title} sections`}>
            {getDashboardItems(role).map((item) => {
              const active = activeItem?.id === item.id

              return (
                <Link
                  key={item.id}
                  to={item.to}
                  className={active ? 'dashboard-nav-item active' : 'dashboard-nav-item'}
                >
                  <strong>{item.label}</strong>
                  <span>{item.description}</span>
                </Link>
              )
            })}
          </nav>
        </aside>
        <section className="main-panel dashboard-main">
          <Outlet />
        </section>
      </main>
    </RoleGate>
  )
}
