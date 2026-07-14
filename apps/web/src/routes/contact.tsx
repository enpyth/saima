import { createFileRoute } from '@tanstack/react-router'
import { ArrowRight, Mail, MapPin, Phone, Send } from 'lucide-react'

import { useLanguage } from '../components/language-provider'
import { Button } from '../components/ui/button'
import { contactContent } from '../content/contact'
import { siteImages } from '../content/shared'

export const Route = createFileRoute('/contact')({ component: Contact })

function Contact() {
  const { language } = useLanguage()
  const content = contactContent[language]

  return (
    <main className="public-page">
      <section className="page-hero image-hero compact">
        <img src={siteImages.choirHall} alt="" aria-hidden="true" />
        <div className="hero-scrim pale" />
        <div>
          <span className="eyebrow">{content.hero.eyebrow}</span>
          <h1>{content.hero.title}</h1>
          <p>{content.hero.paragraphs[0]}</p>
          <div className="actions">
            <Button asChild variant="outline">
              <a href="/partnership-details">
                {content.detailsAction} <ArrowRight size={16} />
              </a>
            </Button>
          </div>
        </div>
      </section>
      <section className="public-section contact-layout">
        <form className="form">
          <span className="eyebrow">{content.form.eyebrow}</span>
          <div className="field">
            <label htmlFor="name">{content.form.name}</label>
            <input id="name" name="name" placeholder={content.form.namePlaceholder} />
          </div>
          <div className="field">
            <label htmlFor="email">{content.form.email}</label>
            <input id="email" name="email" type="email" placeholder={content.form.emailPlaceholder} />
          </div>
          <div className="field">
            <label htmlFor="message">{content.form.message}</label>
            <textarea id="message" name="message" placeholder={content.form.messagePlaceholder} />
          </div>
          <Button type="button">
            {content.form.action} <Send size={16} aria-hidden="true" />
          </Button>
        </form>
        <aside className="contact-panel">
          <span className="eyebrow">{content.contact.eyebrow}</span>
          <h2>{content.contact.title}</h2>
          <p>{content.contact.paragraphs[0]}</p>
          <div className="contact-methods">
            {content.contact.methods.slice(0, 3).map((method, index) => {
              const Icon = index === 0 ? Mail : index === 1 ? Phone : MapPin
              return (
                <p key={method.label}>
                  <Icon size={18} aria-hidden="true" /> {method.label}: {method.value}
                </p>
              )
            })}
          </div>
          <p>{content.contact.response}</p>
        </aside>
      </section>
    </main>
  )
}
