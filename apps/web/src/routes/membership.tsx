import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { ArrowRight, Handshake, Music, Sparkles, Users } from 'lucide-react'

import { MembershipApplicationForm } from '../components/membership-application-form'
import { useAuth } from '../components/auth-provider'
import { Button } from '../components/ui/button'
import { membershipBenefits, participationPaths, siteImages } from '../lib/content'
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
    <main className="public-page">
      <section className="page-hero image-hero compact">
        <img src={siteImages.galleryPerformance} alt="" aria-hidden="true" />
        <div className="hero-scrim pale" />
        <div>
        <span className="eyebrow">Membership</span>
        <h1>Join SAIMA as a performer, teacher, collaborator, or supporter.</h1>
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
        </div>
      </section>

      <section className="public-section">
        <div className="section-heading centered">
          <span className="eyebrow">Join SAIMA</span>
          <h2>Choose the membership path that fits your practice.</h2>
        </div>
        <div className="participation-grid">
          {participationPaths.map((path, index) => {
            const Icon = [Sparkles, Handshake, Music, Users][index] ?? Sparkles
            return (
              <article className="participation-item" key={path.title}>
                <Icon size={28} aria-hidden="true" />
                <h3>{path.title}</h3>
                <p>{path.summary}</p>
                <a href={path.to}>
                  {path.action} <ArrowRight size={15} />
                </a>
              </article>
            )
          })}
        </div>
      </section>

      {user ? (
        <section className="public-section application-section">
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
      <section className="public-section">
        <div className="section-grid">
          <div>
            <span className="eyebrow">Member benefits</span>
            <h2>Support for musicians building a public practice.</h2>
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
