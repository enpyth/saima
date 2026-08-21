import { getTicketQuantityLimit, type FreeTicketRecipient, type TicketSaleStat } from '@saima/shared'
import { createFileRoute } from '@tanstack/react-router'
import { Gift, Mail, Ticket } from 'lucide-react'
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react'

import { Button } from '../components/ui/button'
import { api } from '../lib/orpc'

export const Route = createFileRoute('/dashboard/admin/free-tickets')({ component: AdminFreeTickets })

function AdminFreeTickets() {
  const [recipients, setRecipients] = useState<FreeTicketRecipient[]>([])
  const [ticketStats, setTicketStats] = useState<TicketSaleStat[]>([])
  const [recipientProfileId, setRecipientProfileId] = useState('')
  const [eventPublicId, setEventPublicId] = useState('')
  const [ticketTypeId, setTicketTypeId] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const eventOptions = useMemo(() => {
    const eventsById = new Map(ticketStats.map((stat) => [stat.eventPublicId, stat.eventTitle]))

    return [...eventsById.entries()].map(([id, title]) => ({ id, title }))
  }, [ticketStats])
  const ticketOptions = useMemo(
    () => ticketStats.filter((ticketStat) => ticketStat.eventPublicId === eventPublicId),
    [eventPublicId, ticketStats],
  )
  const selectedTicketType = ticketOptions.find((ticketOption) => ticketOption.ticketTypeId === ticketTypeId)
  const maxQuantity = getTicketQuantityLimit(selectedTicketType?.capacityUnitsPerTicket ?? 1)

  async function loadFormData() {
    setLoading(true)
    try {
      const [recipientRows, statRows] = await Promise.all([
        api.tickets.freeTicketRecipients(),
        api.tickets.salesStats(),
      ])
      setRecipients(recipientRows)
      setTicketStats(statRows)
      setRecipientProfileId((current) => current || recipientRows[0]?.id || '')
      setEventPublicId((current) => current || statRows[0]?.eventPublicId || '')
      setMessage(`Loaded ${recipientRows.length} eligible recipient${recipientRows.length === 1 ? '' : 's'}.`)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not load free ticket form data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadFormData()
  }, [])

  useEffect(() => {
    if (eventOptions.length === 0) {
      setEventPublicId('')
      return
    }
    if (!eventOptions.some((eventOption) => eventOption.id === eventPublicId)) {
      setEventPublicId(eventOptions[0]?.id ?? '')
      setQuantity(1)
    }
  }, [eventOptions, eventPublicId])

  useEffect(() => {
    if (ticketOptions.length === 0) {
      setTicketTypeId('')
      return
    }
    if (!ticketOptions.some((ticketOption) => ticketOption.ticketTypeId === ticketTypeId)) {
      setTicketTypeId(ticketOptions[0]?.ticketTypeId ?? '')
      setQuantity(1)
    }
  }, [ticketOptions, ticketTypeId])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!recipientProfileId || !ticketTypeId) {
      setMessage('Choose a recipient and ticket type.')
      return
    }

    setSubmitting(true)
    try {
      const result = await api.tickets.createFreeTicketOrder({
        recipientProfileId,
        ticketTypeId,
        quantity,
      })
      setMessage(
        result.emailSent
          ? 'Free ticket created and confirmation email sent.'
          : `Free ticket created, but confirmation email failed: ${result.emailError ?? 'Unknown email error.'}`,
      )
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not create free ticket.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="dashboard-section">
      <header className="dashboard-section-header">
        <div>
          <span className="eyebrow">Free Tickets</span>
          <h2>Issue complimentary tickets</h2>
          <p className="muted">Create confirmed zero-dollar tickets for existing ADMIN_EMAILS profiles.</p>
        </div>
        <Button type="button" onClick={loadFormData}>
          {loading ? 'Loading' : 'Refresh'}
        </Button>
      </header>

      <div className="sales-stat-grid">
        <FreeTicketStat icon={<Gift size={20} />} label="Payment" value="Free" />
        <FreeTicketStat icon={<Ticket size={20} />} label="Status" value="Confirmed" />
        <FreeTicketStat icon={<Mail size={20} />} label="Delivery" value="Email" />
      </div>

      {message ? <p className="muted">{message}</p> : null}

      <form className="form" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="freeTicketRecipient">Recipient</label>
          <select
            id="freeTicketRecipient"
            value={recipientProfileId}
            onChange={(event) => setRecipientProfileId(event.currentTarget.value)}
            required
          >
            {recipients.map((recipient) => (
              <option key={recipient.id} value={recipient.id}>
                {recipient.fullName} · {recipient.email}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="freeTicketEvent">Event</label>
          <select
            id="freeTicketEvent"
            value={eventPublicId}
            onChange={(event) => {
              setEventPublicId(event.currentTarget.value)
              setQuantity(1)
            }}
            required
          >
            {eventOptions.map((eventOption) => (
              <option key={eventOption.id} value={eventOption.id}>
                {eventOption.title}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="freeTicketType">Ticket type</label>
          <select
            id="freeTicketType"
            value={ticketTypeId}
            onChange={(event) => {
              setTicketTypeId(event.currentTarget.value)
              setQuantity(1)
            }}
            required
          >
            {ticketOptions.map((ticketOption) => (
              <option key={ticketOption.ticketTypeId} value={ticketOption.ticketTypeId}>
                {ticketOption.ticketTypeName} · {formatMoney(ticketOption.priceCents, ticketOption.currency)}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="freeTicketQuantity">Quantity</label>
          <input
            id="freeTicketQuantity"
            type="number"
            min="1"
            max={maxQuantity}
            value={quantity}
            onChange={(event) => setQuantity(Math.max(Number(event.currentTarget.value), 1))}
            required
          />
        </div>
        <Button type="submit" disabled={submitting || recipients.length === 0 || ticketOptions.length === 0}>
          {submitting ? 'Creating' : 'Create free ticket'}
        </Button>
      </form>
    </div>
  )
}

function FreeTicketStat({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
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
