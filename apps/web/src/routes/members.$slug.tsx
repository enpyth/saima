import { createFileRoute } from '@tanstack/react-router'
import { ArrowLeft, ExternalLink, Mail } from 'lucide-react'

import { useLanguage } from '../components/language-provider'
import { Button } from '../components/ui/button'
import { memberContent } from '../content/members'

export const Route = createFileRoute('/members/$slug')({ component: MemberProfilePage })

function MemberProfilePage() {
  const { slug } = Route.useParams()
  const { language } = useLanguage()
  const content = memberContent[language]
  const member = content.members.find((profile) => profile.slug === slug)

  if (!member) {
    return (
      <main className="public-page">
        <section className="public-title">
          <span className="eyebrow">{content.labels.eyebrow}</span>
          <h1>{content.labels.notFoundTitle}</h1>
          <p>{content.labels.notFoundSummary}</p>
          <div className="actions centered-actions">
            <Button asChild variant="outline">
              <a href="/about">
                <ArrowLeft size={16} /> {content.labels.backToAbout}
              </a>
            </Button>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="public-page">
      <section className="public-section member-detail-hero">
        <div className="member-detail-photo">
          <img src={member.image} alt={member.name} />
        </div>
        <div className="section-copy">
          <span className="eyebrow">{member.role}</span>
          <h1>{member.name}</h1>
          {member.specialty ? <p className="lead dark">{member.specialty}</p> : null}
          <p>{member.summary}</p>
          <div className="actions">
            <Button asChild variant="outline">
              <a href="/about">
                <ArrowLeft size={16} /> {content.labels.backToAbout}
              </a>
            </Button>
            {member.email ? (
              <Button asChild variant="outline">
                <a href={`mailto:${member.email}`}>
                  <Mail size={16} /> {content.labels.contact}
                </a>
              </Button>
            ) : null}
            {member.website ? (
              <Button asChild variant="outline">
                <a href={member.website} rel="noreferrer" target="_blank">
                  <ExternalLink size={16} /> {content.labels.website}
                </a>
              </Button>
            ) : null}
          </div>
        </div>
      </section>

      <section className="public-section member-bio-section">
        <div className="member-bio">
          {member.bio.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      {member.videos? (
          <section className="public-section member-bio-section">
            <div className="section-heading">
              <h2>{content.labels.videos}</h2>
            </div>
            {member.videos.map((video) => (
              <div className="video-container" key={video.embedId}>
                <iframe src={`https://www.youtube.com/embed/${video.embedId}`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen>
                </iframe>
              </div>
            ))}
            {member.moreVideos ? (
              <div className="actions centered-actions">
                <Button asChild variant="outline">
                  <a href={member.moreVideos} rel="noreferrer" target="_blank">
                    {content.labels.moreVideos}
                  </a>
                </Button>
              </div>
            ) : null}
          </section>
      ) : (
        member.moreVideos ? (
          <div className="actions centered-actions">
            <Button asChild variant="outline">
              <a href={member.moreVideos} rel="noreferrer" target="_blank">
                {content.labels.videos}
              </a>
            </Button>
          </div>
        ) : null
      )}

      
    </main>
  )
}
