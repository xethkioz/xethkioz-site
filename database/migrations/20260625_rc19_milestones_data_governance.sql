-- XETHKIOZ v4.0 RC1.9
-- Milestones + Data Governance + Community Progression
-- Objetivo: dejar documentado el baseline funcional para avanzar hacia v4.0 Stable y v5.0.

create table if not exists public.platform_milestones (
  id text primary key,
  label text not null,
  title text not null,
  status text not null check (status in ('stable', 'in-progress', 'planned', 'blocked')),
  progress integer not null default 0 check (progress >= 0 and progress <= 100),
  objective text not null,
  owner_role text default 'admin',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.platform_milestone_tasks (
  id uuid primary key default gen_random_uuid(),
  milestone_id text not null references public.platform_milestones(id) on delete cascade,
  title text not null,
  status text not null default 'pending' check (status in ('pending', 'in-progress', 'done', 'blocked')),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'critical')),
  route text,
  database_scope text,
  qa_note text,
  created_at timestamptz not null default now()
);

create table if not exists public.service_backlog (
  id uuid primary key default gen_random_uuid(),
  service_name text not null,
  current_state text not null,
  next_step text not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'critical')),
  target_milestone text references public.platform_milestones(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.community_progression_rules (
  id uuid primary key default gen_random_uuid(),
  level_name text not null,
  min_xp integer not null default 0,
  requires_staff_review boolean not null default false,
  donation_can_help boolean not null default false,
  benefit text not null,
  created_at timestamptz not null default now()
);

alter table public.platform_milestones enable row level security;
alter table public.platform_milestone_tasks enable row level security;
alter table public.service_backlog enable row level security;
alter table public.community_progression_rules enable row level security;

-- Lectura publica para roadmap y reglas comunitarias.
drop policy if exists "public_read_platform_milestones" on public.platform_milestones;
create policy "public_read_platform_milestones" on public.platform_milestones for select using (true);

drop policy if exists "public_read_service_backlog" on public.service_backlog;
create policy "public_read_service_backlog" on public.service_backlog for select using (true);

drop policy if exists "public_read_community_progression_rules" on public.community_progression_rules;
create policy "public_read_community_progression_rules" on public.community_progression_rules for select using (true);

-- Las tareas internas quedan preparadas para que solo staff/admin las escriba cuando se conecten roles reales.
drop policy if exists "public_read_platform_milestone_tasks" on public.platform_milestone_tasks;
create policy "public_read_platform_milestone_tasks" on public.platform_milestone_tasks for select using (true);

insert into public.platform_milestones (id, label, title, status, progress, objective) values
  ('core-platform', 'Milestone A', 'Core Platform', 'in-progress', 72, 'Arquitectura, layouts, Network Hub, Green Node aislado, Science Lab formal y baseline SQL.'),
  ('content-platform', 'Milestone B', 'Content Platform', 'in-progress', 44, 'CMS, noticias propias, radar externo, informes Science Lab, multimedia, SEO y programacion.'),
  ('community-platform', 'Milestone C', 'Community Platform', 'planned', 31, 'Perfiles, XP, insignias, reputacion, chat, roles, donadores y moderacion temporal.'),
  ('creator-ecosystem', 'Milestone D', 'Creator Ecosystem', 'planned', 24, 'AI Lab, Creator Studio, OBS, redes, prompts, calendario editorial y automatizaciones.'),
  ('production-ready', 'Milestone E', 'Production Ready', 'planned', 18, 'Auditoria final, performance, accesibilidad, SEO, seguridad, Netlify y Supabase.')
on conflict (id) do update set
  status = excluded.status,
  progress = excluded.progress,
  objective = excluded.objective,
  updated_at = now();

insert into public.community_progression_rules (level_name, min_xp, requires_staff_review, donation_can_help, benefit) values
  ('Visitante', 0, false, false, 'Lectura publica y acceso general.'),
  ('Miembro', 100, false, false, 'Perfil, comentarios y chat general.'),
  ('Colaborador', 750, false, false, 'Puede proponer noticias y fuentes para revision.'),
  ('Donador', 0, false, true, 'Insignia, color de nombre y beneficios sin permisos de moderacion automaticos.'),
  ('Embajador', 3000, true, true, 'Participacion destacada en eventos, misiones y comunidad.'),
  ('Moderador temporal', 5000, true, true, 'Permisos limitados por tiempo, historial positivo y aprobacion del staff.'),
  ('Editor', 0, true, false, 'Gestion editorial y publicacion de contenidos.')
on conflict do nothing;

create index if not exists idx_platform_milestone_tasks_milestone on public.platform_milestone_tasks(milestone_id);
create index if not exists idx_service_backlog_target on public.service_backlog(target_milestone);
create index if not exists idx_community_progression_min_xp on public.community_progression_rules(min_xp);
