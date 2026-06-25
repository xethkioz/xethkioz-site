-- XETHKIOZ v4.0 Alpha 4 — CMS + Chat + Reactions Foundation
-- Ejecutar manualmente en Supabase SQL Editor cuando se quiera activar la base real.

create table if not exists public.chat_rooms (
  id text primary key,
  name text not null,
  icon text,
  description text,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.chat_messages
  add column if not exists room_id text references public.chat_rooms(id) on delete set null,
  add column if not exists role text default 'guest',
  add column if not exists metadata jsonb not null default '{}'::jsonb;

create table if not exists public.article_reactions (
  id uuid primary key default gen_random_uuid(),
  article_id uuid references public.articles(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  reaction text not null,
  created_at timestamptz not null default now(),
  unique(article_id, user_id, reaction)
);

create table if not exists public.cms_drafts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references public.profiles(id) on delete set null,
  title text not null,
  slug text,
  excerpt text,
  content text,
  category_id uuid references public.categories(id) on delete set null,
  tags text[] not null default '{}',
  cover_image text,
  seo_title text,
  seo_description text,
  status text not null default 'draft',
  scheduled_at timestamptz,
  ai_metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_chat_messages_room_created on public.chat_messages(room_id, created_at desc);
create index if not exists idx_article_reactions_article on public.article_reactions(article_id);
create index if not exists idx_cms_drafts_status on public.cms_drafts(status);

insert into public.chat_rooms (id, name, icon, description, sort_order)
values
  ('general', 'General', '💬', 'Charla libre de la comunidad XETHKIOZ.', 1),
  ('gaming', 'Gaming', '🎮', 'Juegos, builds, directos y recomendaciones.', 2),
  ('ia', 'IA', '🤖', 'Herramientas, automatización y creación.', 3),
  ('science', 'Ciencia', '🔬', 'Espacio, medicina, fake news y pensamiento crítico.', 4),
  ('streaming', 'Streaming', '📺', 'OBS, Kick, Twitch, clips y overlays.', 5),
  ('asia', 'Asia Gaming', '🌏', 'Tendencias de Asia para LATAM.', 6)
on conflict (id) do update set
  name = excluded.name,
  icon = excluded.icon,
  description = excluded.description,
  sort_order = excluded.sort_order;
