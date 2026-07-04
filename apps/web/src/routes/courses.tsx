import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

import { useAuth } from '../components/auth-provider'
import { Button } from '../components/ui/button'
import { courseSlots } from '../lib/content'
import { api } from '../lib/orpc'

export const Route = createFileRoute('/courses')({ component: Courses })

function Courses() {
  const { user } = useAuth()
  const [liveSlots, setLiveSlots] = useState<
    Array<{
      id: string
      title: string
      starts_at: string
      ends_at: string
      location: string
      capacity: number
    }>
  >([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function loadSlots() {
      try {
        const slots = await api.availabilitySlots.listPublic()
        setLiveSlots(slots as typeof liveSlots)
      } catch {
        setLiveSlots([])
      }
    }

    void loadSlots()
  }, [])

  async function bookSlot(slotId: string) {
    try {
      await api.bookings.create({ slotId })
      setMessage('Booking confirmed. You can review it in your dashboard.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not book this slot.')
    }
  }

  const displaySlots =
    liveSlots.length > 0
      ? liveSlots.map((slot) => ({
          id: slot.id,
          title: slot.title,
          host: slot.location,
          time: new Intl.DateTimeFormat(undefined, {
            dateStyle: 'medium',
            timeStyle: 'short',
          }).format(new Date(slot.starts_at)),
          live: true,
        }))
      : courseSlots.map((slot) => ({
          ...slot,
          id: slot.title,
          live: false,
        }))

  return (
    <main>
      <section className="page-hero">
        <span className="eyebrow">Courses</span>
        <h2>Browse lessons, coaching, and member-led learning opportunities.</h2>
        <p>
          Visitors can browse public availability without login. Booking requires sign-in so each
          visitor can manage upcoming sessions and history.
        </p>
      </section>
      <section className="section">
        {message ? <p className="muted">{message}</p> : null}
        <div className="plain-list">
          {displaySlots.map((slot) => (
            <article className="list-row" key={slot.title}>
              <strong>{slot.time}</strong>
              <div>
                <h3>{slot.title}</h3>
                <p className="muted">{slot.host}</p>
                {!user ? (
                  <Button asChild>
                    <a href="/login">Sign in to book</a>
                  </Button>
                ) : slot.live ? (
                  <Button type="button" onClick={() => bookSlot(slot.id)}>
                    Book slot
                  </Button>
                ) : (
                  <p className="muted">Live booking opens when members publish availability.</p>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
