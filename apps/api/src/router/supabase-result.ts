import { ORPCError } from '@orpc/server'

export async function getRows<T>(query: PromiseLike<{ data: T | null; error: unknown }>): Promise<T> {
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
