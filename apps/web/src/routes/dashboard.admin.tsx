import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

import { MediaUpload } from '../components/media-upload'
import { RoleGate } from '../components/role-gate'
import { Button } from '../components/ui/button'
import { api } from '../lib/orpc'

export const Route = createFileRoute('/dashboard/admin')({ component: AdminDashboard })

type ApplicationRow = {
  id: string
  user_id: string
  full_name: string
  email: string
  instruments: string[]
  experience: string
  motivation: string
  status: 'pending' | 'approved' | 'rejected' | 'needs_info'
  created_at: string
  profiles?: {
    id: string
    email: string
    full_name: string
    role: 'visitor' | 'member' | 'admin'
  } | null
}

type UserRow = {
  id: string
  email: string
  full_name: string
  role: 'visitor' | 'member' | 'admin'
  public_profile: boolean
  created_at: string
}

function AdminDashboard() {
  const [message, setMessage] = useState('')
  const [eventId, setEventId] = useState('')
  const [eventCoverUrl, setEventCoverUrl] = useState('')
  const [applications, setApplications] = useState<ApplicationRow[]>([])
  const [users, setUsers] = useState<UserRow[]>([])
  const [loading, setLoading] = useState(false)

  async function loadAdminData() {
    setLoading(true)
    try {
      const [applications, users] = await Promise.all([
        api.membershipApplications.list(),
        api.adminUsers.list(),
      ])
      setApplications(applications as ApplicationRow[])
      setUsers(users as UserRow[])
      setMessage(`Loaded ${applications.length} applications and ${users.length} users.`)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Admin data could not be loaded.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadAdminData()
  }, [])

  async function decideApplication(
    id: string,
    status: 'approved' | 'rejected' | 'needs_info',
  ) {
    try {
      await api.membershipApplications.decide({ id, status })
      await loadAdminData()
      setMessage(`Application ${status}.`)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not update application.')
    }
  }

  async function setUserRole(id: string, role: UserRow['role']) {
    try {
      await api.adminUsers.setRole({ id, role })
      await loadAdminData()
      setMessage(`User role updated to ${role}.`)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not update user role.')
    }
  }

  return (
    <RoleGate allowed={['admin']}>
      <main className="workspace">
        <aside className="sidebar">
          <span className="eyebrow">Admin</span>
          <p className="muted">Manage SAIMA operations, people, and permissions.</p>
        </aside>
        <section className="main-panel">
          <h2>Admin dashboard</h2>
          <div className="actions">
            <Button type="button" onClick={loadAdminData}>
              {loading ? 'Loading' : 'Load admin data'}
            </Button>
          </div>
          {message ? <p className="muted">{message}</p> : null}
          <div className="panel-grid">
            <section className="panel panel-wide">
              <h3>Membership applications</h3>
              {applications.length === 0 ? (
                <p className="muted">No applications loaded.</p>
              ) : (
                <div className="admin-table">
                  {applications.map((application) => (
                    <article className="admin-row" key={application.id}>
                      <div>
                        <strong>{application.full_name}</strong>
                        <p className="muted">
                          {application.email} · {application.status}
                        </p>
                        <p>{application.motivation}</p>
                        <p className="muted">
                          Instruments: {application.instruments?.join(', ') || 'Not provided'}
                        </p>
                      </div>
                      <div className="admin-actions">
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => decideApplication(application.id, 'approved')}
                          disabled={application.status === 'approved'}
                        >
                          Approve
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => decideApplication(application.id, 'needs_info')}
                          disabled={application.status === 'needs_info'}
                        >
                          Need info
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => decideApplication(application.id, 'rejected')}
                          disabled={application.status === 'rejected'}
                        >
                          Reject
                        </Button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
            <section className="panel panel-wide">
              <h3>Users and members</h3>
              <p className="muted">Manage visitors, approved members, and admins.</p>
              {users.length === 0 ? (
                <p className="muted">No users loaded.</p>
              ) : (
                <div className="admin-table">
                  {users.map((user) => (
                    <article className="admin-row" key={user.id}>
                      <div>
                        <strong>{user.full_name}</strong>
                        <p className="muted">
                          {user.email} · current role: {user.role}
                        </p>
                      </div>
                      <div className="admin-actions">
                        {(['visitor', 'member', 'admin'] as const).map((role) => (
                          <Button
                            key={role}
                            type="button"
                            size="sm"
                            variant={user.role === role ? 'default' : 'outline'}
                            onClick={() => setUserRole(user.id, role)}
                            disabled={user.role === role}
                          >
                            {role}
                          </Button>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
            <section className="panel">
              <h3>Events</h3>
              <p>Create public events visible to visitors before login.</p>
              <div className="field">
                <label htmlFor="eventId">Event ID for cover upload</label>
                <input
                  id="eventId"
                  value={eventId}
                  onChange={(event) => setEventId(event.currentTarget.value)}
                  placeholder="Existing event UUID"
                />
              </div>
              <MediaUpload
                label="Event cover image"
                purpose="event-cover"
                onUploaded={async ({ key, publicUrl }) => {
                  if (!eventId) {
                    setMessage('Enter an event ID before uploading a cover.')
                    return
                  }
                  await api.events.setCover({
                    id: eventId,
                    coverImageKey: key,
                    coverImageUrl: publicUrl,
                  })
                  setEventCoverUrl(publicUrl)
                  setMessage('Event cover updated.')
                }}
              />
              {eventCoverUrl ? (
                <img className="media-preview" src={eventCoverUrl} alt="Uploaded event cover" />
              ) : null}
            </section>
            <section className="panel">
              <h3>Bookings</h3>
              <p>Monitor course bookings and member availability.</p>
            </section>
          </div>
        </section>
      </main>
    </RoleGate>
  )
}
