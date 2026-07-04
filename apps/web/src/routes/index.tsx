import { createFileRoute } from '@tanstack/react-router'
import { ArrowRight, CalendarDays, Users } from 'lucide-react'

import { Button } from '../components/ui/button'
import { membershipBenefits, publicEvents } from '../lib/content'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <main>
      <section className="hero">
        <div className="hero-content">
          <span className="eyebrow">Adelaide / International Musicians</span>
          <h1>SAIMA</h1>
          <p className="lead">
            A home for international musicians in South Australia to perform, teach, collaborate,
            and build lasting artistic community.
          </p>
          <div className="actions">
            <Button asChild>
              <a href="/membership">
                Become a member <ArrowRight size={18} />
              </a>
            </Button>
            <Button asChild data-tone="dark" variant="secondary">
              <a href="/events">
                View events <CalendarDays size={18} />
              </a>
            </Button>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-grid">
          <div>
            <span className="eyebrow">Introduction</span>
            <h2>Connection through music, place, and practice.</h2>
          </div>
          <div>
            <p>
              SAIMA supports musicians arriving, living, and working in South Australia. The
              association creates pathways for performance, education, cultural exchange, and
              professional connection.
            </p>
            <div className="plain-list">
              {membershipBenefits.slice(0, 3).map((benefit) => (
                <div className="list-row" key={benefit}>
                  <strong>
                    <Users size={18} aria-hidden="true" /> Member support
                  </strong>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="section-grid">
          <div>
            <span className="eyebrow">Upcoming</span>
            <h2>Public events open the door before login.</h2>
          </div>
          <div className="plain-list light">
            {publicEvents.map((event) => (
              <div className="list-row" key={event.title}>
                <strong>{event.date}</strong>
                <span>
                  {event.title}
                  <br />
                  <span className="muted">{event.summary}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
