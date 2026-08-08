import type { TicketCheckInResult } from '@saima/shared'
import { createFileRoute } from '@tanstack/react-router'
import { CalendarDays, CheckCircle2, Mail, MapPin, Ticket, TriangleAlert, UserRound, XCircle } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { Button } from '../components/ui/button'
import { formatDateTime } from '../lib/date-format'
import { api } from '../lib/orpc'

export const Route = createFileRoute('/dashboard/admin/ticket-checkin')({ component: AdminTicketCheckIn })

function AdminTicketCheckIn() {
  const [result, setResult] = useState<TicketCheckInResult | null>(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const hasAutoCheckedIn = useRef(false)
  const token = new URLSearchParams(window.location.search).get('token') ?? ''

  async function checkInTicket() {
    if (!token) {
      const missingTokenResult = {
        status: 'invalid',
        message: 'Missing ticket QR token.',
      } satisfies TicketCheckInResult
      setResult(missingTokenResult)
      setMessage(missingTokenResult.message)
      return
    }

    setLoading(true)
    try {
      const response = await api.tickets.checkInByToken({ token })
      setResult(response)
      setMessage(response.message)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not verify ticket.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (hasAutoCheckedIn.current) {
      return
    }

    hasAutoCheckedIn.current = true
    void checkInTicket()
  }, [])

  const ticket = result?.ticket
  const statusClass = getCheckInStatusClass(result?.status)
  const StatusIcon = result?.status === 'already_checked_in' ? TriangleAlert : result?.status === 'checked_in' ? CheckCircle2 : XCircle

  return (
    <div className="dashboard-section">
      <header className="dashboard-section-header">
        <div>
          <span className="eyebrow">Ticket check-in</span>
          <h2>QR verification</h2>
          <p className="muted">Scan a ticket QR code while signed in as an admin.</p>
        </div>
        <Button type="button" variant="outline" onClick={checkInTicket} disabled={loading || !token}>
          {loading ? 'Checking' : 'Check again'}
        </Button>
      </header>

      {message ? (
        <div className={`checkin-status ${statusClass}`} role="alert">
          <StatusIcon size={22} aria-hidden="true" />
          <strong>{message}</strong>
        </div>
      ) : null}

      {ticket ? (
        <article className="admin-row checkin-detail-row">
          <div>
            <span className="eyebrow">{ticket.status}</span>
            <h3>{ticket.event?.title ?? 'Event ticket'}</h3>
            <p className="muted">
              {ticket.ticketType?.name ?? 'Ticket'} · {ticket.quantity} ticket{ticket.quantity === 1 ? '' : 's'} · {formatMoney(ticket.totalPriceCents)}
            </p>
          </div>
          <div className="checkin-detail-grid">
            <p className="muted inline-meta">
              <UserRound size={16} aria-hidden="true" /> {ticket.purchaserName}
            </p>
            <p className="muted inline-meta">
              <Mail size={16} aria-hidden="true" /> {ticket.purchaserEmail}
            </p>
            <p className="muted inline-meta">
              <CalendarDays size={16} aria-hidden="true" /> {formatDateTime(ticket.event?.startsAt)}
            </p>
            <p className="muted inline-meta">
              <MapPin size={16} aria-hidden="true" /> {ticket.event?.location ?? 'Location unavailable'}
            </p>
            <p className="muted inline-meta">
              <Ticket size={16} aria-hidden="true" /> Paid {formatDateTime(ticket.paidAt ?? undefined)}
            </p>
            <p className="muted inline-meta">
              <CheckCircle2 size={16} aria-hidden="true" /> Checked in {formatDateTime(ticket.checkedInAt ?? undefined)}
            </p>
          </div>
        </article>
      ) : !loading ? (
        <p className="empty-state muted">No ticket details available.</p>
      ) : null}
    </div>
  )
}

function formatMoney(cents: number) {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
  }).format(cents / 100)
}

function getCheckInStatusClass(status: TicketCheckInResult['status'] | undefined) {
  if (status === 'checked_in') {
    return 'checkin-status-valid'
  }

  if (status === 'already_checked_in') {
    return 'checkin-status-warning'
  }

  return 'checkin-status-invalid'
}
