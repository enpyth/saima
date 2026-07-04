insert into public.events (title, summary, starts_at, location, is_published)
select
  'SAIMA Winter Showcase',
  'An evening of chamber music, contemporary works, and community performances.',
  now() + interval '14 days',
  'Adelaide Town Hall',
  true
where not exists (
  select 1 from public.events where title = 'SAIMA Winter Showcase'
);

insert into public.events (title, summary, starts_at, location, is_published)
select
  'International Musicians Welcome Session',
  'Meet SAIMA members, learn about membership, and discuss collaboration opportunities.',
  now() + interval '30 days',
  'Adelaide CBD',
  true
where not exists (
  select 1 from public.events where title = 'International Musicians Welcome Session'
);
