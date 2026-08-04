create extension if not exists "pgcrypto";

create type public.app_role as enum ('visitor', 'member', 'admin');
create type public.application_status as enum ('pending', 'approved', 'rejected', 'needs_info');
create type public.course_status as enum ('draft', 'published', 'archived');
create type public.slot_status as enum ('available', 'booked');
create type public.booking_status as enum ('confirmed', 'cancelled', 'completed');
create type public.ticket_order_status as enum ('pending_payment', 'confirmed', 'cancelled');

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
  public_id text not null unique,
  title text not null,
  summary text not null,
  starts_at timestamptz not null,
  location text not null,
  is_published boolean not null default true,
  cover_image_key text,
  cover_image_url text,
  created_at timestamptz not null default now()
);

create table public.ticket_types (
  id uuid primary key default gen_random_uuid(),
  event_public_id text not null references public.events(public_id) on delete cascade,
  name text not null,
  description text,
  price_cents integer not null check (price_cents >= 0),
  currency text not null default 'AUD',
  capacity integer not null check (capacity >= 0),
  sale_starts_at timestamptz,
  sale_ends_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (event_public_id, name)
);

create table public.ticket_orders (
  id uuid primary key default gen_random_uuid(),
  ticket_type_id uuid not null references public.ticket_types(id) on delete restrict,
  event_public_id text not null references public.events(public_id) on delete restrict,
  purchaser_user_id uuid references public.profiles(id) on delete set null,
  purchaser_name text not null,
  purchaser_email text not null,
  purchaser_phone text,
  quantity integer not null check (quantity > 0),
  unit_price_cents integer not null check (unit_price_cents >= 0),
  total_price_cents integer not null check (total_price_cents >= 0),
  status public.ticket_order_status not null default 'pending_payment',
  stripe_checkout_session_id text unique,
  stripe_payment_intent_id text,
  paid_at timestamptz,
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

create index events_public_id_idx
on public.events (public_id);

create index ticket_types_event_public_id_idx
on public.ticket_types (event_public_id);

create index ticket_orders_event_created_at_idx
on public.ticket_orders (event_public_id, created_at desc);

create index ticket_orders_ticket_type_status_idx
on public.ticket_orders (ticket_type_id, status);

create index ticket_orders_purchaser_status_created_at_idx
on public.ticket_orders (purchaser_user_id, status, created_at desc);

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

create or replace function public.create_pending_ticket_order(
  p_ticket_type_id uuid,
  p_purchaser_user_id uuid,
  p_purchaser_name text,
  p_purchaser_email text,
  p_purchaser_phone text,
  p_quantity integer
)
returns public.ticket_orders
language plpgsql
security definer set search_path = public
as $$
declare
  target_ticket public.ticket_types%rowtype;
  sold_quantity integer;
  created_order public.ticket_orders%rowtype;
begin
  if p_quantity < 1 or p_quantity > 10 then
    raise exception 'Choose between 1 and 10 tickets.' using errcode = '22023';
  end if;

  select *
  into target_ticket
  from public.ticket_types
  where id = p_ticket_type_id
  for update;

  if not found then
    raise exception 'Ticket type not found.' using errcode = 'P0002';
  end if;

  if target_ticket.is_active is false then
    raise exception 'Ticket sales are not active.' using errcode = '22023';
  end if;

  if target_ticket.sale_starts_at is not null and now() < target_ticket.sale_starts_at then
    raise exception 'Ticket sales have not started.' using errcode = '22023';
  end if;

  if target_ticket.sale_ends_at is not null and now() > target_ticket.sale_ends_at then
    raise exception 'Ticket sales have ended.' using errcode = '22023';
  end if;

  select coalesce(sum(quantity), 0)
  into sold_quantity
  from public.ticket_orders
  where ticket_type_id = target_ticket.id
    and status in ('pending_payment', 'confirmed');

  if sold_quantity + p_quantity > target_ticket.capacity then
    raise exception 'Not enough tickets remaining.' using errcode = '23505';
  end if;

  insert into public.ticket_orders (
    ticket_type_id,
    event_public_id,
    purchaser_user_id,
    purchaser_name,
    purchaser_email,
    purchaser_phone,
    quantity,
    unit_price_cents,
    total_price_cents,
    status
  )
  values (
    target_ticket.id,
    target_ticket.event_public_id,
    p_purchaser_user_id,
    trim(p_purchaser_name),
    lower(trim(p_purchaser_email)),
    nullif(trim(coalesce(p_purchaser_phone, '')), ''),
    p_quantity,
    target_ticket.price_cents,
    target_ticket.price_cents * p_quantity,
    'pending_payment'
  )
  returning * into created_order;

  return created_order;
end;
$$;

alter table public.profiles enable row level security;
alter table public.events enable row level security;
alter table public.ticket_types enable row level security;
alter table public.ticket_orders enable row level security;
alter table public.membership_applications enable row level security;
alter table public.courses enable row level security;
alter table public.course_slots enable row level security;
alter table public.bookings enable row level security;

create policy "public can read published events"
on public.events for select
using (is_published = true);

create policy "public can read active ticket types"
on public.ticket_types for select
using (is_active = true);

create policy "users can read own ticket orders"
on public.ticket_orders for select
using (auth.uid() = purchaser_user_id);

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
