import { createFileRoute } from '@tanstack/react-router'
import { ArrowRight, Mic2, Piano, Theater } from 'lucide-react'

import { useLanguage } from '../components/language-provider'
import { Button } from '../components/ui/button'
import { choirContent } from '../content/choir'
import { siteImages } from '../content/shared'
import { youthContent } from '../content/youth'

export const Route = createFileRoute('/youth')({ component: Youth })

function Youth() {
  const { language } = useLanguage()
  const content = youthContent[language]
  const choir = choirContent[language]
  const icons = [Mic2, Piano, Theater]
  const areaImages = [siteImages.choirHall, siteImages.instrumentalPerformance, siteImages.youthPiano]

  return (
    <main className="public-page">
      <section className="public-title">
        <span className="eyebrow">{content.hero.eyebrow}</span>
        <h1>{content.hero.title}</h1>
        <p>{content.hero.paragraphs[0]}</p>
        <div className="actions centered-actions">
          <Button asChild variant="outline">
            <a href="/youth-details">
              {content.detailsAction} <ArrowRight size={16} />
            </a>
          </Button>
        </div>
      </section>

      <section className="public-section">
        <div className="section-heading centered">
          <span className="eyebrow">{content.hero.eyebrow}</span>
          <h2>{content.hero.title}</h2>
        </div>
        <div className="youth-grid">
          {content.areas.map((area, index) => {
            const Icon = icons[index] ?? Mic2
            return (
              <article className="youth-item" key={area.title}>
                <img src={areaImages[index] ?? siteImages.youthPiano} alt="" />
                <div>
                  <Icon size={24} aria-hidden="true" />
                  <h3>{area.title}</h3>
                  <p>{area.summary}</p>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <section className="public-section dark-feature">
        <div>
          <span className="eyebrow">{content.cta.eyebrow}</span>
          <h2>{content.cta.title}</h2>
          <p>{content.cta.text}</p>
        </div>
        <Button asChild data-tone="dark" variant="secondary">
          <a href="/events">{content.cta.action}</a>
        </Button>
      </section>
    </main>
  )
}
