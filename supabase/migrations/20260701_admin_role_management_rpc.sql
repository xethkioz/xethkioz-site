-- XETHKIOZ Admin Role Management RPC
-- Safe admin-only function for /cms/users role changes.
-- Run after profiles roles migration.

create extension if not exists pgcrypto;

-- Ensure required enum values exist for older projects.
do $$
begin
  if not exists (select 1 from pg_type where typname = 'xethkioz_subscription_tier') then
    create type public.xethkioz_subscription_tier as enum ('BASIC', 'CREATOR', 'ARCHITECT');
  end if;

  if not exists (select 1 from pg_type where typname = 'xethkioz_user_role') then
    create type public.xethkioz_user_role as enum ('GUEST', 'USER', 'CONTRIBUTOR', 'EDITOR', 'MODERATOR', 'ADMIN');
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_enum e join pg_type t on t.oid = e.enumtypid
    where t.typname = 'xethkioz_user_role' and e.enumlabel = 'USER'
  ) then alter type public.xethkioz_user_role add value 'USER'; end if;

  if not exists (
    select 1 from pg_enum e join pg_type t on t.oid = e.enumtypid
    where t.typname = 'xethkioz_user_role' and e.enumlabel = 'EDITOR'
  ) then alter type public.xethkioz_user_role add value 'EDITOR'; end if;

  if not exists (
    select 1 from pg_enum e join pg_type t on t.oid = e.enumtypid
    where t.typname = 'xethkioz_user_role' and e.enumlabel = 'MODERATOR'
  ) then alter type public.xethkioz_user_role add value 'MODERATOR'; end if;
end $$;

-- Server-side protected role/tier update.
create or replace function public.xethkioz_admin_set_profile_access(
  target_user_id uuid,
  next_role text,
  next_subscription_tier text default 'BASIC'
)
returns table (
  id uuid,
  role text,
  subscription_tier text,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  safe_role text := upper(trim(coalesce(next_role, 'GUEST')));
  safe_tier text := upper(trim(coalesce(next_subscription_tier, 'BASIC')));
begin
  if auth.uid() is null then
    raise exception 'permission denied: authenticated session required';
  end if;

  if not public.xethkioz_has_role(array['ADMIN']) then
    raise exception 'permission denied: admin role required';
  end if;

  if target_user_id is null then
    raise exception 'target_user_id is required';
  end if;

  if safe_role not in ('GUEST', 'USER', 'CONTRIBUTOR', 'EDITOR', 'MODERATOR', 'ADMIN') then
    raise exception 'invalid role: %', safe_role;
  end if;

  if safe_tier not in ('BASIC', 'CREATOR', 'ARCHITECT') then
    raise exception 'invalid subscription tier: %', safe_tier;
  end if;

  update public.profiles
  set
    role = safe_role::public.xethkioz_user_role,
    subscription_tier = safe_tier::public.xethkioz_subscription_tier,
    updated_at = now()
  where profiles.id = target_user_id;

  if not found then
    raise exception 'profile not found: %', target_user_id;
  end if;

  return query
  select
    profiles.id,
    profiles.role::text,
    profiles.subscription_tier::text,
    profiles.updated_at
  from public.profiles
  where profiles.id = target_user_id;
end;
$$;

grant execute on function public.xethkioz_admin_set_profile_access(uuid, text, text) to authenticated;
