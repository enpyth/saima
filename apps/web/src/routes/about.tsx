import { createFileRoute } from '@tanstack/react-router'
import { ArrowRight, Award, HeartHandshake, Landmark, Users } from 'lucide-react'

import { Button } from '../components/ui/button'
import { galleryMoments, missionValues, siteImages } from '../lib/content'

export const Route = createFileRoute('/about')({ component: About })

function About() {
  const icons = [Users, Award, Landmark]

  return (
    <main className="public-page">
      <section className="public-title">
        <span className="eyebrow">About SAIMA</span>
        <h1>Our Legacy & Purpose</h1>
        <p>
          SAIMA exists to connect international musicians, local communities, and cultural
          traditions through thoughtful public programs in South Australia.
        </p>
      </section>

      <section className="public-section editorial-split">
        <div className="portrait-stack">
          <img src={siteImages.galleryPerformance} alt="Musician performing on stage" />
          <p>Mastering the intersection of culture and sound.</p>
        </div>
        <div className="section-copy">
          <span className="eyebrow">Artistic vision</span>
          <h2>The Artistic Vision</h2>
          <p className="lead dark">
            A professional cultural association with an accessible community heart.
          </p>
          <p>
            SAIMA creates space for artists to present heritage, experiment with contemporary
            practice, and welcome audiences into multicultural musical life. The organisation
            supports musicians as performers, teachers, collaborators, and community leaders.
          </p>
        </div>
      </section>

      <section className="public-section tone-band values-band">
        <div className="section-heading centered">
          <span className="eyebrow">Mission</span>
          <h2>A mission rooted in community.</h2>
        </div>
        <div className="pillar-grid">
          {missionValues.map((value, index) => {
            const Icon = icons[index] ?? HeartHandshake
            return (
              <article className="pillar-card" key={value.title}>
                <span className="icon-disc">
                  <Icon size={24} aria-hidden="true" />
                </span>
                <h3>{value.title}</h3>
                <p>{value.summary}</p>
              </article>
            )
          })}
        </div>
      </section>

      <section className="public-section gallery-strip">
        <div className="section-heading">
          <span className="eyebrow">Community</span>
          <h2>The hearts behind the harmony.</h2>
        </div>
        <div className="gallery-grid">
          {galleryMoments.map((moment) => (
            <article className="gallery-tile" key={moment.title}>
              <img src={moment.image} alt="" />
              <span>{moment.category}</span>
              <h3>{moment.title}</h3>
            </article>
          ))}
        </div>
      </section>

      <section className="public-section cta-row">
        <h2>Join the movement.</h2>
        <div className="actions">
          <Button asChild>
            <a href="/membership">
              Become a member <ArrowRight size={16} />
            </a>
          </Button>
          <Button asChild variant="outline">
            <a href="/contact">Support our mission</a>
          </Button>
        </div>
      </section>
    </main>
  )
}
