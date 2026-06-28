-- XETHKIOZ Alpha 3.7 Security Hardening Patch
-- Hardened profiles + RLS permissions for Auth Nexus.
-- Safe to run more than once.

create extension if not exists pgcrypto;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'xethkioz_subscription_tier') then
    create type public.xethkioz_subscription_tier as enum ('BASIC', 'CREATOR', 'ARCHITECT');
  end if;
  if not exists (select 1 from pg_type where typname = 'xethkioz_user_role') then
    create type public.xethkioz_user_role as enum ('GUEST', 'CONTRIBUTOR', 'ADMIN');
  end if;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  subscription_tier public.xethkioz_subscription_tier not null default 'BASIC',
  role public.xethkioz_user_role not null default 'GUEST',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.profiles force row level security;

-- Admin check stays server-side. SECURITY DEFINER avoids RLS recursion, search_path is pinned.
create or replace function public.xethkioz_is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role = 'ADMIN'
  );
$$;

create or replace function public.xethkioz_can_create_article()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and (subscription_tier in ('CREATOR', 'ARCHITECT') or role = 'ADMIN')
  );
$$;

create or replace function public.xethkioz_touch_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists xethkioz_profiles_touch_updated_at on public.profiles;
create trigger xethkioz_profiles_touch_updated_at
before update on public.profiles
for each row execute procedure public.xethkioz_touch_updated_at();

-- Defense-in-depth: a normal user may never change role/subscription_tier through client RLS.
-- Only an ADMIN, evaluated server-side against the existing session, may alter these fields.
create or replace function public.xethkioz_guard_profile_privilege_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (new.role is distinct from old.role or new.subscription_tier is distinct from old.subscription_tier)
     and not public.xethkioz_is_admin() then
    raise exception 'permission denied: profile privilege fields are admin-managed';
  end if;
  return new;
end;
$$;

drop trigger if exists xethkioz_profiles_guard_privilege_update on public.profiles;
create trigger xethkioz_profiles_guard_privilege_update
before update on public.profiles
for each row execute procedure public.xethkioz_guard_profile_privilege_update();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, subscription_tier, role)
  values (new.id, 'BASIC', 'GUEST')
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Remove previous broad policies before installing hardened ones.
drop policy if exists "profiles_public_read" on public.profiles;
drop policy if exists "profiles_self_insert" on public.profiles;
drop policy if exists "profiles_self_update" on public.profiles;
drop policy if exists "profiles_admin_update" on public.profiles;
drop policy if exists "profiles_self_read" on public.profiles;
drop policy if exists "profiles_admin_read" on public.profiles;
drop policy if exists "profiles_self_insert_basic_only" on public.profiles;
drop policy if exists "profiles_self_update_guarded" on public.profiles;
drop policy if exists "profiles_admin_update_guarded" on public.profiles;

create policy "profiles_self_read" on public.profiles
for select using (auth.uid() = id);

create policy "profiles_admin_read" on public.profiles
for select using (public.xethkioz_is_admin());

-- Fallback insert is allowed only for the signed-in user's own BASIC/GUEST profile.
-- The normal path remains the handle_new_user trigger.
create policy "profiles_self_insert_basic_only" on public.profiles
for insert with check (
  auth.uid() = id
  and subscription_tier = 'BASIC'
  and role = 'GUEST'
);

-- Keep self update available for future non-privileged profile fields. The trigger above blocks
-- role/subscription escalation.
create policy "profiles_self_update_guarded" on public.profiles
for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "profiles_admin_update_guarded" on public.profiles
for update using (public.xethkioz_is_admin()) with check (public.xethkioz_is_admin());

-- Public profile projection without privilege fields. Use this for UI/public directories.
create or replace view public.public_profiles as
select id, created_at from public.profiles;

grant select on public.public_profiles to anon, authenticated;

-- Public article read contract. Prefer a public_articles view if present; otherwise articles stay readable.
alter table if exists public.articles enable row level security;
drop policy if exists "articles_public_read" on public.articles;
create policy "articles_public_read" on public.articles
for select using (true);

drop policy if exists "articles_creator_insert" on public.articles;
create policy "articles_creator_insert" on public.articles
for insert with check (public.xethkioz_can_create_article());

drop policy if exists "articles_admin_update" on public.articles;
create policy "articles_admin_update" on public.articles
for update using (public.xethkioz_is_admin()) with check (public.xethkioz_is_admin());

alter table if exists public.categories_config enable row level security;
drop policy if exists "categories_public_read" on public.categories_config;
create policy "categories_public_read" on public.categories_config
for select using (true);

drop policy if exists "categories_admin_write" on public.categories_config;
create policy "categories_admin_write" on public.categories_config
for all using (public.xethkioz_is_admin()) with check (public.xethkioz_is_admin());
