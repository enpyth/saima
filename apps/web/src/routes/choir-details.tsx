import { createFileRoute } from '@tanstack/react-router'

import { useLanguage } from '../components/language-provider'
import { choirContent } from '../content/choir'

export const Route = createFileRoute('/choir-details')({ component: ChoirDetails })

function ChoirDetails() {
  const { language } = useLanguage()
  const content = choirContent[language]

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
        <div className="section-heading">
          <span className="eyebrow">{content.labels.aboutProgram}</span>
          <h2>{content.program.title}</h2>
        </div>
        <div className="section-copy text-column">
          {content.program.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <div className="plain-list">
            {content.program.items.map((item) => (
              <div className="list-row" key={item}>
                <strong>{content.participation.title}</strong>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
