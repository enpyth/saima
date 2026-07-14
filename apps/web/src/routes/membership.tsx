import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { ArrowRight, Handshake, Music, Sparkles, Users } from 'lucide-react'

import { MembershipApplicationForm } from '../components/membership-application-form'
import { useAuth } from '../components/auth-provider'
import { useLanguage } from '../components/language-provider'
import { Button } from '../components/ui/button'
import { membershipContent } from '../content/membership'
import { siteImages } from '../content/shared'
import { api } from '../lib/orpc'

export const Route = createFileRoute('/membership')({ component: Membership })

function Membership() {
  const { loading, role, user } = useAuth()
  const { language } = useLanguage()
  const content = membershipContent[language]
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
          <span className="eyebrow">{content.hero.eyebrow}</span>
          <h1>{content.hero.title}</h1>
          <p>{content.hero.paragraphs[0]}</p>
          {!loading && !user ? (
            <div className="actions">
              <Button asChild>
                <a href="/login">{content.hero.signedOutAction}</a>
              </Button>
              <Button asChild variant="outline">
                <a href="/membership-details">
                  {content.detailsAction} <ArrowRight size={16} />
                </a>
              </Button>
            </div>
          ) : null}
        </div>
      </section>

      <section className="public-section">
        <div className="section-heading centered">
          <span className="eyebrow">{content.pathsHeading.eyebrow}</span>
          <h2>{content.pathsHeading.title}</h2>
        </div>
        <div className="participation-grid">
          {content.paths.map((path, index) => {
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
              <span className="eyebrow">{content.application.eyebrow}</span>
              <h3>{content.application.title}</h3>
              {role === 'member' || role === 'admin' ? (
                <p className="muted">{content.application.alreadyMember}</p>
              ) : applicationStatus ? (
                <p className="muted">
                  {content.application.statusPrefix} `{applicationStatus}`.
                </p>
              ) : (
                <p className="muted">{content.application.submitPrompt}</p>
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
            <span className="eyebrow">{content.sponsorship.eyebrow}</span>
            <h2>{content.sponsorship.title}</h2>
            <p>{content.sponsorship.paragraphs[0]}</p>
          </div>
          <div className="plain-list">
            {content.sponsorship.items.slice(0, 4).map((item) => (
              <div className="list-row" key={item}>
                <strong>{content.sponsorship.itemLabel}</strong>
                <span>{item}</span>
              </div>
            ))}
            <div className="list-row">
              <strong>{content.sponsorship.itemLabel}</strong>
              <span>
                <a className="text-link" href="/membership-details">
                  {content.detailsAction} <ArrowRight size={15} />
                </a>
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
