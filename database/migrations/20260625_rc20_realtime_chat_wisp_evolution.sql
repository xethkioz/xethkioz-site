-- XETHKIOZ v4.0 RC2.0
-- Realtime chat + Wisp evolution baseline

create table if not exists public.xeth_chat_rooms (
  id text primary key,
  name text not null,
  icon text not null default '💬',
  description text,
  portal text not null default 'network',
  is_public boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.xeth_chat_messages (
  id uuid primary key default gen_random_uuid(),
  room text not null references public.xeth_chat_rooms(id) on delete cascade,
  user text not null default 'Visitante',
  role text not null default 'guest' check (role in ('host','mod','member','guest')),
  text text not null check (char_length(text) between 1 and 280),
  created_at timestamptz not null default now()
);

create index if not exists idx_xeth_chat_messages_room_created on public.xeth_chat_messages(room, created_at desc);

create table if not exists public.xeth_presence_routes (
  id uuid primary key default gen_random_uuid(),
  client_id text not null,
  display_name text,
  route text not null,
  portal text not null default 'network',
  last_seen timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique(client_id, route)
);

create index if not exists idx_xeth_presence_routes_seen on public.xeth_presence_routes(route, last_seen desc);

create table if not exists public.xeth_wisp_events (
  id uuid primary key default gen_random_uuid(),
  client_id text,
  event_type text not null,
  route text,
  xp integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_xeth_wisp_events_created on public.xeth_wisp_events(created_at desc);

insert into public.xeth_chat_rooms (id, name, icon, description, portal, sort_order) values
  ('general', 'General', '💬', 'Charla libre de la comunidad XETHKIOZ.', 'network', 1),
  ('gaming', 'Gaming', '🎮', 'Juegos, builds, directos y recomendaciones.', 'gaming', 2),
  ('ia', 'IA', '🤖', 'Herramientas, automatización y creación.', 'ai-lab', 3),
  ('science', 'Ciencia', '🔬', 'Espacio, medicina, papers y pensamiento crítico.', 'science', 4),
  ('streaming', 'Streaming', '📺', 'OBS, Kick, Twitch, clips y overlays.', 'streaming', 5),
  ('green-node', 'Green Node', '🟢', 'Linux, programación, OSINT educativo y seguridad defensiva.', 'green-node', 6),
  ('asia', 'Asia Gaming', '🌏', 'Tendencias de Corea, Japón, China y SEA.', 'asia-gaming', 7)
on conflict (id) do update set
  name = excluded.name,
  icon = excluded.icon,
  description = excluded.description,
  portal = excluded.portal,
  sort_order = excluded.sort_order;

alter table public.xeth_chat_rooms enable row level security;
alter table public.xeth_chat_messages enable row level security;
alter table public.xeth_presence_routes enable row level security;
alter table public.xeth_wisp_events enable row level security;

drop policy if exists "Public rooms are readable" on public.xeth_chat_rooms;
create policy "Public rooms are readable" on public.xeth_chat_rooms for select using (is_public = true);

drop policy if exists "Public chat messages are readable" on public.xeth_chat_messages;
create policy "Public chat messages are readable" on public.xeth_chat_messages for select using (true);

drop policy if exists "Visitors can write short chat messages" on public.xeth_chat_messages;
create policy "Visitors can write short chat messages" on public.xeth_chat_messages for insert with check (char_length(text) between 1 and 280 and role in ('guest','member'));

drop policy if exists "Presence is readable" on public.xeth_presence_routes;
create policy "Presence is readable" on public.xeth_presence_routes for select using (true);

drop policy if exists "Visitors can upsert their presence" on public.xeth_presence_routes;
create policy "Visitors can upsert their presence" on public.xeth_presence_routes for insert with check (true);

drop policy if exists "Visitors can update their presence" on public.xeth_presence_routes;
create policy "Visitors can update their presence" on public.xeth_presence_routes for update using (true) with check (true);

drop policy if exists "Wisp events are readable" on public.xeth_wisp_events;
create policy "Wisp events are readable" on public.xeth_wisp_events for select using (true);

drop policy if exists "Visitors can create wisp events" on public.xeth_wisp_events;
create policy "Visitors can create wisp events" on public.xeth_wisp_events for insert with check (xp >= 0 and xp <= 500);

-- Enable Realtime from Supabase dashboard if not already enabled:
-- Database > Replication > add xeth_chat_messages and xeth_presence_routes to realtime publication.
