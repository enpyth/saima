import { createFileRoute } from '@tanstack/react-router'
import type { CourseWithSlots } from '@saima/shared'
import { CalendarDays } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '../components/ui/button'
import { formatDateTime } from '../lib/date-format'
import { api } from '../lib/orpc'
import {
  buildAvailabilityDraftCells,
  buildDateOptions,
  toDateKey,
  toLocalSlotIso,
} from '../lib/slot-board'

export const Route = createFileRoute('/dashboard/member/availability')({
  component: MemberAvailability,
})

function MemberAvailability() {
  const [courses, setCourses] = useState<CourseWithSlots[]>([])
  const [slotCourseId, setSlotCourseId] = useState('')
  const [availabilityDateKey, setAvailabilityDateKey] = useState(() => toDateKey(new Date()))
  const [selectedTimeKeys, setSelectedTimeKeys] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const todayKey = toDateKey(new Date())
  const availabilityDates = buildDateOptions(todayKey, 7)
  const selectedCourse = courses.find((course) => course.id === slotCourseId)
  const availabilityCells = buildAvailabilityDraftCells({
    dateKey: availabilityDateKey,
    existingSlots: selectedCourse?.courseSlots ?? [],
    selectedTimeKeys,
    startHour: 8,
    endHour: 22,
  })

  async function loadCourses() {
    setLoading(true)
    try {
      const rows = await api.courses.listMine()
      setCourses(rows)
      if (!slotCourseId && rows[0]) {
        setSlotCourseId(rows[0].id)
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not load courses.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadCourses()
  }, [])

  async function publishSlots() {
    if (!slotCourseId) {
      setMessage('Select a course before publishing availability.')
      return
    }

    if (selectedTimeKeys.length === 0) {
      setMessage('Select at least one time slot.')
      return
    }

    const selectedCount = selectedTimeKeys.length

    try {
      await api.courseSlots.createMany({
        courseId: slotCourseId,
        startsAt: selectedTimeKeys.map((timeKey) => toLocalSlotIso(availabilityDateKey, timeKey)),
      })
      setSelectedTimeKeys([])
      await loadCourses()
      setMessage(`${selectedCount} availability slots published.`)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not publish availability.')
    }
  }

  function toggleTimeKey(timeKey: string) {
    setSelectedTimeKeys((current) =>
      current.includes(timeKey)
        ? current.filter((selected) => selected !== timeKey)
        : [...current, timeKey].sort(),
    )
  }

  async function cancelSlot(id: string) {
    try {
      await api.courseSlots.cancel({ id })
      await loadCourses()
      setMessage('Slot removed.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not cancel slot.')
    }
  }

  return (
    <div className="dashboard-section">
      <header className="dashboard-section-header">
        <div>
          <span className="eyebrow">Availability</span>
          <h2>Publish availability</h2>
          <p className="muted">Select half-hour blocks visitors can book for a course.</p>
        </div>
        <Button type="button" onClick={loadCourses}>
          {loading ? 'Loading' : 'Refresh'}
        </Button>
      </header>
      {message ? <p className="muted">{message}</p> : null}

      <section className="panel panel-wide">
        <form className="form form-wide">
          <div className="field">
            <label htmlFor="slotCourse">Course</label>
            <select
              id="slotCourse"
              value={slotCourseId}
              onChange={(event) => {
                setSlotCourseId(event.currentTarget.value)
                setSelectedTimeKeys([])
              }}
            >
              <option value="">Select a course</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>

          <div className="member-availability-picker">
            <div className="date-jump">
              <CalendarDays aria-hidden="true" size={18} />
              <input
                aria-label="Choose availability date"
                type="date"
                value={availabilityDateKey}
                onChange={(event) => {
                  setAvailabilityDateKey(event.currentTarget.value)
                  setSelectedTimeKeys([])
                }}
              />
            </div>
            <div className="slot-date-strip" aria-label="Select availability date">
              {availabilityDates.map((date) => (
                <Button
                  key={date.key}
                  type="button"
                  size="sm"
                  variant={availabilityDateKey === date.key ? 'default' : 'outline'}
                  onClick={() => {
                    setAvailabilityDateKey(date.key)
                    setSelectedTimeKeys([])
                  }}
                >
                  {date.key === todayKey ? 'Today' : date.label}
                </Button>
              ))}
            </div>
            <div className="availability-grid" aria-label="Select availability times">
              {availabilityCells.map((cell) => (
                <button
                  key={cell.timeKey}
                  type="button"
                  className={`availability-cell ${cell.status}`}
                  disabled={!cell.selectable}
                  onClick={() => toggleTimeKey(cell.timeKey)}
                  aria-label={`${cell.timeKey} ${cell.status}`}
                >
                  <span>{cell.timeKey}</span>
                </button>
              ))}
            </div>
            <div className="slot-legend">
              <span>
                <i className="slot-swatch available" /> Available
              </span>
              <span>
                <i className="slot-swatch booked" /> Booked
              </span>
              <span>
                <i className="slot-swatch selected" /> Selected
              </span>
            </div>
          </div>

          <Button type="button" onClick={publishSlots} disabled={!slotCourseId || selectedTimeKeys.length === 0}>
            Publish {selectedTimeKeys.length || ''} selected slots
          </Button>
        </form>
      </section>

      <section className="dashboard-list-section">
        <h3>Published slots</h3>
        {courses.length === 0 ? (
          <p className="muted">No courses available for scheduling yet.</p>
        ) : (
          <div className="admin-table">
            {courses.map((course) => (
              <article className="admin-row" key={course.id}>
                <div>
                  <strong>{course.title}</strong>
                  <p className="muted">
                    {course.instrument} · {course.level} · {course.location} · {course.status}
                  </p>
                  <div className="slot-list compact">
                    {course.courseSlots.length === 0 ? (
                      <span className="muted">No upcoming slots.</span>
                    ) : (
                      course.courseSlots.map((slot) => (
                        <div className="slot-row" key={slot.id}>
                          <span>
                            {formatDateTime(slot.startsAt)} · {slot.status}
                          </span>
                          {slot.status === 'available' ? (
                            <Button type="button" size="sm" variant="outline" onClick={() => cancelSlot(slot.id)}>
                              Cancel
                            </Button>
                          ) : null}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
