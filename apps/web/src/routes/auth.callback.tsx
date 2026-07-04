import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

import { api } from '../lib/orpc'
import { supabase } from '../lib/supabase'

export const Route = createFileRoute('/auth/callback')({ component: AuthCallback })

function AuthCallback() {
  const navigate = useNavigate()
  const [message, setMessage] = useState('Completing sign-in...')

  useEffect(() => {
    async function finish() {
      if (!supabase) {
        setMessage('Supabase is not configured.')
        return
      }
      const { error } = await supabase.auth.getSession()
      if (error) {
        setMessage(error.message)
        return
      }
      await api.profile.sync()
      await navigate({ to: '/dashboard' })
    }
    void finish()
  }, [navigate])

  return (
    <main>
      <section className="page-hero">
        <span className="eyebrow">Auth</span>
        <h2>{message}</h2>
      </section>
    </main>
  )
}
