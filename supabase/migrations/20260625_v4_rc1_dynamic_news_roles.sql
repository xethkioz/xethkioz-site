-- XETHKIOZ v4.0 RC1
-- Dynamic News + Roles + Admin Foundation
-- Ejecutar en Supabase SQL Editor después de revisar en entorno local.

create table if not exists public.news_sources (
  id uuid primary key default gen_random_uuid(),
  source_key text unique not null,
  name text not null,
  kind text not null check (kind in ('gaming','technology','science','ai','streaming','asia-gaming')),
  region text,
  url text not null,
  rss_url text,
  language text default 'es',
  attribution text not null default 'Citar fuente original y enlazar.',
  status text not null default 'manual-review' check (status in ('ready','manual-review','api-needed','disabled')),
  notes text,
  last_checked_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.external_news_items (
  id uuid primary key default gen_random_uuid(),
  source_id uuid references public.news_sources(id) on delete set null,
  external_url text not null,
  external_id text,
  title text not null,
  excerpt text,
  image_url text,
  source_name text,
  category_slug text,
  language text default 'es',
  status text not null default 'pending' check (status in ('pending','reviewed','converted','rejected')),
  attribution_url text not null,
  imported_at timestamptz not null default now(),
  reviewed_by uuid references public.profiles(id) on delete set null,
  converted_article_id uuid references public.articles(id) on delete set null
);

create table if not exists public.user_xp_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  action_key text not null,
  points integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.user_badges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  badge_key text not null,
  badge_name text not null,
  badge_icon text,
  reason text,
  awarded_by uuid references public.profiles(id) on delete set null,
  awarded_at timestamptz not null default now(),
  unique(user_id, badge_key)
);

create table if not exists public.moderation_assignments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  role text not null check (role in ('temp_moderator','moderator','editor','admin')),
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  reason text,
  status text not null default 'active' check (status in ('active','expired','revoked')),
  assigned_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.article_comments (
  id uuid primary key default gen_random_uuid(),
  article_id uuid references public.articles(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  parent_id uuid references public.article_comments(id) on delete cascade,
  body text not null,
  status text not null default 'visible' check (status in ('visible','hidden','deleted','pending')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.article_reactions (
  id uuid primary key default gen_random_uuid(),
  article_id uuid references public.articles(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  reaction text not null check (reaction in ('like','fire','mindblown','useful','hype')),
  created_at timestamptz not null default now(),
  unique(article_id, user_id, reaction)
);

alter table public.news_sources enable row level security;
alter table public.external_news_items enable row level security;
alter table public.user_xp_events enable row level security;
alter table public.user_badges enable row level security;
alter table public.moderation_assignments enable row level security;
alter table public.article_comments enable row level security;
alter table public.article_reactions enable row level security;

drop policy if exists "Public can read active news sources" on public.news_sources;
create policy "Public can read active news sources" on public.news_sources
  for select using (status <> 'disabled');

drop policy if exists "Public can read reviewed external items" on public.external_news_items;
create policy "Public can read reviewed external items" on public.external_news_items
  for select using (status in ('reviewed','converted'));

drop policy if exists "Users can read visible comments" on public.article_comments;
create policy "Users can read visible comments" on public.article_comments
  for select using (status = 'visible');

drop policy if exists "Authenticated users can insert comments" on public.article_comments;
create policy "Authenticated users can insert comments" on public.article_comments
  for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "Authenticated users can react" on public.article_reactions;
create policy "Authenticated users can react" on public.article_reactions
  for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "Users can read reactions" on public.article_reactions;
create policy "Users can read reactions" on public.article_reactions
  for select using (true);

-- Admin/editor policies should be tightened after confirming the final profiles.role values.
