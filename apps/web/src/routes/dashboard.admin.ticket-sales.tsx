import { calculateTicketSaleOverview, type TicketSaleStat } from '@saima/shared'
import { createFileRoute } from '@tanstack/react-router'
import { BarChart3, DollarSign, Ticket, Users } from 'lucide-react'
import { useEffect, useMemo, useState, type ReactNode } from 'react'

import { Button } from '../components/ui/button'
import { api } from '../lib/orpc'

export const Route = createFileRoute('/dashboard/admin/ticket-sales')({ component: AdminTicketSales })

function AdminTicketSales() {
  const [stats, setStats] = useState<TicketSaleStat[]>([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const overview = useMemo(() => calculateTicketSaleOverview(stats), [stats])

  async function loadStats() {
    setLoading(true)
    try {
      const rows = await api.tickets.salesStats()
      setStats(rows)
      setMessage(`Loaded ${rows.length} ticket type${rows.length === 1 ? '' : 's'}.`)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not load ticket sales.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadStats()
  }, [])

  return (
    <div className="dashboard-section">
      <header className="dashboard-section-header">
        <div>
          <span className="eyebrow">Ticket sales</span>
          <h2>Sales overview</h2>
          <p className="muted">Track ticket inventory, confirmed sales, and revenue by event.</p>
        </div>
        <Button type="button" onClick={loadStats}>
          {loading ? 'Loading' : 'Refresh'}
        </Button>
      </header>

      <div className="sales-stat-grid">
        <SalesStat icon={<Ticket size={20} />} label="Capacity used" value={String(overview.totalSold)} />
        <SalesStat icon={<Users size={20} />} label="Remaining" value={String(overview.totalRemaining)} />
        <SalesStat icon={<DollarSign size={20} />} label="Revenue" value={formatMoney(overview.totalRevenueCents, 'AUD')} />
        <SalesStat icon={<BarChart3 size={20} />} label="Sell-through" value={`${overview.sellThroughRate}%`} />
      </div>

      {message ? <p className="muted">{message}</p> : null}

      <div className="admin-table">
        {stats.map((stat) => (
          <article className="admin-row ticket-sales-row" key={stat.ticketTypeId}>
            <div>
              <span className="eyebrow">{formatDate(stat.startsAt)}</span>
              <h3>{stat.eventTitle}</h3>
              <p className="muted">
                {stat.ticketTypeName} · {formatMoney(stat.priceCents, stat.currency)} · Capacity {stat.capacity}
              </p>
            </div>
            <div className="ticket-sales-metrics">
              <strong>{stat.sold} sold</strong>
              <span>{stat.reserved} pending payment</span>
              <span>{stat.remaining} remaining</span>
              <span>{formatMoney(stat.revenueCents, stat.currency)}</span>
            </div>
          </article>
        ))}
        {stats.length === 0 && !loading ? (
          <p className="empty-state muted">No ticket sales configured yet.</p>
        ) : null}
      </div>
    </div>
  )
}

function SalesStat({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="sales-stat">
      <span>{icon}</span>
      <div>
        <strong>{value}</strong>
        <small>{label}</small>
      </div>
    </div>
  )
}

function formatMoney(cents: number, currency: string) {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency,
  }).format(cents / 100)
}

function formatDate(value: string) {
  if (!value) {
    return 'Event'
  }

  return new Intl.DateTimeFormat('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}
