-- XETHKIOZ roles + chat identity hardening
-- Safe to run manually in Supabase SQL Editor.
-- Compatible with older profiles schemas that may not yet have subscription_tier.

create extension if not exists pgcrypto;

-- 1) Ensure required enum types exist.
do $$
begin
  if not exists (select 1 from pg_type where typname = 'xethkioz_subscription_tier') then
    create type public.xethkioz_subscription_tier as enum ('BASIC', 'CREATOR', 'ARCHITECT');
  end if;

  if not exists (select 1 from pg_type where typname = 'xethkioz_user_role') then
    create type public.xethkioz_user_role as enum ('GUEST', 'USER', 'CONTRIBUTOR', 'EDITOR', 'MODERATOR', 'ADMIN');
  end if;
end $$;

-- 2) Expand role enum when it already existed with older values.
do $$
begin
  if exists (select 1 from pg_type where typname = 'xethkioz_user_role') then
    if not exists (
      select 1 from pg_enum e join pg_type t on t.oid = e.enumtypid
      where t.typname = 'xethkioz_user_role' and e.enumlabel = 'USER'
    ) then
      alter type public.xethkioz_user_role add value 'USER';
    end if;

    if not exists (
      select 1 from pg_enum e join pg_type t on t.oid = e.enumtypid
      where t.typname = 'xethkioz_user_role' and e.enumlabel = 'EDITOR'
    ) then
      alter type public.xethkioz_user_role add value 'EDITOR';
    end if;

    if not exists (
      select 1 from pg_enum e join pg_type t on t.oid = e.enumtypid
      where t.typname = 'xethkioz_user_role' and e.enumlabel = 'MODERATOR'
    ) then
      alter type public.xethkioz_user_role add value 'MODERATOR';
    end if;
  end if;
end $$;

-- 3) Ensure profiles has the expected columns.
-- This fixes older installs where subscription_tier was missing.
do $$
begin
  if exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'profiles'
  ) then
    if not exists (
      select 1 from information_schema.columns
      where table_schema = 'public' and table_name = 'profiles' and column_name = 'subscription_tier'
    ) then
      alter table public.profiles
        add column subscription_tier public.xethkioz_subscription_tier not null default 'BASIC';
    end if;

    if not exists (
      select 1 from information_schema.columns
      where table_schema = 'public' and table_name = 'profiles' and column_name = 'role'
    ) then
      alter table public.profiles
        add column role public.xethkioz_user_role not null default 'GUEST';
    end if;
  end if;
end $$;

-- 4) Helper roles.
create or replace function public.xethkioz_has_role(allowed_roles text[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role::text = any(allowed_roles)
  );
$$;

create or replace function public.xethkioz_is_moderator_or_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.xethkioz_has_role(array['MODERATOR','ADMIN']);
$$;

create or replace function public.xethkioz_can_publish_article()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.xethkioz_has_role(array['ADMIN']);
$$;

create or replace function public.xethkioz_can_submit_article()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.xethkioz_has_role(array['CONTRIBUTOR','EDITOR','MODERATOR','ADMIN'])
    or exists (
      select 1
      from public.profiles
      where id = auth.uid()
        and subscription_tier::text in ('CREATOR','ARCHITECT')
    );
$$;

-- 5) Reserved XETHKIOZ display names for chat.
create or replace function public.xethkioz_normalize_identity(value text)
returns text
language sql
immutable
set search_path = public
as $$
  select lower(regexp_replace(translate(coalesce(value,''), '013', 'oie'), '[^a-zA-Z0-9]', '', 'g'));
$$;

create or replace function public.xethkioz_is_reserved_display_name(value text)
returns boolean
language sql
immutable
set search_path = public
as $$
  select public.xethkioz_normalize_identity(value) like '%xethkioz%'
      or public.xethkioz_normalize_identity(value) like '%xethkios%'
      or public.xethkioz_normalize_identity(value) like '%xethkio%'
      or public.xethkioz_normalize_identity(value) like 'xethk%'
      or public.xethkioz_normalize_identity(value) = 'xeth';
$$;

-- 6) Rebuild chat insert policy with reserved-name protection.
alter table if exists public.chat_messages enable row level security;

drop policy if exists "chat_messages_public_insert" on public.chat_messages;
create policy "chat_messages_public_insert"
on public.chat_messages
for insert
with check (
  exists (
    select 1
    from public.chat_rooms
    where chat_rooms.id = chat_messages.room_id
      and chat_rooms.is_public = true
  )
  and char_length(display_name) between 1 and 40
  and char_length(body) between 1 and 500
  and role in ('guest','member')
  and (
    not public.xethkioz_is_reserved_display_name(display_name)
    or public.xethkioz_has_role(array['ADMIN'])
  )
);
