import { createFileRoute } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

import { useLanguage } from '../components/language-provider'
import { Button } from '../components/ui/button'
import { aboutContent } from '../content/about'
import { memberContent } from '../content/members'

export const Route = createFileRoute('/about')({ component: About })

function About() {
  const { language } = useLanguage()
  const content = aboutContent[language]
  const membersContent = memberContent[language]
  const members = [...membersContent.members].sort((left, right) => left.order - right.order)
  const founder = members[0]

  return (
    <main className="public-page">
      <section className="public-title about-page-title">
        <span className="eyebrow">{content.hero.eyebrow}</span>
        <h1>{content.hero.title}</h1>
        <p className="about-page-intro">{content.hero.paragraphs[0]}</p>
        <div className="actions centered-actions">
          <Button asChild variant="outline">
            <a href="/about-details">
              {content.detailAction} <ArrowRight size={16} />
            </a>
          </Button>
        </div>
      </section>

      <section className="public-section editorial-split">
        <div className="portrait-stack">
          <img src={founder?.image} alt={founder?.name ?? ''} />
          <p>{founder?.role}</p>
        </div>
        <div className="section-copy">
          <span className="eyebrow">{content.labels.artisticVision}</span>
          <h2>{founder?.name}</h2>
          <p className="lead dark">{founder?.specialty}</p>
          <p>{founder?.summary}</p>
          <Button asChild variant="outline">
            <a href={founder?.href}>
              {membersContent.labels.viewProfile} <ArrowRight size={16} />
            </a>
          </Button>
        </div>
      </section>

      {/*<section className="public-section tone-band values-band">
        <div className="section-heading centered">
          <span className="eyebrow">{mission.eyebrow}</span>
          <h2>{mission.title}</h2>
        </div>
        <div className="pillar-grid">
          {mission.values.map((item, index) => {
            const Icon = icons[index] ?? HeartHandshake
            return (
              <article className="pillar-card" key={item.title}>
                <span className="icon-disc">
                  <Icon size={24} aria-hidden="true" />
                </span>
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
              </article>
            )
          })}
        </div>
      </section>*/}

      <section className="public-section gallery-strip">
        <div className="section-heading">
          <span className="eyebrow">{membersContent.labels.eyebrow}</span>
          <h2>{content.sections[2]?.title}</h2>
          <p>{content.sections[2]?.paragraphs?.[0]}</p>
        </div>
        <div className="member-grid">
          {members.map((member) => (
            <article className="member-card" key={member.slug}>
              <a href={member.href}>
                <img src={member.image} alt={member.name} />
                <span>{member.role}</span>
                <h3>{member.name}</h3>
                <p>{member.summary}</p>
                <strong>
                  {membersContent.labels.viewProfile} <ArrowRight size={16} />
                </strong>
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="public-section cta-row">
        <h2>{content.cta.title}</h2>
        <div className="actions">
          <Button asChild>
            <a href="/membership">
              {content.cta.primaryAction} <ArrowRight size={16} />
            </a>
          </Button>
          <Button asChild variant="outline">
            <a href="/contact">{content.cta.secondaryAction}</a>
          </Button>
        </div>
      </section>
    </main>
  )
}
