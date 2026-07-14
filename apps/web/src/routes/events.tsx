import { createFileRoute } from '@tanstack/react-router'
import { ArrowRight, CalendarDays, MapPin } from 'lucide-react'

import { useLanguage } from '../components/language-provider'
import { Button } from '../components/ui/button'
import { eventsContent } from '../content/events'
import { galleryContent } from '../content/gallery'
import { siteImages } from '../content/shared'

export const Route = createFileRoute('/events')({ component: Events })

function Events() {
  const { language } = useLanguage()
  const content = eventsContent[language]
  const moments = galleryContent[language].groups.slice(0, 3)

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
          <span className="eyebrow">{content.upcoming.title}</span>
          <h2>{content.upcoming.paragraphs[1]}</h2>
        </div>
        <div className="event-list">
          {content.upcoming.events.map((event) => (
            <article className="event-row" key={event.title}>
              <time>{event.date}</time>
              <div>
                <h3>{event.title}</h3>
                <p>{event.subtitle}</p>
                <p className="muted inline-meta">
                  <MapPin size={16} aria-hidden="true" /> {event.location}
                </p>
              </div>
              <Button asChild variant="outline">
                <a href="/events-details">
                  {content.labels.details} <ArrowRight size={16} />
                </a>
              </Button>
            </article>
          ))}
        </div>
      </section>

      <section className="public-section dark-feature">
        <div>
          <span className="eyebrow">{content.labels.past}</span>
          <h2>{content.past.title}</h2>
          <p>{content.past.paragraphs[0]}</p>
        </div>
        <Button asChild data-tone="dark" variant="secondary">
          <a href="/events-details">
            {content.labels.details} <ArrowRight size={16} />
          </a>
        </Button>
        <CalendarDays size={96} aria-hidden="true" />
      </section>

      <section className="public-section gallery-strip">
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
      </section>
    </main>
  )
}
