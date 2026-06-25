-- XETHKIOZ Network RC1.1
-- Science Lab + Green Node foundation
-- Build date: 2026-06-25
-- Purpose: modular portals, formal science reports, hidden Green Node content and access events.

create table if not exists public.network_portals (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  status text not null default 'planned' check (status in ('core','formal','hidden','branch','planned')),
  accent text not null default 'orange',
  route_path text not null,
  is_public boolean not null default true,
  requires_easter_egg boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.science_reports (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  summary text not null,
  content text,
  field text not null,
  evidence_level text not null check (evidence_level in ('Divulgación','Informe','Paper revisado','Preprint','Fuente institucional')),
  source_name text,
  source_url text,
  doi text,
  author_id uuid,
  status text not null default 'draft' check (status in ('draft','review','published','archived')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.green_node_entries (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text,
  content text,
  node_category text not null default 'green-node',
  clearance_level text not null default 'visitor',
  terminal_command text,
  safety_label text not null default 'educational',
  status text not null default 'draft' check (status in ('draft','review','published','archived')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.green_node_access_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  event_type text not null default 'portal_open',
  command text,
  clearance_level text not null default 'visitor',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.network_portals enable row level security;
alter table public.science_reports enable row level security;
alter table public.green_node_entries enable row level security;
alter table public.green_node_access_logs enable row level security;

drop policy if exists "Public can read public network portals" on public.network_portals;
create policy "Public can read public network portals"
  on public.network_portals for select
  using (is_public = true);

drop policy if exists "Public can read published science reports" on public.science_reports;
create policy "Public can read published science reports"
  on public.science_reports for select
  using (status = 'published');

drop policy if exists "Public can read published green node entries" on public.green_node_entries;
create policy "Public can read published green node entries"
  on public.green_node_entries for select
  using (status = 'published');

drop policy if exists "Authenticated can insert green node access logs" on public.green_node_access_logs;
create policy "Authenticated can insert green node access logs"
  on public.green_node_access_logs for insert
  with check (auth.uid() is not null);

insert into public.network_portals (slug, name, description, status, accent, route_path, is_public, requires_easter_egg, sort_order)
values
  ('gaming-tech', 'Gaming & Technology', 'Portal principal de gaming, tecnología, IA aplicada, hardware y streaming.', 'core', 'orange', '/gaming', true, false, 1),
  ('science-lab', 'Science Lab', 'División profesional para informes científicos, divulgación y fuentes verificables.', 'formal', 'blue', '/science', true, false, 2),
  ('green-node', 'Green Node', 'Nodo oculto de Linux, programación, ciberseguridad educativa, OSINT y misterios documentales.', 'hidden', 'green', '/green-node', true, true, 3),
  ('asia-gaming', 'Asia Gaming', 'Portal dedicado a gaming asiático y tendencias de Corea, Japón, China y SEA.', 'branch', 'red', '/gaming?focus=asia', true, false, 4),
  ('ai-lab', 'AI Lab', 'Laboratorio de modelos, prompts, automatizaciones e inteligencia artificial.', 'planned', 'cyan', '/tech?focus=ai', true, false, 5),
  ('creator-studio', 'Creator Studio', 'Producción, OBS, streaming, audio, video y herramientas para creadores.', 'branch', 'purple', '/streaming', true, false, 6)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  status = excluded.status,
  accent = excluded.accent,
  route_path = excluded.route_path,
  is_public = excluded.is_public,
  requires_easter_egg = excluded.requires_easter_egg,
  sort_order = excluded.sort_order,
  updated_at = now();
