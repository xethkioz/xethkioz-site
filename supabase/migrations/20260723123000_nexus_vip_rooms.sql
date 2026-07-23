-- Invite-only Nexus rooms.
-- VIP means a private, ephemeral conversation space. Membership is never
-- purchasable and invitations are limited to accepted contacts.

create table if not exists public.nexus_vip_rooms (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  codename text not null check (char_length(codename) between 3 and 48),
  theme text not null default 'violet' check (theme in ('violet', 'cyan', 'orange', 'green')),
  status text not null default 'active' check (status in ('active', 'closed')),
  expires_at timestamptz not null default (now() + interval '7 days'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (expires_at > created_at),
  check (expires_at <= created_at + interval '7 days')
);

create table if not exists public.nexus_vip_room_members (
  room_id uuid not null references public.nexus_vip_rooms(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  invited_by uuid not null references auth.users(id) on delete cascade,
  status text not null default 'invited' check (status in ('invited', 'active', 'declined')),
  created_at timestamptz not null default now(),
  responded_at timestamptz,
  primary key (room_id, user_id),
  check (user_id <> invited_by)
);

create table if not exists public.nexus_vip_messages (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.nexus_vip_rooms(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 500),
  created_at timestamptz not null default now()
);

create index if not exists nexus_vip_rooms_owner_active_idx
  on public.nexus_vip_rooms (owner_id, created_at desc)
  where status = 'active';
create index if not exists nexus_vip_rooms_expiry_idx
  on public.nexus_vip_rooms (expires_at)
  where status = 'active';
create index if not exists nexus_vip_members_user_status_idx
  on public.nexus_vip_room_members (user_id, status, created_at desc);
create index if not exists nexus_vip_members_inviter_created_idx
  on public.nexus_vip_room_members (invited_by, created_at desc);
create index if not exists nexus_vip_messages_room_created_idx
  on public.nexus_vip_messages (room_id, created_at desc);
create index if not exists nexus_vip_messages_sender_created_idx
  on public.nexus_vip_messages (sender_id, created_at desc);

alter table public.nexus_vip_rooms enable row level security;
alter table public.nexus_vip_room_members enable row level security;
alter table public.nexus_vip_messages enable row level security;

create or replace function private.xethkioz_vip_can_view(target_room_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.nexus_vip_rooms room
    where room.id = target_room_id
      and room.status = 'active'
      and room.expires_at > now()
      and (
        room.owner_id = auth.uid()
        or exists (
          select 1
          from public.nexus_vip_room_members member
          where member.room_id = room.id
            and member.user_id = auth.uid()
            and member.status in ('invited', 'active')
        )
      )
  );
$$;

create or replace function private.xethkioz_vip_can_message(target_room_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.nexus_vip_rooms room
    where room.id = target_room_id
      and room.status = 'active'
      and room.expires_at > now()
      and (
        room.owner_id = auth.uid()
        or exists (
          select 1
          from public.nexus_vip_room_members member
          where member.room_id = room.id
            and member.user_id = auth.uid()
            and member.status = 'active'
        )
      )
  );
$$;

create or replace function private.xethkioz_guard_vip_room_create()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.owner_id <> auth.uid() then
    raise exception 'ROOM_OWNER_MISMATCH';
  end if;

  if (
    select count(*)
    from public.nexus_vip_rooms
    where owner_id = auth.uid()
      and status = 'active'
      and expires_at > now()
  ) >= 3 then
    raise exception 'ACTIVE_ROOM_LIMIT';
  end if;

  new.status := 'active';
  new.created_at := now();
  new.updated_at := now();
  new.expires_at := least(new.expires_at, now() + interval '7 days');
  return new;
end;
$$;

create or replace function private.xethkioz_guard_vip_invite()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  room_owner uuid;
begin
  select owner_id into room_owner
  from public.nexus_vip_rooms
  where id = new.room_id
    and status = 'active'
    and expires_at > now();

  if room_owner is null or room_owner <> auth.uid() or new.invited_by <> auth.uid() then
    raise exception 'INVITE_OWNER_REQUIRED';
  end if;

  if (
    select count(*)
    from public.nexus_vip_room_members
    where room_id = new.room_id
      and status in ('invited', 'active')
  ) >= 8 then
    raise exception 'ROOM_MEMBER_LIMIT';
  end if;

  if not exists (
    select 1
    from public.nexus_relationships relation
    where relation.status = 'accepted'
      and (
        (relation.requester_id = auth.uid() and relation.addressee_id = new.user_id)
        or (relation.addressee_id = auth.uid() and relation.requester_id = new.user_id)
      )
  ) then
    raise exception 'ACCEPTED_CONTACT_REQUIRED';
  end if;

  new.status := 'invited';
  new.created_at := now();
  new.responded_at := null;
  return new;
end;
$$;

create or replace function private.xethkioz_guard_vip_invite_response()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if
    new.room_id <> old.room_id
    or new.user_id <> old.user_id
    or new.invited_by <> old.invited_by
  then
    raise exception 'VIP_MEMBERSHIP_IDENTITY_IMMUTABLE';
  end if;

  if old.status <> 'invited' or new.status not in ('active', 'declined') then
    raise exception 'INVALID_INVITATION_RESPONSE';
  end if;

  new.created_at := old.created_at;
  new.responded_at := now();
  return new;
end;
$$;

create or replace function private.xethkioz_guard_vip_message()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.sender_id <> auth.uid() or not private.xethkioz_vip_can_message(new.room_id) then
    raise exception 'VIP_MESSAGE_ACCESS_DENIED';
  end if;

  new.body := btrim(new.body);
  if char_length(new.body) < 1 then
    raise exception 'VIP_MESSAGE_EMPTY';
  end if;

  if (
    select count(*)
    from public.nexus_vip_messages
    where sender_id = auth.uid()
      and created_at > now() - interval '1 minute'
  ) >= 12 then
    raise exception 'VIP_MESSAGE_RATE_LIMIT';
  end if;

  new.created_at := now();
  return new;
end;
$$;

revoke all on function private.xethkioz_vip_can_view(uuid) from public, anon;
revoke all on function private.xethkioz_vip_can_message(uuid) from public, anon;
revoke all on function private.xethkioz_guard_vip_room_create() from public, anon, authenticated;
revoke all on function private.xethkioz_guard_vip_invite() from public, anon, authenticated;
revoke all on function private.xethkioz_guard_vip_invite_response() from public, anon, authenticated;
revoke all on function private.xethkioz_guard_vip_message() from public, anon, authenticated;
grant execute on function private.xethkioz_vip_can_view(uuid) to authenticated, service_role;
grant execute on function private.xethkioz_vip_can_message(uuid) to authenticated, service_role;

drop trigger if exists nexus_vip_room_create_guard on public.nexus_vip_rooms;
create trigger nexus_vip_room_create_guard
before insert on public.nexus_vip_rooms
for each row execute function private.xethkioz_guard_vip_room_create();

drop trigger if exists nexus_vip_invite_guard on public.nexus_vip_room_members;
create trigger nexus_vip_invite_guard
before insert on public.nexus_vip_room_members
for each row execute function private.xethkioz_guard_vip_invite();

drop trigger if exists nexus_vip_invite_response_guard on public.nexus_vip_room_members;
create trigger nexus_vip_invite_response_guard
before update on public.nexus_vip_room_members
for each row execute function private.xethkioz_guard_vip_invite_response();

drop trigger if exists nexus_vip_message_guard on public.nexus_vip_messages;
create trigger nexus_vip_message_guard
before insert on public.nexus_vip_messages
for each row execute function private.xethkioz_guard_vip_message();

drop policy if exists nexus_vip_rooms_member_read on public.nexus_vip_rooms;
create policy nexus_vip_rooms_member_read
on public.nexus_vip_rooms
for select
to authenticated
using (
  owner_id = (select auth.uid())
  or (select private.xethkioz_vip_can_view(id))
);

drop policy if exists nexus_vip_rooms_owner_insert on public.nexus_vip_rooms;
create policy nexus_vip_rooms_owner_insert
on public.nexus_vip_rooms
for insert
to authenticated
with check (owner_id = (select auth.uid()));

drop policy if exists nexus_vip_rooms_owner_update on public.nexus_vip_rooms;
create policy nexus_vip_rooms_owner_update
on public.nexus_vip_rooms
for update
to authenticated
using (owner_id = (select auth.uid()))
with check (owner_id = (select auth.uid()));

drop policy if exists nexus_vip_members_room_read on public.nexus_vip_room_members;
create policy nexus_vip_members_room_read
on public.nexus_vip_room_members
for select
to authenticated
using ((select private.xethkioz_vip_can_view(room_id)));

drop policy if exists nexus_vip_members_owner_invite on public.nexus_vip_room_members;
create policy nexus_vip_members_owner_invite
on public.nexus_vip_room_members
for insert
to authenticated
with check (
  invited_by = (select auth.uid())
  and exists (
    select 1
    from public.nexus_vip_rooms room
    where room.id = room_id
      and room.owner_id = (select auth.uid())
  )
);

drop policy if exists nexus_vip_members_invitee_respond on public.nexus_vip_room_members;
create policy nexus_vip_members_invitee_respond
on public.nexus_vip_room_members
for update
to authenticated
using (user_id = (select auth.uid()) and status = 'invited')
with check (user_id = (select auth.uid()) and status in ('active', 'declined'));

drop policy if exists nexus_vip_members_owner_revoke on public.nexus_vip_room_members;
create policy nexus_vip_members_owner_revoke
on public.nexus_vip_room_members
for delete
to authenticated
using (
  exists (
    select 1
    from public.nexus_vip_rooms room
    where room.id = room_id
      and room.owner_id = (select auth.uid())
  )
);

drop policy if exists nexus_vip_messages_member_read on public.nexus_vip_messages;
create policy nexus_vip_messages_member_read
on public.nexus_vip_messages
for select
to authenticated
using ((select private.xethkioz_vip_can_message(room_id)));

drop policy if exists nexus_vip_messages_member_insert on public.nexus_vip_messages;
create policy nexus_vip_messages_member_insert
on public.nexus_vip_messages
for insert
to authenticated
with check (
  sender_id = (select auth.uid())
  and (select private.xethkioz_vip_can_message(room_id))
);

revoke all on public.nexus_vip_rooms, public.nexus_vip_room_members, public.nexus_vip_messages from public, anon, authenticated;
grant select, insert on public.nexus_vip_rooms to authenticated;
grant update (codename, theme, status, updated_at) on public.nexus_vip_rooms to authenticated;
grant select, insert, delete on public.nexus_vip_room_members to authenticated;
grant update (status, responded_at) on public.nexus_vip_room_members to authenticated;
grant select, insert on public.nexus_vip_messages to authenticated;

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'nexus_vip_messages'
  ) then
    alter publication supabase_realtime add table public.nexus_vip_messages;
  end if;
end
$$;

comment on table public.nexus_vip_rooms is
  'Ephemeral invite-only social rooms. VIP denotes privacy and cosmetics, never paid communication access.';
