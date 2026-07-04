import { createFileRoute } from '@tanstack/react-router'

import { MembershipApplicationForm } from '../components/membership-application-form'
import { RoleGate } from '../components/role-gate'

export const Route = createFileRoute('/dashboard/visitor')({ component: VisitorDashboard })

function VisitorDashboard() {
  return (
    <RoleGate allowed={['visitor']}>
      <main className="workspace">
        <aside className="sidebar">
          <span className="eyebrow">Visitor</span>
          <p className="muted">Apply, book, and manage personal details.</p>
        </aside>
        <section className="main-panel">
          <h2>Visitor dashboard</h2>
          <div className="panel-grid">
            <section className="panel">
              <h3>Membership application</h3>
              <MembershipApplicationForm />
            </section>
            <section className="panel">
              <h3>Bookings</h3>
              <p>Browse public course slots, book available sessions, and review booking history.</p>
            </section>
          </div>
        </section>
      </main>
    </RoleGate>
  )
}
