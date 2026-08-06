# API Router Issue List

Static review target: `apps/api/src/router.ts`

Priority scale:

- P1: High impact correctness, data consistency, or security issue.
- P2: Medium impact reliability, scalability, or maintainability issue.
- P3: Lower impact cleanup or developer experience issue.

## Issues

### P1: `availabilitySlots.create` accepts ignored fields and drops ranges

Affected area: `availabilitySlots.create`

The input accepts `title` and `capacity`, but the handler does not persist either value. It also calls `toHalfHourRange()` and inserts only the first generated slot, so a larger range is silently truncated.

Suggested upgrade:

- Remove the legacy `availabilitySlots.create` route if `courseSlots.createRange` is the intended path.
- Or update it to create the full slot range and remove unsupported fields until the database supports them.
- Add route tests for single-slot and multi-slot inputs.

### P1: Supabase errors are always returned as internal server errors

Affected area: `getRows()`

`getRows()` maps every Supabase/Postgres failure to `INTERNAL_SERVER_ERROR` and exposes raw database messages to clients. Expected states such as missing rows, unique conflicts, permission errors, and validation errors should not look like API faults.

Suggested upgrade:

- Map common database codes to oRPC errors: `PGRST116`/`P0002` to not found, `23505` to conflict, `42501` to forbidden, and `22023` to bad request.
- Log internal error details server-side and return stable client messages.
- Add unit tests for error mapping.

### P1: Ticket checkout session creation is not idempotent

Affected area: `tickets.createCheckoutSession`

The API creates a pending ticket order, creates a Stripe Checkout Session, then writes the Stripe session ID back to Supabase. A retry between those steps can create duplicate Stripe sessions or leave capacity reserved without a tracked session.

Suggested upgrade:

- Use a Stripe idempotency key based on the pending order ID.
- Move checkout creation into a ticket service with explicit recovery behavior.
- Consider cancelling or expiring pending orders that never receive a Stripe session ID.

### P2: Media upload and update routes need ownership checks

Affected area: `media.createUploadUrl`, `events.setCover`, `profile.updateMedia`

Any authenticated user can request an `event-cover` upload URL, and media update routes accept arbitrary keys and URLs. The server does not verify key ownership, purpose, uploaded object existence, content type, or final object size.

Suggested upgrade:

- Restrict `event-cover` upload URLs to admins.
- Record R2 object metadata in Supabase with `owner_user_id`, `purpose`, `key`, `content_type`, and `size`.
- Only allow profile and event media updates using server-issued keys that match the caller and purpose.

### P2: Ticket sales summaries should be aggregated in the database

Affected area: `getTicketTypeSummaries()`, `summarizeTicketTypes()`

Ticket availability loads order rows into the API and repeatedly filters them per ticket type. This will scale poorly and can count stale `pending_payment` orders forever.

Suggested upgrade:

- Move sold and reserved counts into a Supabase view or RPC.
- Add an expiry policy for stale pending ticket orders.
- Use the database aggregate result for public sale availability and admin sales stats.

### P2: Membership approval is not transactional

Affected area: `membershipApplications.decide`

Approving an application updates the application first and then updates the profile role. If the role update fails, the system can show an approved application while the user remains a visitor.

Suggested upgrade:

- Move application decision and role update into a Supabase function.
- Set `decided_at` when a decision is made.
- Add tests for approve, reject, and failure paths.

### P2: Router file is doing too many jobs

Status: Fixed

Affected area: whole router module

The router currently contains authorization helpers, schemas, database row types, query helpers, aggregation logic, Stripe orchestration, media upload orchestration, and all oRPC route definitions in one file.

Suggested upgrade:

- Split by domain: `events`, `tickets`, `profile`, `membershipApplications`, `courses`, `courseSlots`, `bookings`, `media`, and `adminUsers`.
- Move shared auth procedures into a `procedures` module.
- Move Supabase error handling into a small shared helper.
- Keep the exported router shape stable while extracting implementation.

### P3: API contracts mix database rows and shared camelCase types

Status: Fixed

Affected area: route return values and local row types

Some routes return raw Supabase rows in snake_case while shared package types use camelCase. Frontend routes compensate with local casts, which weakens the value of `AppRouter` as the source of truth.

Suggested upgrade:

- Define explicit response mappers for public API outputs.
- Move cross-boundary response types into `packages/shared`.
- Keep internal database row types separate from client-facing DTOs.

### P3: Repeated Supabase select strings are brittle

Affected area: event, course, booking, ticket, and profile queries

Long select strings are repeated across handlers. Adding or renaming fields will require multiple manual updates.

Suggested upgrade:

- Extract common select fragments where they are reused.
- Prefer typed mappers near each domain module after the router split.
- Add focused tests around returned shape for public course and ticket sale APIs.
