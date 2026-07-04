# AGENTS.md

## Development Rules

### 1. Use TDD for Features

Implement new features with a test-driven workflow.

### 2. Object Storage and Records

Use Cloudflare R2 for stored objects.

Use Supabase for relational records and metadata only

### 3. UI Components

Use shadcn-style components from the local `apps/web/src/components/ui` directory for UI primitives.

### 4. Stack Consistency

Keep implementation aligned with the current stack:

- Use Bun scripts
- Use oRPC procedures for web-to-API calls.
- Use Elysia API patterns already present in `apps/api`.
- Use Supabase Auth for authentication and Supabase tables/functions for relational data.
- Use Cloudflare R2 S3-compatible APIs for object storage.
- Keep shared types in `packages/shared` when they cross app boundaries.

## Verification

Before finishing feature work, run the relevant checks:

```bash
bun run test
bun run typecheck
bun run build
```

If a change touches database schema, update `supabase/schema.sql`, `supabase/reset.sql` when needed, and document whether the user must run a migration or reset.
