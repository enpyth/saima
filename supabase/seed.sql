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
