import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

import { Button } from '../components/ui/button'
import { api } from '../lib/orpc'

export const Route = createFileRoute('/dashboard/member/courses')({ component: MemberCourses })

type MemberCourse = {
  id: string
  title: string
  summary: string
  instrument: string
  level: string
  location: string
  status: 'draft' | 'published' | 'archived'
  course_slots: Array<{
    id: string
    starts_at: string
    ends_at: string
    status: 'available' | 'booked'
  }>
}

function MemberCourses() {
  const [courses, setCourses] = useState<MemberCourse[]>([])
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [instrument, setInstrument] = useState('')
  const [level, setLevel] = useState('All levels')
  const [location, setLocation] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function loadCourses() {
    setLoading(true)
    try {
      const rows = await api.courses.listMine()
      const nextCourses = rows as MemberCourse[]
      setCourses(nextCourses)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not load courses.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadCourses()
  }, [])

  async function createCourse() {
    try {
      await api.courses.create({
        title,
        summary,
        instrument,
        level,
        location,
        status: 'published',
      })
      setTitle('')
      setSummary('')
      setInstrument('')
      setLevel('All levels')
      setLocation('')
      await loadCourses()
      setMessage('Course published.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not publish course.')
    }
  }

  async function setCourseStatus(id: string, status: MemberCourse['status']) {
    try {
      await api.courses.setStatus({ id, status })
      await loadCourses()
      setMessage(`Course set to ${status}.`)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not update course.')
    }
  }

  return (
    <div className="dashboard-section">
      <header className="dashboard-section-header">
        <div>
          <span className="eyebrow">Courses</span>
          <h2>Courses</h2>
          <p className="muted">Publish and manage the courses visitors can book.</p>
        </div>
        <Button type="button" onClick={loadCourses}>
          {loading ? 'Loading' : 'Refresh'}
        </Button>
      </header>
      {message ? <p className="muted">{message}</p> : null}
      <div className="dashboard-section narrow">
        <section className="panel">
          <h3>Publish course</h3>
          <form className="form">
            <div className="field">
              <label htmlFor="title">Course title</label>
              <input id="title" value={title} onChange={(event) => setTitle(event.currentTarget.value)} />
            </div>
            <div className="field">
              <label htmlFor="summary">Summary</label>
              <textarea id="summary" value={summary} onChange={(event) => setSummary(event.currentTarget.value)} />
            </div>
            <div className="field">
              <label htmlFor="instrument">Instrument or focus</label>
              <input id="instrument" value={instrument} onChange={(event) => setInstrument(event.currentTarget.value)} />
            </div>
            <div className="field">
              <label htmlFor="level">Level</label>
              <input id="level" value={level} onChange={(event) => setLevel(event.currentTarget.value)} />
            </div>
            <div className="field">
              <label htmlFor="location">Location</label>
              <input id="location" value={location} onChange={(event) => setLocation(event.currentTarget.value)} />
            </div>
            <Button type="button" onClick={createCourse}>
              Publish course
            </Button>
          </form>
        </section>
      </div>

      <section className="dashboard-list-section">
        <h3>My courses</h3>
        {courses.length === 0 ? (
          <p className="muted">No courses published yet.</p>
        ) : (
          <div className="admin-table">
            {courses.map((course) => (
              <article className="admin-row" key={course.id}>
                <div>
                  <strong>{course.title}</strong>
                  <p className="muted">
                    {course.instrument} · {course.level} · {course.location} · {course.status}
                  </p>
                  <p>{course.summary}</p>
                </div>
                <div className="admin-actions">
                  {(['published', 'draft', 'archived'] as const).map((status) => (
                    <Button
                      key={status}
                      type="button"
                      size="sm"
                      variant={course.status === status ? 'default' : 'outline'}
                      onClick={() => setCourseStatus(course.id, status)}
                      disabled={course.status === status}
                    >
                      {status}
                    </Button>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
