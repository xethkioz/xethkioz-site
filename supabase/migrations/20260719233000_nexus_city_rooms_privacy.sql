-- Nexus City Living Rooms
-- Safe public passport projection plus independently protected capsule state.

create table if not exists public.nexus_public_directory (
  user_id uuid primary key references auth.users(id) on delete cascade,
  handle text not null unique,
  display_name text not null,
  bio text not null default '',
  status_text text not null default '',
  locale text not null default 'es',
  avatar_state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint nexus_public_directory_handle_format check (handle ~ '^[a-z0-9_]{3,24}$'),
  constraint nexus_public_directory_display_name_length check (char_length(display_name) between 1 and 40),
  constraint nexus_public_directory_bio_length check (char_length(bio) <= 280),
  constraint nexus_public_directory_status_length check (char_length(status_text) <= 80),
  constraint nexus_public_directory_locale check (locale in ('es','en')),
  constraint nexus_public_directory_avatar_object check (jsonb_typeof(avatar_state) = 'object'),
  constraint nexus_public_directory_avatar_size check (octet_length(avatar_state::text) <= 12000)
);

create table if not exists public.nexus_rooms (
  owner_id uuid primary key references auth.users(id) on delete cascade,
  room_state jsonb not null default '{"theme":"violet","furniture":["console"]}'::jsonb,
  access text not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint nexus_rooms_access check (access in ('open','contacts','private')),
  constraint nexus_rooms_state_object check (jsonb_typeof(room_state) = 'object'),
  constraint nexus_rooms_state_size check (octet_length(room_state::text) <= 8000)
);

insert into public.nexus_public_directory (user_id,handle,display_name,bio,status_text,locale,avatar_state,updated_at)
select user_id,handle,display_name,bio,status_text,locale,avatar_state,updated_at
from public.nexus_public_profiles
where visibility = 'public'
on conflict (user_id) do update set
  handle=excluded.handle,display_name=excluded.display_name,bio=excluded.bio,
  status_text=excluded.status_text,locale=excluded.locale,
  avatar_state=excluded.avatar_state,updated_at=excluded.updated_at;

insert into public.nexus_rooms (owner_id,room_state,access,updated_at)
select
  user_id,
  room_state - 'access',
  case when room_state->>'access' in ('open','contacts','private') then room_state->>'access' else 'open' end,
  updated_at
from public.nexus_public_profiles
on conflict (owner_id) do nothing;

create or replace function public.xethkioz_sync_nexus_public_directory()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'DELETE' or new.visibility <> 'public' then
    delete from public.nexus_public_directory where user_id = coalesce(new.user_id, old.user_id);
    return coalesce(new, old);
  end if;

  insert into public.nexus_public_directory (user_id,handle,display_name,bio,status_text,locale,avatar_state,updated_at)
  values (new.user_id,new.handle,new.display_name,new.bio,new.status_text,new.locale,new.avatar_state,new.updated_at)
  on conflict (user_id) do update set
    handle=excluded.handle,display_name=excluded.display_name,bio=excluded.bio,
    status_text=excluded.status_text,locale=excluded.locale,
    avatar_state=excluded.avatar_state,updated_at=excluded.updated_at;
  return new;
end;
$$;

revoke all on function public.xethkioz_sync_nexus_public_directory() from public, anon, authenticated;

drop trigger if exists nexus_public_profiles_sync_directory on public.nexus_public_profiles;
create trigger nexus_public_profiles_sync_directory
after insert or update of handle,display_name,bio,status_text,locale,visibility,avatar_state,updated_at or delete
on public.nexus_public_profiles
for each row execute function public.xethkioz_sync_nexus_public_directory();

alter table public.nexus_public_directory enable row level security;
alter table public.nexus_rooms enable row level security;

drop policy if exists nexus_public_directory_read on public.nexus_public_directory;
create policy nexus_public_directory_read
on public.nexus_public_directory for select to anon, authenticated
using (true);

drop policy if exists nexus_rooms_anon_open_read on public.nexus_rooms;
create policy nexus_rooms_anon_open_read
on public.nexus_rooms for select to anon
using (access = 'open');

drop policy if exists nexus_rooms_authenticated_read on public.nexus_rooms;
create policy nexus_rooms_authenticated_read
on public.nexus_rooms for select to authenticated
using (
  owner_id = (select auth.uid())
  or (
    not exists (
      select 1 from public.nexus_relationships relation
      where relation.status = 'blocked'
        and ((relation.requester_id = (select auth.uid()) and relation.addressee_id = owner_id)
          or (relation.addressee_id = (select auth.uid()) and relation.requester_id = owner_id))
    )
    and (
      access = 'open'
      or (access = 'contacts' and exists (
        select 1 from public.nexus_relationships relation
        where relation.status = 'accepted'
          and ((relation.requester_id = (select auth.uid()) and relation.addressee_id = owner_id)
            or (relation.addressee_id = (select auth.uid()) and relation.requester_id = owner_id))
      ))
    )
  )
);

drop policy if exists nexus_rooms_own_insert on public.nexus_rooms;
create policy nexus_rooms_own_insert
on public.nexus_rooms for insert to authenticated
with check (owner_id = (select auth.uid()));

drop policy if exists nexus_rooms_own_update on public.nexus_rooms;
create policy nexus_rooms_own_update
on public.nexus_rooms for update to authenticated
using (owner_id = (select auth.uid()))
with check (owner_id = (select auth.uid()));

-- The legacy profile row becomes owner-only. Public clients use the safe projection.
drop policy if exists nexus_public_profiles_anon_read on public.nexus_public_profiles;
drop policy if exists nexus_public_profiles_authenticated_read on public.nexus_public_profiles;
create policy nexus_public_profiles_authenticated_read
on public.nexus_public_profiles for select to authenticated
using ((select auth.uid()) = user_id);

revoke all on public.nexus_public_directory from anon, authenticated;
revoke all on public.nexus_rooms from anon, authenticated;
revoke select on public.nexus_public_profiles from anon;

grant select on public.nexus_public_directory to anon, authenticated;
grant select on public.nexus_rooms to anon, authenticated;
grant insert on public.nexus_rooms to authenticated;
grant update (room_state, access, updated_at) on public.nexus_rooms to authenticated;

create index if not exists nexus_public_directory_updated_idx on public.nexus_public_directory (updated_at desc);
create index if not exists nexus_rooms_access_updated_idx on public.nexus_rooms (access, updated_at desc);

comment on table public.nexus_public_directory is 'Safe public Nexus passport projection. Never contains room state, visibility settings, email, IP or payment information.';
comment on table public.nexus_rooms is 'Nexus capsule state protected independently by open, accepted-contact or owner-only RLS.';
