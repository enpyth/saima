import { z } from 'zod'

import { syncProfileForUser } from '../profile-sync'
import { supabaseAdmin } from '../supabase'
import { authed } from './procedures'
import { text } from './schemas'
import { getRows } from './supabase-result'

export const profileRouter = {
  sync: authed.handler(async ({ context }) => {
    const { data, error } = await supabaseAdmin.auth.admin.getUserById(context.user.id)
    if (!error && data.user) {
      try {
        const profile = await syncProfileForUser(data.user)
        if (profile) {
          return profile
        }
      } catch (syncError) {
        console.error('Profile sync failed:', syncError)
      }
    }

    return {
      id: context.user.id,
      email: context.user.email,
      role: context.user.role,
      full_name: context.user.fullName,
      avatar_url: context.user.avatarUrl,
    }
  }),
  me: authed.handler(({ context }) =>
    getRows(
      supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', context.user.id)
        .single(),
    ),
  ),
  update: authed
    .input(
      z.object({
        fullName: text,
        phone: z.string().trim().optional(),
        instruments: z.array(text).default([]),
        bio: z.string().trim().optional(),
        countryOrRegion: z.string().trim().optional(),
        publicProfile: z.boolean().default(false),
      }),
    )
    .handler(({ context, input }) =>
      getRows(
        supabaseAdmin
          .from('profiles')
          .update({
            full_name: input.fullName,
            phone: input.phone ?? null,
            instruments: input.instruments,
            bio: input.bio ?? null,
            country_or_region: input.countryOrRegion ?? null,
            public_profile: input.publicProfile,
          })
          .eq('id', context.user.id)
          .select()
          .single(),
      ),
    ),
  updateMedia: authed
    .input(
      z.object({
        avatarKey: z.string().trim().optional(),
        avatarUrl: z.string().url().optional(),
        coverImageKey: z.string().trim().optional(),
        coverImageUrl: z.string().url().optional(),
      }),
    )
    .handler(({ context, input }) =>
      getRows(
        supabaseAdmin
          .from('profiles')
          .update({
            avatar_key: input.avatarKey,
            avatar_url: input.avatarUrl,
            cover_image_key: input.coverImageKey,
            cover_image_url: input.coverImageUrl,
          })
          .eq('id', context.user.id)
          .select()
          .single(),
      ),
    ),
}
