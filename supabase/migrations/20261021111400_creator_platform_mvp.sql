-- XETHKIOZ Creator Network: additive, staged for review. Do not run on production until approved.
-- Creator files are NOT uploaded to this database; only external HTTPS links are stored.
create table if not exists public.creator_projects (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users(id) on delete cascade,
  author_name text not null check (char_length(author_name) between 1 and 70),
  title text not null default '' check (char_length(title) <= 100),
  summary text not null default '' check (char_length(summary) <= 1200),
  category text not null check (category in ('programa','videojuego','video','arte','herramienta_ia','otro')),
  external_url text not null default '' check (char_length(external_url) <= 2048),
  cover_url text,
  license text not null default 'Todos los derechos reservados' check (char_length(license) between 1 and 80),
  tags text[] not null default '{}'::text[] check (cardinality(tags) <= 8),
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
grant insert (author_id, author_name, title, summary, category, external_url, cover_url, license, tags, status) on public.creator_projects to authenticated;
grant update (author_name, title, summary, category, external_url, cover_url, license, tags, status) on public.creator_projects to authenticated;
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
    (select auth.uid()) = author_id and status in ('draft','pending_review','rejected')
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
grant insert, select on public.creator_project_reports to authenticated;
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
  project_id uuid not null references public.creator_projects(id) on delete cascade,
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
