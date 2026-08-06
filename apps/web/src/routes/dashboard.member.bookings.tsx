import { createFileRoute } from '@tanstack/react-router'
import type { BookingWithDetails } from '@saima/shared'
import { useEffect, useState } from 'react'

import { Button } from '../components/ui/button'
import { formatDateTime } from '../lib/date-format'
import { api } from '../lib/orpc'

export const Route = createFileRoute('/dashboard/member/bookings')({ component: MemberBookings })

function MemberBookings() {
  const [bookings, setBookings] = useState<BookingWithDetails[]>([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function loadBookings() {
    setLoading(true)
    try {
      const rows = await api.bookings.forMember()
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
          <h2>Bookings received</h2>
          <p className="muted">Review visitor reservations for your courses.</p>
        </div>
        <Button type="button" onClick={loadBookings}>
          {loading ? 'Loading' : 'Refresh'}
        </Button>
      </header>
      {message ? <p className="muted">{message}</p> : null}
      {bookings.length === 0 ? (
        <p className="muted">No visitor bookings yet.</p>
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
                  Visitor: {booking.profile?.fullName ?? 'Unknown'} ({booking.profile?.email ?? 'no email'})
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
