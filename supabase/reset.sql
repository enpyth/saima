-- Danger: this deletes SAIMA application tables, data, policies, triggers, and enum types.
-- Run this only when you intentionally want to reset the SAIMA schema.
-- It does not delete Supabase auth users by default.

begin;

drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

drop table if exists public.bookings cascade;
drop table if exists public.availability_slots cascade;
drop table if exists public.membership_applications cascade;
drop table if exists public.events cascade;
drop table if exists public.profiles cascade;

drop type if exists public.booking_status cascade;
drop type if exists public.slot_status cascade;
drop type if exists public.application_status cascade;
drop type if exists public.app_role cascade;

-- Optional: also delete Supabase auth users.
-- Uncomment only if you want to remove login accounts too.
-- delete from auth.users;

commit;
