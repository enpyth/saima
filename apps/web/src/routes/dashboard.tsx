import { Outlet, createFileRoute, useLocation, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

import { Button } from '../components/ui/button'
import { useAuth } from '../components/auth-provider'

export const Route = createFileRoute('/dashboard')({ component: Dashboard })

function Dashboard() {
  const { configured, error, loading, role, user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [message, setMessage] = useState('Loading dashboard')
  const isDashboardIndex = location.pathname === '/dashboard'

  useEffect(() => {
    if (!isDashboardIndex) return
    if (!configured) {
      setMessage('Supabase setup required')
      return
    }
    if (loading) return
    if (!user) {
      setMessage('Sign in to continue')
      return
    }
    if (role) {
      void navigate({ to: `/dashboard/${role}` })
      return
    }
    setMessage(error ? 'Profile unavailable' : 'Role unavailable')
  }, [configured, error, isDashboardIndex, loading, navigate, role, user])

  if (!isDashboardIndex) {
    return <Outlet />
  }

  return (
    <main className="workspace">
      <section className="main-panel">
        <h2>{message}</h2>
        {!configured ? <p>Add Supabase environment values, then restart dev servers.</p> : null}
        {error ? <p>{error}</p> : null}
        {!loading && !user ? (
          <Button asChild>
            <a href="/login">Sign in</a>
          </Button>
        ) : null}
      </section>
    </main>
  )
}
