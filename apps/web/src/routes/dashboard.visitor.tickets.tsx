import { createFileRoute } from '@tanstack/react-router'
import type { TicketOrderWithDetails } from '@saima/shared'
import { CalendarDays, MapPin, Ticket } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '../components/ui/button'
import { formatDateTime } from '../lib/date-format'
import { api } from '../lib/orpc'

export const Route = createFileRoute('/dashboard/visitor/tickets')({ component: VisitorTickets })

function VisitorTickets() {
  const [tickets, setTickets] = useState<TicketOrderWithDetails[]>([])
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
      setTickets(rows)
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
                <h3>{ticket.event?.title ?? 'Event ticket'}</h3>
                <p className="muted">
                  {ticket.ticketType?.name ?? 'Ticket'} · {ticket.quantity} ticket{ticket.quantity === 1 ? '' : 's'} · {formatMoney(ticket.totalPriceCents)}
                </p>
                <p className="muted inline-meta">
                  <CalendarDays size={16} aria-hidden="true" /> {formatDateTime(ticket.event?.startsAt)}
                </p>
                <p className="muted inline-meta">
                  <MapPin size={16} aria-hidden="true" /> {ticket.event?.location ?? 'Location unavailable'}
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
