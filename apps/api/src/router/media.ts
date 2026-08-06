import { ORPCError } from '@orpc/server'
import { z } from 'zod'

import { createPresignedUploadUrl, getPublicR2Url } from '../r2'
import { authed } from './procedures'
import { imageContentTypes, text } from './schemas'

export const mediaRouter = {
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
}
