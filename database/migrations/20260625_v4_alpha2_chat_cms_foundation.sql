-- XETHKIOZ v4.0 Alpha 2 — Community Chat + CMS foundation
-- This file is documentation-ready. Review before running in Supabase.

create table if not exists public.chat_rooms (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  icon text,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  room_id uuid references public.chat_rooms(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete set null,
  display_name text not null default 'Visitante',
  body text not null check (char_length(body) <= 500),
  is_deleted boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.cms_drafts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique,
  excerpt text,
  content text,
  portal text check (portal in ('gaming','tech','science','streaming','community')),
  category_id uuid,
  cover_image text,
  status text not null default 'draft' check (status in ('draft','review','scheduled','published','archived')),
  seo_title text,
  seo_description text,
  scheduled_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.chat_rooms enable row level security;
alter table public.chat_messages enable row level security;
alter table public.cms_drafts enable row level security;

-- Public read for active rooms and non-deleted messages.
create policy if not exists "chat rooms are readable" on public.chat_rooms for select using (is_active = true);
create policy if not exists "chat messages are readable" on public.chat_messages for select using (is_deleted = false);

-- Authenticated users can insert messages. Moderation policies must be tightened before production.
create policy if not exists "authenticated users can insert chat messages" on public.chat_messages for insert to authenticated with check (true);

-- CMS drafts must be restricted to admin/editor roles in the next migration.
