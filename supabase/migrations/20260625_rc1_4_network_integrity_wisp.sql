-- XETHKIOZ v4.0 RC1.4
-- Network Integrity + Wisp EGG + Science Lab formal fields
-- Safe additive migration. Review in Supabase before LIVE.

create table if not exists public.network_modules (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  route text not null,
  visual_identity text,
  status text default 'planned',
  priority text default 'normal',
  description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.green_node_unlocks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  trigger text not null,
  route text default '/green-node',
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create table if not exists public.science_sources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  source_type text not null,
  source_url text,
  doi text,
  institution text,
  evidence_level text default 'divulgacion',
  reliability_notes text,
  created_at timestamptz default now()
);

alter table public.network_modules enable row level security;
alter table public.green_node_unlocks enable row level security;
alter table public.science_sources enable row level security;

create policy if not exists "network modules are readable" on public.network_modules for select using (true);
create policy if not exists "science sources are readable" on public.science_sources for select using (true);
create policy if not exists "users can read own unlocks" on public.green_node_unlocks for select using (auth.uid() = user_id or user_id is null);
create policy if not exists "authenticated users can create own unlocks" on public.green_node_unlocks for insert with check (auth.uid() = user_id or user_id is null);

insert into public.network_modules (slug, name, route, visual_identity, status, priority, description) values
  ('gaming-tech', 'Gaming & Technology', '/gaming', 'violeta+naranja', 'core-live', 'alta', 'Portal principal de XETHKIOZ.'),
  ('science-lab', 'Science Lab', '/science', 'azul+blanco+institucional', 'formal-division', 'alta', 'Divulgación científica con fuentes y evidencia.'),
  ('green-node', 'Green Node', '/green-node', 'verde neon+negro+glitch', 'hidden-egg', 'especial', 'Linux, programación, cyber defensivo y misterios documentales.'),
  ('ai-lab', 'AI Lab', '/tech?focus=ai', 'cian+violeta', 'planned', 'media', 'IA, prompts y automatización editorial.'),
  ('creator-studio', 'Creator Studio', '/streaming', 'violeta+magenta', 'branch', 'media', 'Streaming, OBS y producción audiovisual.'),
  ('community-os', 'Community OS', '/community', 'naranja+violeta', 'foundation', 'alta', 'Perfiles, XP, roles y comunidad.')
on conflict (slug) do update set
  name = excluded.name,
  route = excluded.route,
  visual_identity = excluded.visual_identity,
  status = excluded.status,
  priority = excluded.priority,
  description = excluded.description,
  updated_at = now();
