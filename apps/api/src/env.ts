const required = (name: string) => {
  const value = Bun.env[name]
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

export const env = {
  port: Number(Bun.env.PORT ?? 3001),
  webOrigin: Bun.env.WEB_ORIGIN ?? 'http://localhost:3000',
  supabaseUrl: required('SUPABASE_URL'),
  supabaseAnonKey: required('SUPABASE_ANON_KEY'),
  supabaseServiceRoleKey: required('SUPABASE_SERVICE_ROLE_KEY'),
  r2AccountId: Bun.env.R2_ACCOUNT_ID,
  r2AccessKeyId: Bun.env.R2_ACCESS_KEY_ID,
  r2SecretAccessKey: Bun.env.R2_SECRET_ACCESS_KEY,
  r2Bucket: Bun.env.R2_BUCKET,
  r2PublicBaseUrl: Bun.env.R2_PUBLIC_BASE_URL?.replace(/\/$/, ''),
  stripeSecretKey: Bun.env.STRIPE_SECRET_KEY,
  stripeWebhookSecret: Bun.env.STRIPE_WEBHOOK_SECRET,
  adminEmails: new Set(
    (Bun.env.ADMIN_EMAILS ?? '')
      .split(',')
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  ),
}
