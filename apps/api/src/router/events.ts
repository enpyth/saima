import { os } from '@orpc/server'
import { z } from 'zod'

import { supabaseAdmin } from '../supabase'
import { mapPublicEvent } from './mappers'
import { adminOnly } from './procedures'
import type { PublicEventRow } from './rows'
import { text, uuid } from './schemas'
import { getRows } from './supabase-result'

export const eventsRouter = {
  listPublic: os.handler(() =>
    getRows<PublicEventRow[]>(
      supabaseAdmin
        .from('events')
        .select('id,public_id,title,summary,starts_at,location,is_published,cover_image_key,cover_image_url')
        .eq('is_published', true)
        .order('starts_at', { ascending: true }),
    ).then((events) => events.map(mapPublicEvent)),
  ),
  create: adminOnly
    .input(
      z.object({
        title: text,
        publicId: z.string().trim().min(1).regex(/^[a-z0-9-]+$/),
        summary: text,
        startsAt: z.string().datetime(),
        location: text,
        isPublished: z.boolean().default(true),
        coverImageKey: z.string().trim().optional(),
        coverImageUrl: z.string().url().optional(),
      }),
    )
    .handler(({ input }) =>
      getRows<PublicEventRow>(
        supabaseAdmin
          .from('events')
          .insert({
            public_id: input.publicId,
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
      ).then(mapPublicEvent),
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
      getRows<PublicEventRow>(
        supabaseAdmin
          .from('events')
          .update({
            cover_image_key: input.coverImageKey,
            cover_image_url: input.coverImageUrl,
          })
          .eq('id', input.id)
          .select()
          .single(),
      ).then(mapPublicEvent),
    ),
}
