import { createFileRoute } from '@tanstack/react-router'
import { ArrowRight, CalendarDays, CheckCircle2, MapPin, Music2 } from 'lucide-react'

import { useLanguage } from '../components/language-provider'
import { Button } from '../components/ui/button'
import { choirContent } from '../content/choir'
import { siteImages } from '../content/shared'

export const Route = createFileRoute('/choir')({ component: Choir })

function Choir() {
  const { language } = useLanguage()
  const content = choirContent[language]

  return (
    <main className="public-page">
      <section className="choir-hero">
        <img src={siteImages.choirHall} alt="" aria-hidden="true" />
        <div>
          <span className="eyebrow">{content.hero.eyebrow}</span>
          <h1>{content.hero.title}</h1>
          <p>{content.hero.paragraphs[0]}</p>
          <Button asChild>
            <a href="#join">
              {content.hero.action} <ArrowRight size={16} />
            </a>
          </Button>
        </div>
      </section>

      <section className="public-section editorial-split">
        <div className="section-copy">
          <span className="eyebrow">{content.labels.aboutProgram}</span>
          <h2>{content.program.title}</h2>
          <p>{content.program.paragraphs[0]}</p>
          <div className="check-list">
            {content.program.items.map((item) => (
              <p key={item}>
                <CheckCircle2 size={18} aria-hidden="true" /> {item}
              </p>
            ))}
          </div>
          <Button asChild variant="outline">
            <a href="/choir-details">
              {content.detailsAction} <ArrowRight size={16} />
            </a>
          </Button>
        </div>
        <div className="program-note">
          <Music2 size={44} aria-hidden="true" />
          <h3>{content.participation.title}</h3>
          <p>{content.participation.text}</p>
        </div>
      </section>

      <section className="public-section dark-feature">
        <div>
          <span className="eyebrow">{content.upcoming.eyebrow}</span>
          <h2>{content.upcoming.title}</h2>
          <p>{content.program.paragraphs[4]}</p>
        </div>
      </section>

      <section className="public-section event-preview">
        <div>
          <span className="eyebrow">{content.upcoming.eyebrow}</span>
          <h2>{content.upcoming.title}</h2>
        </div>
        <div className="plain-list">
          {content.upcoming.rows.map((row, index) => (
            <div className="list-row" key={row.label}>
              <strong>
                {index === 0 ? <CalendarDays size={18} aria-hidden="true" /> : <MapPin size={18} aria-hidden="true" />}
                {row.label}
              </strong>
              <span>{row.value}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="public-section cta-panel" id="join">
        <div>
          <h2>{content.cta.title}</h2>
          <p>{content.cta.text}</p>
          <Button asChild>
            <a href="/contact">{content.cta.action}</a>
          </Button>
        </div>
      </section>
    </main>
  )
}
