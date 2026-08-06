import { z } from 'zod'

export const uuid = z.string().uuid()
export const text = z.string().trim().min(1)
export const imageContentTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] as const
export const courseStatus = z.enum(['draft', 'published', 'archived'])
