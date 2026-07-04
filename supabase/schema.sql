create extension if not exists "pgcrypto";

create type public.app_role as enum ('visitor', 'member', 'admin');
create type public.application_status as enum ('pending', 'approved', 'rejected', 'needs_info');
create type public.course_status as enum ('draft', 'published', 'archived');
create type public.slot_status as enum ('available', 'booked');
create type public.booking_status as enum ('confirmed', 'cancelled', 'completed');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text not null,
  role public.app_role not null default 'visitor',
  phone text,
  instruments text[] not null default '{}',
  bio text,
  country_or_region text,
  public_profile boolean not null default false,
  avatar_key text,
  avatar_url text,
  cover_image_key text,
  cover_image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text not null,
  starts_at timestamptz not null,
  location text not null,
  is_published boolean not null default true,
  cover_image_key text,
  cover_image_url text,
  created_at timestamptz not null default now()
);

create table public.membership_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  full_name text not null,
  email text not null,
  instruments text[] not null default '{}',
  experience text not null,
  motivation text not null,
  status public.application_status not null default 'pending',
  created_at timestamptz not null default now(),
  decided_at timestamptz
);

create table public.courses (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  summary text not null,
  instrument text not null,
  level text not null default 'All levels',
  location text not null,
  status public.course_status not null default 'published',
  cover_image_key text,
  cover_image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.course_slots (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  member_id uuid not null references public.profiles(id) on delete cascade,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status public.slot_status not null default 'available',
  created_at timestamptz not null default now(),
  constraint course_slot_duration check (ends_at = starts_at + interval '30 minutes'),
  constraint course_slot_half_hour_start check (
    extract(minute from starts_at)::int in (0, 30)
    and extract(second from starts_at)::int = 0
  ),
  unique (course_id, starts_at)
);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  slot_id uuid not null references public.course_slots(id) on delete cascade,
  visitor_id uuid not null references public.profiles(id) on delete cascade,
  status public.booking_status not null default 'confirmed',
  created_at timestamptz not null default now(),
  unique (slot_id, visitor_id)
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    email,
    full_name,
    role,
    avatar_url
  )
  values (
    new.id,
    lower(coalesce(new.email, '')),
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      new.email,
      'SAIMA user'
    ),
    'visitor',
    coalesce(
      new.raw_user_meta_data ->> 'avatar_url',
      new.raw_user_meta_data ->> 'picture'
    )
  )
  on conflict (id) do update
  set
    email = excluded.email,
    full_name = excluded.full_name,
    avatar_url = coalesce(public.profiles.avatar_url, excluded.avatar_url),
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

insert into public.profiles (
  id,
  email,
  full_name,
  role,
  avatar_url
)
select
  users.id,
  lower(coalesce(users.email, '')),
  coalesce(
    users.raw_user_meta_data ->> 'full_name',
    users.raw_user_meta_data ->> 'name',
    users.email,
    'SAIMA user'
  ),
  'visitor',
  coalesce(
    users.raw_user_meta_data ->> 'avatar_url',
    users.raw_user_meta_data ->> 'picture'
  )
from auth.users
on conflict (id) do update
set
  email = excluded.email,
  full_name = excluded.full_name,
  avatar_url = coalesce(public.profiles.avatar_url, excluded.avatar_url),
  updated_at = now();

create index membership_applications_user_id_idx
on public.membership_applications (user_id);

create index courses_member_status_idx
on public.courses (member_id, status);

create index course_slots_course_status_starts_at_idx
on public.course_slots (course_id, status, starts_at);

create index course_slots_member_status_starts_at_idx
on public.course_slots (member_id, status, starts_at);

create index bookings_visitor_id_created_at_idx
on public.bookings (visitor_id, created_at desc);

create index bookings_slot_id_idx
on public.bookings (slot_id);

create index bookings_course_id_created_at_idx
on public.bookings (course_id, created_at desc);

create or replace function public.book_course_slot(p_slot_id uuid, p_visitor_id uuid)
returns public.bookings
language plpgsql
security definer set search_path = public
as $$
declare
  target_slot public.course_slots%rowtype;
  created_booking public.bookings%rowtype;
begin
  select *
  into target_slot
  from public.course_slots
  where id = p_slot_id
  for update;

  if not found then
    raise exception 'Slot not found' using errcode = 'P0002';
  end if;

  if target_slot.status <> 'available' then
    raise exception 'This slot is no longer available.' using errcode = '23505';
  end if;

  if target_slot.member_id = p_visitor_id then
    raise exception 'Members cannot book their own course slots.' using errcode = '42501';
  end if;

  insert into public.bookings (course_id, slot_id, visitor_id, status)
  values (target_slot.course_id, target_slot.id, p_visitor_id, 'confirmed')
  returning * into created_booking;

  update public.course_slots
  set status = 'booked'
  where id = target_slot.id;

  return created_booking;
end;
$$;

alter table public.profiles enable row level security;
alter table public.events enable row level security;
alter table public.membership_applications enable row level security;
alter table public.courses enable row level security;
alter table public.course_slots enable row level security;
alter table public.bookings enable row level security;

create policy "public can read published events"
on public.events for select
using (is_published = true);

create policy "public can read published courses"
on public.courses for select
using (status = 'published');

create policy "public can read available course slots"
on public.course_slots for select
using (status = 'available');

create policy "users can read own profile"
on public.profiles for select
using (auth.uid() = id or public_profile = true);

create policy "users can update own profile"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);
