-- XETHKIOZ 10.0 platform stability
-- Additive monetization foundation plus low-risk RLS/index hardening.

create extension if not exists pgcrypto;

create table if not exists public.ads_slots (
  id text primary key,
  label text not null,
  placement text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.ads_campaigns (
  id uuid primary key default gen_random_uuid(),
  slot_id text not null references public.ads_slots(id) on delete restrict,
  sponsor_name text not null,
  title text not null,
  description text,
  target_url text,
  image_url text,
  status text not null default 'draft' check (status in ('draft','review','active','paused','archived')),
  starts_at timestamptz,
  ends_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  approved_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint ads_campaigns_schedule_check check (ends_at is null or starts_at is null or ends_at > starts_at)
);

insert into public.ads_slots (id, label, placement, is_active) values
  ('home-hero', 'Home Hero', 'Inicio / portada', true),
  ('news-inline', 'News Inline', 'Entre tarjetas de noticias', true),
  ('section-sidebar', 'Section Sidebar', 'Gaming / Science / Fun / Green Node', true),
  ('stream-banner', 'Stream Banner', 'Avisos Kick / Twitch / YouTube', true)
on conflict (id) do update set
  label = excluded.label,
  placement = excluded.placement,
  is_active = excluded.is_active;

alter table public.ads_slots enable row level security;
alter table public.ads_campaigns enable row level security;

drop policy if exists ads_slots_public_read on public.ads_slots;
create policy ads_slots_public_read
on public.ads_slots
for select
to anon, authenticated
using (is_active = true);

drop policy if exists ads_campaigns_public_active_read on public.ads_campaigns;
create policy ads_campaigns_public_active_read
on public.ads_campaigns
for select
to anon, authenticated
using (
  status = 'active'
  and (starts_at is null or starts_at <= now())
  and (ends_at is null or ends_at >= now())
);

drop policy if exists ads_campaigns_admin_all on public.ads_campaigns;
create policy ads_campaigns_admin_all
on public.ads_campaigns
for all
to authenticated
using ((select public.xethkioz_has_role(array['ADMIN'])))
with check ((select public.xethkioz_has_role(array['ADMIN'])));

drop policy if exists ads_slots_admin_all on public.ads_slots;
create policy ads_slots_admin_all
on public.ads_slots
for all
to authenticated
using ((select public.xethkioz_has_role(array['ADMIN'])))
with check ((select public.xethkioz_has_role(array['ADMIN'])));

grant select on public.ads_slots, public.ads_campaigns to anon, authenticated;
grant insert, update, delete on public.ads_slots, public.ads_campaigns to authenticated;

create index if not exists ads_campaigns_active_slot_idx
on public.ads_campaigns (slot_id, updated_at desc)
where status = 'active';

create index if not exists ads_campaigns_created_by_idx on public.ads_campaigns (created_by);
create index if not exists ads_campaigns_approved_by_idx on public.ads_campaigns (approved_by);
create index if not exists articles_author_id_idx on public.articles (author_id);
create index if not exists comments_article_id_idx on public.comments (article_id);
create index if not exists comments_user_id_idx on public.comments (user_id);

drop policy if exists articles_select_published on public.articles;
create policy articles_select_published
on public.articles
for select
to anon, authenticated
using (status = 'published' or (select auth.uid()) is not null);

drop policy if exists comments_insert_auth on public.comments;
create policy comments_insert_auth
on public.comments
for insert
to authenticated
with check ((select auth.uid()) = user_id);

insert into public.site_settings (key, value)
values ('version', '{"version":"10.0.0","name":"Nexus City Multiverse Production Release"}'::jsonb)
on conflict (key) do update set value = excluded.value, updated_at = now();

comment on table public.ads_campaigns is 'XETHKIOZ sponsor and advertising campaigns; public reads are limited to active scheduled records.';
