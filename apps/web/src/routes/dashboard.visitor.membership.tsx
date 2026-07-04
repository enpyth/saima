import { createFileRoute } from '@tanstack/react-router'

import { MembershipApplicationForm } from '../components/membership-application-form'

export const Route = createFileRoute('/dashboard/visitor/membership')({
  component: VisitorMembership,
})

function VisitorMembership() {
  return (
    <div className="dashboard-section narrow">
      <header className="dashboard-section-header">
        <div>
          <span className="eyebrow">Membership</span>
          <h2>Membership application</h2>
          <p className="muted">Submit or review your application to become a SAIMA member.</p>
        </div>
      </header>
      <MembershipApplicationForm />
    </div>
  )
}
