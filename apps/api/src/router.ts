import { ORPCError, os } from '@orpc/server'
import type { Role } from '@saima/shared'
import { z } from 'zod'

import type { ApiContext } from './context'
import { createPresignedUploadUrl, getPublicR2Url } from './r2'
import { syncProfileForUser } from './profile-sync'
import { supabaseAdmin } from './supabase'

const authed = os.$context<ApiContext>().use(({ context, next }) => {
  if (!context.user) {
    throw new ORPCError('UNAUTHORIZED')
  }
  return next({
    context: {
      user: context.user,
    },
  })
})

const requireRole = (roles: Role[]) =>
  authed.use(({ context, next }) => {
    if (!roles.includes(context.user.role)) {
      throw new ORPCError('FORBIDDEN')
    }
    return next()
  })

const adminOnly = requireRole(['admin'])
const memberOnly = requireRole(['member', 'admin'])

const uuid = z.string().uuid()
const text = z.string().trim().min(1)
const imageContentTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] as const

async function getRows<T>(query: PromiseLike<{ data: T | null; error: unknown }>): Promise<T> {
  const { data, error } = await query
  if (error) {
    const message =
      typeof error === 'object' && error && 'message' in error && typeof error.message === 'string'
        ? error.message
        : 'Supabase query failed'
    throw new ORPCError('INTERNAL_SERVER_ERROR', { message })
  }
  return data as T
}

export const router = {
  health: os.handler(() => ({
    ok: true,
    name: 'saima-api',
  })),

  events: {
    listPublic: os.handler(() =>
      getRows(
        supabaseAdmin
          .from('events')
          .select('id,title,summary,starts_at,location,is_published,cover_image_key,cover_image_url')
          .eq('is_published', true)
          .order('starts_at', { ascending: true }),
      ),
    ),
    create: adminOnly
      .input(
        z.object({
          title: text,
          summary: text,
          startsAt: z.string().datetime(),
          location: text,
          isPublished: z.boolean().default(true),
          coverImageKey: z.string().trim().optional(),
          coverImageUrl: z.string().url().optional(),
        }),
      )
      .handler(({ input }) =>
        getRows(
          supabaseAdmin
            .from('events')
            .insert({
              title: input.title,
              summary: input.summary,
              starts_at: input.startsAt,
              location: input.location,
              is_published: input.isPublished,
              cover_image_key: input.coverImageKey ?? null,
              cover_image_url: input.coverImageUrl ?? null,
            })
            .select()
            .single(),
        ),
      ),
    setCover: adminOnly
      .input(
        z.object({
          id: uuid,
          coverImageKey: text,
          coverImageUrl: z.string().url(),
        }),
      )
      .handler(({ input }) =>
        getRows(
          supabaseAdmin
            .from('events')
            .update({
              cover_image_key: input.coverImageKey,
              cover_image_url: input.coverImageUrl,
            })
            .eq('id', input.id)
            .select()
            .single(),
        ),
      ),
  },

  profile: {
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
  },

  membershipApplications: {
    mine: authed.handler(({ context }) =>
      getRows(
        supabaseAdmin
          .from('membership_applications')
          .select('*')
          .eq('user_id', context.user.id)
          .order('created_at', { ascending: false })
          .limit(1),
      ),
    ),
    create: authed
      .input(
        z.object({
          fullName: text,
          email: z.string().email(),
          instruments: z.array(text).min(1),
          experience: text,
          motivation: text,
        }),
      )
      .handler(({ context, input }) =>
        getRows(
          supabaseAdmin
            .from('membership_applications')
            .insert({
              user_id: context.user.id,
              full_name: input.fullName,
              email: input.email.toLowerCase(),
              instruments: input.instruments,
              experience: input.experience,
              motivation: input.motivation,
              status: 'pending',
            })
            .select()
            .single(),
        ),
      ),
    list: adminOnly.handler(() =>
      getRows(
        supabaseAdmin
          .from('membership_applications')
          .select('*, profiles(id,email,full_name,role)')
          .order('created_at', { ascending: false }),
      ),
    ),
    decide: adminOnly
      .input(
        z.object({
          id: uuid,
          status: z.enum(['approved', 'rejected', 'needs_info']),
        }),
      )
      .handler(async ({ input }) => {
        const application = await getRows<{ user_id: string }>(
          supabaseAdmin
            .from('membership_applications')
            .update({ status: input.status })
            .eq('id', input.id)
            .select('user_id')
            .single(),
        )

        if (input.status === 'approved') {
          await getRows(
            supabaseAdmin
              .from('profiles')
              .update({ role: 'member' })
              .eq('id', application.user_id)
              .select('id')
              .single(),
          )
        }

        return { ok: true }
      }),
  },

  availabilitySlots: {
    listPublic: os.handler(() =>
      getRows(
        supabaseAdmin
          .from('availability_slots')
          .select('id,member_id,title,starts_at,ends_at,location,capacity,status')
          .eq('status', 'available')
          .order('starts_at', { ascending: true }),
      ),
    ),
    create: memberOnly
      .input(
        z.object({
          title: text,
          startsAt: z.string().datetime(),
          endsAt: z.string().datetime(),
          location: text,
          capacity: z.number().int().min(1).max(20).default(1),
        }),
      )
      .handler(({ context, input }) =>
        getRows(
          supabaseAdmin
            .from('availability_slots')
            .insert({
              member_id: context.user.id,
              title: input.title,
              starts_at: input.startsAt,
              ends_at: input.endsAt,
              location: input.location,
              capacity: input.capacity,
              status: 'available',
            })
            .select()
            .single(),
        ),
      ),
  },

  bookings: {
    mine: authed.handler(({ context }) =>
      getRows(
        supabaseAdmin
          .from('bookings')
          .select('*, availability_slots(*)')
          .eq('visitor_id', context.user.id)
          .order('created_at', { ascending: false }),
      ),
    ),
    create: authed.input(z.object({ slotId: uuid })).handler(async ({ context, input }) => {
      const slot = await getRows<{ id: string; status: string }>(
        supabaseAdmin
          .from('availability_slots')
          .select('id,status')
          .eq('id', input.slotId)
          .single(),
      )

      if (slot.status !== 'available') {
        throw new ORPCError('CONFLICT', { message: 'This slot is no longer available.' })
      }

      return getRows(
        supabaseAdmin
          .from('bookings')
          .insert({
            slot_id: input.slotId,
            visitor_id: context.user.id,
            status: 'confirmed',
          })
          .select()
          .single(),
      )
    }),
  },

  media: {
    createUploadUrl: authed
      .input(
        z.object({
          purpose: z.enum(['profile-avatar', 'profile-cover', 'event-cover']),
          fileName: text,
          contentType: z.enum(imageContentTypes),
          size: z.number().int().min(1).max(5 * 1024 * 1024),
        }),
      )
      .handler(async ({ context, input }) => {
        const extension = input.fileName.split('.').pop()?.toLowerCase() ?? 'jpg'
        const safeExtension = extension.replace(/[^a-z0-9]/g, '') || 'jpg'
        const key = `${input.purpose}/${context.user.id}/${crypto.randomUUID()}.${safeExtension}`

        try {
          const uploadUrl = await createPresignedUploadUrl({
            key,
            contentType: input.contentType,
          })

          return {
            key,
            uploadUrl,
            publicUrl: getPublicR2Url(key),
          }
        } catch (error) {
          throw new ORPCError('INTERNAL_SERVER_ERROR', {
            message: error instanceof Error ? error.message : 'Could not create upload URL.',
          })
        }
      }),
  },

  adminUsers: {
    list: adminOnly.handler(() =>
      getRows(
        supabaseAdmin
          .from('profiles')
          .select('id,email,full_name,role,public_profile,created_at')
          .order('created_at', { ascending: false }),
      ),
    ),
    setRole: adminOnly
      .input(
        z.object({
          id: uuid,
          role: z.enum(['visitor', 'member', 'admin']),
        }),
      )
      .handler(({ input }) =>
        getRows(
          supabaseAdmin
            .from('profiles')
            .update({ role: input.role })
            .eq('id', input.id)
            .select('id,role')
            .single(),
        ),
      ),
  },
}

export type AppRouter = typeof router
