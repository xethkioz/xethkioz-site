begin;

-- The new frontend now reaches Huellas only through /api/huellas-stats.
revoke all on function public.get_huellas_stats() from public, anon, authenticated;
grant execute on function public.get_huellas_stats() to service_role;

drop function if exists public.register_huellas_visit();

-- Authenticated progression now uses xethkioz_claim_activity, whose award map
-- and limits are owned by Postgres rather than supplied by the browser.
drop policy if exists user_activity_insert_own on public.user_activity_events;
revoke insert on table public.user_activity_events from authenticated;

-- Anonymous Wisp activity remains local and cosmetic. Retire legacy database
-- writes when the historical table exists, without breaking newer installs.
do $$
begin
  if to_regclass('public.xeth_wisp_events') is not null then
    execute 'drop policy if exists "xeth wisp events readable" on public.xeth_wisp_events';
    execute 'drop policy if exists "xeth wisp events insert" on public.xeth_wisp_events';
    execute 'drop policy if exists "Wisp events are readable" on public.xeth_wisp_events';
    execute 'drop policy if exists "Visitors can create wisp events" on public.xeth_wisp_events';
    execute 'revoke all on table public.xeth_wisp_events from public, anon, authenticated';
  end if;
end;
$$;

commit;
