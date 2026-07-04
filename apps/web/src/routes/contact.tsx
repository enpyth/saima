import { createFileRoute } from '@tanstack/react-router'

import { Button } from '../components/ui/button'

export const Route = createFileRoute('/contact')({ component: Contact })

function Contact() {
  return (
    <main>
      <section className="page-hero">
        <span className="eyebrow">Contact</span>
        <h2>Start a conversation with SAIMA.</h2>
        <p>
          Use this page for membership questions, event partnerships, course enquiries, and
          collaboration proposals.
        </p>
      </section>
      <section className="section">
        <form className="form">
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
            Prepare enquiry
          </Button>
        </form>
      </section>
    </main>
  )
}
