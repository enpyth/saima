begin;

drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();
drop function if exists public.book_course_slot(uuid, uuid);
drop function if exists public.create_ticket_order(uuid, uuid, text, text, text, integer);
drop function if exists public.create_pending_ticket_order(uuid, uuid, text, text, text, integer);
drop function if exists public.create_pending_ticket_order(uuid, text, integer, integer, timestamptz, timestamptz, boolean, uuid, text, text, text, integer);
drop function if exists public.create_pending_ticket_order(text, text, integer, integer, timestamptz, timestamptz, boolean, uuid, text, text, text, integer);
drop function if exists public.create_pending_ticket_order(uuid, text, integer, integer, integer, timestamptz, timestamptz, boolean, uuid, text, text, text, integer);
drop function if exists public.create_free_ticket_order(uuid, text, integer, integer, uuid, text, text, text, integer);

drop table if exists public.ticket_orders cascade;
drop table if exists public.ticket_types cascade;
drop table if exists public.bookings cascade;
drop table if exists public.course_slots cascade;
drop table if exists public.courses cascade;
drop table if exists public.membership_applications cascade;
drop table if exists public.events cascade;
drop table if exists public.profiles cascade;

drop type if exists public.booking_status cascade;
drop type if exists public.ticket_order_status cascade;
drop type if exists public.slot_status cascade;
drop type if exists public.course_status cascade;
drop type if exists public.application_status cascade;
drop type if exists public.app_role cascade;

commit;
