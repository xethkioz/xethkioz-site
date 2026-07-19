-- Nexus City Capsule Chat
-- Adds safe contact-visible identity resolution and one RLS-protected chat per capsule.

alter table public.nexus_public_directory
  add column visibility text not null default 'public';

alter table public.nexus_public_directory
  add constraint nexus_public_directory_visibility
  check (visibility in ('public','contacts','private'));

insert into public.nexus_public_directory (
  user_id,handle,display_name,bio,status_text,locale,avatar_state,updated_at,visibility
)
select
  user_id,handle,display_name,bio,status_text,locale,avatar_state,updated_at,visibility
from public.nexus_public_profiles
on conflict (user_id) do update set
  handle=excluded.handle,display_name=excluded.display_name,bio=excluded.bio,
  status_text=excluded.status_text,locale=excluded.locale,
  avatar_state=excluded.avatar_state,updated_at=excluded.updated_at,
  visibility=excluded.visibility;

create or replace function public.xethkioz_sync_nexus_public_directory()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'DELETE' then
    delete from public.nexus_public_directory where user_id = old.user_id;
    return old;
  end if;

  insert into public.nexus_public_directory (
    user_id,handle,display_name,bio,status_text,locale,avatar_state,updated_at,visibility
  )
  values (
    new.user_id,new.handle,new.display_name,new.bio,new.status_text,new.locale,
    new.avatar_state,new.updated_at,new.visibility
  )
  on conflict (user_id) do update set
    handle=excluded.handle,display_name=excluded.display_name,bio=excluded.bio,
    status_text=excluded.status_text,locale=excluded.locale,
    avatar_state=excluded.avatar_state,updated_at=excluded.updated_at,
    visibility=excluded.visibility;
  return new;
end;
$$;

revoke all on function public.xethkioz_sync_nexus_public_directory() from public, anon, authenticated;

drop policy if exists nexus_public_directory_read on public.nexus_public_directory;
drop policy if exists nexus_public_directory_anon_read on public.nexus_public_directory;
drop policy if exists nexus_public_directory_authenticated_read on public.nexus_public_directory;

create policy nexus_public_directory_anon_read
on public.nexus_public_directory for select to anon
using (visibility = 'public');

create policy nexus_public_directory_authenticated_read
on public.nexus_public_directory for select to authenticated
using (
  visibility = 'public'
  or user_id = (select auth.uid())
  or (
    visibility = 'contacts'
    and not exists (
      select 1 from public.nexus_relationships relation
      where relation.status = 'blocked'
        and ((relation.requester_id = (select auth.uid()) and relation.addressee_id = user_id)
          or (relation.addressee_id = (select auth.uid()) and relation.requester_id = user_id))
    )
    and exists (
      select 1 from public.nexus_relationships relation
      where relation.status = 'accepted'
        and ((relation.requester_id = (select auth.uid()) and relation.addressee_id = user_id)
          or (relation.addressee_id = (select auth.uid()) and relation.requester_id = user_id))
    )
  )
);

create index if not exists nexus_public_directory_visibility_updated_idx
on public.nexus_public_directory (visibility, updated_at desc);

alter table public.chat_rooms
  add column owner_id uuid references auth.users(id) on delete cascade,
  add column room_kind text not null default 'public';

alter table public.chat_rooms
  add constraint chat_rooms_kind
  check (room_kind in ('public','capsule'));

create unique index chat_rooms_capsule_owner_idx
on public.chat_rooms (owner_id)
where room_kind = 'capsule';

alter table public.chat_messages
  drop constraint chat_messages_room_id_fkey;

alter table public.chat_messages
  add constraint chat_messages_room_id_fkey
  foreign key (room_id) references public.chat_rooms(id)
  on update cascade on delete cascade;

create or replace function public.xethkioz_upsert_nexus_capsule_chat(p_owner uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  capsule_handle text;
  capsule_name text;
  capsule_access text;
begin
  select profile.handle, profile.display_name
  into capsule_handle, capsule_name
  from public.nexus_public_profiles profile
  where profile.user_id = p_owner;

  if not found then
    delete from public.chat_rooms
    where owner_id = p_owner and room_kind = 'capsule';
    return;
  end if;

  select room.access
  into capsule_access
  from public.nexus_rooms room
  where room.owner_id = p_owner;

  if not found then
    delete from public.chat_rooms
    where owner_id = p_owner and room_kind = 'capsule';
    return;
  end if;

  update public.chat_rooms
  set
    id = 'capsule-' || capsule_handle,
    name = 'Cápsula @' || capsule_handle,
    icon = '◆',
    description = 'Chat contextual de la cápsula de ' || capsule_name,
    is_public = capsule_access = 'open'
  where owner_id = p_owner and room_kind = 'capsule';

  if not found then
    insert into public.chat_rooms (
      id,name,icon,description,is_public,owner_id,room_kind
    ) values (
      'capsule-' || capsule_handle,
      'Cápsula @' || capsule_handle,
      '◆',
      'Chat contextual de la cápsula de ' || capsule_name,
      capsule_access = 'open',
      p_owner,
      'capsule'
    );
  end if;
end;
$$;

revoke all on function public.xethkioz_upsert_nexus_capsule_chat(uuid) from public, anon, authenticated;

create or replace function public.xethkioz_sync_capsule_chat_from_profile()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'DELETE' then
    delete from public.chat_rooms
    where owner_id = old.user_id and room_kind = 'capsule';
    return old;
  end if;
  perform public.xethkioz_upsert_nexus_capsule_chat(new.user_id);
  return new;
end;
$$;

create or replace function public.xethkioz_sync_capsule_chat_from_room()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'DELETE' then
    delete from public.chat_rooms
    where owner_id = old.owner_id and room_kind = 'capsule';
    return old;
  end if;
  perform public.xethkioz_upsert_nexus_capsule_chat(new.owner_id);
  return new;
end;
$$;

revoke all on function public.xethkioz_sync_capsule_chat_from_profile() from public, anon, authenticated;
revoke all on function public.xethkioz_sync_capsule_chat_from_room() from public, anon, authenticated;

drop trigger if exists nexus_public_profiles_sync_capsule_chat on public.nexus_public_profiles;
create trigger nexus_public_profiles_sync_capsule_chat
after insert or update of handle,display_name or delete
on public.nexus_public_profiles
for each row execute function public.xethkioz_sync_capsule_chat_from_profile();

drop trigger if exists nexus_rooms_sync_capsule_chat on public.nexus_rooms;
create trigger nexus_rooms_sync_capsule_chat
after insert or update of access or delete
on public.nexus_rooms
for each row execute function public.xethkioz_sync_capsule_chat_from_room();

select public.xethkioz_upsert_nexus_capsule_chat(profile.user_id)
from public.nexus_public_profiles profile;

drop policy if exists chat_rooms_public_read on public.chat_rooms;
create policy chat_rooms_access_read
on public.chat_rooms for select to anon, authenticated
using (
  (room_kind = 'public' and is_public = true)
  or (
    room_kind = 'capsule'
    and exists (
      select 1 from public.nexus_rooms room
      where room.owner_id = chat_rooms.owner_id
    )
  )
);

drop policy if exists chat_messages_public_read on public.chat_messages;
create policy chat_messages_access_read
on public.chat_messages for select to anon, authenticated
using (
  exists (
    select 1 from public.chat_rooms room
    where room.id = chat_messages.room_id
  )
);

drop policy if exists chat_messages_guest_insert on public.chat_messages;
create policy chat_messages_guest_insert
on public.chat_messages for insert to anon
with check (
  exists (select 1 from public.chat_rooms room where room.id = chat_messages.room_id)
  and user_id is null
  and role = 'guest'
  and char_length(display_name) between 1 and 40
  and char_length(body) between 1 and 500
  and not public.xethkioz_is_reserved_display_name(display_name)
);

drop policy if exists chat_messages_member_insert on public.chat_messages;
create policy chat_messages_member_insert
on public.chat_messages for insert to authenticated
with check (
  exists (select 1 from public.chat_rooms room where room.id = chat_messages.room_id)
  and user_id = (select auth.uid())
  and role = 'member'
  and char_length(display_name) between 1 and 40
  and char_length(body) between 1 and 500
  and (
    not public.xethkioz_is_reserved_display_name(display_name)
    or public.xethkioz_has_role(array['ADMIN'])
  )
);

comment on column public.nexus_public_directory.visibility is 'Safe access label used by RLS; no private room state is stored in this directory.';
comment on column public.chat_rooms.owner_id is 'Capsule owner. Null for global editorial chat rooms.';
comment on column public.chat_rooms.room_kind is 'Distinguishes global public rooms from Nexus capsule rooms.';

