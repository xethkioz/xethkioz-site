-- XETHKIOZ Stage 2D
-- Realtime community chat foundation for NexusChatWidget.
-- Safe to run more than once in Supabase SQL Editor.

create extension if not exists pgcrypto;

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
  room_id text not null references public.chat_rooms(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  display_name text not null default 'Visitante',
  role text not null default 'guest' check (role in ('host','mod','member','guest')),
  body text not null check (char_length(body) between 1 and 500),
  created_at timestamptz not null default now()
);

insert into public.chat_rooms (id, name, icon, description, is_public) values
('general','General','💬','Charla libre de la comunidad XETHKIOZ', true),
('gaming','Gaming','🎮','Juegos, builds, lanzamientos y comunidad', true),
('ia','IA','🤖','Herramientas, automatización y creación', true),
('science','Ciencia','🔬','Ciencia, fake news y pensamiento crítico', true),
('streaming','Streaming','📺','OBS, Kick, Twitch, clips y overlays', true),
('asia','Asia Gaming','🌏','Corea, Japón, China y SEA para LATAM', true),
('green-node','Green Node','🟢','Linux, privacidad, terminal y ciberseguridad educativa', true),
('fun','Memes','😂','Memes, clips, rarezas y descanso de la comunidad', true)
on conflict (id) do update set
  name = excluded.name,
  icon = excluded.icon,
  description = excluded.description,
  is_public = excluded.is_public;

create index if not exists idx_chat_messages_room_created on public.chat_messages(room_id, created_at desc);

alter table public.chat_rooms enable row level security;
alter table public.chat_messages enable row level security;

drop policy if exists "chat_rooms_public_read" on public.chat_rooms;
drop policy if exists "chat_messages_public_read" on public.chat_messages;
drop policy if exists "chat_messages_public_insert" on public.chat_messages;

create policy "chat_rooms_public_read" on public.chat_rooms
for select using (is_public = true);

create policy "chat_messages_public_read" on public.chat_messages
for select using (
  exists (
    select 1 from public.chat_rooms
    where chat_rooms.id = chat_messages.room_id
      and chat_rooms.is_public = true
  )
);

create policy "chat_messages_public_insert" on public.chat_messages
for insert with check (
  exists (
    select 1 from public.chat_rooms
    where chat_rooms.id = chat_messages.room_id
      and chat_rooms.is_public = true
  )
  and char_length(display_name) between 1 and 40
  and char_length(body) between 1 and 500
  and role in ('guest','member')
);

grant select on public.chat_rooms to anon, authenticated;
grant select, insert on public.chat_messages to anon, authenticated;

do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime')
     and not exists (
       select 1
       from pg_publication_tables
       where pubname = 'supabase_realtime'
         and schemaname = 'public'
         and tablename = 'chat_messages'
     ) then
    alter publication supabase_realtime add table public.chat_messages;
  end if;
end $$;
