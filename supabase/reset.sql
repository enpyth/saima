begin;

drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();
drop function if exists public.book_course_slot(uuid, uuid);

drop table if exists public.bookings cascade;
drop table if exists public.course_slots cascade;
drop table if exists public.courses cascade;
drop table if exists public.membership_applications cascade;
drop table if exists public.events cascade;
drop table if exists public.profiles cascade;

drop type if exists public.booking_status cascade;
drop type if exists public.slot_status cascade;
drop type if exists public.course_status cascade;
drop type if exists public.application_status cascade;
drop type if exists public.app_role cascade;

commit;
