import { createFileRoute } from '@tanstack/react-router'
import { ArrowRight, CalendarDays, MapPin } from 'lucide-react'

import { useLanguage } from '../components/language-provider'
import { Button } from '../components/ui/button'
import { eventsContent, getEventsByStatus } from '../content/events'
import type { EventArticle } from '../content/types'
import { siteImages } from '../content/shared'

export const Route = createFileRoute('/events')({ component: Events })

function Events() {
  const { language } = useLanguage()
  const content = eventsContent[language]
  const eventGroups = getEventsByStatus(language)

  return (
    <main className="public-page">
      <section className="page-hero image-hero">
        <img src={siteImages.eventsConcert} alt="" aria-hidden="true" />
        <div className="hero-scrim warm" />
        <div>
          <span className="eyebrow">{content.hero.eyebrow}</span>
          <h1>{content.hero.title}</h1>
          <p>{content.hero.paragraphs[0]}</p>
        </div>
      </section>

      <section className="public-section">
        <div className="section-heading">
          <span className="eyebrow">{content.labels.upcoming}</span>
          <h2>{content.sections.upcomingTitle}</h2>
          <p>{content.sections.upcomingSummary}</p>
        </div>
        <EventList emptyLabel={content.labels.noEvents} events={eventGroups.upcoming} detailsLabel={content.labels.details} />
      </section>

      <section className="public-section dark-feature">
        <div>
          <span className="eyebrow">{content.labels.past}</span>
          <h2>{content.sections.pastTitle}</h2>
          <p>{content.sections.pastSummary}</p>
        </div>
        <CalendarDays size={96} aria-hidden="true" />
      </section>

      <section className="public-section">
        <EventList emptyLabel={content.labels.noEvents} events={eventGroups.past} detailsLabel={content.labels.details} />
      </section>

      {/* <section className="public-section gallery-strip">
        <div className="section-heading centered">
          <span className="eyebrow">{galleryContent[language].hero.eyebrow}</span>
          <h2>{galleryContent[language].hero.title}</h2>
        </div>
        <div className="gallery-grid">
          {moments.map((moment) => (
            <article className="gallery-tile" key={moment.title}>
              <img src={moment.image} alt="" />
              <span>{moment.title}</span>
              <h3>{moment.summary}</h3>
            </article>
          ))}
        </div>
      </section> */}
    </main>
  )
}

function EventList({
  detailsLabel,
  emptyLabel,
  events,
}: {
  detailsLabel: string
  emptyLabel: string
  events: EventArticle[]
}) {
  if (events.length === 0) {
    return <p className="muted">{emptyLabel}</p>
  }

  return (
    <div className="event-list">
      {events.map((event) => (
        <article className="event-row" key={event.id}>
          <time>{event.date}</time>
          <div>
            <h3>{event.title}</h3>
            <p>{event.subtitle}</p>
            <p className="muted inline-meta">
              <MapPin size={16} aria-hidden="true" /> {event.location}
            </p>
          </div>
          <Button asChild variant="outline">
            <a href={event.href}>
              {detailsLabel} <ArrowRight size={16} />
            </a>
          </Button>
        </article>
      ))}
    </div>
  )
}
