import { createFileRoute } from '@tanstack/react-router'
import type { TicketOrderWithDetails } from '@saima/shared'
import { CalendarDays, MapPin, Ticket } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '../components/ui/button'
import { formatDateTime } from '../lib/date-format'
import { api } from '../lib/orpc'
import { printTicket } from '../lib/printed-ticket'

export const Route = createFileRoute('/dashboard/admin/free-tickets-list')({ component: AdminTickets })

function AdminTickets() {
  const [tickets, setTickets] = useState<TicketOrderWithDetails[]>([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function loadTickets() {
    setLoading(true)
    try {
      const rows = await api.tickets.mine()
      setTickets(rows)
      setMessage(`Loaded ${rows.length} ticket order${rows.length === 1 ? '' : 's'}.`)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not load tickets.')
    } finally {
      setLoading(false)
    }
  }

  async function onPrintClicked(ticket: TicketOrderWithDetails) {
    await printTicket(ticket);
  }

  useEffect(() => {
    void loadTickets()
  }, [])

  return (
    <div className="dashboard-section">
      <header className="dashboard-section-header">
        <div>
          <span className="eyebrow">Tickets</span>
          <h2>Free tickets</h2>
          <p className="muted">View generated complimentary tickets connected to your account.</p>
        </div>
      </header>

      {message ? <p className="muted">{message}</p> : null}

      {loading ? (
        <p className="muted">Loading your tickets...</p>
      ) : tickets.length === 0 ? (
        <p className="muted">No tickets yet.</p>
      ) : (
        <div className="admin-table">
          {tickets.map((ticket) => (
            <article className="admin-row ticket-dashboard-row" key={ticket.id}>
              <div>
                <h3>{ticket.event?.title ?? 'Event ticket'}</h3>
                <p className="muted">Issued At: {formatDateTime(ticket.createdAt)}</p>
                <p className="muted">
                  {ticket.ticketType?.name ?? 'Ticket'} · {ticket.quantity} ticket{ticket.quantity === 1 ? '' : 's'} · {formatMoney(ticket.totalPriceCents)}
                </p>
              </div>
              <div>
                <Button type="button" variant="outline" onClick={() => void onPrintClicked(ticket)}>Print</Button>
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
