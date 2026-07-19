-- Nexus City Social Loop
-- Public passports, personal capsule state and consent-based relationships.

create table if not exists public.nexus_public_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  handle text not null unique,
  display_name text not null,
  bio text not null default '',
  status_text text not null default '',
  locale text not null default 'es',
  visibility text not null default 'public',
  avatar_state jsonb not null default '{}'::jsonb,
  room_state jsonb not null default '{"theme":"violet","furniture":["console"],"access":"open"}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint nexus_public_profiles_handle_format check (handle ~ '^[a-z0-9_]{3,24}$'),
  constraint nexus_public_profiles_reserved_handle check (handle not in ('xethkioz','xethkios','xethkio')),
  constraint nexus_public_profiles_display_name_length check (char_length(display_name) between 1 and 40),
  constraint nexus_public_profiles_bio_length check (char_length(bio) <= 280),
  constraint nexus_public_profiles_status_length check (char_length(status_text) <= 80),
  constraint nexus_public_profiles_locale check (locale in ('es','en')),
  constraint nexus_public_profiles_visibility check (visibility in ('public','contacts','private')),
  constraint nexus_public_profiles_avatar_object check (jsonb_typeof(avatar_state) = 'object'),
  constraint nexus_public_profiles_room_object check (jsonb_typeof(room_state) = 'object'),
  constraint nexus_public_profiles_avatar_size check (octet_length(avatar_state::text) <= 12000),
  constraint nexus_public_profiles_room_size check (octet_length(room_state::text) <= 8000)
);

create table if not exists public.nexus_relationships (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references auth.users(id) on delete cascade,
  addressee_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint nexus_relationships_different_users check (requester_id <> addressee_id),
  constraint nexus_relationships_status check (status in ('pending','accepted','blocked')),
  constraint nexus_relationships_direction_unique unique (requester_id, addressee_id)
);

alter table public.nexus_public_profiles enable row level security;
alter table public.nexus_relationships enable row level security;

drop policy if exists nexus_public_profiles_anon_read on public.nexus_public_profiles;
create policy nexus_public_profiles_anon_read
on public.nexus_public_profiles for select to anon
using (visibility = 'public');

drop policy if exists nexus_public_profiles_authenticated_read on public.nexus_public_profiles;
create policy nexus_public_profiles_authenticated_read
on public.nexus_public_profiles for select to authenticated
using (visibility = 'public' or (select auth.uid()) = user_id);

drop policy if exists nexus_public_profiles_own_insert on public.nexus_public_profiles;
create policy nexus_public_profiles_own_insert
on public.nexus_public_profiles for insert to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists nexus_public_profiles_own_update on public.nexus_public_profiles;
create policy nexus_public_profiles_own_update
on public.nexus_public_profiles for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists nexus_relationships_participant_read on public.nexus_relationships;
create policy nexus_relationships_participant_read
on public.nexus_relationships for select to authenticated
using ((select auth.uid()) = requester_id or (select auth.uid()) = addressee_id);

drop policy if exists nexus_relationships_requester_insert on public.nexus_relationships;
create policy nexus_relationships_requester_insert
on public.nexus_relationships for insert to authenticated
with check ((select auth.uid()) = requester_id and status in ('pending','blocked'));

drop policy if exists nexus_relationships_requester_update on public.nexus_relationships;
create policy nexus_relationships_requester_update
on public.nexus_relationships for update to authenticated
using ((select auth.uid()) = requester_id)
with check ((select auth.uid()) = requester_id and status in ('pending','blocked'));

drop policy if exists nexus_relationships_addressee_update on public.nexus_relationships;
create policy nexus_relationships_addressee_update
on public.nexus_relationships for update to authenticated
using ((select auth.uid()) = addressee_id)
with check ((select auth.uid()) = addressee_id and status in ('accepted','blocked'));

drop policy if exists nexus_relationships_participant_delete on public.nexus_relationships;
create policy nexus_relationships_participant_delete
on public.nexus_relationships for delete to authenticated
using ((select auth.uid()) = requester_id or (select auth.uid()) = addressee_id);

revoke all on public.nexus_public_profiles from anon, authenticated;
revoke all on public.nexus_relationships from anon, authenticated;

grant select on public.nexus_public_profiles to anon;
grant select, insert on public.nexus_public_profiles to authenticated;
grant update (handle, display_name, bio, status_text, locale, visibility, avatar_state, room_state, updated_at) on public.nexus_public_profiles to authenticated;

grant select, insert, delete on public.nexus_relationships to authenticated;
grant update (status, updated_at) on public.nexus_relationships to authenticated;

create index if not exists nexus_public_profiles_visibility_updated_idx on public.nexus_public_profiles (visibility, updated_at desc);
create index if not exists nexus_relationships_addressee_status_idx on public.nexus_relationships (addressee_id, status, updated_at desc);
create index if not exists nexus_relationships_requester_status_idx on public.nexus_relationships (requester_id, status, updated_at desc);

comment on table public.nexus_public_profiles is 'User-controlled Nexus passport. Never stores email, IP address or payment information.';
comment on table public.nexus_relationships is 'Consent-based contact requests and blocks. Visible only to relationship participants.';
