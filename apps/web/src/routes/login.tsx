import { createFileRoute } from '@tanstack/react-router'
import { Mail } from 'lucide-react'
import { useState } from 'react'

import { Button } from '../components/ui/button'
import { authRedirectTo, hasSupabaseConfig, supabase } from '../lib/supabase'

export const Route = createFileRoute('/login')({ component: Login })

function Login() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  async function signInWithGoogle() {
    if (!supabase) return
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: authRedirectTo,
      },
    })
  }

  async function sendMagicLink() {
    if (!supabase) return
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: authRedirectTo,
      },
    })
    setMessage(error ? error.message : 'Check your email for the SAIMA sign-in link.')
  }

  return (
    <main>
      <section className="page-hero">
        <span className="eyebrow">Sign in</span>
        <h2>Use Google or an email magic link.</h2>
        <p>
          Sign in to apply for membership, book courses, manage your profile, or access member and
          admin tools.
        </p>

        <div className="auth-box">
          {!hasSupabaseConfig ? (
            <p className="muted">
              Add Supabase values to `apps/web/.env` before authentication can run.
            </p>
          ) : null}
          <div className="form">
            <Button type="button" onClick={signInWithGoogle}>
              Continue with Google
            </Button>
            <div className="field">
              <label htmlFor="email">Email magic link</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.currentTarget.value)}
                placeholder="you@example.com"
              />
            </div>
            <Button type="button" variant="outline" onClick={sendMagicLink}>
              <Mail size={18} /> Send magic link
            </Button>
            {message ? <p className="muted">{message}</p> : null}
          </div>
        </div>
      </section>
    </main>
  )
}
