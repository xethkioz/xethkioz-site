-- XETHKIOZ v4.0 RC1.3
-- Network link audit + Green Node Wisp access + Science Lab evidence fields
-- Safe to run after profiles/articles/categories base migrations.

create table if not exists public.network_modules (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  route text not null,
  status text not null default 'planned' check (status in ('core','active','hidden','planned','archived')),
  accent text not null default 'orange',
  description text,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.link_registry (
  id uuid primary key default gen_random_uuid(),
  area text not null,
  label text not null,
  url text not null,
  link_type text not null default 'internal' check (link_type in ('internal','external','hidden','social','streaming')),
  status text not null default 'pending' check (status in ('confirmed','pending','broken','hidden')),
  last_checked_at timestamptz,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.green_node_access_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  access_method text not null check (access_method in ('wisp-click','keyboard-sequence','terminal-command','direct-route')),
  clearance_level text not null default 'GREEN',
  command text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.science_report_sources (
  id uuid primary key default gen_random_uuid(),
  report_id uuid,
  title text not null,
  source_name text not null,
  source_url text not null,
  evidence_level text not null check (evidence_level in ('Divulgación','Informe','Paper revisado','Preprint','Fuente institucional')),
  doi text,
  review_status text not null default 'draft' check (review_status in ('draft','review','published','archived')),
  created_at timestamptz not null default now()
);

alter table public.network_modules enable row level security;
alter table public.link_registry enable row level security;
alter table public.green_node_access_logs enable row level security;
alter table public.science_report_sources enable row level security;

create policy if not exists "network modules public read" on public.network_modules for select using (true);
create policy if not exists "link registry public confirmed read" on public.link_registry for select using (status in ('confirmed','hidden'));
create policy if not exists "green node insert own public" on public.green_node_access_logs for insert with check (true);
create policy if not exists "science sources public published read" on public.science_report_sources for select using (review_status = 'published');

insert into public.network_modules (slug, name, route, status, accent, description, is_visible)
values
  ('gaming-tech','Gaming & Technology','/gaming','core','orange','Portal principal de gaming, tecnología, IA aplicada y streaming.', true),
  ('science-lab','Science Lab','/science','active','sky','División formal para informes científicos y fuentes verificables.', true),
  ('green-node','Green Node','/green-node','hidden','green','Nodo oculto con Linux, programación, ciberseguridad defensiva y misterios documentales.', false),
  ('ai-lab','AI Lab','/tech?focus=ai','planned','cyan','Laboratorio de IA, modelos, prompts y automatización editorial.', true),
  ('creator-studio','Creator Studio','/streaming','active','purple','Producción audiovisual, OBS, directos y herramientas para creadores.', true)
on conflict (slug) do update set
  name = excluded.name,
  route = excluded.route,
  status = excluded.status,
  accent = excluded.accent,
  description = excluded.description,
  is_visible = excluded.is_visible,
  updated_at = now();
