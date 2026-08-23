-- XETHKIOZ maintenance follow-up (2026-08-23)
--
-- 1. Enforce the existing 30-day visit-log retention policy on a fixed schedule.
-- 2. Run the first cleanup immediately after the job is installed.
-- 3. Stop exposing an expired Huellas notice as an active approved post.

do $maintenance$
declare
  existing_job_id bigint;
begin
  -- Keep this migration idempotent if it is replayed in a restored environment.
  for existing_job_id in
    select jobid
    from cron.job
    where jobname = 'xethkioz-site-visit-retention-30d'
  loop
    perform cron.unschedule(existing_job_id);
  end loop;

  perform cron.schedule(
    'xethkioz-site-visit-retention-30d',
    '31 3 * * *',
    'select public.xethkioz_cleanup_site_visits();'
  );
end
$maintenance$;

-- The RPC is SECURITY DEFINER, uses a fixed empty search_path, serializes concurrent
-- runs and remains executable only by postgres/service_role.
select public.xethkioz_cleanup_site_visits();

update public.pet_posts
set status = 'resolved'
where id = '11111111-1111-4111-8111-111111111111'::uuid
  and status = 'approved'
  and expires_at < now();

