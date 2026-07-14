import { createFileRoute } from '@tanstack/react-router'

import { useLanguage } from '../components/language-provider'
import { membershipContent } from '../content/membership'

export const Route = createFileRoute('/membership-details')({ component: MembershipDetails })

function MembershipDetails() {
  const { language } = useLanguage()
  const content = membershipContent[language]

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
          <span className="eyebrow">{content.pathsHeading.eyebrow}</span>
          <h2>{content.pathsHeading.title}</h2>
        </div>
        <div className="plain-list">
          {content.paths.map((path) => (
            <div className="list-row" key={path.title}>
              <strong>{path.title}</strong>
              <span>{path.summary}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="public-section tone-band">
        <div className="section-heading centered">
          <h2>{content.expression.title}</h2>
        </div>
        <div className="section-grid">
          <div className="section-copy">
            <h3>{content.expression.interestsTitle}</h3>
            <ul className="content-list">
              {content.expression.interests.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="section-copy">
            <h3>{content.expression.skillsTitle}</h3>
            <ul className="content-list">
              {content.expression.skills.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <h3>{content.expression.consentTitle}</h3>
            <p>{content.expression.consent}</p>
          </div>
        </div>
      </section>

      <section className="public-section">
        <div className="section-heading">
          <span className="eyebrow">{content.sponsorship.eyebrow}</span>
          <h2>{content.sponsorship.title}</h2>
          {content.sponsorship.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <div className="plain-list">
          {content.sponsorship.items.map((item) => (
            <div className="list-row" key={item}>
              <strong>{content.sponsorship.itemLabel}</strong>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
