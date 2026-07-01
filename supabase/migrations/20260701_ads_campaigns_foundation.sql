-- XETHKIOZ Ads Foundation
-- Creates safe base tables for future sponsor/banner management.
-- Admin-only write, public read for active approved campaigns.

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
  updated_at timestamptz not null default now()
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
using (is_active = true);

drop policy if exists ads_campaigns_public_active_read on public.ads_campaigns;
create policy ads_campaigns_public_active_read
on public.ads_campaigns
for select
using (
  status = 'active'
  and (starts_at is null or starts_at <= now())
  and (ends_at is null or ends_at >= now())
);

drop policy if exists ads_campaigns_admin_all on public.ads_campaigns;
create policy ads_campaigns_admin_all
on public.ads_campaigns
for all
using (public.xethkioz_has_role(array['ADMIN']))
with check (public.xethkioz_has_role(array['ADMIN']));

drop policy if exists ads_slots_admin_all on public.ads_slots;
create policy ads_slots_admin_all
on public.ads_slots
for all
using (public.xethkioz_has_role(array['ADMIN']))
with check (public.xethkioz_has_role(array['ADMIN']));

grant select on public.ads_slots to anon, authenticated;
grant select on public.ads_campaigns to anon, authenticated;
