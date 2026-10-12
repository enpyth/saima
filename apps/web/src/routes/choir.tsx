import { createFileRoute } from '@tanstack/react-router'
import { ArrowRight, CalendarDays, CheckCircle2, MapPin, Music2, Sparkles } from 'lucide-react'

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
          <div className="actions">
            {content.sectionsNav.map((section) => (
              <Button asChild key={section.id} variant="outline" className="choir-anchor-btn">
                <a href={`#${section.id}`}>{section.label}</a>
              </Button>
            ))}
            <Button asChild>
              <a href="#join">
                {content.hero.action} <ArrowRight size={16} />
              </a>
            </Button>
          </div>
        </div>
      </section>

      <nav className="choir-subnav" aria-label={content.labels.jumpToSection}>
        <div className="choir-subnav-inner">
          <span className="eyebrow">{content.labels.jumpToSection}</span>
          <div className="choir-subnav-links">
            {content.sectionsNav.map((section) => (
              <a className="choir-subnav-pill" href={`#${section.id}`} key={section.id}>
                <Music2 size={15} aria-hidden="true" />
                {section.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <section className="public-section editorial-split" id="parent-child-choir">
        <div className="section-copy">
          <span className="eyebrow">{content.program.eyebrow}</span>
          <h2>{content.program.title}</h2>
          {content.program.paragraphs.slice(0, 3).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <div className="check-list">
            {content.program.items.map((item) => (
              <p key={item}>
                <CheckCircle2 size={18} aria-hidden="true" /> {item}
              </p>
            ))}
          </div>
          <div className="actions">
            <Button asChild variant="outline">
              <a href="/choir-details">
                {content.detailsAction} <ArrowRight size={16} />
              </a>
            </Button>
          </div>
        </div>
        <div className="program-note">
          <Music2 size={44} aria-hidden="true" />
          <h3>{content.participation.title}</h3>
          <p>{content.participation.text}</p>
        </div>
      </section>

      <section className="public-section tone-band" id="childrens-choir">
        <div className="editorial-split">
          <div className="section-copy">
            <span className="eyebrow">{content.childrensChoir.eyebrow}</span>
            <h2>{content.childrensChoir.title}</h2>
            {content.childrensChoir.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <div className="check-list">
              {content.childrensChoir.items.map((item) => (
                <p key={item}>
                  <CheckCircle2 size={18} aria-hidden="true" /> {item}
                </p>
              ))}
            </div>
          </div>
          <div className="program-note">
            <Sparkles size={44} aria-hidden="true" />
            <span className="eyebrow">{content.childrensChoir.highlight.eyebrow}</span>
            <h3>{content.childrensChoir.highlight.title}</h3>
            <p>{content.childrensChoir.highlight.text}</p>
          </div>
        </div>

        <div className="choir-gallery-section">
          <div className="section-heading">
            <span className="eyebrow">{content.childrensChoir.eyebrow}</span>
            <h3>{content.childrensChoir.galleryTitle}</h3>
          </div>
          <div className="choir-photo-grid">
            {content.childrensChoir.gallery.map((photo) => (
              <figure className="choir-photo-card" key={photo.url}>
                <div className="choir-photo-frame">
                  <img src={photo.url} alt={photo.caption} loading="lazy" />
                </div>
                <figcaption>{photo.caption}</figcaption>
              </figure>
            ))}
          </div>
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
