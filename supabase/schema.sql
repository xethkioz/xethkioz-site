-- XETHKIOZ Database Schema v3.6.4 / Foundation
-- Ejecutar en Supabase SQL Editor después de purgar tablas viejas si se busca instalación limpia.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  username text unique,
  display_name text,
  avatar_url text,
  bio text,
  role text not null default 'user',
  status text not null default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  icon text,
  portal text not null default 'gaming',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.authors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  bio text,
  avatar_url text,
  role text not null default 'Editor',
  created_at timestamptz not null default now()
);

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text not null,
  cover_image text,
  category_id uuid references public.categories(id) on delete set null,
  author_id uuid references public.authors(id) on delete set null,
  tags text[] not null default '{}',
  status text not null default 'published',
  is_featured boolean not null default false,
  is_trending boolean not null default false,
  is_editors_pick boolean not null default false,
  is_popular boolean not null default false,
  views int not null default 0,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  article_id uuid references public.articles(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  content text not null,
  status text not null default 'published',
  created_at timestamptz default now()
);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  message text not null,
  status text not null default 'published',
  created_at timestamptz default now()
);

create table if not exists public.streams (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  platform text not null,
  channel_name text not null,
  channel_url text not null,
  video_id text,
  thumbnail text,
  is_live boolean not null default false,
  is_featured boolean not null default false,
  views int not null default 0,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.media_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  type text not null default 'image',
  url text not null,
  thumbnail text,
  description text,
  is_featured boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.social_links (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  handle text not null,
  url text not null,
  followers text,
  icon text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz default now()
);

create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_articles_category on public.articles(category_id);
create index if not exists idx_articles_published on public.articles(published_at desc);
create index if not exists idx_articles_status on public.articles(status);
create index if not exists idx_categories_portal on public.categories(portal);
create index if not exists idx_streams_platform on public.streams(platform);
create index if not exists idx_newsletter_email on public.newsletter_subscribers(email);

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.authors enable row level security;
alter table public.articles enable row level security;
alter table public.comments enable row level security;
alter table public.chat_messages enable row level security;
alter table public.streams enable row level security;
alter table public.media_items enable row level security;
alter table public.social_links enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.site_settings enable row level security;

drop policy if exists profiles_select_all on public.profiles;
create policy profiles_select_all on public.profiles for select using (true);

drop policy if exists profiles_insert_own on public.profiles;
create policy profiles_insert_own on public.profiles for insert with check (auth.uid() = id);

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles for update using (auth.uid() = id);

drop policy if exists public_read_categories on public.categories;
create policy public_read_categories on public.categories for select to anon, authenticated using (true);

drop policy if exists public_read_authors on public.authors;
create policy public_read_authors on public.authors for select to anon, authenticated using (true);

drop policy if exists public_read_articles on public.articles;
create policy public_read_articles on public.articles for select to anon, authenticated using (status = 'published');

drop policy if exists authenticated_read_articles on public.articles;
create policy authenticated_read_articles on public.articles for select to authenticated using (true);

drop policy if exists comments_select_published on public.comments;
create policy comments_select_published on public.comments for select using (status = 'published');

drop policy if exists comments_insert_auth on public.comments;
create policy comments_insert_auth on public.comments for insert with check (auth.uid() = user_id);

drop policy if exists chat_select_auth on public.chat_messages;
create policy chat_select_auth on public.chat_messages for select using (auth.uid() is not null);

drop policy if exists chat_insert_auth on public.chat_messages;
create policy chat_insert_auth on public.chat_messages for insert with check (auth.uid() = user_id);

drop policy if exists public_read_streams on public.streams;
create policy public_read_streams on public.streams for select to anon, authenticated using (true);

drop policy if exists public_read_media on public.media_items;
create policy public_read_media on public.media_items for select to anon, authenticated using (true);

drop policy if exists public_read_social on public.social_links;
create policy public_read_social on public.social_links for select to anon, authenticated using (true);

drop policy if exists public_subscribe_newsletter on public.newsletter_subscribers;
create policy public_subscribe_newsletter on public.newsletter_subscribers for insert to anon, authenticated with check (true);

drop policy if exists settings_select_all on public.site_settings;
create policy settings_select_all on public.site_settings for select using (true);

insert into public.site_settings (key, value)
values
('version', '{"version":"3.6.4","name":"Auth + Foundation Cleanup"}'),
('donations', '{"paypal":"https://www.paypal.com/ncp/payment/5ZYB8NGEGC8AS","mercadopago":"https://link.mercadopago.com.ar/xethkioz","enabled":true}')
on conflict (key) do update set value = excluded.value, updated_at = now();

-- ============================================================
-- XETHKIOZ v4.0 RC1.5 baseline note
-- ============================================================
-- From this point forward, the canonical additive migration for the network ecosystem is:
-- supabase/migrations/20260625_rc15_network_database_baseline.sql
-- It consolidates: network_modules, science_reports/sources, dynamic news attribution,
-- CMS publication jobs, roles/XP/badges, donor tiers, Green Node unlocks and Wisp events.
-- Apply the migration after a Supabase backup. Do not drop existing user data.
