-- XETHKIOZ v4.0 Alpha 3
-- Base para CMS editorial, comentarios, reacciones y chat comunitario.
-- Ejecutar manualmente en Supabase cuando se avance de mock/localStorage a datos reales.

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  article_id uuid,
  user_id uuid references auth.users(id) on delete set null,
  display_name text not null default 'Visitante',
  body text not null check (char_length(body) between 1 and 800),
  status text not null default 'published' check (status in ('pending','published','hidden','deleted')),
  created_at timestamptz not null default now()
);

create table if not exists public.article_reactions (
  id uuid primary key default gen_random_uuid(),
  article_slug text not null,
  user_id uuid references auth.users(id) on delete cascade,
  reaction text not null check (reaction in ('like','hype','think','share')),
  created_at timestamptz not null default now(),
  unique(article_slug, user_id, reaction)
);

create table if not exists public.chat_rooms (
  id text primary key,
  name text not null,
  icon text not null default '💬',
  description text,
  is_public boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  room_id text references public.chat_rooms(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  display_name text not null default 'Visitante',
  role text not null default 'member' check (role in ('host','mod','member','guest')),
  body text not null check (char_length(body) between 1 and 500),
  created_at timestamptz not null default now()
);

insert into public.chat_rooms (id, name, icon, description) values
('general','General','💬','Charla libre de la comunidad XETHKIOZ'),
('gaming','Gaming','🎮','Juegos, builds, lanzamientos y comunidad'),
('ia','IA','🤖','Herramientas, automatización y creación'),
('science','Ciencia','🔬','Ciencia, fake news y pensamiento crítico'),
('streaming','Streaming','📺','OBS, Kick, Twitch, clips y overlays'),
('asia','Asia Gaming','🌏','Corea, Japón, China y SEA para LATAM')
on conflict (id) do nothing;

alter table public.comments enable row level security;
alter table public.article_reactions enable row level security;
alter table public.chat_rooms enable row level security;
alter table public.chat_messages enable row level security;

create policy if not exists "Public read published comments" on public.comments for select using (status = 'published');
create policy if not exists "Authenticated insert comments" on public.comments for insert with check (auth.uid() = user_id or user_id is null);

create policy if not exists "Public read reactions" on public.article_reactions for select using (true);
create policy if not exists "Authenticated manage own reactions" on public.article_reactions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy if not exists "Public read chat rooms" on public.chat_rooms for select using (is_public = true);
create policy if not exists "Public read chat messages" on public.chat_messages for select using (true);
create policy if not exists "Authenticated insert chat messages" on public.chat_messages for insert with check (auth.uid() = user_id or user_id is null);

-- Realtime: activar desde Supabase Dashboard si no está en la publicación.
-- alter publication supabase_realtime add table public.chat_messages;
