import type { TicketSaleInventory } from '@saima/shared'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  AlertCircle,
  ArrowUpRight,
  BarChart3,
  Calendar,
  KeyRound,
  Lock,
  MapPin,
  RefreshCw,
  Ticket,
  Users,
} from 'lucide-react'
import { useEffect, useMemo, useState, type FormEvent } from 'react'

import { useLanguage } from '../components/language-provider'
import { Button } from '../components/ui/button'
import { findEvent } from '../content/events'
import { api } from '../lib/orpc'
import {
  calculateTicketAvailabilitySummary,
  getTicketSaleConfig,
  verifyTicketSaleSecret,
} from '../lib/ticket-sales-config'

export const Route = createFileRoute('/events_/$eventId_/tickets-status')({
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
        title: 'Ticket Availability & Status | SAIMA',
      },
      {
        name: 'description',
        content: 'Private ticket availability and remaining inventory status.',
      },
    ],
  }),
  component: EventTicketsStatusPage,
})

function EventTicketsStatusPage() {
  const { eventId } = Route.useParams()
  const search = Route.useSearch()
  const { language } = useLanguage()
  const event = findEvent(language, eventId)
  const ticketSaleConfig = getTicketSaleConfig(eventId)

  const [activeKey, setActiveKey] = useState(search.key ?? '')
  const [keyInput, setKeyInput] = useState(search.key ?? '')
  const [passkeyError, setPasskeyError] = useState('')

  const [sale, setSale] = useState<TicketSaleInventory | null>(null)
  const [loading, setLoading] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const isAuthorized = useMemo(() => {
    return verifyTicketSaleSecret(eventId, activeKey)
  }, [eventId, activeKey])

  async function loadData() {
    setLoading(true)
    setFetchError(null)
    try {
      const data = await api.tickets.saleForEvent({ eventPublicId: eventId })
      setSale(data)
      setLastUpdated(new Date())
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : 'Failed to load ticket inventory data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthorized) {
      void loadData()
    }
  }, [isAuthorized, eventId])

  function handleUnlock(e: FormEvent) {
    e.preventDefault()
    if (verifyTicketSaleSecret(eventId, keyInput)) {
      setActiveKey(keyInput)
      setPasskeyError('')
    } else {
      setPasskeyError('Invalid passkey. Access denied.')
    }
  }

  const summary = useMemo(() => {
    if (!sale) {
      return null
    }
    return calculateTicketAvailabilitySummary(eventId, sale.capacity, sale.ticketInventories)
  }, [eventId, sale])

  if (!ticketSaleConfig) {
    return (
      <main className="public-page">
        <div className="ticket-status-wrapper">
          <div className="passkey-card">
            <div className="passkey-icon-wrapper">
              <AlertCircle size={28} />
            </div>
            <h2>Ticket Sale Not Configured</h2>
            <p className="muted" style={{ marginTop: '8px' }}>
              No ticket sale configuration was found for event ID: {eventId}.
            </p>
            <div style={{ marginTop: '20px' }}>
              <Link to="/events" className="button">
                Back to Events
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (!isAuthorized) {
    return (
      <main className="public-page">
        <div className="ticket-status-wrapper">
          <div className="passkey-card">
            <div className="passkey-icon-wrapper">
              <Lock size={28} />
            </div>
            <h2>Restricted Ticket Status</h2>
            <p className="muted" style={{ marginTop: '8px', fontSize: '15px' }}>
              This is a private page displaying real-time ticket availability and remaining inventory for{' '}
              <strong>{event?.title ?? 'this event'}</strong>.
            </p>

            <form onSubmit={handleUnlock} className="passkey-form">
              {passkeyError ? (
                <div className="passkey-error">
                  <AlertCircle size={18} />
                  <span>{passkeyError}</span>
                </div>
              ) : null}

              <div className="field">
                <label htmlFor="passkey-input" style={{ fontSize: '14px', fontWeight: 600 }}>
                  Enter Access Passkey
                </label>
                <input
                  id="passkey-input"
                  type="password"
                  placeholder="Enter passkey to view status..."
                  value={keyInput}
                  onChange={(e) => {
                    setKeyInput(e.target.value)
                    if (passkeyError) setPasskeyError('')
                  }}
                  autoFocus
                  required
                />
              </div>

              <Button type="submit" style={{ width: '100%' }}>
                <KeyRound size={16} style={{ marginRight: '8px' }} />
                Unlock Ticket Status
              </Button>
            </form>

            <div style={{ marginTop: '24px', borderTop: '1px solid rgba(25, 23, 21, 0.1)', paddingTop: '16px' }}>
              <Link
                to="/events/$eventId"
                params={{ eventId }}
                style={{ fontSize: '14px', color: '#71665b', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              >
                Go to Public Event Page <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

  const eventTitle = event?.title ?? sale?.eventTitle ?? 'Concert Event'
  const eventDate = event?.date ? formatDate(event.date) : sale?.startsAt ? formatDate(sale.startsAt) : null
  const eventVenue = event?.location ?? 'Royalty Theatre, Adelaide'

  return (
    <main className="public-page">
      <div className="ticket-status-wrapper">
        <header className="ticket-status-header">
          <div>
            <span className="ticket-status-badge">
              <Lock size={12} /> Confidential · Internal Status
            </span>
            <h1 style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', marginTop: '4px' }}>{eventTitle}</h1>
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
              {eventDate ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  <Calendar size={15} /> {eventDate}
                </span>
              ) : null}
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <MapPin size={15} /> {eventVenue}
              </span>
              {lastUpdated ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  Updated at {formatTime(lastUpdated)}
                </span>
              ) : null}
            </div>
          </div>

          <div className="ticket-status-actions">
            <Button
              type="button"
              variant="outline"
              onClick={() => void loadData()}
              disabled={loading}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
              {loading ? 'Refreshing...' : 'Refresh Data'}
            </Button>
            <Link to="/events/$eventId" params={{ eventId }} className="button secondary">
              View Public Page <ArrowUpRight size={15} style={{ marginLeft: '4px' }} />
            </Link>
          </div>
        </header>

        {fetchError ? (
          <div className="passkey-error">
            <AlertCircle size={18} />
            <span>{fetchError}</span>
          </div>
        ) : null}

        {summary ? (
          <>
            {/* Overview Stat Cards */}
            <div className="sales-stat-grid">
              <div className="sales-stat">
                <span>
                  <Users size={20} />
                </span>
                <div>
                  <strong style={{ color: summary.remainingCapacityUnits > 0 ? '#166534' : '#9a3729' }}>
                    {summary.remainingCapacityUnits}
                  </strong>
                  <small>Remaining Seats ({summary.totalCapacity} total capacity)</small>
                </div>
              </div>

              <div className="sales-stat">
                <span>
                  <Ticket size={20} />
                </span>
                <div>
                  <strong>{summary.usedCapacityUnits}</strong>
                  <small>Capacity Used ({summary.totalReservedTickets} reserved / pending)</small>
                </div>
              </div>

              <div className="sales-stat">
                <span>
                  <Ticket size={20} />
                </span>
                <div>
                  <strong>{summary.totalSoldTickets}</strong>
                  <small>Confirmed Tickets Sold</small>
                </div>
              </div>

              <div className="sales-stat">
                <span>
                  <BarChart3 size={20} />
                </span>
                <div>
                  <strong>{summary.sellThroughRate}%</strong>
                  <small>Capacity Sell-Through</small>
                </div>
              </div>
            </div>

            {/* Ticket Tier Breakdown Table */}
            <div>
              <div style={{ marginBottom: '14px' }}>
                <h2 style={{ fontSize: '20px' }}>Ticket Tier Availability</h2>
                <p className="muted" style={{ fontSize: '14px', marginTop: '4px' }}>
                  Live breakdown of confirmed ticket orders, pending checkout reservations, and remaining tickets
                  available for purchase per tier.
                </p>
              </div>

              <div className="ticket-status-table-wrapper">
                <table className="ticket-status-table">
                  <thead>
                    <tr>
                      <th>Ticket Tier</th>
                      <th>Price</th>
                      <th>Seats / Ticket</th>
                      <th>Sold</th>
                      <th>Pending</th>
                      <th>Remaining Tickets</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.tiers.map((tier) => (
                      <tr key={tier.slug}>
                        <td>
                          <div className="ticket-status-tier-title">{tier.name}</div>
                          {tier.description ? (
                            <div className="ticket-status-tier-desc">{tier.description}</div>
                          ) : null}
                        </td>
                        <td>
                          <strong>{formatMoney(tier.priceCents, tier.currency)}</strong>
                        </td>
                        <td>
                          {tier.capacityUnitsPerTicket} seat{tier.capacityUnitsPerTicket > 1 ? 's' : ''}
                        </td>
                        <td>
                          <strong>{tier.sold}</strong>
                        </td>
                        <td style={{ color: tier.reserved > 0 ? '#b45309' : '#71665b' }}>
                          {tier.reserved}
                        </td>
                        <td>
                          <span
                            className={`ticket-status-remaining-highlight ${tier.soldOut ? 'sold-out' : ''}`}
                          >
                            {tier.remainingTickets}
                          </span>{' '}
                          <small style={{ color: '#71665b' }}>ticket{tier.remainingTickets === 1 ? '' : 's'}</small>
                        </td>
                        <td>
                          {tier.soldOut ? (
                            <span className="ticket-status-badge-soldout">Sold Out</span>
                          ) : (
                            <span className="ticket-status-badge-avail">Available</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Explanatory note */}
            <div
              style={{
                background: '#fff8ee',
                border: '1px solid rgba(25, 23, 21, 0.12)',
                borderRadius: '8px',
                padding: '16px 20px',
                fontSize: '14px',
                color: '#71665b',
                lineHeight: 1.5,
              }}
            >
              <strong style={{ color: '#191715' }}>Pooled Venue Capacity Note:</strong> Seat capacity is pooled
              across all ticket tiers ({summary.totalCapacity} seats total). Remaining ticket quantities show how many
              tickets of each type can be purchased before venue capacity is reached (e.g. 1 Family ticket reserves 4
              seats).
            </div>
          </>
        ) : loading ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <RefreshCw size={28} className="animate-spin" style={{ margin: '0 auto 12px', color: '#9a3729' }} />
            <p className="muted">Loading live ticket inventory...</p>
          </div>
        ) : null}
      </div>
    </main>
  )
}

function formatMoney(cents: number, currency: string) {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency,
  }).format(cents / 100)
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

function formatTime(date: Date) {
  return date.toLocaleTimeString('en-AU', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}
