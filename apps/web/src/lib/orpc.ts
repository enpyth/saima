import { createORPCClient } from '@orpc/client'
import { RPCLink } from '@orpc/client/fetch'
import type { RouterClient } from '@orpc/server'
import type { AppRouter } from '@saima/api/router'

import { supabase } from './supabase'

const apiUrl = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:3001'

const link = new RPCLink({
  url: `${apiUrl}/rpc`,
  headers: async () => {
    const token = (await supabase?.auth.getSession())?.data.session?.access_token
    return token ? { authorization: `Bearer ${token}` } : {}
  },
})

export const api: RouterClient<AppRouter> = createORPCClient(link)
