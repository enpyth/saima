import { createFileRoute } from '@tanstack/react-router'
import { ArrowRight, Mic2, Piano, Theater } from 'lucide-react'

import { Button } from '../components/ui/button'
import { siteImages, youthShowcases } from '../lib/content'

export const Route = createFileRoute('/youth')({ component: Youth })

function Youth() {
  const icons = [Mic2, Piano, Theater]

  return (
    <main className="public-page">
      <section className="public-title">
        <span className="eyebrow">Youth & Showcase</span>
        <h1>Student Showcase: Young Voices and Performers</h1>
        <p>
          A public platform for young musicians to learn, rehearse, perform, and feel part of a
          broader cultural community.
        </p>
      </section>

      <section className="public-section editorial-split reverse tone-band">
        <div className="image-offset">
          <img src={siteImages.choirHall} alt="Warm rehearsal hall" />
        </div>
        <div className="section-copy">
          <span className="eyebrow">Generations in harmony</span>
          <h2>Parent-Child Choir Performances</h2>
          <p>
            Family participation gives young musicians a low-pressure entry point into ensemble
            singing, listening, and shared stage confidence.
          </p>
          <Button asChild variant="outline">
            <a href="/choir">
              Learn more about the choir <ArrowRight size={16} />
            </a>
          </Button>
        </div>
      </section>

      <section className="public-section">
        <div className="section-heading centered">
          <span className="eyebrow">Showcase</span>
          <h2>Young Artist Showcase</h2>
        </div>
        <div className="youth-grid">
          {youthShowcases.map((showcase, index) => {
            const Icon = icons[index] ?? Mic2
            return (
              <article className="youth-item" key={showcase.title}>
                <img src={index === 0 ? siteImages.choirHall : siteImages.youthPiano} alt="" />
                <div>
                  <Icon size={24} aria-hidden="true" />
                  <h3>{showcase.title}</h3>
                  <p>{showcase.summary}</p>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <section className="public-section dark-feature">
        <div>
          <span className="eyebrow">Next generation</span>
          <h2>Nurturing the next generation.</h2>
          <p>
            Students build confidence through repeated opportunities to prepare, listen, perform,
            and receive encouragement from the SAIMA network.
          </p>
        </div>
        <Button asChild data-tone="dark" variant="secondary">
          <a href="/events">View upcoming recitals</a>
        </Button>
      </section>
    </main>
  )
}
