import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

import { Button } from '../components/ui/button'
import { api } from '../lib/orpc'

export const Route = createFileRoute('/dashboard/admin/applications')({
  component: AdminApplications,
})

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

function AdminApplications() {
  const [applications, setApplications] = useState<ApplicationRow[]>([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function loadApplications() {
    setLoading(true)
    try {
      const rows = await api.membershipApplications.list()
      setApplications(rows as ApplicationRow[])
      setMessage(`Loaded ${rows.length} applications.`)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Applications could not be loaded.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadApplications()
  }, [])

  async function decideApplication(
    id: string,
    status: 'approved' | 'rejected' | 'needs_info',
  ) {
    try {
      await api.membershipApplications.decide({ id, status })
      await loadApplications()
      setMessage(`Application ${status}.`)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not update application.')
    }
  }

  return (
    <div className="dashboard-section">
      <header className="dashboard-section-header">
        <div>
          <span className="eyebrow">Applications</span>
          <h2>Membership applications</h2>
          <p className="muted">Review pending requests and promote approved applicants.</p>
        </div>
        <Button type="button" onClick={loadApplications}>
          {loading ? 'Loading' : 'Refresh'}
        </Button>
      </header>
      {message ? <p className="muted">{message}</p> : null}
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
    </div>
  )
}
