import { createFileRoute } from '@tanstack/react-router'
import type { AdminUser } from '@saima/shared'
import { useEffect, useState } from 'react'

import { Button } from '../components/ui/button'
import { api } from '../lib/orpc'

export const Route = createFileRoute('/dashboard/admin/users')({ component: AdminUsers })

function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function loadUsers() {
    setLoading(true)
    try {
      const rows = await api.adminUsers.list()
      setUsers(rows)
      setMessage(`Loaded ${rows.length} users.`)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Users could not be loaded.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadUsers()
  }, [])

  async function setUserRole(id: string, role: AdminUser['role']) {
    try {
      await api.adminUsers.setRole({ id, role })
      await loadUsers()
      setMessage(`User role updated to ${role}.`)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not update user role.')
    }
  }

  return (
    <div className="dashboard-section">
      <header className="dashboard-section-header">
        <div>
          <span className="eyebrow">Users</span>
          <h2>Users and members</h2>
          <p className="muted">Manage visitors, approved members, and admins.</p>
        </div>
        <Button type="button" onClick={loadUsers}>
          {loading ? 'Loading' : 'Refresh'}
        </Button>
      </header>
      {message ? <p className="muted">{message}</p> : null}
      {users.length === 0 ? (
        <p className="muted">No users loaded.</p>
      ) : (
        <div className="admin-table">
          {users.map((user) => (
            <article className="admin-row" key={user.id}>
              <div>
                <strong>{user.fullName}</strong>
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
    </div>
  )
}
