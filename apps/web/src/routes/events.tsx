import { createFileRoute } from '@tanstack/react-router'
import { MapPin } from 'lucide-react'

import { publicEvents } from '../lib/content'

export const Route = createFileRoute('/events')({ component: Events })

function Events() {
  return (
    <main>
      <section className="page-hero">
        <span className="eyebrow">Events</span>
        <h2>Concerts, workshops, welcomes, and member showcases.</h2>
        <p>
          These public events are visible before login. Admins can publish and manage event details
          from the dashboard once Supabase is configured.
        </p>
      </section>
      <section className="section">
        <div className="plain-list">
          {publicEvents.map((event) => (
            <article className="list-row" key={event.title}>
              <strong>{event.date}</strong>
              <div>
                <h3>{event.title}</h3>
                <p>{event.summary}</p>
                <p className="muted">
                  <MapPin size={16} aria-hidden="true" /> {event.location}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
