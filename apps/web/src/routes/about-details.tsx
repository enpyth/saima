import { createFileRoute } from '@tanstack/react-router'

import { useLanguage } from '../components/language-provider'
import { aboutContent } from '../content/about'

export const Route = createFileRoute('/about-details')({ component: AboutDetails })

function AboutDetails() {
  const { language } = useLanguage()
  const content = aboutContent[language]

  return (
    <main className="public-page">
      <section className="public-title">
        <span className="eyebrow">{content.hero.eyebrow}</span>
        <h1>{content.hero.title}</h1>
        {content.hero.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>

      {content.sections.map((section) => (
        <section className="public-section" key={section.title}>
          <div className="section-heading">
            <h2>{section.title}</h2>
          </div>
          <div className="section-copy text-column">
            {section.paragraphs?.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {section.items ? (
              <div className="plain-list">
                {section.items.map((item) => (
                  <div className="list-row" key={item}>
                    <strong>{content.labels.aim}</strong>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </section>
      ))}

      <section className="public-section">
        <div className="section-heading">
          <span className="eyebrow">{content.artistProfile.title}</span>
          <h2>{content.artistProfile.title}</h2>
        </div>
        <div className="plain-list">
          {content.artistProfile.fields.map((field) => (
            <div className="list-row" key={field.label}>
              <strong>{field.label}</strong>
              <span>{field.value}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
