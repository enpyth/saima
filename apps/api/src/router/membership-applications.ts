import { z } from 'zod'

import { supabaseAdmin } from '../supabase'
import { adminOnly, authed } from './procedures'
import { text, uuid } from './schemas'
import { getRows } from './supabase-result'

export const membershipApplicationsRouter = {
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
}
