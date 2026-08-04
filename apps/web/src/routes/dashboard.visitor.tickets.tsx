import { createFileRoute } from '@tanstack/react-router'
import { CalendarDays, MapPin, Ticket } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '../components/ui/button'
import { formatDateTime } from '../lib/date-format'
import { api } from '../lib/orpc'

export const Route = createFileRoute('/dashboard/visitor/tickets')({ component: VisitorTickets })

type VisitorTicketOrder = {
  id: string
  event_public_id: string
  purchaser_name: string
  purchaser_email: string
  quantity: number
  total_price_cents: number
  status: string
  paid_at: string | null
  created_at: string
  ticket_types?: {
    name: string
    description: string | null
  } | null
  events?: {
    title: string
    starts_at: string
    location: string
  } | null
}

function VisitorTickets() {
  const [tickets, setTickets] = useState<VisitorTicketOrder[]>([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function loadTickets() {
    setLoading(true)
    try {
      const sessionId = new URLSearchParams(window.location.search).get('session_id')
      if (sessionId) {
        await api.tickets.syncCheckoutSession({ sessionId })
        window.history.replaceState({}, '', '/dashboard/visitor/tickets')
      }
      const rows = await api.tickets.mine()
      setTickets(rows as VisitorTicketOrder[])
      setMessage(`Loaded ${rows.length} ticket order${rows.length === 1 ? '' : 's'}.`)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not load tickets.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadTickets()
  }, [])

  return (
    <div className="dashboard-section">
      <header className="dashboard-section-header">
        <div>
          <span className="eyebrow">Tickets</span>
          <h2>My tickets</h2>
          <p className="muted">View paid event tickets connected to your account.</p>
        </div>
        <div className="admin-actions">
          <Button asChild>
            <a href="/events/20261016">Buy tickets</a>
          </Button>
          <Button type="button" variant="outline" onClick={loadTickets}>
            {loading ? 'Loading' : 'Refresh'}
          </Button>
        </div>
      </header>

      {message ? <p className="muted">{message}</p> : null}

      {tickets.length === 0 ? (
        <p className="muted">No paid tickets yet.</p>
      ) : (
        <div className="admin-table">
          {tickets.map((ticket) => (
            <article className="admin-row ticket-dashboard-row" key={ticket.id}>
              <div>
                <span className="eyebrow">{ticket.status}</span>
                <h3>{ticket.events?.title ?? 'Event ticket'}</h3>
                <p className="muted">
                  {ticket.ticket_types?.name ?? 'Ticket'} · {ticket.quantity} ticket{ticket.quantity === 1 ? '' : 's'} · {formatMoney(ticket.total_price_cents)}
                </p>
                <p className="muted inline-meta">
                  <CalendarDays size={16} aria-hidden="true" /> {formatDateTime(ticket.events?.starts_at)}
                </p>
                <p className="muted inline-meta">
                  <MapPin size={16} aria-hidden="true" /> {ticket.events?.location ?? 'Location unavailable'}
                </p>
              </div>
              <div className="ticket-qr-placeholder" aria-hidden="true">
                <Ticket size={34} />
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

function formatMoney(cents: number) {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
  }).format(cents / 100)
}
