import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

import { Button } from '../components/ui/button'
import { formatDateTime } from '../lib/date-format'
import { api } from '../lib/orpc'

export const Route = createFileRoute('/dashboard/visitor/bookings')({
  component: VisitorBookings,
})

type VisitorBooking = {
  id: string
  status: string
  created_at: string
  courses?: {
    title: string
    instrument: string
    level: string
    location: string
    profiles?: {
      full_name: string
      email: string
    } | null
  } | null
  course_slots?: {
    starts_at: string
    ends_at: string
    status: string
  } | null
}

function VisitorBookings() {
  const [bookings, setBookings] = useState<VisitorBooking[]>([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function loadBookings() {
    setLoading(true)
    try {
      const rows = await api.bookings.mine()
      setBookings(rows as VisitorBooking[])
      setMessage(`Loaded ${rows.length} bookings.`)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not load bookings.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadBookings()
  }, [])

  return (
    <div className="dashboard-section">
      <header className="dashboard-section-header">
        <div>
          <span className="eyebrow">Bookings</span>
          <h2>My bookings</h2>
          <p className="muted">Review upcoming reservations and past booking history.</p>
        </div>
        <div className="admin-actions">
          <Button asChild>
            <a href="/courses">Browse courses</a>
          </Button>
          <Button type="button" variant="outline" onClick={loadBookings}>
            {loading ? 'Loading' : 'Refresh'}
          </Button>
        </div>
      </header>
      {message ? <p className="muted">{message}</p> : null}
      {bookings.length === 0 ? (
        <p className="muted">No bookings yet.</p>
      ) : (
        <div className="admin-table">
          {bookings.map((booking) => (
            <article className="admin-row" key={booking.id}>
              <div>
                <strong>{booking.courses?.title ?? 'Course'}</strong>
                <p className="muted">
                  {formatDateTime(booking.course_slots?.starts_at)} · {booking.status}
                </p>
                <p>
                  {booking.courses?.instrument ?? 'Music'} · {booking.courses?.level ?? 'All levels'} ·{' '}
                  {booking.courses?.location ?? 'Location unavailable'}
                </p>
                <p className="muted">
                  Member: {booking.courses?.profiles?.full_name ?? 'SAIMA member'}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
