-- Keep profile data private, prevent self-escalation and persist meaningful
-- community activity for authenticated users.

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_all" on public.profiles;
drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_select_admin" on public.profiles;
drop policy if exists "profiles_select_own_or_admin" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
drop policy if exists "profiles_public_read" on public.profiles;
drop policy if exists "profiles_self_read" on public.profiles;
drop policy if exists "profiles_admin_read" on public.profiles;
drop policy if exists "profiles_self_insert" on public.profiles;
drop policy if exists "profiles_self_insert_basic_only" on public.profiles;
drop policy if exists "profiles_self_update" on public.profiles;
drop policy if exists "profiles_self_update_guarded" on public.profiles;
drop policy if exists "profiles_admin_update" on public.profiles;
drop policy if exists "profiles_admin_update_guarded" on public.profiles;

create policy "profiles_select_own_or_admin"
on public.profiles
for select
to authenticated
using (
  (select auth.uid()) = id
  or public.xethkioz_has_role(array['ADMIN'])
);

create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check (
  (select auth.uid()) = id
  and role::text in ('GUEST', 'USER')
  and subscription_tier::text = 'BASIC'
);

create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

revoke all on table public.profiles from anon;
revoke all on table public.profiles from authenticated;
grant select, insert on table public.profiles to authenticated;
grant update (username, display_name, avatar_url, bio) on table public.profiles to authenticated;

create table if not exists public.user_activity_events (
  id text primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  event_type text not null check (event_type in ('visit', 'chat', 'portal', 'daily', 'mission')),
  route text not null check (char_length(route) between 1 and 180),
  points integer not null check (points between 1 and 100),
  created_at timestamptz not null default now()
);

create index if not exists user_activity_events_user_created_idx
  on public.user_activity_events (user_id, created_at desc);

alter table public.user_activity_events enable row level security;
alter table public.user_activity_events force row level security;

drop policy if exists "user_activity_select_own" on public.user_activity_events;
drop policy if exists "user_activity_insert_own" on public.user_activity_events;
drop policy if exists "user_activity_select_admin" on public.user_activity_events;
drop policy if exists "user_activity_select_own_or_admin" on public.user_activity_events;

create policy "user_activity_select_own_or_admin"
on public.user_activity_events
for select
to authenticated
using (
  (select auth.uid()) = user_id
  or public.xethkioz_has_role(array['ADMIN'])
);

create policy "user_activity_insert_own"
on public.user_activity_events
for insert
to authenticated
with check ((select auth.uid()) = user_id);

revoke all on table public.user_activity_events from public, anon, authenticated;
grant select, insert on table public.user_activity_events to authenticated;

-- Guests remain welcome in public rooms, while authenticated members get a
-- verified user_id and cannot forge another user's identity.
drop policy if exists "chat_messages_public_insert" on public.chat_messages;
drop policy if exists "chat_messages_guest_insert" on public.chat_messages;
drop policy if exists "chat_messages_member_insert" on public.chat_messages;

create policy "chat_messages_guest_insert"
on public.chat_messages
for insert
to anon
with check (
  exists (
    select 1 from public.chat_rooms
    where chat_rooms.id = chat_messages.room_id
      and chat_rooms.is_public = true
  )
  and user_id is null
  and role = 'guest'
  and char_length(display_name) between 1 and 40
  and char_length(body) between 1 and 500
  and not public.xethkioz_is_reserved_display_name(display_name)
);

create policy "chat_messages_member_insert"
on public.chat_messages
for insert
to authenticated
with check (
  exists (
    select 1 from public.chat_rooms
    where chat_rooms.id = chat_messages.room_id
      and chat_rooms.is_public = true
  )
  and user_id = (select auth.uid())
  and role = 'member'
  and char_length(display_name) between 1 and 40
  and char_length(body) between 1 and 500
  and (
    not public.xethkioz_is_reserved_display_name(display_name)
    or public.xethkioz_has_role(array['ADMIN'])
  )
);

create index if not exists chat_messages_user_id_idx
  on public.chat_messages (user_id)
  where user_id is not null;

revoke update, delete, truncate, references, trigger
  on table public.chat_messages
  from anon, authenticated;
