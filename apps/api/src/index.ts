import cors from '@elysiajs/cors'
import { onError } from '@orpc/server'
import { RPCHandler } from '@orpc/server/fetch'
import { Elysia } from 'elysia'

import { createContext } from './context'
import { env } from './env'
import { router } from './router'

const handler = new RPCHandler(router, {
  interceptors: [
    onError((error) => {
      console.error(error)
    }),
  ],
})

const app = new Elysia()
  .use(
    cors({
      origin: env.webOrigin,
      allowedHeaders: ['content-type', 'authorization'],
      methods: ['GET', 'POST', 'OPTIONS'],
    }),
  )
  .get('/health', () => ({ ok: true, name: 'saima-api' }))
  .all(
    '/rpc*',
    async ({ request }) => {
      const { response } = await handler.handle(request, {
        prefix: '/rpc',
        context: await createContext(request),
      })
      return response ?? new Response('Not Found', { status: 404 })
    },
    {
      parse: 'none',
    },
  )
  .listen(env.port)

console.log(`SAIMA API running at http://localhost:${app.server?.port}`)
