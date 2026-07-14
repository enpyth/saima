import { createFileRoute } from '@tanstack/react-router'
import { ArrowRight, Award, HeartHandshake, Landmark, Users } from 'lucide-react'

import { useLanguage } from '../components/language-provider'
import { Button } from '../components/ui/button'
import { aboutContent } from '../content/about'
import { galleryContent } from '../content/gallery'
import { siteImages } from '../content/shared'

export const Route = createFileRoute('/about')({ component: About })

function About() {
  const { language } = useLanguage()
  const content = aboutContent[language]
  const gallery = galleryContent[language].groups.slice(0, 4)
  const icons = [Users, Award, Landmark]
  const mission = content.missionPreview

  return (
    <main className="public-page">
      <section className="public-title">
        <span className="eyebrow">{content.hero.eyebrow}</span>
        <h1>{content.hero.title}</h1>
        <p>{content.hero.paragraphs[0]}</p>
        <div className="actions centered-actions">
          <Button asChild variant="outline">
            <a href="/about-details">
              {content.detailAction} <ArrowRight size={16} />
            </a>
          </Button>
        </div>
      </section>

      <section className="public-section editorial-split">
        <div className="portrait-stack">
          <img src={siteImages.galleryPerformance} alt="" />
          <p>{content.sections[0]?.title}</p>
        </div>
        <div className="section-copy">
          <span className="eyebrow">{content.labels.artisticVision}</span>
          <h2>{content.sections[0]?.title}</h2>
          <p className="lead dark">{content.sections[0]?.paragraphs?.[0]}</p>
          <p>{content.hero.paragraphs[5]}</p>
        </div>
      </section>

      <section className="public-section tone-band values-band">
        <div className="section-heading centered">
          <span className="eyebrow">{mission.eyebrow}</span>
          <h2>{mission.title}</h2>
        </div>
        <div className="pillar-grid">
          {mission.values.map((item, index) => {
            const Icon = icons[index] ?? HeartHandshake
            return (
              <article className="pillar-card" key={item.title}>
                <span className="icon-disc">
                  <Icon size={24} aria-hidden="true" />
                </span>
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
              </article>
            )
          })}
        </div>
      </section>

      <section className="public-section gallery-strip">
        <div className="section-heading">
          <span className="eyebrow">{galleryContent[language].hero.eyebrow}</span>
          <h2>{content.sections[2]?.title}</h2>
        </div>
        <div className="gallery-grid">
          {gallery.map((moment) => (
            <article className="gallery-tile" key={moment.title}>
              <img src={moment.image} alt="" />
              <span>{moment.title}</span>
              <h3>{moment.summary}</h3>
            </article>
          ))}
        </div>
      </section>

      <section className="public-section cta-row">
        <h2>{content.cta.title}</h2>
        <div className="actions">
          <Button asChild>
            <a href="/membership">
              {content.cta.primaryAction} <ArrowRight size={16} />
            </a>
          </Button>
          <Button asChild variant="outline">
            <a href="/contact">{content.cta.secondaryAction}</a>
          </Button>
        </div>
      </section>
    </main>
  )
}
