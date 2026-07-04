import type { User } from '@supabase/supabase-js'
import type { Role } from '@saima/shared'

import { env } from './env'
import { supabaseAdmin } from './supabase'

type ProfileRow = {
  id: string
  email: string
  role: Role
  full_name: string
  avatar_url: string | null
}

function getDisplayName(user: User, email: string) {
  const name = user.user_metadata?.full_name ?? user.user_metadata?.name
  return typeof name === 'string' && name.trim() ? name : email
}

function getAvatarUrl(user: User) {
  const image = user.user_metadata?.avatar_url ?? user.user_metadata?.picture
  return typeof image === 'string' && image.trim() ? image : null
}

export async function syncProfileForUser(user: User): Promise<ProfileRow | null> {
  if (!user.email) {
    return null
  }

  const email = user.email.toLowerCase()
  const isAdminEmail = env.adminEmails.has(email)

  const { data: existing, error: selectError } = await supabaseAdmin
    .from('profiles')
    .select('id,email,role,full_name,avatar_url')
    .eq('id', user.id)
    .maybeSingle()

  if (selectError) {
    throw selectError
  }

  const role: Role = existing?.role
    ? isAdminEmail && existing.role !== 'admin'
      ? 'admin'
      : existing.role
    : isAdminEmail
      ? 'admin'
      : 'visitor'

  const payload = {
    id: user.id,
    email,
    full_name: existing?.full_name ?? getDisplayName(user, email),
    avatar_url: existing?.avatar_url ?? getAvatarUrl(user),
    role,
  }

  const { data, error } = await supabaseAdmin
    .from('profiles')
    .upsert(payload, { onConflict: 'id' })
    .select('id,email,role,full_name,avatar_url')
    .single()

  if (error) {
    throw error
  }

  return data as ProfileRow
}
