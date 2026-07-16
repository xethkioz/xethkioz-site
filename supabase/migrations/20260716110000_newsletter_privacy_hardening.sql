-- Newsletter privacy hardening.
-- Public visitors may subscribe, but only an ADMIN may read subscriber emails.

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

create index if not exists newsletter_subscribers_created_at_idx
on public.newsletter_subscribers (created_at desc);

alter table public.newsletter_subscribers enable row level security;
alter table public.newsletter_subscribers force row level security;

drop policy if exists "public_subscribe_newsletter" on public.newsletter_subscribers;
drop policy if exists "admin_read_newsletter" on public.newsletter_subscribers;
drop policy if exists "newsletter_insert_only" on public.newsletter_subscribers;
drop policy if exists "newsletter_admin_select" on public.newsletter_subscribers;
drop policy if exists "newsletter_admin_only_select" on public.newsletter_subscribers;

create policy "newsletter_insert_only"
on public.newsletter_subscribers
for insert
to anon, authenticated
with check (
  char_length(email) between 5 and 254
  and email = lower(trim(email))
  and email ~* '^[A-Za-z0-9.!#$%&''*+/=?^_`{|}~-]+@[A-Za-z0-9.-]+[.][A-Za-z]{2,}$'
);

create policy "newsletter_admin_only_select"
on public.newsletter_subscribers
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = (select auth.uid())
      and lower(profiles.role::text) = 'admin'
  )
);

grant insert on table public.newsletter_subscribers to anon, authenticated;
grant select on table public.newsletter_subscribers to authenticated;
revoke select on table public.newsletter_subscribers from anon;
revoke update, delete on table public.newsletter_subscribers from anon, authenticated;
