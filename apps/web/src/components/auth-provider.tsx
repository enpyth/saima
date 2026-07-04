import type { User } from '@supabase/supabase-js'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import { api } from '../lib/orpc'
import { hasSupabaseConfig, supabase } from '../lib/supabase'

export type AuthProfile = {
  id: string
  email: string
  role: 'visitor' | 'member' | 'admin'
  full_name?: string | null
  avatar_url?: string | null
  cover_image_url?: string | null
}

type AuthContextValue = {
  configured: boolean
  loading: boolean
  error: string | null
  user: User | null
  profile: AuthProfile | null
  role: AuthProfile['role'] | null
  refreshProfile: () => Promise<AuthProfile | null>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<AuthProfile | null>(null)
  const [loading, setLoading] = useState(hasSupabaseConfig)
  const [error, setError] = useState<string | null>(null)

  const refreshProfile = useCallback(async () => {
    if (!supabase) {
      setProfile(null)
      return null
    }

    const { data } = await supabase.auth.getSession()
    if (!data.session) {
      setProfile(null)
      return null
    }

    try {
      const synced = (await api.profile.sync()) as AuthProfile | null
      setProfile(synced)
      setError(null)
      return synced
    } catch (syncError) {
      const message = syncError instanceof Error ? syncError.message : 'Profile sync failed.'
      setProfile(null)
      setError(message)
      return null
    }
  }, [])

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    let mounted = true

    async function loadInitialSession() {
      try {
        const { data } = await supabase!.auth.getSession()
        if (!mounted) return

        setUser(data.session?.user ?? null)
        setLoading(false)

        if (data.session) {
          void refreshProfile()
        }
      } catch (sessionError) {
        if (!mounted) return
        setError(sessionError instanceof Error ? sessionError.message : 'Could not load auth session.')
        setLoading(false)
      }
    }

    void loadInitialSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (!session) {
        setProfile(null)
        setError(null)
        setLoading(false)
        return
      }

      void refreshProfile().finally(() => setLoading(false))
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [refreshProfile])

  const value = useMemo<AuthContextValue>(
    () => ({
      configured: hasSupabaseConfig,
      loading,
      error,
      user,
      profile,
      role: profile?.role ?? null,
      refreshProfile,
      signOut: async () => {
        await supabase?.auth.signOut()
        setUser(null)
        setProfile(null)
      },
    }),
    [loading, profile, refreshProfile, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}
