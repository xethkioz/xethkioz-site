begin;

-- The public role is intentionally not enough to claim the XETHKIOZ identity.
-- A single, immutable owner flag binds it to the existing site owner account.
alter table public.profiles
  add column if not exists is_site_owner boolean not null default false;

with owner_candidate as (
  select id
  from public.profiles
  where upper(role) = 'ADMIN'
  order by
    case when subscription_tier::text = 'ARCHITECT' then 0 else 1 end,
    created_at asc nulls last,
    id
  limit 1
)
update public.profiles as profile
set is_site_owner = true,
    updated_at = now()
where profile.id = (select id from owner_candidate)
  and not exists (
    select 1 from public.profiles where is_site_owner = true
  );

create unique index if not exists profiles_one_site_owner_idx
  on public.profiles ((1))
  where is_site_owner = true;

create schema if not exists private;

create or replace function private.xethkioz_guard_profile_owner_flag()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' and new.is_site_owner = true
     and current_user not in ('postgres', 'supabase_admin') then
    raise exception 'XETHKIOZ_OWNER_FLAG_PROTECTED';
  end if;

  if tg_op = 'UPDATE'
     and new.is_site_owner is distinct from old.is_site_owner
     and current_user not in ('postgres', 'supabase_admin') then
    raise exception 'XETHKIOZ_OWNER_FLAG_PROTECTED';
  end if;

  return new;
end;
$$;

revoke all on function private.xethkioz_guard_profile_owner_flag() from public, anon, authenticated;

drop trigger if exists profiles_guard_owner_flag on public.profiles;
create trigger profiles_guard_owner_flag
before insert or update of is_site_owner on public.profiles
for each row execute function private.xethkioz_guard_profile_owner_flag();

create or replace function private.xethkioz_is_site_owner()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select (select auth.uid()) is not null
    and exists (
      select 1
      from public.profiles
      where id = (select auth.uid())
        and is_site_owner = true
    );
$$;

revoke all on function private.xethkioz_is_site_owner() from public, anon;
grant execute on function private.xethkioz_is_site_owner() to authenticated;

create or replace function private.xethkioz_guard_chat_identity()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if public.xethkioz_is_reserved_display_name(new.display_name)
     and not exists (
       select 1
       from public.profiles
       where id = new.user_id
         and is_site_owner = true
     ) then
    raise exception 'XETHKIOZ_RESERVED_IDENTITY';
  end if;

  if public.xethkioz_is_reserved_display_name(new.display_name) then
    new.display_name := 'XETHKIOZ';
  end if;

  return new;
end;
$$;

revoke all on function private.xethkioz_guard_chat_identity() from public, anon, authenticated;

drop trigger if exists chat_messages_guard_reserved_identity on public.chat_messages;
create trigger chat_messages_guard_reserved_identity
before insert or update of display_name, user_id on public.chat_messages
for each row execute function private.xethkioz_guard_chat_identity();

drop policy if exists chat_messages_guest_insert on public.chat_messages;
create policy chat_messages_guest_insert
on public.chat_messages
for insert
to anon, authenticated
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
on public.chat_messages
for insert
to authenticated
with check (
  exists (select 1 from public.chat_rooms room where room.id = chat_messages.room_id)
  and user_id = (select auth.uid())
  and role = 'member'
  and char_length(display_name) between 1 and 40
  and char_length(body) between 1 and 500
  and (
    not public.xethkioz_is_reserved_display_name(display_name)
    or (select private.xethkioz_is_site_owner())
  )
);

-- The UI and RLS both hide expired rows even if the scheduler is delayed.
drop policy if exists chat_messages_access_read on public.chat_messages;
create policy chat_messages_access_read
on public.chat_messages
for select
to anon, authenticated
using (
  created_at >= now() - interval '24 hours'
  and exists (select 1 from public.chat_rooms room where room.id = chat_messages.room_id)
);

create index if not exists chat_messages_created_at_idx
  on public.chat_messages (created_at);

-- Remove the currently expired history, then keep a rolling 24-hour window.
delete from public.chat_messages
where created_at < now() - interval '24 hours';

create extension if not exists pg_cron with schema pg_catalog;

select cron.schedule(
  'xethkioz-chat-retention-24h',
  '17 * * * *',
  $$delete from public.chat_messages where created_at < now() - interval '24 hours'$$
);

comment on column public.profiles.is_site_owner is
  'Immutable single-account flag used to protect the XETHKIOZ chat identity.';

commit;
