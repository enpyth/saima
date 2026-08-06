import { createFileRoute } from '@tanstack/react-router'
import type { TicketType } from '@saima/shared'
import { ArrowLeft, ExternalLink, FileText, MapPin, Ticket } from 'lucide-react'
import { useEffect, useMemo, useState, type FormEvent } from 'react'

import { useAuth } from '../components/auth-provider'
import { useLanguage } from '../components/language-provider'
import Masonry from '../components/Masonry'
import { Button } from '../components/ui/button'
import { eventsContent, findEvent, getEventStatus } from '../content/events'
import { api } from '../lib/orpc'

export const Route = createFileRoute('/events_/$eventId')({ component: EventPage })

function EventPage() {
  const { eventId } = Route.useParams()
  const { language } = useLanguage()
  const content = eventsContent[language]
  const event = findEvent(language, eventId)

  if (!event) {
    return (
      <main className="public-page">
        <section className="public-title">
          <span className="eyebrow">{content.hero.eyebrow}</span>
          <h1>{content.labels.notFoundTitle}</h1>
          <p>{content.labels.notFoundSummary}</p>
          <div className="actions centered-actions">
            <Button asChild variant="outline">
              <a href="/events">
                <ArrowLeft size={16} /> {content.labels.backToEvents}
              </a>
            </Button>
          </div>
        </section>
      </main>
    )
  }

  const statusLabel = content.labels[getEventStatus(event)]

  return (
    <main className="public-page">
      <section className="public-title">
        <span className="eyebrow">{statusLabel}</span>
        <h1>{event.title}</h1>
        {event.subtitle ? <p>{event.subtitle}</p> : null}
        <p className="muted inline-meta">
          <MapPin size={16} aria-hidden="true" /> {event.location}
        </p>
        <div className="actions centered-actions">
          <Button asChild variant="outline">
            <a href="/events">
              <ArrowLeft size={16} /> {content.labels.backToEvents}
            </a>
          </Button>
        </div>
      </section>

      <section className="public-section">
        <article className="event-row rich-event-row">
          <time>{event.date}</time>
          <div>
            {event.paragraphs?.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {event.highlights ? (
              <div className="event-highlights">
                <strong>{content.labels.highlights}</strong>
                <ul>
                  {event.highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </article>
      </section>

      {event.id === '20261016' ? <TicketSaleModule eventPublicId={event.id} /> : null}

      {event.details ? (
        <section className="public-section">
          <div className="section-heading">
            <span className="eyebrow">{content.labels.eventDetails}</span>
            <h2>{content.labels.eventDetails}</h2>
          </div>
          <dl className="event-detail-list">
            {event.details.map((detail) => (
              <div key={detail.label}>
                <dt>{detail.label}</dt>
                <dd>{detail.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      {event.posterImage ? (
        <section className="public-section">
          <div className="section-heading">
            <span className="eyebrow">{event.posterImage.label}</span>
            <h2>{event.posterImage.label}</h2>
          </div>
          <div className="event-poster">
            <img src={event.posterImage.url} alt={event.posterImage.label} />
          </div>
        </section>
      ) : null}

      {event.resources ? (
        <section className="public-section">
          <div className="section-heading">
            <span className="eyebrow">{content.labels.resources}</span>
            <h2>{content.labels.resources}</h2>
          </div>
          <div className="event-resource-grid">
            {event.resources.map((resource) => (
              <article className="event-resource" key={resource.url}>
                <div className="event-resource-file">
                  <FileText size={44} aria-hidden="true" />
                </div>
                <div>
                  <h3>{resource.label}</h3>
                  <Button asChild variant="outline">
                    <a href={resource.url} rel="noreferrer" target="_blank">
                      {content.labels.openResource} <ExternalLink size={16} />
                    </a>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {event.galleryImages ? (
        <section className="public-section">
          <div className="section-heading">
            <span className="eyebrow">{content.labels.gallery}</span>
            <h2>{content.labels.gallery}</h2>
          </div>
          <div className="event-masonry">
            <Masonry
              items={event.galleryImages}
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
      ) : null}
    </main>
  )
}

function TicketSaleModule({ eventPublicId }: { eventPublicId: string }) {
  const { language } = useLanguage()
  const { profile, user } = useAuth()
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([])
  const [selectedTicketTypeId, setSelectedTicketTypeId] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [purchaserName, setPurchaserName] = useState('')
  const [purchaserEmail, setPurchaserEmail] = useState('')
  const [purchaserPhone, setPurchaserPhone] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const labels = language === 'zh'
    ? {
        eyebrow: '售票',
        title: '购买音乐会门票',
        summary: '选择票种并留下联系方式。提交后，系统会为你确认门票数量。',
        ticketType: '票种',
        quantity: '数量',
        name: '姓名',
        email: '邮箱',
        phone: '电话',
        submit: '确认购票',
        loading: '正在载入',
        checkout: '前往 Stripe 安全付款',
        signIn: '请先登录后购票。',
        soldOut: '门票已售罄',
        remaining: '剩余',
        total: '合计',
        success: '正在跳转到 Stripe 安全付款页面。',
        unavailable: '当前没有可售票种。',
      }
    : {
        eyebrow: 'Tickets',
        title: 'Buy concert tickets',
        summary: 'Choose a ticket type and leave your contact details. Your ticket quantity is confirmed on submission.',
        ticketType: 'Ticket type',
        quantity: 'Quantity',
        name: 'Name',
        email: 'Email',
        phone: 'Phone',
        submit: 'Confirm tickets',
        loading: 'Loading',
        checkout: 'Continue to secure Stripe payment',
        signIn: 'Sign in before buying tickets.',
        soldOut: 'Sold out',
        remaining: 'remaining',
        total: 'Total',
        success: 'Redirecting to Stripe secure payment.',
        unavailable: 'No ticket types are currently available.',
      }

  useEffect(() => {
    if (profile?.fullName && !purchaserName) {
      setPurchaserName(profile.fullName)
    }
    if (user?.email && !purchaserEmail) {
      setPurchaserEmail(user.email)
    }
  }, [profile?.fullName, purchaserEmail, purchaserName, user?.email])

  useEffect(() => {
    let mounted = true

    async function loadSale() {
      setLoading(true)
      try {
        const sale = await api.tickets.saleForEvent({ eventPublicId })
        if (!mounted) {
          return
        }
        setTicketTypes(sale.ticketTypes)
        setSelectedTicketTypeId(sale.ticketTypes[0]?.id ?? '')
      } catch (error) {
        if (mounted) {
          setMessage(error instanceof Error ? error.message : labels.unavailable)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    void loadSale()

    return () => {
      mounted = false
    }
  }, [eventPublicId, labels.unavailable])

  const selectedTicketType = useMemo(
    () => ticketTypes.find((ticketType) => ticketType.id === selectedTicketTypeId),
    [selectedTicketTypeId, ticketTypes],
  )
  const maxQuantity = Math.min(selectedTicketType?.remaining ?? 1, 10)
  const total = (selectedTicketType?.priceCents ?? 0) * quantity

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!selectedTicketType || selectedTicketType.remaining <= 0) {
      setMessage(labels.soldOut)
      return
    }
    if (!user) {
      setMessage(labels.signIn)
      window.location.href = '/login'
      return
    }

    setSubmitting(true)
    try {
      const session = await api.tickets.createCheckoutSession({
        ticketTypeId: selectedTicketType.id,
        purchaserName,
        purchaserEmail,
        purchaserPhone: purchaserPhone || undefined,
        quantity,
      })
      setMessage(labels.success)
      window.location.href = session.checkoutUrl
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not start Stripe Checkout.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="public-section ticket-sale-section" id="tickets">
      <div className="section-heading">
        <span className="eyebrow">{labels.eyebrow}</span>
        <h2>{labels.title}</h2>
        <p>{labels.summary}</p>
      </div>
      <div className="ticket-sale-layout">
        <div className="ticket-sale-summary">
          <Ticket size={42} aria-hidden="true" />
          {loading ? <p>{labels.loading}</p> : null}
          {!loading && ticketTypes.length === 0 ? <p>{labels.unavailable}</p> : null}
          {ticketTypes.map((ticketType) => (
            <div className="ticket-type-row" key={ticketType.id}>
              <div>
                <strong>{ticketType.name}</strong>
                {ticketType.description ? <span>{ticketType.description}</span> : null}
              </div>
              <div>
                <strong>{formatMoney(ticketType.priceCents, ticketType.currency)}</strong>
                <span>{ticketType.remaining > 0 ? `${ticketType.remaining} ${labels.remaining}` : labels.soldOut}</span>
              </div>
            </div>
          ))}
        </div>

        <form className="form ticket-sale-form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="ticketType">{labels.ticketType}</label>
            <select
              id="ticketType"
              value={selectedTicketTypeId}
              onChange={(event) => {
                setSelectedTicketTypeId(event.currentTarget.value)
                setQuantity(1)
              }}
              required
            >
              {ticketTypes.map((ticketType) => (
                <option key={ticketType.id} value={ticketType.id} disabled={ticketType.remaining <= 0}>
                  {ticketType.name}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="ticketQuantity">{labels.quantity}</label>
            <input
              id="ticketQuantity"
              type="number"
              min="1"
              max={Math.max(maxQuantity, 1)}
              value={quantity}
              onChange={(event) => setQuantity(Number(event.currentTarget.value))}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="purchaserName">{labels.name}</label>
            <input id="purchaserName" value={purchaserName} onChange={(event) => setPurchaserName(event.currentTarget.value)} required />
          </div>
          <div className="field">
            <label htmlFor="purchaserEmail">{labels.email}</label>
            <input id="purchaserEmail" type="email" value={purchaserEmail} onChange={(event) => setPurchaserEmail(event.currentTarget.value)} required />
          </div>
          <div className="field">
            <label htmlFor="purchaserPhone">{labels.phone}</label>
            <input id="purchaserPhone" value={purchaserPhone} onChange={(event) => setPurchaserPhone(event.currentTarget.value)} />
          </div>
          <div className="ticket-total-row">
            <span>{labels.total}</span>
            <strong>{formatMoney(total, selectedTicketType?.currency ?? 'AUD')}</strong>
          </div>
          {message ? <p className="muted">{message}</p> : null}
          <Button type="submit" disabled={submitting || !selectedTicketType || selectedTicketType.remaining <= 0}>
            {submitting ? labels.loading : labels.checkout}
          </Button>
        </form>
      </div>
    </section>
  )
}

function formatMoney(cents: number, currency: string) {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency,
  }).format(cents / 100)
}
