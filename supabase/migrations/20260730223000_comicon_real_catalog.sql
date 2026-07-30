begin;

create table if not exists public.comicon_catalog (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 120),
  channel text not null check (channel in ('marvel','dc','anime','screen','comics')),
  entity_type text not null check (entity_type in ('hero','villain','antihero','team','comic','manga','screen')),
  title text not null check (char_length(btrim(title)) between 1 and 160),
  publisher text not null check (char_length(btrim(publisher)) between 1 and 160),
  universe text check (universe is null or char_length(universe) <= 180),
  identity text check (identity is null or char_length(identity) <= 180),
  debut text check (debut is null or char_length(debut) <= 220),
  creators text[] not null default '{}',
  summary jsonb not null default '{"es":"","en":""}'::jsonb
    check (jsonb_typeof(summary) = 'object' and summary ? 'es' and summary ? 'en'),
  facts jsonb not null default '{"es":[],"en":[]}'::jsonb
    check (jsonb_typeof(facts) = 'object' and jsonb_typeof(facts->'es') = 'array' and jsonb_typeof(facts->'en') = 'array'),
  image_url text not null check (char_length(image_url) <= 2048 and (image_url like '/%' or image_url like 'https://%')),
  image_alt text not null check (char_length(image_alt) between 5 and 240),
  source_urls text[] not null default '{}',
  tags text[] not null default '{}',
  featured boolean not null default false,
  sort_order integer not null default 100 check (sort_order between 0 and 9999),
  status text not null default 'draft' check (status in ('draft','published','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists comicon_catalog_public_idx
  on public.comicon_catalog (status, featured desc, sort_order, title);
create index if not exists comicon_catalog_channel_idx
  on public.comicon_catalog (channel, entity_type, status);
create index if not exists comicon_catalog_tags_idx
  on public.comicon_catalog using gin (tags);

alter table public.comicon_catalog enable row level security;

revoke all on table public.comicon_catalog from public, anon, authenticated;
grant select on table public.comicon_catalog to anon, authenticated;
grant insert, update, delete on table public.comicon_catalog to authenticated;

drop policy if exists comicon_catalog_public_read on public.comicon_catalog;
create policy comicon_catalog_public_read
on public.comicon_catalog
for select
to anon, authenticated
using (status = 'published');

drop policy if exists comicon_catalog_admin_insert on public.comicon_catalog;
create policy comicon_catalog_admin_insert
on public.comicon_catalog
for insert
to authenticated
with check ((select private.xethkioz_has_role(array['ADMIN'])));

drop policy if exists comicon_catalog_admin_update on public.comicon_catalog;
create policy comicon_catalog_admin_update
on public.comicon_catalog
for update
to authenticated
using ((select private.xethkioz_has_role(array['ADMIN'])))
with check ((select private.xethkioz_has_role(array['ADMIN'])));

drop policy if exists comicon_catalog_admin_delete on public.comicon_catalog;
create policy comicon_catalog_admin_delete
on public.comicon_catalog
for delete
to authenticated
using ((select private.xethkioz_has_role(array['ADMIN'])));

comment on table public.comicon_catalog is
  'Structured COMICON reference catalog for heroes, villains, teams, comics, manga and screen adaptations. Public read, ADMIN-only writes.';

commit;
