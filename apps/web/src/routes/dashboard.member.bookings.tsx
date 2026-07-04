import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

import { Button } from '../components/ui/button'
import { formatDateTime } from '../lib/date-format'
import { api } from '../lib/orpc'

export const Route = createFileRoute('/dashboard/member/bookings')({ component: MemberBookings })

type MemberBooking = {
  id: string
  status: string
  created_at: string
  profiles?: {
    full_name: string
    email: string
  } | null
  courses?: {
    title: string
    location: string
  } | null
  course_slots?: {
    starts_at: string
    ends_at: string
    status: string
  } | null
}

function MemberBookings() {
  const [bookings, setBookings] = useState<MemberBooking[]>([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function loadBookings() {
    setLoading(true)
    try {
      const rows = await api.bookings.forMember()
      setBookings(rows as MemberBooking[])
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
                <strong>{booking.courses?.title ?? 'Course'}</strong>
                <p className="muted">
                  {formatDateTime(booking.course_slots?.starts_at)} · {booking.status}
                </p>
                <p>
                  Visitor: {booking.profiles?.full_name ?? 'Unknown'} ({booking.profiles?.email ?? 'no email'})
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
