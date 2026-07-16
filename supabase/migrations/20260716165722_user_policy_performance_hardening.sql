-- Consolidate equivalent permissive policies and index the authenticated
-- chat relationship. This keeps authorization explicit while avoiding
-- duplicate policy evaluation on every row.

drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_select_admin" on public.profiles;
drop policy if exists "profiles_select_own_or_admin" on public.profiles;

create policy "profiles_select_own_or_admin"
on public.profiles
for select
to authenticated
using (
  (select auth.uid()) = id
  or public.xethkioz_has_role(array['ADMIN'])
);

drop policy if exists "user_activity_select_own" on public.user_activity_events;
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

drop policy if exists "chat_messages_guest_insert" on public.chat_messages;

create policy "chat_messages_guest_insert"
on public.chat_messages
for insert
to anon
with check (
  exists (
    select 1
    from public.chat_rooms
    where chat_rooms.id = chat_messages.room_id
      and chat_rooms.is_public = true
  )
  and user_id is null
  and role = 'guest'
  and char_length(display_name) between 1 and 40
  and char_length(body) between 1 and 500
  and not public.xethkioz_is_reserved_display_name(display_name)
);

create index if not exists chat_messages_user_id_idx
on public.chat_messages (user_id)
where user_id is not null;
