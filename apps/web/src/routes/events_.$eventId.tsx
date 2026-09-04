import { createFileRoute } from '@tanstack/react-router'
import { ArrowLeft, ExternalLink, FileText, MapPin, Music, Sparkles } from 'lucide-react'

import { useLanguage } from '../components/language-provider'
import Masonry from '../components/Masonry'
import { TicketSaleModule } from '../components/ticket-sale-module'
import { Button } from '../components/ui/button'
import { eventsContent, findEvent, getEventStatus } from '../content/events'
import type { EventArticle, Language } from '../content/types'
import { getTicketSaleConfig } from '../lib/ticket-sales-config'

export const Route = createFileRoute('/events_/$eventId')({ component: EventPage })

type EventContent = (typeof eventsContent)[Language]
type EventLabels = EventContent['labels']

function EventPage() {
  const { eventId } = Route.useParams()
  const { language } = useLanguage()
  const content = eventsContent[language]
  const event = findEvent(language, eventId)

  if (!event) {
    return <EventNotFound content={content} />
  }

  const ticketSale = getTicketSaleConfig(event.id)
  const statusLabel = content.labels[getEventStatus(event)]

  return (
    <main className="public-page">
      <EventHeader event={event} labels={content.labels} statusLabel={statusLabel} />
      <EventOverview event={event} labels={content.labels} />

      {ticketSale?.isActive ? <TicketSaleModule eventPublicId={event.id} /> : null}
      {event.performers ? <EventPerformersSection performers={event.performers} /> : null}
      {event.programImage || event.programSchedule ? (
        <EventProgramSection
          programImage={event.programImage}
          programSchedule={event.programSchedule}
          language={language}
        />
      ) : null}
      {event.posterImage ? <EventPosterSection posterImage={event.posterImage} /> : null}
      {event.details ? <EventDetailsSection details={event.details} labels={content.labels} /> : null}
      {event.resources ? <EventResourcesSection labels={content.labels} resources={event.resources} /> : null}
      {event.videos ? <EventVideosSection labels={content.labels} videos={event.videos} /> : null}
      {event.galleryImages ? <EventGallerySection galleryImages={event.galleryImages} labels={content.labels} /> : null}
    </main>
  )
}

function EventNotFound({ content }: { content: EventContent }) {
  return (
    <main className="public-page">
      <section className="public-title">
        <span className="eyebrow">{content.hero.eyebrow}</span>
        <h1>{content.labels.notFoundTitle}</h1>
        <p>{content.labels.notFoundSummary}</p>
        <BackToEventsButton label={content.labels.backToEvents} />
      </section>
    </main>
  )
}

function EventHeader({ event, labels, statusLabel }: { event: EventArticle; labels: EventLabels; statusLabel: string }) {
  return (
    <section className="public-title">
      <span className="eyebrow">{statusLabel}</span>
      <h1>{event.title}</h1>
      {event.subtitle ? <p>{event.subtitle}</p> : null}
      <p className="muted inline-meta">
        <MapPin size={16} aria-hidden="true" /> {event.location}
      </p>
      <BackToEventsButton label={labels.backToEvents} />
    </section>
  )
}

function BackToEventsButton({ label }: { label: string }) {
  return (
    <div className="actions centered-actions">
      <Button asChild variant="outline">
        <a href="/events">
          <ArrowLeft size={16} /> {label}
        </a>
      </Button>
    </div>
  )
}

function EventOverview({ event, labels }: { event: EventArticle; labels: EventLabels }) {
  return (
    <section className="public-section">
      <article className="event-row rich-event-row">
        <time>{event.date}</time>
        <div>
          {event.paragraphs?.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          {event.highlights ? <EventHighlights highlights={event.highlights} label={labels.highlights} /> : null}
        </div>
      </article>
    </section>
  )
}

function EventHighlights({ highlights, label }: { highlights: string[]; label: string }) {
  return (
    <div className="event-highlights">
      <strong>{label}</strong>
      <ul>
        {highlights.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}

function EventDetailsSection({ details, labels }: { details: NonNullable<EventArticle['details']>; labels: EventLabels }) {
  return (
    <section className="public-section">
      <SectionHeading eyebrow={labels.eventDetails} title={labels.eventDetails} />
      <dl className="event-detail-list">
        {details.map((detail) => (
          <div key={detail.label}>
            <dt>{detail.label}</dt>
            <dd>{detail.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

function EventPosterSection({ posterImage }: { posterImage: NonNullable<EventArticle['posterImage']> }) {
  return (
    <section className="public-section">
      <SectionHeading eyebrow={posterImage.label} title={posterImage.label} />
      <div className="event-poster">
        <img src={posterImage.url} alt={posterImage.label} />
      </div>
    </section>
  )
}

function EventPerformersSection({
  performers,
}: {
  performers: NonNullable<EventArticle['performers']>
}) {
  return (
    <section className="public-section">
      <div className="section-heading">
        <span className="eyebrow">{performers.eyebrow}</span>
        <h2>{performers.title}</h2>
        <p className="performer-section-subtitle">{performers.subtitle}</p>
        {performers.note ? <p className="performer-note">{performers.note}</p> : null}
      </div>

      <div className="performer-grid">
        {performers.list.map((performer) => (
          <article className="performer-card" key={performer.name}>
            <div className="performer-header">
              <div className="performer-avatar-placeholder" aria-hidden="true">
                <Sparkles size={18} />
              </div>
              <h3 className="performer-name">{performer.name}</h3>
            </div>

            <div className="performer-achievements">
              <span className="performer-badge-label">Honours & Experience</span>
              <ul>
                {performer.achievements.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="performer-songs">
              <span className="performer-badge-label">On Stage</span>
              <div className="performer-song-tags">
                {performer.songs.map((song) => (
                  <span className="performer-song-tag" key={song}>
                    <Music size={13} aria-hidden="true" />
                    {song}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>

      {performers.quote ? (
        <div className="performer-quote-banner">
          <h4>{performers.quote.heading}</h4>
          <p className="performer-quote-highlight">“{performers.quote.subheading}”</p>
          <p className="performer-quote-footer">{performers.quote.footer}</p>
        </div>
      ) : null}
    </section>
  )
}

function EventProgramSection({
  programImage,
  programSchedule,
  language,
}: {
  programImage?: EventArticle['programImage']
  programSchedule?: EventArticle['programSchedule']
  language: Language
}) {
  const openFullImageLabel = language === 'zh' ? '查看原图（高清大图）' : 'View Full Resolution'
  const sectionTitle = programSchedule?.title ?? programImage?.label ?? 'Concert Programme'
  const eyebrow = programSchedule?.eyebrow ?? programImage?.label ?? 'Programme'

  return (
    <section className="public-section">
      <SectionHeading eyebrow={eyebrow} title={sectionTitle} />
      {programSchedule?.subtitle ? (
        <p className="program-director-subtitle">{programSchedule.subtitle}</p>
      ) : null}

      <div className="program-showcase-layout">
        {programImage ? (
          <div className="program-image-column">
            <div className="program-image-frame">
              <a
                href={programImage.url}
                target="_blank"
                rel="noopener noreferrer"
                title={openFullImageLabel}
                className="program-image-link"
              >
                <img src={programImage.url} alt={programImage.label} className="program-flyer-img" />
                <span className="program-image-zoom-hint">
                  <ExternalLink size={14} aria-hidden="true" /> {openFullImageLabel}
                </span>
              </a>
            </div>
            <div className="program-image-actions">
              <Button asChild variant="outline" size="sm">
                <a href={programImage.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink size={14} /> {openFullImageLabel}
                </a>
              </Button>
            </div>
          </div>
        ) : null}

        {programSchedule ? (
          <div className="program-schedule-column">
            {programSchedule.sections.map((section) => (
              <div className="program-schedule-part" key={section.part}>
                <div className="program-part-header">
                  <span className="program-part-tag">{section.part}</span>
                  {section.theme ? <h3 className="program-part-theme">{section.theme}</h3> : null}
                </div>

                <div className="program-items-list">
                  {section.items.map((item, index) => (
                    <div className="program-item-row" key={`${item.work}-${item.song}-${index}`}>
                      <div className="program-item-number">
                        {item.number ? String(item.number).padStart(2, '0') : '—'}
                      </div>
                      <div className="program-item-content">
                        {item.notes ? <span className="program-item-note">{item.notes}</span> : null}
                        <div className="program-item-main">
                          <strong className="program-item-work">{item.work}</strong>
                          <span className="program-item-song">“{item.song}”</span>
                        </div>
                        <div className="program-item-performer">
                          <span className="program-performer-name">{item.performer}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}

function EventResourcesSection({ labels, resources }: { labels: EventLabels; resources: NonNullable<EventArticle['resources']> }) {
  return (
    <section className="public-section">
      <SectionHeading eyebrow={labels.resources} title={labels.resources} />
      <div className="event-resource-grid">
        {resources.map((resource) => (
          <article className="event-resource" key={resource.url}>
            <div className="event-resource-file">
              <FileText size={44} aria-hidden="true" />
            </div>
            <div>
              <h3>{resource.label}</h3>
              <Button asChild variant="outline">
                <a href={resource.url} rel="noreferrer" target="_blank">
                  {labels.openResource} <ExternalLink size={16} />
                </a>
              </Button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function EventVideosSection({ labels, videos }: { labels: EventLabels; videos: NonNullable<EventArticle['videos']> }) {
  return (
    <section className="public-section">
      <div className="section-heading">
        <h2>{labels.videos}</h2>
      </div>
      {videos.map((video) => (
        <div className="video-container" key={video.embedId}>
          <iframe
            src={`https://www.youtube.com/embed/${video.embedId}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      ))}
    </section>
  )
}

function EventGallerySection({
  galleryImages,
  labels,
}: {
  galleryImages: NonNullable<EventArticle['galleryImages']>
  labels: EventLabels
}) {
  return (
    <section className="public-section">
      <SectionHeading eyebrow={labels.gallery} title={labels.gallery} />
      <div className="event-masonry">
        <Masonry
          items={galleryImages}
          ease="power3.out"
          duration={0.6}
          stagger={0.05}
          animateFrom="bottom"
          scaleOnHover
          hoverScale={0.95}
          blurToFocus
          colorShiftOnHover={false}
        />
      </div>
    </section>
  )
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="section-heading">
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
    </div>
  )
}
