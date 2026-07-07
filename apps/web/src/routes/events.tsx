import { createFileRoute } from '@tanstack/react-router'
import { ArrowRight, CalendarDays, MapPin } from 'lucide-react'

import { Button } from '../components/ui/button'
import { galleryMoments, publicEvents, siteImages } from '../lib/content'

export const Route = createFileRoute('/events')({ component: Events })

function Events() {
  return (
    <main className="public-page">
      <section className="page-hero image-hero">
        <img src={siteImages.eventsConcert} alt="" aria-hidden="true" />
        <div className="hero-scrim warm" />
        <div>
          <span className="eyebrow">Events</span>
          <h1>Concerts, workshops, welcomes, and member showcases.</h1>
          <p>
            Public programs introduce SAIMA before login, while member and admin workflows continue
            through the dashboard.
          </p>
        </div>
      </section>

      <section className="public-section">
        <div className="section-heading">
          <span className="eyebrow">Upcoming Events</span>
          <h2>Gather around music that travels across cultures.</h2>
        </div>
        <div className="event-list">
          {publicEvents.map((event) => (
            <article className="event-row" key={event.title}>
              <time>{event.date}</time>
              <div>
                <h3>{event.title}</h3>
                <p>{event.summary}</p>
                <p className="muted inline-meta">
                  <MapPin size={16} aria-hidden="true" /> {event.location}
                </p>
              </div>
              <Button asChild variant="outline">
                <a href="/contact">
                  Enquire <ArrowRight size={16} />
                </a>
              </Button>
            </article>
          ))}
        </div>
      </section>

      <section className="public-section dark-feature">
        <div>
          <span className="eyebrow">Member calendar</span>
          <h2>Performances are only one part of the association.</h2>
          <p>
            SAIMA events also include welcome sessions, teaching exchanges, rehearsals, and
            collaborative workshops led by members.
          </p>
        </div>
        <CalendarDays size={96} aria-hidden="true" />
      </section>

      <section className="public-section gallery-strip">
        <div className="section-heading centered">
          <span className="eyebrow">Past moments</span>
          <h2>Recent community scenes</h2>
        </div>
        <div className="gallery-grid">
          {galleryMoments.slice(0, 3).map((moment) => (
            <article className="gallery-tile" key={moment.title}>
              <img src={moment.image} alt="" />
              <span>{moment.category}</span>
              <h3>{moment.title}</h3>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
