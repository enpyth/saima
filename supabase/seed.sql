insert into public.events (public_id, title, summary, starts_at, location, is_published)
select
  'winter-showcase',
  'SAIMA Winter Showcase',
  'An evening of chamber music, contemporary works, and community performances.',
  now() + interval '14 days',
  'Adelaide Town Hall',
  true
where not exists (
  select 1 from public.events where public_id = 'winter-showcase'
);

insert into public.events (public_id, title, summary, starts_at, location, is_published)
select
  'welcome-session',
  'International Musicians Welcome Session',
  'Meet SAIMA members, learn about membership, and discuss collaboration opportunities.',
  now() + interval '30 days',
  'Adelaide CBD',
  true
where not exists (
  select 1 from public.events where public_id = 'welcome-session'
);

insert into public.events (public_id, title, summary, starts_at, location, is_published)
select
  '20261016',
  'A Dream for Every Child',
  'Elsa and her students present a charity musical theatre concert supporting children with cancer and their families.',
  '2026-10-16 19:30:00+10:30',
  'Royalty Theatre',
  true
where not exists (
  select 1 from public.events where public_id = '20261016'
);

insert into public.ticket_types (
  event_public_id,
  name,
  description,
  price_cents,
  currency,
  capacity,
  sale_starts_at,
  sale_ends_at,
  is_active
)
select
  '20261016',
  'General admission',
  'Standard reserved ticket for A Dream for Every Child.',
  3500,
  'AUD',
  500,
  now() - interval '1 day',
  '2026-10-16 19:30:00+10:30',
  true
where not exists (
  select 1 from public.ticket_types where event_public_id = '20261016' and name = 'General admission'
);
