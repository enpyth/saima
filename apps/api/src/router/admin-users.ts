import { z } from 'zod'

import { supabaseAdmin } from '../supabase'
import { mapAdminUser } from './mappers'
import { adminOnly } from './procedures'
import type { ProfileRow } from './rows'
import { uuid } from './schemas'
import { getRows } from './supabase-result'

export const adminUsersRouter = {
  list: adminOnly.handler(() =>
    getRows<ProfileRow[]>(
      supabaseAdmin
        .from('profiles')
        .select('id,email,full_name,role,public_profile,created_at')
        .order('created_at', { ascending: false }),
    ).then((users) => users.map(mapAdminUser)),
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
}
