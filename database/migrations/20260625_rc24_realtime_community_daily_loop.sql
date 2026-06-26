-- XETHKIOZ v4.0 RC2.4 — Realtime Community + Daily Loop
-- Apply in Supabase after the current baseline.

create table if not exists public.xeth_chat_messages (
  id text primary key,
  room text not null default 'general',
  "user" text not null default 'Visitante',
  role text not null default 'guest' check (role in ('host','mod','member','guest')),
  text text not null check (char_length(text) between 1 and 280),
  created_at timestamptz not null default now(),
  is_deleted boolean not null default false
);

create index if not exists idx_xeth_chat_messages_room_created on public.xeth_chat_messages(room, created_at desc);
create index if not exists idx_xeth_chat_messages_visible on public.xeth_chat_messages(room, is_deleted, created_at desc);

create table if not exists public.xeth_presence_routes (
  client_id text primary key,
  display_name text,
  route text not null default '/',
  room text not null default 'general',
  last_seen timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_xeth_presence_routes_route_seen on public.xeth_presence_routes(route, last_seen desc);
create index if not exists idx_xeth_presence_routes_room_seen on public.xeth_presence_routes(room, last_seen desc);

create table if not exists public.xeth_wisp_events (
  id text primary key,
  client_id text,
  event_type text not null default 'visit',
  route text not null default '/',
  points integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_xeth_wisp_events_route_created on public.xeth_wisp_events(route, created_at desc);
create index if not exists idx_xeth_wisp_events_client_created on public.xeth_wisp_events(client_id, created_at desc);

create table if not exists public.xeth_daily_content_slots (
  id uuid primary key default gen_random_uuid(),
  slot_date date not null default current_date,
  portal text not null,
  slot_key text not null,
  title text not null,
  summary text,
  source_name text,
  source_url text,
  target_url text,
  status text not null default 'draft' check (status in ('draft','review','published','archived')),
  priority integer not null default 50,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(slot_date, portal, slot_key)
);

create index if not exists idx_xeth_daily_content_slots_date_portal on public.xeth_daily_content_slots(slot_date desc, portal, priority desc);

alter table public.xeth_chat_messages enable row level security;
alter table public.xeth_presence_routes enable row level security;
alter table public.xeth_wisp_events enable row level security;
alter table public.xeth_daily_content_slots enable row level security;

drop policy if exists "xeth chat readable" on public.xeth_chat_messages;
create policy "xeth chat readable" on public.xeth_chat_messages for select using (is_deleted = false);

drop policy if exists "xeth chat visitor insert" on public.xeth_chat_messages;
create policy "xeth chat visitor insert" on public.xeth_chat_messages for insert with check (is_deleted = false and char_length(text) between 1 and 280 and role in ('guest','member'));

drop policy if exists "xeth presence readable" on public.xeth_presence_routes;
create policy "xeth presence readable" on public.xeth_presence_routes for select using (true);

drop policy if exists "xeth presence insert" on public.xeth_presence_routes;
create policy "xeth presence insert" on public.xeth_presence_routes for insert with check (true);

drop policy if exists "xeth presence update" on public.xeth_presence_routes;
create policy "xeth presence update" on public.xeth_presence_routes for update using (true) with check (true);

drop policy if exists "xeth wisp events readable" on public.xeth_wisp_events;
create policy "xeth wisp events readable" on public.xeth_wisp_events for select using (true);

drop policy if exists "xeth wisp events insert" on public.xeth_wisp_events;
create policy "xeth wisp events insert" on public.xeth_wisp_events for insert with check (points between 0 and 500);

drop policy if exists "xeth daily slots readable" on public.xeth_daily_content_slots;
create policy "xeth daily slots readable" on public.xeth_daily_content_slots for select using (status in ('review','published'));

-- Enable realtime publication when running with sufficient privileges.
do $$
begin
  begin
    alter publication supabase_realtime add table public.xeth_chat_messages;
  exception when duplicate_object then null; when insufficient_privilege then null; when undefined_object then null;
  end;
  begin
    alter publication supabase_realtime add table public.xeth_presence_routes;
  exception when duplicate_object then null; when insufficient_privilege then null; when undefined_object then null;
  end;
  begin
    alter publication supabase_realtime add table public.xeth_wisp_events;
  exception when duplicate_object then null; when insufficient_privilege then null; when undefined_object then null;
  end;
end $$;

insert into public.xeth_daily_content_slots (portal, slot_key, title, summary, source_name, target_url, status, priority)
values
  ('home', 'today-lead', 'Hoy en XETHKIOZ: comunidad, noticias y actividad diaria', 'Slot inicial para que la portada siempre tenga un foco editorial rotativo.', 'XETHKIOZ Editorial', '/news', 'review', 95),
  ('gaming', 'daily-radar', 'Radar gamer diario', 'Base para elegir cinco titulares y convertir uno en noticia propia.', 'XETHKIOZ Gaming', '/gaming', 'review', 90),
  ('science', 'verified-report', 'Informe verificado Science Lab', 'Base para informes con fuente, evidencia y fecha de revisión.', 'XETHKIOZ Science Lab', '/science', 'review', 88),
  ('green-node', 'node-log', 'Green Node log educativo', 'Linux, programación, OSINT ético y cultura hacker defensiva.', 'XETHKIOZ Green Node', '/green-node', 'review', 82)
on conflict (slot_date, portal, slot_key) do nothing;
