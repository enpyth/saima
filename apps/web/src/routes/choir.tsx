import { createFileRoute } from '@tanstack/react-router'
import { ArrowRight, CalendarDays, CheckCircle2, MapPin, Music2 } from 'lucide-react'

import { Button } from '../components/ui/button'
import { siteImages } from '../lib/content'

export const Route = createFileRoute('/choir')({ component: Choir })

function Choir() {
  return (
    <main className="public-page">
      <section className="choir-hero">
        <img src={siteImages.choirHall} alt="" aria-hidden="true" />
        <div>
          <span className="eyebrow">Family program</span>
          <h1>
            Parent-Child
            <br />
            Choir
          </h1>
          <p>
            A warm entry point for families to sing together, learn rehearsal habits, and share
            cultural songs in community.
          </p>
          <Button asChild>
            <a href="#join">
              Register interest <ArrowRight size={16} />
            </a>
          </Button>
        </div>
      </section>

      <section className="public-section editorial-split">
        <div className="section-copy">
          <span className="eyebrow">About the program</span>
          <h2>Weekly sessions shaped around connection.</h2>
          <p>
            Families rehearse accessible repertoire, develop listening skills, and prepare for
            seasonal community performances.
          </p>
          <div className="check-list">
            {['Shared singing for parents and children', 'Gentle rehearsal structure', 'Festival and showcase goals'].map(
              (item) => (
                <p key={item}>
                  <CheckCircle2 size={18} aria-hidden="true" /> {item}
                </p>
              ),
            )}
          </div>
        </div>
        <div className="program-note">
          <Music2 size={44} aria-hidden="true" />
          <h3>Participation</h3>
          <p>No audition barrier. Families can register interest and discuss readiness with SAIMA.</p>
        </div>
      </section>

      <section className="public-section dark-feature">
        <div>
          <span className="eyebrow">First steps</span>
          <h2>Come to a listening session before joining.</h2>
          <p>
            New families can observe a rehearsal, meet the program lead, and understand the rhythm
            of weekly participation.
          </p>
        </div>
      </section>

      <section className="public-section event-preview">
        <div>
          <span className="eyebrow">Looking forward</span>
          <h2>The Mid-Autumn Festival Showcase</h2>
        </div>
        <div className="plain-list">
          <div className="list-row">
            <strong>
              <CalendarDays size={18} aria-hidden="true" /> Timing
            </strong>
            <span>Seasonal showcase date to be confirmed through SAIMA events.</span>
          </div>
          <div className="list-row">
            <strong>
              <MapPin size={18} aria-hidden="true" /> Place
            </strong>
            <span>Adelaide community venue, confirmed with participating families.</span>
          </div>
        </div>
      </section>

      <section className="public-section cta-panel" id="join">
        <div>
          <h2>Your family's musical journey starts here.</h2>
          <p>Send SAIMA a note and we will follow up with the next rehearsal opportunity.</p>
          <Button asChild>
            <a href="/contact">Register interest</a>
          </Button>
        </div>
      </section>
    </main>
  )
}
