import { createFileRoute } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

import { useLanguage } from '../components/language-provider'
import { Button } from '../components/ui/button'
import { eventsContent } from '../content/events'

export const Route = createFileRoute('/events-details')({ component: EventDetailsRedirect })

function EventDetailsRedirect() {
  const { language } = useLanguage()
  const content = eventsContent[language]
  const firstEvent = content.events[0]

  return (
    <main className="public-page">
      <section className="public-title">
        <span className="eyebrow">{content.hero.eyebrow}</span>
        <h1>{content.sections.upcomingTitle}</h1>
        <p>{content.hero.paragraphs[0]}</p>
        {firstEvent ? (
          <div className="actions centered-actions">
            <Button asChild>
              <a href={firstEvent.href}>
                {content.labels.details} <ArrowRight size={16} />
              </a>
            </Button>
          </div>
        ) : null}
      </section>
    </main>
  )
}
