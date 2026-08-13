-- XETHKIOZ v11: Huellas public statistics hardening.
-- Apply only together with the v11 frontend that reads huellas_public_stats.
-- The goal is to remove all public write access from community metrics and
-- avoid exposing pet_posts (which contains phone/contact data) to anonymous reads.

create schema if not exists private;

create table if not exists public.huellas_public_stats (
  id smallint primary key default 1 check (id = 1),
  total_cases bigint not null default 0 check (total_cases >= 0),
  active_posts bigint not null default 0 check (active_posts >= 0),
  reunited bigint not null default 0 check (reunited >= 0),
  adoptions bigint not null default 0 check (adoptions >= 0),
  updated_at timestamptz not null default now()
);

alter table public.huellas_public_stats enable row level security;

revoke all on table public.huellas_public_stats from public;
revoke all on table public.huellas_public_stats from anon, authenticated;
grant select on table public.huellas_public_stats to anon, authenticated;

drop policy if exists huellas_public_stats_read on public.huellas_public_stats;
create policy huellas_public_stats_read
on public.huellas_public_stats
for select
to anon, authenticated
using (id = 1);

create or replace function private.refresh_huellas_public_stats()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.huellas_public_stats (
    id,
    total_cases,
    active_posts,
    reunited,
    adoptions,
    updated_at
  )
  select
    1,
    count(*) filter (where status in ('approved', 'resolved')),
    count(*) filter (where status = 'approved' and expires_at > now()),
    count(*) filter (where status = 'resolved' and type in ('Perdido', 'Encontrado')),
    count(*) filter (where status = 'resolved' and type = 'Adopción'),
    now()
  from public.pet_posts
  on conflict (id) do update
    set total_cases = excluded.total_cases,
        active_posts = excluded.active_posts,
        reunited = excluded.reunited,
        adoptions = excluded.adoptions,
        updated_at = excluded.updated_at;

  return null;
end;
$$;

revoke all on function private.refresh_huellas_public_stats() from public, anon, authenticated;

-- Prime the aggregate before installing the statement trigger.
insert into public.huellas_public_stats (
  id,
  total_cases,
  active_posts,
  reunited,
  adoptions,
  updated_at
)
select
  1,
  count(*) filter (where status in ('approved', 'resolved')),
  count(*) filter (where status = 'approved' and expires_at > now()),
  count(*) filter (where status = 'resolved' and type in ('Perdido', 'Encontrado')),
  count(*) filter (where status = 'resolved' and type = 'Adopción'),
  now()
from public.pet_posts
on conflict (id) do update
  set total_cases = excluded.total_cases,
      active_posts = excluded.active_posts,
      reunited = excluded.reunited,
      adoptions = excluded.adoptions,
      updated_at = excluded.updated_at;

drop trigger if exists huellas_refresh_public_stats on public.pet_posts;
create trigger huellas_refresh_public_stats
after insert or update or delete or truncate
on public.pet_posts
for each statement
execute function private.refresh_huellas_public_stats();

-- Retire the legacy public RPC surface. The functions remain temporarily so
-- rollback can re-grant them if required, but anonymous/authenticated users
-- can no longer execute SECURITY DEFINER functions that read/write metrics.
revoke execute on function public.register_huellas_visit() from public, anon, authenticated;
revoke execute on function public.get_huellas_stats() from public, anon, authenticated;
