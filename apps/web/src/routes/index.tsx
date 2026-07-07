import { createFileRoute } from '@tanstack/react-router'
import { ArrowRight, CalendarDays, Music, School, Users } from 'lucide-react'

import { Button } from '../components/ui/button'
import { programPillars, publicEvents, siteImages } from '../lib/content'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
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
          <span className="eyebrow">South Australia / Cultural harmony</span>
          <h1>South Australian International Musicians Association</h1>
          <p className="lead">
            Promoting music education, multicultural artistic exchange, and community engagement
            through music.
          </p>
          <div className="actions">
            <Button asChild>
              <a href="/courses">
                Discover our programs <ArrowRight size={18} />
              </a>
            </Button>
            <Button asChild data-tone="dark" variant="secondary">
              <a href="/events">
                Upcoming concerts <CalendarDays size={18} />
              </a>
            </Button>
          </div>
        </div>
      </section>

      <section className="public-section editorial-split">
        <div className="section-copy">
          <span className="eyebrow">Rooted in South Australia</span>
          <h2>Our Cultural Mandate</h2>
          <p className="lead dark">
            A not-for-profit community arts organisation committed to connecting people across
            cultures, generations, and communities.
          </p>
          <p>
            We believe that music is a universal language that transcends borders. Through SAIMA,
            artists collaborate, bridge traditional heritage and contemporary performance, and
            invite global perspectives to Adelaide.
          </p>
          <a className="text-link" href="/about">
            Learn more about our mission <ArrowRight size={16} />
          </a>
        </div>
        <div className="image-offset">
          <img src={siteImages.mandateLesson} alt="Musicians sharing a teaching moment" />
        </div>
      </section>

      <section className="public-section tone-band">
        <div className="section-heading centered">
          <h2>What We Do</h2>
        </div>
        <div className="pillar-grid">
          {programPillars.map((pillar) => {
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
          <span className="eyebrow">Upcoming</span>
          <h2>Concerts, workshops, welcomes, and member showcases.</h2>
        </div>
        <div className="plain-list">
          {publicEvents.slice(0, 3).map((event) => (
            <article className="list-row" key={event.title}>
              <strong>{event.date}</strong>
              <span>
                {event.title}
                <br />
                <span className="muted">{event.summary}</span>
              </span>
            </article>
          ))}
        </div>
      </section>

      <section className="public-section cta-panel">
        <div>
          <h2>Join our musical community today.</h2>
          <p>
            Whether you are a professional musician, an aspiring student, or a music lover, there is
            a place for you in SAIMA.
          </p>
          <div className="actions centered-actions">
            <Button asChild>
              <a href="/membership">Become a member</a>
            </Button>
            <Button asChild variant="outline">
              <a href="/contact">Volunteer with us</a>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
