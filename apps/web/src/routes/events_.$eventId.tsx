import { createFileRoute } from '@tanstack/react-router'
import { ArrowLeft, ExternalLink, FileText, MapPin } from 'lucide-react'

import { useLanguage } from '../components/language-provider'
import Masonry from '../components/Masonry'
import { Button } from '../components/ui/button'
import { eventsContent, findEvent, getEventStatus } from '../content/events'

export const Route = createFileRoute('/events_/$eventId')({ component: EventPage })

function EventPage() {
  const { eventId } = Route.useParams()
  const { language } = useLanguage()
  const content = eventsContent[language]
  const event = findEvent(language, eventId)

  if (!event) {
    return (
      <main className="public-page">
        <section className="public-title">
          <span className="eyebrow">{content.hero.eyebrow}</span>
          <h1>{content.labels.notFoundTitle}</h1>
          <p>{content.labels.notFoundSummary}</p>
          <div className="actions centered-actions">
            <Button asChild variant="outline">
              <a href="/events">
                <ArrowLeft size={16} /> {content.labels.backToEvents}
              </a>
            </Button>
          </div>
        </section>
      </main>
    )
  }

  const statusLabel = content.labels[getEventStatus(event)]

  return (
    <main className="public-page">
      <section className="public-title">
        <span className="eyebrow">{statusLabel}</span>
        <h1>{event.title}</h1>
        {event.subtitle ? <p>{event.subtitle}</p> : null}
        <p className="muted inline-meta">
          <MapPin size={16} aria-hidden="true" /> {event.location}
        </p>
        <div className="actions centered-actions">
          <Button asChild variant="outline">
            <a href="/events">
              <ArrowLeft size={16} /> {content.labels.backToEvents}
            </a>
          </Button>
        </div>
      </section>

      <section className="public-section">
        <article className="event-row rich-event-row">
          <time>{event.date}</time>
          <div>
            {event.paragraphs?.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {event.highlights ? (
              <div className="event-highlights">
                <strong>{content.labels.highlights}</strong>
                <ul>
                  {event.highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </article>
      </section>

      {event.details ? (
        <section className="public-section">
          <div className="section-heading">
            <span className="eyebrow">{content.labels.eventDetails}</span>
            <h2>{content.labels.eventDetails}</h2>
          </div>
          <dl className="event-detail-list">
            {event.details.map((detail) => (
              <div key={detail.label}>
                <dt>{detail.label}</dt>
                <dd>{detail.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      {event.posterImage ? (
        <section className="public-section">
          <div className="section-heading">
            <span className="eyebrow">{event.posterImage.label}</span>
            <h2>{event.posterImage.label}</h2>
          </div>
          <div className="event-poster">
            <img src={event.posterImage.url} alt={event.posterImage.label} />
          </div>
        </section>
      ) : null}

      {event.resources ? (
        <section className="public-section">
          <div className="section-heading">
            <span className="eyebrow">{content.labels.resources}</span>
            <h2>{content.labels.resources}</h2>
          </div>
          <div className="event-resource-grid">
            {event.resources.map((resource) => (
              <article className="event-resource" key={resource.url}>
                <div className="event-resource-file">
                  <FileText size={44} aria-hidden="true" />
                </div>
                <div>
                  <h3>{resource.label}</h3>
                  <Button asChild variant="outline">
                    <a href={resource.url} rel="noreferrer" target="_blank">
                      {content.labels.openResource} <ExternalLink size={16} />
                    </a>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {event.galleryImages ? (
        <section className="public-section">
          <div className="section-heading">
            <span className="eyebrow">{content.labels.gallery}</span>
            <h2>{content.labels.gallery}</h2>
          </div>
          <div className="event-masonry">
            <Masonry
              items={event.galleryImages}
              ease="power3.out"
              duration={0.6}
              stagger={0.05}
              animateFrom="bottom"
              scaleOnHover
              hoverScale={0.95}
              blurToFocus
              colorShiftOnHover={false}
            />
          </div>
        </section>
      ) : null}
    </main>
  )
}
