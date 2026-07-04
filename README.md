# SAIMA

Local web system for the South Australian International Musicians Association.

## Stack

- Bun workspaces
- Turborepo
- TanStack Start web app
- Elysia API server
- oRPC procedure API
- Hosted Supabase for Google OAuth, email magic links, database, and roles

## Local setup

1. Install Bun if needed:

   ```sh
   curl -fsSL https://bun.sh/install | bash
   ```

2. Copy environment files:

   ```sh
   cp .env.example apps/web/.env
   cp .env.example apps/api/.env
   ```

3. Fill the Supabase values in both env files. In Supabase Auth, enable Google and email magic link sign-in, then add:

   ```text
   http://localhost:3000/auth/callback
   ```

   to the allowed redirect URLs.

4. Run the SQL in `supabase/schema.sql` against the hosted Supabase project.

5. Install and start:

   ```sh
   bun install
   bun run dev
   ```

Web runs at `http://localhost:3000`; API runs at `http://localhost:3001`.
