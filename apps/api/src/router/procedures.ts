import { ORPCError, os } from '@orpc/server'
import type { Role } from '@saima/shared'

import type { ApiContext } from '../context'

export const authed = os.$context<ApiContext>().use(({ context, next }) => {
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

export const adminOnly = requireRole(['admin'])
export const memberOnly = requireRole(['member', 'admin'])
