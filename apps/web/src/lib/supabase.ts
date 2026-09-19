import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined
const isBrowser = typeof window !== 'undefined'

export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey)

export const supabase = isBrowser && hasSupabaseConfig
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null

export function authRedirectTo(redirect?: string) {
  const url = new URL('/auth/callback', window.location.origin)

  if (redirect) {
    url.searchParams.set('redirect', redirect)
  }

  return url.toString()
}