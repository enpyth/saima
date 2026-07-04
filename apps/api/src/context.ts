import type { Role } from '@saima/shared'

import { env } from './env'
import { syncProfileForUser } from './profile-sync'
import { supabaseAnon } from './supabase'

export type ApiUser = {
  id: string
  email: string
  role: Role
  fullName: string
  avatarUrl: string | null
}

export type ApiContext = {
  user: ApiUser | null
}

export async function createContext(request: Request): Promise<ApiContext> {
  const header = request.headers.get('authorization')
  const token = header?.startsWith('Bearer ') ? header.slice('Bearer '.length) : null

  if (!token) {
    return { user: null }
  }

  const { data, error } = await supabaseAnon.auth.getUser(token)
  if (error || !data.user.email) {
    return { user: null }
  }

  const email = data.user.email.toLowerCase()
  const fullName =
    typeof data.user.user_metadata?.full_name === 'string'
      ? data.user.user_metadata.full_name
      : typeof data.user.user_metadata?.name === 'string'
        ? data.user.user_metadata.name
        : email
  const avatarUrl =
    typeof data.user.user_metadata?.avatar_url === 'string'
      ? data.user.user_metadata.avatar_url
      : typeof data.user.user_metadata?.picture === 'string'
        ? data.user.user_metadata.picture
        : null
  const fallbackRole: Role = env.adminEmails.has(email) ? 'admin' : 'visitor'
  let profile: Awaited<ReturnType<typeof syncProfileForUser>> = null

  try {
    profile = await syncProfileForUser(data.user)
  } catch (error) {
    console.error('Profile sync failed during request context creation:', error)
  }

  return {
    user: {
      id: data.user.id,
      email,
      role: profile?.role ?? fallbackRole,
      fullName: profile?.full_name ?? fullName,
      avatarUrl: profile?.avatar_url ?? avatarUrl,
    },
  }
}
