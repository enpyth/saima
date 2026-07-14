import { createFileRoute } from '@tanstack/react-router'
import { MapPin } from 'lucide-react'

import { useLanguage } from '../components/language-provider'
import { eventsContent } from '../content/events'
import type { EventArticle } from '../content/types'

export const Route = createFileRoute('/events-details')({ component: EventDetails })

function EventDetails() {
  const { language } = useLanguage()
  const content = eventsContent[language]

  return (
    <main className="public-page">
      <section className="public-title">
        <span className="eyebrow">{content.hero.eyebrow}</span>
        <h1>{content.hero.title}</h1>
        {content.hero.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>

      <section className="public-section">
        <div className="section-heading">
          <span className="eyebrow">{content.labels.upcoming}</span>
          <h2>{content.upcoming.title}</h2>
          {content.upcoming.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <div className="event-list">
          {content.upcoming.events.map((event) => (
            <DetailEvent event={event} highlightsLabel={content.labels.highlights} key={event.title} />
          ))}
        </div>
      </section>

      <section className="public-section tone-band">
        <div className="section-heading centered">
          <span className="eyebrow">{content.labels.past}</span>
          <h2>{content.past.title}</h2>
          {content.past.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      {content.past.sections.map((section) => (
        <section className="public-section" key={section.title}>
          <div className="section-heading">
            <h2>{section.title}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          {section.events ? (
            <div className="event-list">
              {section.events.map((event) => (
                <DetailEvent event={event} highlightsLabel={content.labels.highlights} key={event.title} />
              ))}
            </div>
          ) : null}
        </section>
      ))}
    </main>
  )
}

function DetailEvent({
  event,
  highlightsLabel,
}: {
  event: EventArticle
  highlightsLabel: string
}) {
  return (
    <article className="event-row rich-event-row">
      <time>{event.date}</time>
      <div>
        <h3>{event.title}</h3>
        {event.subtitle ? <p className="lead dark">{event.subtitle}</p> : null}
        {event.location ? (
          <p className="muted inline-meta">
            <MapPin size={16} aria-hidden="true" /> {event.location}
          </p>
        ) : null}
        {event.paragraphs?.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        {event.highlights ? (
          <div className="event-highlights">
            <strong>{highlightsLabel}</strong>
            <ul>
              {event.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </article>
  )
}
