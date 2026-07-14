import { createFileRoute } from '@tanstack/react-router'

import { useLanguage } from '../components/language-provider'
import { youthContent } from '../content/youth'

export const Route = createFileRoute('/youth-details')({ component: YouthDetails })

function YouthDetails() {
  const { language } = useLanguage()
  const content = youthContent[language]

  return (
    <main className="public-page">
      <section className="public-title">
        <span className="eyebrow">{content.hero.eyebrow}</span>
        <h1>{content.hero.title}</h1>
        {content.hero.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>
      <section className="public-section">
        <div className="plain-list">
          {content.areas.map((area) => (
            <div className="list-row" key={area.title}>
              <strong>{area.title}</strong>
              <span>{area.summary}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
