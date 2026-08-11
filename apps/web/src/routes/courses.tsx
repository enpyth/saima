import { createFileRoute, redirect } from '@tanstack/react-router'
import type { CourseWithSlots } from '@saima/shared'
import { useEffect, useState } from 'react'
import { ArrowDown, LayoutDashboard, Search } from 'lucide-react'

import { Button } from '../components/ui/button'
import { CourseSlotBoard } from '../components/course-slot-board'
import { useAuth } from '../components/auth-provider'
import { useLanguage } from '../components/language-provider'
import { coursesContent } from '../content/courses'
import { isPublicRouteEnabled, siteImages } from '../content/shared'
import { api } from '../lib/orpc'
import { getSlotsByIds, toDateKey } from '../lib/slot-board'

export const Route = createFileRoute('/courses')({
  beforeLoad: () => {
    if (!isPublicRouteEnabled('/courses')) {
      throw redirect({ to: '/', replace: true })
    }
  },
  component: Courses,
})

function Courses() {
  const { user } = useAuth()
  const { language } = useLanguage()
  const content = coursesContent[language]
  const [courses, setCourses] = useState<CourseWithSlots[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [selectedDateKey, setSelectedDateKey] = useState(() => toDateKey(new Date()))
  const [selectedSlotIds, setSelectedSlotIds] = useState<string[]>([])

  async function loadCourses() {
    setLoading(true)
    try {
      const rows = await api.courses.listPublic()
      setCourses(rows)
      setSelectedSlotIds((current) =>
        getSlotsByIds(rows, current).map((item) => item.slot.id),
      )
    } catch (error) {
      setMessage(error instanceof Error ? error.message : content.states.loadFailed)
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
      setMessage(content.states.selectRequired)
      return
    }

    try {
      await Promise.all(selectedSlotIds.map((slotId) => api.bookings.create({ slotId })))
      setMessage(`${selectedSlotIds.length} ${content.states.bookedSuffix}`)
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
        <span className="eyebrow">{content.hero.eyebrow}</span>
        <h1>
          {content.hero.title} <span>{content.hero.titleAccent}</span>
        </h1>
        <p>{content.hero.text}</p>
        <div className="actions">
          <Button asChild>
            <a href="#browse-courses">
              {content.hero.browseAction} <ArrowDown size={16} />
            </a>
          </Button>
          <Button asChild variant="outline">
            <a href="/dashboard">
              {content.hero.dashboardAction} <LayoutDashboard size={16} />
            </a>
          </Button>
        </div>
        </div>
        <img src={siteImages.mandateLesson} alt={content.hero.imageAlt} />
      </section>

      <section className="course-filter-strip" aria-label={content.filterAriaLabel}>
        <div>
          <Search size={18} aria-hidden="true" />
          <span>{content.filter}</span>
        </div>
      </section>

      <section className="public-section" id="browse-courses">
        {message ? <p className="muted">{message}</p> : null}
        {loading ? <p className="muted">{content.states.loading}</p> : null}
        {!loading && courses.length === 0 ? (
          <p className="muted">{content.states.empty}</p>
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
          confirmLabel={user ? content.states.confirmSignedIn : content.states.confirmSignedOut}
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
                    {course.level} · {course.location} · {content.states.hostLabel}:{' '}
                    {course.profile?.fullName ?? content.states.hostFallback}
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
