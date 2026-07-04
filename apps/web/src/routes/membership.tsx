import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

import { MembershipApplicationForm } from '../components/membership-application-form'
import { useAuth } from '../components/auth-provider'
import { Button } from '../components/ui/button'
import { membershipBenefits } from '../lib/content'
import { api } from '../lib/orpc'

export const Route = createFileRoute('/membership')({ component: Membership })

function Membership() {
  const { loading, role, user } = useAuth()
  const [applicationStatus, setApplicationStatus] = useState<string | null>(null)

  useEffect(() => {
    async function loadApplication() {
      if (!user || role === 'member' || role === 'admin') {
        return
      }

      try {
        const applications = (await api.membershipApplications.mine()) as Array<{ status: string }>
        setApplicationStatus(applications[0]?.status ?? null)
      } catch {
        setApplicationStatus(null)
      }
    }

    void loadApplication()
  }, [role, user])

  return (
    <main>
      <section className="page-hero">
        <span className="eyebrow">Membership</span>
        <h2>Join SAIMA as a performer, teacher, collaborator, or supporter.</h2>
        <p>
          Membership applications are reviewed by admins. Approved applicants receive member access
          to publish course availability and manage bookings.
        </p>
        {!loading && !user ? (
          <div className="actions">
            <Button asChild>
              <a href="/login">Apply after sign-in</a>
            </Button>
          </div>
        ) : null}
      </section>
      {user ? (
        <section className="section">
          <div className="section-grid">
            <div>
              <span className="eyebrow">Application</span>
              <h3>Membership application</h3>
              {role === 'member' || role === 'admin' ? (
                <p className="muted">Your account already has SAIMA member access.</p>
              ) : applicationStatus ? (
                <p className="muted">Your latest application status is `{applicationStatus}`.</p>
              ) : (
                <p className="muted">Submit your application for admin review.</p>
              )}
            </div>
            <div>
              {role === 'member' || role === 'admin' || applicationStatus ? null : (
                <MembershipApplicationForm onSubmitted={() => setApplicationStatus('pending')} />
              )}
            </div>
          </div>
        </section>
      ) : null}
      <section className="section">
        <div className="section-grid">
          <div>
            <h3>Member benefits</h3>
          </div>
          <div className="plain-list">
            {membershipBenefits.map((benefit) => (
              <div className="list-row" key={benefit}>
                <strong>Included</strong>
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
