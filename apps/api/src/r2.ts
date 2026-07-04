import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

import { env } from './env'

export function assertR2Configured() {
  if (
    !env.r2AccountId ||
    !env.r2AccessKeyId ||
    !env.r2SecretAccessKey ||
    !env.r2Bucket ||
    !env.r2PublicBaseUrl
  ) {
    throw new Error('Cloudflare R2 is not configured.')
  }
}

export function createR2Client() {
  assertR2Configured()

  return new S3Client({
    region: 'auto',
    endpoint: `https://${env.r2AccountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: env.r2AccessKeyId!,
      secretAccessKey: env.r2SecretAccessKey!,
    },
  })
}

export async function createPresignedUploadUrl({
  key,
  contentType,
}: {
  key: string
  contentType: string
}) {
  const client = createR2Client()
  const command = new PutObjectCommand({
    Bucket: env.r2Bucket!,
    Key: key,
    ContentType: contentType,
  })

  return getSignedUrl(client, command, { expiresIn: 60 * 5 })
}

export function getPublicR2Url(key: string) {
  assertR2Configured()
  return `${env.r2PublicBaseUrl}/${key}`
}
