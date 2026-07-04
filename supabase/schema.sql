create extension if not exists "pgcrypto";

create type public.app_role as enum ('visitor', 'member', 'admin');
create type public.application_status as enum ('pending', 'approved', 'rejected', 'needs_info');
create type public.slot_status as enum ('available', 'booked', 'cancelled');
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

create table public.availability_slots (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  location text not null,
  capacity integer not null default 1 check (capacity > 0),
  status public.slot_status not null default 'available',
  created_at timestamptz not null default now(),
  constraint availability_time_order check (ends_at > starts_at)
);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  slot_id uuid not null references public.availability_slots(id) on delete cascade,
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

create index availability_slots_status_starts_at_idx
on public.availability_slots (status, starts_at);

create index bookings_visitor_id_created_at_idx
on public.bookings (visitor_id, created_at desc);

create index bookings_slot_id_idx
on public.bookings (slot_id);

alter table public.profiles enable row level security;
alter table public.events enable row level security;
alter table public.membership_applications enable row level security;
alter table public.availability_slots enable row level security;
alter table public.bookings enable row level security;

create policy "public can read published events"
on public.events for select
using (is_published = true);

create policy "public can read available slots"
on public.availability_slots for select
using (status = 'available');

create policy "users can read own profile"
on public.profiles for select
using (auth.uid() = id or public_profile = true);

create policy "users can update own profile"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

insert into public.events (title, summary, starts_at, location, is_published) values
  ('SAIMA Winter Showcase', 'An evening of chamber music, contemporary works, and community performances.', now() + interval '14 days', 'Adelaide Town Hall', true),
  ('International Musicians Welcome Session', 'Meet SAIMA members, learn about membership, and discuss collaboration opportunities.', now() + interval '30 days', 'Adelaide CBD', true);
