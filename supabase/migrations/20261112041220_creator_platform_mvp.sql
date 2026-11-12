-- XETHKIOZ Creator Network: additive, applied to xethkioz-site on 2026-11-12 after isolated tests. Do not reapply on the same project.
-- Creator files are NOT uploaded to this database; only external HTTPS links are stored.
create table if not exists public.creator_projects (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users(id) on delete cascade,
  author_name text not null check (char_length(author_name) between 1 and 70),
  title text not null default '' check (char_length(title) <= 100),
  summary text not null default '' check (char_length(summary) <= 1200),
  category text not null check (category in ('programa','videojuego','video','arte','herramienta_ia','otro')),
  external_url text not null default '' check (char_length(external_url) <= 2048),
  cover_url text check (cover_url is null or char_length(cover_url) <= 2048),
  license text not null default 'Todos los derechos reservados' check (char_length(license) between 1 and 80),
  tags text[] not null default '{}'::text[] check (cardinality(tags) <= 8 and char_length(array_to_string(tags, ',')) <= 255),
  status text not null default 'draft' check (status in ('draft','pending_review','published','rejected')),
  created_at timestamptz not null default now(),
  published_at timestamptz,
  updated_at timestamptz not null default now(),
  rejection_reason text check (rejection_reason is null or char_length(rejection_reason) <= 500),
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  constraint creator_ready_to_submit check (
    status = 'draft' or (
      char_length(title) between 4 and 100 and char_length(summary) between 20 and 1200
      and external_url ~* '^https://[^ ]+'
    )
  ),
  constraint creator_publish_timestamp check ((status = 'published') = (published_at is not null))
);
create index if not exists creator_projects_public_recent_idx on public.creator_projects(created_at desc) where status = 'published';
create index if not exists creator_projects_author_recent_idx on public.creator_projects(author_id, created_at desc);
alter table public.creator_projects enable row level security;
-- Grant access explicitly due to the 2026 Data API exposure change; row access is still controlled by RLS.
revoke all on public.creator_projects from anon, authenticated;
grant select on public.creator_projects to anon, authenticated;
-- Browser users may change only creator-owned fields, never review metadata.
grant insert (author_id, author_name, title, summary, category, external_url, license, tags, status) on public.creator_projects to authenticated;
grant update (author_name, title, summary, category, external_url, license, tags, status) on public.creator_projects to authenticated;
grant delete on public.creator_projects to authenticated;
create policy creator_projects_public_read on public.creator_projects
  for select to anon, authenticated using (status = 'published');
create policy creator_projects_owner_read on public.creator_projects
  for select to authenticated using ((select auth.uid()) = author_id);
create policy creator_projects_owner_insert on public.creator_projects
  for insert to authenticated with check (
    (select auth.uid()) = author_id and status in ('draft','pending_review') and published_at is null
  );
create policy creator_projects_owner_update on public.creator_projects
  for update to authenticated using (
    (select auth.uid()) = author_id and status in ('draft','rejected')
  ) with check (
    (select auth.uid()) = author_id and status in ('draft','pending_review') and published_at is null
  );
create policy creator_projects_owner_delete_drafts on public.creator_projects
  for delete to authenticated using (
    (select auth.uid()) = author_id and status in ('draft','rejected')
  );

create table if not exists public.creator_project_reports (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.creator_projects(id) on delete cascade,
  reporter_id uuid not null references auth.users(id) on delete cascade,
  reason text not null default 'needs_review' check (reason in ('needs_review','malware','copyright','spam','other')),
  created_at timestamptz not null default now(),
  unique(project_id, reporter_id)
);
alter table public.creator_project_reports enable row level security;
revoke all on public.creator_project_reports from anon, authenticated;
grant select on public.creator_project_reports to authenticated;
-- Browser reporters can set only reporter/project/reason; resolution is server-owned.
grant insert (project_id, reporter_id, reason) on public.creator_project_reports to authenticated;
create policy creator_reports_insert on public.creator_project_reports
  for insert to authenticated with check (
    reporter_id = (select auth.uid()) and exists (
      select 1 from public.creator_projects p where p.id = project_id and p.status = 'published'
    )
  );
create policy creator_reports_owner_read on public.creator_project_reports
  for select to authenticated using (reporter_id = (select auth.uid()));

-- Audit and report resolution are accessible only through the privileged server workflow.
create table if not exists public.creator_moderation_events (
  id uuid primary key default gen_random_uuid(),
  -- Keep the project identifier as an audit reference after a rejected project is deleted.
  -- Retention and user-erasure requirements must be explicitly resolved before launch.
  project_id uuid not null,
  reviewer_id uuid references auth.users(id) on delete set null,
  action text not null check (action in ('approved','rejected','unpublished','report_dismissed')),
  note text not null default '' check (char_length(note) <= 500),
  created_at timestamptz not null default now()
);
alter table public.creator_moderation_events enable row level security;
revoke all on public.creator_moderation_events from anon, authenticated;
alter table public.creator_project_reports add column if not exists resolved_at timestamptz;
alter table public.creator_project_reports add column if not exists resolved_by uuid references auth.users(id) on delete set null;
alter table public.creator_project_reports add column if not exists resolution text check (resolution is null or resolution in ('removed','dismissed'));

-- Human moderation must take place using a privileged, server-side admin workflow.
-- No authenticated user can set status='published' through the Data API under these policies.
-- Server-side URL validation, reputation scanning, rate limits, copyright workflow, and OAuth
-- are required before opening public submissions at scale.


-- Two atomic server-only workflows. The caller is always the service_role from the
-- authenticated Edge Function. SECURITY INVOKER avoids a superuser bypass.
create or replace function public.creator_review_project(
  p_actor uuid, p_project uuid, p_decision text, p_note text default ''
) returns text
language plpgsql
security invoker
set search_path = ''
as $function$
declare
  v_project public.creator_projects%rowtype;
  v_status text;
begin
  -- The Edge Function verifies the user with auth.getUser and app_metadata
  -- before calling this RPC with its private service-role credential.
  if p_decision not in ('approve','reject')
     or char_length(coalesce(p_note, '')) > 500
     or (p_decision = 'reject' and char_length(trim(coalesce(p_note, ''))) < 10) then
    raise exception 'Invalid moderation decision' using errcode = '22023';
  end if;

  select * into v_project from public.creator_projects where id = p_project for update;
  if not found or v_project.status <> 'pending_review' then
    raise exception 'Project status changed' using errcode = '22023';
  end if;
  if v_project.author_id = p_actor then
    raise exception 'Self approval denied' using errcode = '42501';
  end if;
  -- Browser links need manual domain/content review in Edge before approval.
  if p_decision = 'approve' and v_project.external_url !~* '^https://[^ ]+' then
    raise exception 'Invalid external project link' using errcode = '22023';
  end if;
  v_status := case when p_decision = 'approve' then 'published' else 'rejected' end;
  update public.creator_projects
  set status = v_status,
      published_at = case when p_decision = 'approve' then now() else null end,
      reviewed_by = p_actor,
      reviewed_at = now(),
      rejection_reason = case when p_decision = 'reject' then trim(p_note) else null end,
      updated_at = now()
  where id = p_project;
  insert into public.creator_moderation_events(project_id, reviewer_id, action, note)
    values (p_project, p_actor, case when p_decision = 'approve' then 'approved' else 'rejected' end, coalesce(p_note, ''));
  return v_status;
end;
$function$;

create or replace function public.creator_resolve_report(
  p_actor uuid, p_report uuid, p_decision text, p_note text
) returns text
language plpgsql
security invoker
set search_path = ''
as $function$
declare
  v_report public.creator_project_reports%rowtype;
  v_project public.creator_projects%rowtype;
  v_resolution text;
begin
  -- Only the service_role has EXECUTE. The Edge Function verifies app_metadata.
  if p_decision not in ('remove', 'dismiss')
     or char_length(trim(coalesce(p_note, ''))) not between 10 and 500 then
    raise exception 'Invalid report resolution' using errcode = '22023';
  end if;
  select * into v_report from public.creator_project_reports where id = p_report for update;
  if not found or v_report.resolved_at is not null then
    raise exception 'Report already resolved' using errcode = '22023';
  end if;
  select * into v_project from public.creator_projects where id = v_report.project_id for update;
  if not found or v_project.author_id = p_actor then
    raise exception 'Self moderation denied' using errcode = '42501';
  end if;
  if p_decision = 'remove' then
    if v_project.status <> 'published' then
      raise exception 'Project is no longer published' using errcode = '22023';
    end if;
    update public.creator_projects
    set status = 'rejected',
        published_at = null,
        reviewed_by = p_actor,
        reviewed_at = now(),
        rejection_reason = trim(p_note),
        updated_at = now()
    where id = v_report.project_id;
  end if;
  v_resolution := case when p_decision = 'remove' then 'removed' else 'dismissed' end;
  update public.creator_project_reports
  set resolved_at = now(), resolved_by = p_actor, resolution = v_resolution
  where id = p_report;
  insert into public.creator_moderation_events(project_id, reviewer_id, action, note)
    values (v_report.project_id, p_actor,
            case when p_decision = 'remove' then 'unpublished' else 'report_dismissed' end,
            trim(p_note));
  return v_resolution;
end;
$function$;

-- PostgreSQL grants EXECUTE on new functions to PUBLIC by default.
-- Both functions must be inaccessible to anon and regular authenticated users.
revoke execute on function public.creator_review_project(uuid, uuid, text, text)
  from public, anon, authenticated;
revoke execute on function public.creator_resolve_report(uuid, uuid, text, text)
  from public, anon, authenticated;
grant execute on function public.creator_review_project(uuid, uuid, text, text)
  to service_role;
grant execute on function public.creator_resolve_report(uuid, uuid, text, text)
  to service_role;
grant select, update on public.creator_projects to service_role;
grant select, update on public.creator_project_reports to service_role;
grant insert on public.creator_moderation_events to service_role;
