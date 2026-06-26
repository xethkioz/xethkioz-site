-- XETHKIOZ v4.0 RC4.0 — Stability Core / Public Chat hardening
-- Apply in Supabase SQL editor. Public chat must work without login.

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

alter table public.xeth_chat_messages enable row level security;

drop policy if exists "xeth chat readable" on public.xeth_chat_messages;
create policy "xeth chat readable" on public.xeth_chat_messages
for select to anon, authenticated
using (is_deleted = false);

drop policy if exists "xeth chat visitor insert" on public.xeth_chat_messages;
create policy "xeth chat visitor insert" on public.xeth_chat_messages
for insert to anon, authenticated
with check (is_deleted = false and room = 'general' and role in ('guest','member') and char_length(text) between 1 and 280);

grant usage on schema public to anon, authenticated;
grant select, insert on public.xeth_chat_messages to anon, authenticated;

do $$
begin
  begin
    alter publication supabase_realtime add table public.xeth_chat_messages;
  exception
    when duplicate_object then null;
    when insufficient_privilege then null;
    when undefined_object then null;
  end;
end $$;

insert into public.xeth_chat_messages (id, room, "user", role, text, created_at)
values ('rc4-welcome-general', 'general', 'XETHKIOZ System', 'mod', 'Chat público RC4 listo: sala general visible para todos los visitantes.', now())
on conflict (id) do nothing;
