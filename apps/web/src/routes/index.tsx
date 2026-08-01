import { createFileRoute } from '@tanstack/react-router'
import { ArrowRight, CalendarDays, Music, School, Users } from 'lucide-react'

import { useLanguage } from '../components/language-provider'
import { Button } from '../components/ui/button'
import { eventsContent, getEventsByStatus } from '../content/events'
import { homeContent } from '../content/home'
import { siteImages } from '../content/shared'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  const { language } = useLanguage()
  const content = homeContent[language]
  const events = getEventsByStatus(language).upcoming
  const icons = {
    music: Music,
    school: School,
    users: Users,
  }

  return (
    <main className="public-page">
      <section className="home-hero">
        <img src={siteImages.heroStage} alt="" aria-hidden="true" />
        <div className="hero-scrim" />
        <div className="hero-content">
          <span className="eyebrow">{content.hero.eyebrow}</span>
          <h1>{content.hero.title}</h1>
          <p className="lead">{content.hero.paragraphs[0]}</p>
          <div className="actions">
            <Button asChild>
              <a href="/courses">
                {content.hero.primaryAction} <ArrowRight size={18} />
              </a>
            </Button>
            <Button asChild data-tone="dark" variant="secondary">
              <a href="/events">
                {content.hero.secondaryAction} <CalendarDays size={18} />
              </a>
            </Button>
          </div>
        </div>
      </section>

      <section className="public-section editorial-split">
        <div className="section-copy">
          <span className="eyebrow">{content.mandate.eyebrow}</span>
          <h2>{content.mandate.title}</h2>
          <p className="lead dark">{content.mandate.paragraphs[0]}</p>
          <p>{content.mandate.paragraphs[1]}</p>
          <a className="text-link" href="/about">
            {content.mandate.action} <ArrowRight size={16} />
          </a>
        </div>
        <div className="image-offset">
          <img src={siteImages.mandateLesson} alt="" />
        </div>
      </section>

      <section className="public-section tone-band">
        <div className="section-heading centered">
          <h2>{content.sections.whatWeDo}</h2>
        </div>
        <div className="pillar-grid">
          {content.pillars.map((pillar) => {
            const Icon = icons[pillar.icon]
            return (
              <article className="pillar-card" key={pillar.title}>
                <span className="icon-disc">
                  <Icon size={24} aria-hidden="true" />
                </span>
                <h3>{pillar.title}</h3>
                <p>{pillar.summary}</p>
              </article>
            )
          })}
        </div>
      </section>

      <section className="public-section event-preview">
        <div>
          <span className="eyebrow">{eventsContent[language].labels.upcoming}</span>
          <h2>{eventsContent[language].sections.upcomingTitle}</h2>
        </div>
        <div className="plain-list">
          {events.slice(0, 3).map((event) => (
            <article className="list-row" key={event.title}>
              <strong>{event.date}</strong>
              <span>
                {event.title}
                <br />
                <span className="muted">{event.subtitle ?? event.location}</span>
              </span>
            </article>
          ))}
        </div>
      </section>

      <section className="public-section cta-panel">
        <div>
          <h2>{content.cta.title}</h2>
          <p>{content.cta.text}</p>
          <div className="actions centered-actions">
            <Button asChild>
              <a href="/membership">{content.cta.primaryAction}</a>
            </Button>
            <Button asChild variant="outline">
              <a href="/contact">{content.cta.secondaryAction}</a>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
