begin;

-- The public site only needs the singleton aggregate row. Let browser roles
-- read that row through RLS and execute the aggregate with their own
-- privileges, eliminating the SECURITY DEFINER boundary for read-only data.
grant select on table public.huellas_stats to anon, authenticated;

drop policy if exists huellas_stats_public_read on public.huellas_stats;
create policy huellas_stats_public_read
  on public.huellas_stats
  for select
  to anon, authenticated
  using (id = 1);

create or replace function public.get_huellas_stats()
returns jsonb
language sql
stable
security invoker
set search_path = public
as $function$
  select jsonb_build_object(
    'visits', coalesce(raw.visits, 0),
    'active_posts', coalesce(public_stats.active_posts, 0),
    'reunited', coalesce(public_stats.reunited, 0),
    'adoptions', coalesce(public_stats.adoptions, 0)
  )
  from public.huellas_stats as raw
  left join public.huellas_public_stats as public_stats
    on public_stats.id = raw.id
  where raw.id = 1;
$function$;

revoke all on function public.get_huellas_stats() from public;
grant execute on function public.get_huellas_stats() to anon, authenticated, service_role;

comment on function public.get_huellas_stats() is
  'Read-only aggregate exposed with caller privileges; RLS restricts huellas_stats to the singleton public row.';

commit;
