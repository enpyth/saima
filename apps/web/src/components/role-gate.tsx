import type { AuthProfile } from './auth-provider'
import { useAuth } from './auth-provider'
import { Button } from './ui/button'

export function RoleGate({
  allowed,
  children,
}: {
  allowed: Array<AuthProfile['role']>
  children: React.ReactNode
}) {
  const { configured, error, loading, role } = useAuth()

  if (!configured) {
    return (
      <main className="workspace">
        <section className="main-panel">
          <h2>Supabase setup required</h2>
          <p>Add Supabase values to the web and API environment files, then restart dev servers.</p>
        </section>
      </main>
    )
  }

  if (loading) {
    return (
      <main className="workspace">
        <section className="main-panel">
          <h2>Loading dashboard</h2>
        </section>
      </main>
    )
  }

  if (!role) {
    return (
      <main className="workspace">
        <section className="main-panel">
          <h2>{error ? 'Profile unavailable' : 'Sign in required'}</h2>
          <p>{error || 'You need to sign in before opening this dashboard.'}</p>
          {error ? null : (
            <Button asChild>
              <a href="/login">Sign in</a>
            </Button>
          )}
        </section>
      </main>
    )
  }

  if (!allowed.includes(role)) {
    return (
      <main className="workspace">
        <section className="main-panel">
          <h2>Access limited</h2>
          <p>Your current role is `{role}`. Open your assigned dashboard instead.</p>
          <Button asChild>
            <a href={`/dashboard/${role}`}>Open my dashboard</a>
          </Button>
        </section>
      </main>
    )
  }

  return <>{children}</>
}
