import { createFileRoute } from '@tanstack/react-router'

import { useLanguage } from '../components/language-provider'
import { contactContent } from '../content/contact'

export const Route = createFileRoute('/partnership-details')({ component: ContactPartnership })

function ContactPartnership() {
  const { language } = useLanguage()
  const content = contactContent[language]

  return (
    <main className="public-page">
      <section className="public-title">
        <span className="eyebrow">{content.labels.partnership}</span>
        <h1>{content.partner.title}</h1>
        {content.partner.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>
      <section className="public-section">
        <div className="plain-list">
          {content.contact.methods.map((method) => (
            <div className="list-row" key={method.label}>
              <strong>{method.label}</strong>
              <span>{method.value}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
