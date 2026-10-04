import type { ClaimFreeTicketsResult, TicketInventory } from '@saima/shared'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  Gift,
  Lock,
  Mail,
  MapPin,
  Printer,
  Sparkles,
} from 'lucide-react'
import { useEffect, useMemo, useState, type FormEvent } from 'react'

import { useLanguage } from '../components/language-provider'
import { Button } from '../components/ui/button'
import { findEvent } from '../content/events'
import { api } from '../lib/orpc'
import {
  getTicketSaleConfig,
  getTicketSaleOptions,
  verifyFreeTicketsSecret,
} from '../lib/ticket-sales-config'

export const Route = createFileRoute('/events_/$eventId_/free-tickets')({
  validateSearch: (search: Record<string, unknown>): { key?: string } => {
    return {
      key: typeof search.key === 'string' ? search.key : undefined,
    }
  },
  head: () => ({
    meta: [
      {
        name: 'robots',
        content: 'noindex, nofollow',
      },
      {
        title: 'Complimentary Ticket Invitation | SAIMA',
      },
      {
        name: 'description',
        content: 'Private complimentary ticket registration for SAIMA events.',
      },
    ],
  }),
  component: EventFreeTicketsPage,
})

function EventFreeTicketsPage() {
  const { eventId } = Route.useParams()
  const search = Route.useSearch()
  const { language } = useLanguage()
  const event = findEvent(language, eventId)
  const ticketSaleConfig = getTicketSaleConfig(eventId)
  const ticketOptions = useMemo(() => getTicketSaleOptions(eventId), [eventId])

  const isAuthorized = useMemo(() => {
    return verifyFreeTicketsSecret(eventId, search.key)
  }, [eventId, search.key])

  const [ticketInventories, setTicketInventories] = useState<TicketInventory[]>([])
  const [selectedTicketTypeSlug, setSelectedTicketTypeSlug] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [purchaserName, setPurchaserName] = useState('')
  const [purchaserEmail, setPurchaserEmail] = useState('')
  const [purchaserPhone, setPurchaserPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [claimResult, setClaimResult] = useState<ClaimFreeTicketsResult | null>(null)

  // Initialize selected tier
  useEffect(() => {
    if (ticketOptions.length > 0 && !selectedTicketTypeSlug) {
      setSelectedTicketTypeSlug(ticketOptions[0]?.slug ?? '')
    }
  }, [selectedTicketTypeSlug, ticketOptions])

  // Load live availability when authorized
  useEffect(() => {
    if (!isAuthorized) return

    let mounted = true
    async function loadSale() {
      setLoading(true)
      try {
        const sale = await api.tickets.saleForEvent({ eventPublicId: eventId })
        if (mounted) {
          setTicketInventories(sale.ticketInventories)
        }
      } catch (err) {
        if (mounted) {
          setErrorMessage(err instanceof Error ? err.message : 'Could not check current ticket availability.')
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
  }, [eventId, isAuthorized])

  const inventoriesBySlug = useMemo(() => {
    return new Map(ticketInventories.map((inv) => [inv.slug, inv]))
  }, [ticketInventories])

  const selectedOption = useMemo(() => {
    return ticketOptions.find((opt) => opt.slug === selectedTicketTypeSlug)
  }, [selectedTicketTypeSlug, ticketOptions])

  const selectedInventory = useMemo(() => {
    return selectedOption ? inventoriesBySlug.get(selectedOption.slug) : undefined
  }, [inventoriesBySlug, selectedOption])

  const remainingUnits = selectedInventory?.remaining ?? ticketSaleConfig?.capacity ?? 100
  const maxAllowedQuantity = Math.max(
    1,
    Math.min(
      10,
      selectedOption?.capacityUnitsPerTicket
        ? Math.floor(remainingUnits / selectedOption.capacityUnitsPerTicket)
        : 10,
    ),
  )

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!selectedOption || !search.key) return
    const ticketTypeId = selectedInventory?.ticketTypeId
    if (!ticketTypeId) {
      setErrorMessage('Ticket type details are loading. Please try again in a moment.')
      return
    }

    setSubmitting(true)
    setErrorMessage(null)
    try {
      const result = await api.tickets.claimFreeTickets({
        eventPublicId: eventId,
        secretKey: search.key,
        ticketTypeId,
        purchaserName: purchaserName.trim(),
        purchaserEmail: purchaserEmail.trim().toLowerCase(),
        purchaserPhone: purchaserPhone.trim() || undefined,
        quantity,
      })
      setClaimResult(result)
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to confirm complimentary tickets.')
    } finally {
      setSubmitting(false)
    }
  }

  // Not authorized state: clean, polite card without password box
  if (!isAuthorized) {
    return (
      <main className="public-page">
        <div className="ticket-status-wrapper">
          <div className="passkey-card">
            <div className="passkey-icon-wrapper" style={{ background: 'rgba(25, 23, 21, 0.08)', color: '#191715' }}>
              <Lock size={28} />
            </div>
            <h2>Invitation Access Only</h2>
            <p className="muted" style={{ marginTop: '12px', fontSize: '15px', lineHeight: 1.6 }}>
              This complimentary ticket page is private and accessible only via a valid invitation link.
              If you received a complimentary invitation, please make sure you open the complete link provided to you.
            </p>

            <div style={{ marginTop: '28px', borderTop: '1px solid rgba(25, 23, 21, 0.1)', paddingTop: '20px' }}>
              <Link to="/events/$eventId" params={{ eventId }} className="button secondary">
                View Public Event Page <ArrowUpRight size={15} style={{ marginLeft: '4px' }} />
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

  const eventTitle = event?.title ?? 'Concert Event'
  const eventDate = event?.date ? formatDate(event.date) : '16 Oct 2026'
  const eventVenue = event?.location ?? 'Royalty Theatre, Adelaide'

  // Confirmed success view
  if (claimResult) {
    return (
      <main className="public-page">
        <div className="ticket-status-wrapper">
          <div className="free-tickets-success-card">
            <div className="free-tickets-success-icon">
              <CheckCircle2 size={36} />
            </div>
            <span className="ticket-status-badge" style={{ background: '#dcfce7', color: '#166534', marginBottom: '12px' }}>
              <Sparkles size={13} /> Order Confirmed · $0.00
            </span>
            <h1 style={{ fontSize: '28px', marginTop: '6px' }}>You&apos;re Going to the Concert!</h1>
            <p className="muted" style={{ marginTop: '8px', fontSize: '15px' }}>
              Your complimentary tickets for <strong>{eventTitle}</strong> have been confirmed.
            </p>

            <div
              style={{
                background: '#fff',
                border: '1px solid rgba(25, 23, 21, 0.12)',
                borderRadius: '8px',
                padding: '20px',
                marginTop: '24px',
                textAlign: 'left',
                display: 'grid',
                gap: '10px',
                fontSize: '14px',
              }}
            >
              <div>
                <small className="muted" style={{ textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.05em' }}>
                  Order Reference
                </small>
                <div style={{ fontWeight: 600, fontFamily: 'monospace', fontSize: '15px' }}>{claimResult.orderId}</div>
              </div>

              <div>
                <small className="muted" style={{ textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.05em' }}>
                  Tickets
                </small>
                <div style={{ fontWeight: 600, fontSize: '15px' }}>
                  {claimResult.ticketTypeName} × {claimResult.quantity} (Complimentary)
                </div>
              </div>

              <div>
                <small className="muted" style={{ textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.05em' }}>
                  Guest Name & Email
                </small>
                <div style={{ fontWeight: 600, fontSize: '14px' }}>
                  {claimResult.purchaserName} ({claimResult.purchaserEmail})
                </div>
              </div>

              <div>
                <small className="muted" style={{ textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.05em' }}>
                  Date & Venue
                </small>
                <div style={{ fontWeight: 600, fontSize: '14px' }}>
                  {eventDate} · {eventVenue}
                </div>
              </div>
            </div>

            {claimResult.qrCodeDataUrl ? (
              <div>
                <div className="free-tickets-qr-frame">
                  <img src={claimResult.qrCodeDataUrl} alt="Check-in QR Code" />
                </div>
                <p style={{ fontSize: '13px', color: '#71665b', marginTop: '6px' }}>
                  Show this QR code at the door for entry on the evening of the concert.
                </p>
              </div>
            ) : null}

            <p style={{ marginTop: '16px', fontSize: '14px', color: '#166534', background: '#dcfce7', padding: '10px', borderRadius: '6px' }}>
              <Mail size={16} style={{ display: 'inline', verticalAlign: '-3px', marginRight: '6px' }} />
              A confirmation email with your QR code has also been sent to <strong>{claimResult.purchaserEmail}</strong>.
            </p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '28px', flexWrap: 'wrap' }}>
              <Button type="button" variant="outline" onClick={() => window.print()}>
                <Printer size={15} style={{ marginRight: '6px' }} /> Print / Save Ticket
              </Button>
              <Link to="/events/$eventId" params={{ eventId }} className="button secondary">
                Back to Event Page
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

  // Active form view
  return (
    <main className="public-page">
      <div className="ticket-status-wrapper">
        <header className="ticket-status-header">
          <div>
            <span className="ticket-status-badge">
              <Gift size={13} /> Complimentary Invitation · Free $0 Tickets
            </span>
            <h1 style={{ fontSize: 'clamp(26px, 4vw, 36px)', marginTop: '4px' }}>{eventTitle}</h1>
            <div
              style={{
                display: 'flex',
                gap: '16px',
                flexWrap: 'wrap',
                marginTop: '8px',
                color: '#71665b',
                fontSize: '14px',
              }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <Calendar size={15} /> {eventDate}
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <MapPin size={15} /> {eventVenue}
              </span>
            </div>
            <p className="muted" style={{ marginTop: '12px', fontSize: '15px', maxWidth: '640px' }}>
              You have received a special complimentary invitation to attend this performance.
              Please select your ticket type and fill out your details to receive your tickets.
            </p>
          </div>

          <div className="ticket-status-actions">
            <Link to="/events/$eventId" params={{ eventId }} className="button secondary">
              View Public Page <ArrowUpRight size={15} style={{ marginLeft: '4px' }} />
            </Link>
          </div>
        </header>

        {errorMessage ? (
          <div className="passkey-error">
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="free-tickets-layout">
          {/* Left Column: Ticket Selection */}
          <div style={{ display: 'grid', gap: '20px' }}>
            <div>
              <h2 style={{ fontSize: '18px', marginBottom: '8px' }}>1. Choose Ticket Type</h2>
              <p className="muted" style={{ fontSize: '14px', marginBottom: '14px' }}>
                All ticket options on this private invitation page are provided at no cost ($0.00).
              </p>

              <div style={{ display: 'grid', gap: '12px' }}>
                {ticketOptions.map((opt) => {
                  const isSelected = opt.slug === selectedTicketTypeSlug
                  const inv = inventoriesBySlug.get(opt.slug)
                  const isSoldOut = inv && inv.remaining < opt.capacityUnitsPerTicket

                  return (
                    <button
                      key={opt.slug}
                      type="button"
                      disabled={isSoldOut}
                      className={`free-ticket-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedTicketTypeSlug(opt.slug)
                        setQuantity(1)
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <strong style={{ fontSize: '16px' }}>{opt.name}</strong>
                          <span className="free-ticket-badge">$0.00 Free</span>
                        </div>
                        {opt.description ? (
                          <div style={{ fontSize: '13px', color: '#71665b', marginTop: '4px' }}>
                            {opt.description}
                          </div>
                        ) : null}
                        <div style={{ fontSize: '13px', color: '#71665b', marginTop: '4px' }}>
                          {opt.capacityUnitsPerTicket} seat{opt.capacityUnitsPerTicket > 1 ? 's' : ''} per ticket
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span className="free-ticket-original-price">
                          ${(opt.priceCents / 100).toFixed(0)}
                        </span>
                        <strong style={{ fontSize: '16px', color: '#166534' }}>$0</strong>
                        {isSoldOut ? (
                          <div style={{ fontSize: '12px', color: '#9a3729', marginTop: '4px' }}>Sold Out</div>
                        ) : null}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label htmlFor="quantity-select" style={{ fontSize: '14px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                2. Number of Tickets
              </label>
              <select
                id="quantity-select"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '6px',
                  border: '1px solid rgba(25, 23, 21, 0.2)',
                  background: '#fff',
                  fontSize: '15px',
                }}
              >
                {Array.from({ length: maxAllowedQuantity }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n} ticket{n > 1 ? 's' : ''} (
                    {selectedOption?.capacityUnitsPerTicket ? n * selectedOption.capacityUnitsPerTicket : n} seat
                    {selectedOption?.capacityUnitsPerTicket && n * selectedOption.capacityUnitsPerTicket > 1 ? 's' : ''})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Right Column: Contact Details & Order Summary */}
          <div
            style={{
              background: '#fff8ee',
              border: '1px solid rgba(25, 23, 21, 0.12)',
              borderRadius: '10px',
              padding: '24px',
              display: 'grid',
              gap: '20px',
            }}
          >
            <h2 style={{ fontSize: '18px' }}>3. Guest Information</h2>

            <div className="field">
              <label htmlFor="purchaser-name" style={{ fontSize: '14px', fontWeight: 600 }}>
                Full Name *
              </label>
              <input
                id="purchaser-name"
                type="text"
                placeholder="Jane Doe"
                value={purchaserName}
                onChange={(e) => setPurchaserName(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="purchaser-email" style={{ fontSize: '14px', fontWeight: 600 }}>
                Email Address *
              </label>
              <input
                id="purchaser-email"
                type="email"
                placeholder="jane@example.com"
                value={purchaserEmail}
                onChange={(e) => setPurchaserEmail(e.target.value)}
                required
              />
              <small className="muted" style={{ fontSize: '12px', marginTop: '4px', display: 'block' }}>
                Your tickets and check-in QR code will be sent to this email address.
              </small>
            </div>

            <div className="field">
              <label htmlFor="purchaser-phone" style={{ fontSize: '14px', fontWeight: 600 }}>
                Phone Number (Optional)
              </label>
              <input
                id="purchaser-phone"
                type="tel"
                placeholder="0400 000 000"
                value={purchaserPhone}
                onChange={(e) => setPurchaserPhone(e.target.value)}
              />
            </div>

            {/* Summary */}
            <div
              style={{
                borderTop: '1px solid rgba(25, 23, 21, 0.12)',
                paddingTop: '16px',
                display: 'grid',
                gap: '8px',
                fontSize: '14px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="muted">Ticket Type:</span>
                <strong>{selectedOption?.name ?? 'General admission'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="muted">Quantity:</span>
                <strong>{quantity}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="muted">Total Seats:</span>
                <strong>{quantity * (selectedOption?.capacityUnitsPerTicket ?? 1)} seats</strong>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderTop: '1px dashed rgba(25, 23, 21, 0.15)',
                  paddingTop: '8px',
                  marginTop: '4px',
                  fontSize: '16px',
                }}
              >
                <span>Total Amount:</span>
                <strong style={{ color: '#166534', fontSize: '18px' }}>$0.00 AUD (Free)</strong>
              </div>
            </div>

            <Button
              type="submit"
              disabled={submitting || loading || !selectedOption}
              style={{ width: '100%', padding: '14px', fontSize: '16px' }}
            >
              {submitting ? 'Confirming Your Tickets...' : 'Claim Free Tickets'}
              {!submitting ? <ArrowRight size={16} style={{ marginLeft: '8px' }} /> : null}
            </Button>

            <p className="muted" style={{ fontSize: '12px', textAlign: 'center', margin: 0 }}>
              No credit card or payment required. Immediate confirmation.
            </p>
          </div>
        </form>
      </div>
    </main>
  )
}

function formatDate(value: string) {
  if (!value) return ''
  const date = new Date(value)
  return new Intl.DateTimeFormat('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}
