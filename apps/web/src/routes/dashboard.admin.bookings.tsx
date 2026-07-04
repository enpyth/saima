import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

import { CourseSlotBoard } from '../components/course-slot-board'
import { Button } from '../components/ui/button'
import { api } from '../lib/orpc'
import { toDateKey, type SlotBoardCourse } from '../lib/slot-board'

export const Route = createFileRoute('/dashboard/admin/bookings')({ component: AdminBookings })

function AdminBookings() {
  const [courses, setCourses] = useState<SlotBoardCourse[]>([])
  const [selectedDateKey, setSelectedDateKey] = useState(() => toDateKey(new Date()))
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function loadCourses() {
    setLoading(true)
    try {
      const rows = await api.courses.listAll()
      setCourses(rows as SlotBoardCourse[])
      setMessage(`Loaded ${rows.length} courses.`)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not load course operations.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadCourses()
  }, [])

  return (
    <div className="dashboard-section">
      <header className="dashboard-section-header">
        <div>
          <span className="eyebrow">Bookings</span>
          <h2>Course booking operations</h2>
          <p className="muted">
            View all member courses and slot status by date.
          </p>
        </div>
        <Button type="button" onClick={loadCourses}>
          {loading ? 'Loading' : 'Refresh'}
        </Button>
      </header>
      {message ? <p className="muted">{message}</p> : null}
      <CourseSlotBoard
        courses={courses}
        mode="admin"
        selectedDateKey={selectedDateKey}
        onDateChange={setSelectedDateKey}
      />
    </div>
  )
}
