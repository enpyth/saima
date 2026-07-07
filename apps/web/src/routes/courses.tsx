import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { ArrowDown, LayoutDashboard, Search } from 'lucide-react'

import { Button } from '../components/ui/button'
import { CourseSlotBoard } from '../components/course-slot-board'
import { useAuth } from '../components/auth-provider'
import { siteImages } from '../lib/content'
import { api } from '../lib/orpc'
import { getSlotsByIds, toDateKey } from '../lib/slot-board'

export const Route = createFileRoute('/courses')({ component: Courses })

type PublicCourse = {
  id: string
  title: string
  summary: string
  instrument: string
  level: string
  location: string
  profiles?: {
    full_name: string
    avatar_url?: string | null
  } | null
  course_slots: Array<{
    id: string
    starts_at: string
    ends_at: string
    status: 'available' | 'booked'
  }>
}

function Courses() {
  const { user } = useAuth()
  const [courses, setCourses] = useState<PublicCourse[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [selectedDateKey, setSelectedDateKey] = useState(() => toDateKey(new Date()))
  const [selectedSlotIds, setSelectedSlotIds] = useState<string[]>([])

  async function loadCourses() {
    setLoading(true)
    try {
      const rows = await api.courses.listPublic()
      setCourses(rows as PublicCourse[])
      setSelectedSlotIds((current) =>
        getSlotsByIds(rows as PublicCourse[], current).map((item) => item.slot.id),
      )
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not load courses.')
      setCourses([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadCourses()
  }, [])

  async function confirmBooking() {
    if (!user) {
      window.location.href = '/login'
      return
    }

    if (selectedSlotIds.length === 0) {
      setMessage('Select at least one slot before confirming.')
      return
    }

    try {
      await Promise.all(selectedSlotIds.map((slotId) => api.bookings.create({ slotId })))
      setMessage(`${selectedSlotIds.length} bookings confirmed. You can review them in your dashboard.`)
      setSelectedSlotIds([])
      await loadCourses()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not book this slot.')
    }
  }

  function toggleSlot(slotId: string) {
    setSelectedSlotIds((current) =>
      current.includes(slotId)
        ? current.filter((selected) => selected !== slotId)
        : [...current, slotId],
    )
  }

  return (
    <main className="public-page">
      <section className="courses-hero">
        <div>
        <span className="eyebrow">Courses</span>
        <h1>
          Refine your art with <span>global maestros.</span>
        </h1>
        <p>
          Browse published courses from SAIMA members. Sign in to reserve an available time and
          manage your booking history from the visitor dashboard.
        </p>
        <div className="actions">
          <Button asChild>
            <a href="#browse-courses">
              Browse courses <ArrowDown size={16} />
            </a>
          </Button>
          <Button asChild variant="outline">
            <a href="/dashboard">
              Dashboard <LayoutDashboard size={16} />
            </a>
          </Button>
        </div>
        </div>
        <img src={siteImages.mandateLesson} alt="Member-led music lesson" />
      </section>

      <section className="course-filter-strip" aria-label="Course search preview">
        <div>
          <Search size={18} aria-hidden="true" />
          <span>Filter by instrument, level, host, or available time from the live booking board.</span>
        </div>
      </section>

      <section className="public-section" id="browse-courses">
        {message ? <p className="muted">{message}</p> : null}
        {loading ? <p className="muted">Loading courses...</p> : null}
        {!loading && courses.length === 0 ? (
          <p className="muted">No published courses are available yet.</p>
        ) : null}
        <CourseSlotBoard
          courses={courses}
          mode="booking"
          selectedDateKey={selectedDateKey}
          selectedSlotIds={selectedSlotIds}
          onDateChange={(dateKey) => {
            setSelectedDateKey(dateKey)
            setSelectedSlotIds([])
          }}
          onSlotToggle={toggleSlot}
          onConfirm={confirmBooking}
          confirmLabel={user ? 'Confirm selected bookings' : 'Sign in to book'}
        />
        {courses.length > 0 ? (
          <div className="course-card-grid">
            {courses.map((course) => (
              <article className="course-card" key={course.id}>
                <div>
                  <span className="eyebrow">{course.instrument}</span>
                  <h3>{course.title}</h3>
                  <p>{course.summary}</p>
                  <p className="muted">
                    {course.level} · {course.location} · Host:{' '}
                    {course.profiles?.full_name ?? 'SAIMA member'}
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </main>
  )
}
