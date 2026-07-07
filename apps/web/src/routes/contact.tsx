import { createFileRoute } from '@tanstack/react-router'
import { Mail, MapPin, Phone, Send } from 'lucide-react'

import { Button } from '../components/ui/button'
import { siteImages } from '../lib/content'

export const Route = createFileRoute('/contact')({ component: Contact })

function Contact() {
  return (
    <main className="public-page">
      <section className="page-hero image-hero compact">
        <img src={siteImages.choirHall} alt="" aria-hidden="true" />
        <div className="hero-scrim pale" />
        <div>
        <span className="eyebrow">Contact</span>
        <h1>Start a conversation with SAIMA.</h1>
        <p>
          Use this page for event partnerships, course enquiries, volunteering, sponsorship, and
          collaboration proposals.
        </p>
        </div>
      </section>
      <section className="public-section contact-layout">
        <form className="form">
          <span className="eyebrow">Send us a message</span>
          <div className="field">
            <label htmlFor="name">Name</label>
            <input id="name" name="name" placeholder="Your name" />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" placeholder="you@example.com" />
          </div>
          <div className="field">
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" placeholder="How can SAIMA help?" />
          </div>
          <Button type="button">
            Prepare enquiry <Send size={16} aria-hidden="true" />
          </Button>
        </form>
        <aside className="contact-panel">
          <span className="eyebrow">Contact information</span>
          <h2>Start with a clear proposal, question, or invitation.</h2>
          <p>
            SAIMA welcomes conversations with artists, families, venues, schools, and community
            partners across South Australia.
          </p>
          <div className="contact-methods">
            <p>
              <MapPin size={18} aria-hidden="true" /> Adelaide, South Australia
            </p>
            <p>
              <Mail size={18} aria-hidden="true" /> info@saima.com.au
            </p>
            <p>
              <Phone size={18} aria-hidden="true" /> Contact by enquiry form
            </p>
          </div>
        </aside>
      </section>
    </main>
  )
}
