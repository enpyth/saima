import { createFileRoute } from '@tanstack/react-router'
import type { BookingWithDetails } from '@saima/shared'
import { useEffect, useState } from 'react'

import { Button } from '../components/ui/button'
import { formatDateTime } from '../lib/date-format'
import { api } from '../lib/orpc'

export const Route = createFileRoute('/dashboard/visitor/bookings')({
  component: VisitorBookings,
})

function VisitorBookings() {
  const [bookings, setBookings] = useState<BookingWithDetails[]>([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function loadBookings() {
    setLoading(true)
    try {
      const rows = await api.bookings.mine()
      setBookings(rows)
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
                <strong>{booking.course?.title ?? 'Course'}</strong>
                <p className="muted">
                  {formatDateTime(booking.courseSlot?.startsAt)} · {booking.status}
                </p>
                <p>
                  {booking.course?.instrument ?? 'Music'} · {booking.course?.level ?? 'All levels'} ·{' '}
                  {booking.course?.location ?? 'Location unavailable'}
                </p>
                <p className="muted">
                  Member: {booking.course?.profile?.fullName ?? 'SAIMA member'}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
