-- XETHKIOZ v4.0 RC1.5
-- Network Database Baseline + General Review
-- Build date: 2026-06-25
-- Purpose: consolidate database direction from this point forward.
-- Apply only after a Supabase backup. This migration is additive and avoids destructive drops.

-- ------------------------------------------------------------
-- 1) Role helpers
-- ------------------------------------------------------------
create or replace function public.xethkioz_current_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((select role from public.profiles where id = auth.uid()), 'guest')
$$;

create or replace function public.xethkioz_is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.xethkioz_current_role() in ('admin','editor','moderator','temp_moderator')
$$;

create or replace function public.xethkioz_is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.xethkioz_current_role() = 'admin'
$$;

-- ------------------------------------------------------------
-- 2) Network modules / portals
-- ------------------------------------------------------------
create table if not exists public.network_modules (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  route text not null,
  visual_identity text not null,
  status text not null default 'planned',
  priority text not null default 'media',
  description text,
  is_hidden boolean not null default false,
  requires_unlock boolean not null default false,
  sort_order integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.network_modules enable row level security;
drop policy if exists network_modules_public_read on public.network_modules;
create policy network_modules_public_read on public.network_modules for select using (true);

drop policy if exists network_modules_staff_write on public.network_modules;
create policy network_modules_staff_write on public.network_modules for all to authenticated using (public.xethkioz_is_staff()) with check (public.xethkioz_is_staff());

insert into public.network_modules (slug, name, route, visual_identity, status, priority, description, is_hidden, requires_unlock, sort_order, metadata)
values
  ('gaming-tech', 'Gaming & Technology', '/gaming', 'violeta+naranja', 'core-live', 'alta', 'Portal principal de XETHKIOZ.', false, false, 10, '{"portal":"gaming"}'),
  ('science-lab', 'Science Lab', '/science', 'azul+blanco+institucional', 'formal-division', 'alta', 'Divulgación científica con fuentes, evidencia e informes.', false, false, 20, '{"portal":"science","requires_sources":true}'),
  ('green-node', 'Green Node', '/green-node', 'verde-neon+negro+glitch', 'hidden-egg', 'especial', 'Linux, programación, ciberseguridad defensiva, OSINT y misterios documentales.', true, true, 30, '{"portal":"green-node","safety":"educational_only"}'),
  ('ai-lab', 'AI Lab', '/tech?focus=ai', 'cian+violeta', 'planned', 'media', 'Modelos, prompts, IA editorial y automatización.', false, false, 40, '{"portal":"ai"}'),
  ('creator-studio', 'Creator Studio', '/streaming', 'violeta+magenta', 'branch', 'media', 'OBS, Kick, Twitch, YouTube, audio, video y producción.', false, false, 50, '{"portal":"creator"}'),
  ('community-os', 'Community OS', '/community', 'naranja+violeta', 'foundation', 'alta', 'Perfiles, XP, roles, chat, reputación y comunidad.', false, false, 60, '{"portal":"community"}')
on conflict (slug) do update set
  name = excluded.name,
  route = excluded.route,
  visual_identity = excluded.visual_identity,
  status = excluded.status,
  priority = excluded.priority,
  description = excluded.description,
  is_hidden = excluded.is_hidden,
  requires_unlock = excluded.requires_unlock,
  sort_order = excluded.sort_order,
  metadata = excluded.metadata,
  updated_at = now();

-- ------------------------------------------------------------
-- 3) CMS/article upgrades
-- ------------------------------------------------------------
alter table public.articles
  add column if not exists portal_slug text default 'gaming-tech',
  add column if not exists seo_title text,
  add column if not exists seo_description text,
  add column if not exists canonical_url text,
  add column if not exists source_url text,
  add column if not exists source_name text,
  add column if not exists reading_minutes integer default 4,
  add column if not exists moderation_status text not null default 'approved',
  add column if not exists editorial_type text not null default 'original';

create index if not exists idx_articles_portal_slug on public.articles(portal_slug);
create index if not exists idx_articles_editorial_type on public.articles(editorial_type);
create index if not exists idx_articles_featured_published on public.articles(is_featured, published_at desc);

create table if not exists public.content_tags (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  portal_slug text,
  created_at timestamptz not null default now()
);

create table if not exists public.article_tag_links (
  article_id uuid references public.articles(id) on delete cascade,
  tag_id uuid references public.content_tags(id) on delete cascade,
  primary key(article_id, tag_id)
);

alter table public.content_tags enable row level security;
alter table public.article_tag_links enable row level security;
drop policy if exists content_tags_public_read on public.content_tags;
create policy content_tags_public_read on public.content_tags for select using (true);
drop policy if exists article_tag_links_public_read on public.article_tag_links;
create policy article_tag_links_public_read on public.article_tag_links for select using (true);

-- ------------------------------------------------------------
-- 4) Science Lab formal layer
-- ------------------------------------------------------------
create table if not exists public.science_sources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  source_type text not null default 'institutional',
  url text not null,
  reliability_level text not null default 'review_required',
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.science_reports (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  summary text not null,
  content text,
  field text not null,
  evidence_level text not null default 'Divulgación',
  source_name text,
  source_url text,
  doi text,
  source_id uuid references public.science_sources(id) on delete set null,
  author_id uuid references public.authors(id) on delete set null,
  status text not null default 'draft',
  reviewed_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_science_reports_status on public.science_reports(status);
create index if not exists idx_science_reports_field on public.science_reports(field);
create index if not exists idx_science_reports_published on public.science_reports(published_at desc);

alter table public.science_sources enable row level security;
alter table public.science_reports enable row level security;
drop policy if exists science_sources_public_read on public.science_sources;
create policy science_sources_public_read on public.science_sources for select using (true);
drop policy if exists science_reports_public_read on public.science_reports;
create policy science_reports_public_read on public.science_reports for select using (status = 'published');
drop policy if exists science_reports_staff_read on public.science_reports;
create policy science_reports_staff_read on public.science_reports for select to authenticated using (public.xethkioz_is_staff());
drop policy if exists science_reports_staff_write on public.science_reports;
create policy science_reports_staff_write on public.science_reports for all to authenticated using (public.xethkioz_is_staff()) with check (public.xethkioz_is_staff());

-- ------------------------------------------------------------
-- 5) Dynamic news and attribution
-- ------------------------------------------------------------
create table if not exists public.news_sources (
  id uuid primary key default gen_random_uuid(),
  source_key text unique not null,
  name text not null,
  kind text not null,
  region text,
  url text not null,
  rss_url text,
  language text default 'es',
  attribution text not null default 'Citar fuente original y enlazar.',
  status text not null default 'manual-review',
  notes text,
  last_checked_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.external_news_items (
  id uuid primary key default gen_random_uuid(),
  source_id uuid references public.news_sources(id) on delete set null,
  external_url text not null,
  external_id text,
  title text not null,
  excerpt text,
  image_url text,
  source_name text,
  category_slug text,
  language text default 'es',
  status text not null default 'pending',
  attribution_url text not null,
  imported_at timestamptz not null default now(),
  reviewed_by uuid references public.profiles(id) on delete set null,
  converted_article_id uuid references public.articles(id) on delete set null
);

create table if not exists public.cms_publication_jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  job_type text not null default 'article',
  status text not null default 'draft',
  portal_slug text not null default 'gaming-tech',
  scheduled_at timestamptz,
  payload jsonb not null default '{}'::jsonb,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_external_news_status on public.external_news_items(status);
create index if not exists idx_external_news_imported on public.external_news_items(imported_at desc);
create index if not exists idx_cms_jobs_status on public.cms_publication_jobs(status);

alter table public.news_sources enable row level security;
alter table public.external_news_items enable row level security;
alter table public.cms_publication_jobs enable row level security;
drop policy if exists news_sources_public_read on public.news_sources;
create policy news_sources_public_read on public.news_sources for select using (status <> 'disabled');
drop policy if exists external_news_public_read on public.external_news_items;
create policy external_news_public_read on public.external_news_items for select using (status in ('reviewed','converted'));
drop policy if exists external_news_staff_all on public.external_news_items;
create policy external_news_staff_all on public.external_news_items for all to authenticated using (public.xethkioz_is_staff()) with check (public.xethkioz_is_staff());
drop policy if exists cms_jobs_staff_all on public.cms_publication_jobs;
create policy cms_jobs_staff_all on public.cms_publication_jobs for all to authenticated using (public.xethkioz_is_staff()) with check (public.xethkioz_is_staff());

-- ------------------------------------------------------------
-- 6) Community, XP, badges, donor and moderation ladder
-- ------------------------------------------------------------
create table if not exists public.user_xp_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  action_key text not null,
  points integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  achievement_key text unique not null,
  name text not null,
  icon text,
  description text,
  required_points integer default 0,
  portal_slug text,
  created_at timestamptz not null default now()
);

create table if not exists public.user_badges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  badge_key text not null,
  badge_name text not null,
  badge_icon text,
  reason text,
  awarded_by uuid references public.profiles(id) on delete set null,
  awarded_at timestamptz not null default now(),
  unique(user_id, badge_key)
);

create table if not exists public.moderation_assignments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  role text not null,
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  reason text,
  status text not null default 'active',
  assigned_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.donor_tiers (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  monthly_amount_min numeric(12,2) default 0,
  benefits jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_xp_user_created on public.user_xp_events(user_id, created_at desc);
create index if not exists idx_badges_user on public.user_badges(user_id);
create index if not exists idx_moderation_user_status on public.moderation_assignments(user_id, status);

alter table public.user_xp_events enable row level security;
alter table public.achievements enable row level security;
alter table public.user_badges enable row level security;
alter table public.moderation_assignments enable row level security;
alter table public.donor_tiers enable row level security;
drop policy if exists achievements_public_read on public.achievements;
create policy achievements_public_read on public.achievements for select using (true);
drop policy if exists donor_tiers_public_read on public.donor_tiers;
create policy donor_tiers_public_read on public.donor_tiers for select using (true);
drop policy if exists xp_own_read on public.user_xp_events;
create policy xp_own_read on public.user_xp_events for select to authenticated using (auth.uid() = user_id or public.xethkioz_is_staff());
drop policy if exists badges_public_read on public.user_badges;
create policy badges_public_read on public.user_badges for select using (true);
drop policy if exists moderation_staff_read on public.moderation_assignments;
create policy moderation_staff_read on public.moderation_assignments for select to authenticated using (auth.uid() = user_id or public.xethkioz_is_staff());

-- ------------------------------------------------------------
-- 7) Green Node / Wisp unlocks and audit
-- ------------------------------------------------------------
create table if not exists public.green_node_unlocks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  unlock_key text not null,
  source text not null default 'wisp',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.wisp_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  event_type text not null,
  route_path text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.green_node_entries (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  category text not null,
  level text not null default 'visitor',
  excerpt text not null,
  command text,
  safety_label text not null default 'educational',
  status text not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_wisp_events_route_created on public.wisp_events(route_path, created_at desc);
create index if not exists idx_green_unlocks_user on public.green_node_unlocks(user_id, created_at desc);

alter table public.green_node_unlocks enable row level security;
alter table public.wisp_events enable row level security;
alter table public.green_node_entries enable row level security;
drop policy if exists green_entries_public_read on public.green_node_entries;
create policy green_entries_public_read on public.green_node_entries for select using (status = 'published');
drop policy if exists green_unlocks_own_read on public.green_node_unlocks;
create policy green_unlocks_own_read on public.green_node_unlocks for select to authenticated using (auth.uid() = user_id or public.xethkioz_is_staff());
drop policy if exists green_unlocks_auth_insert on public.green_node_unlocks;
create policy green_unlocks_auth_insert on public.green_node_unlocks for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists wisp_events_staff_read on public.wisp_events;
create policy wisp_events_staff_read on public.wisp_events for select to authenticated using (public.xethkioz_is_staff());

-- ------------------------------------------------------------
-- 8) Seeds / system config
-- ------------------------------------------------------------
insert into public.achievements (achievement_key, name, icon, description, required_points, portal_slug)
values
  ('first_login', 'Primer acceso', '🟠', 'El usuario ingresó por primera vez.', 0, 'community-os'),
  ('green_wisp_found', 'Wisp encontrado', '🟢', 'Descubrió el acceso oculto a Green Node.', 10, 'green-node'),
  ('science_reader', 'Lector científico', '🔬', 'Leyó informes de Science Lab.', 50, 'science-lab'),
  ('community_signal', 'Señal comunitaria', '💬', 'Participación inicial en chat/comentarios.', 100, 'community-os'),
  ('temp_mod_candidate', 'Candidato a moderador temporal', '🛡️', 'Historial positivo y actividad suficiente para revisión.', 500, 'community-os')
on conflict (achievement_key) do update set
  name = excluded.name,
  icon = excluded.icon,
  description = excluded.description,
  required_points = excluded.required_points,
  portal_slug = excluded.portal_slug;

insert into public.donor_tiers (slug, name, monthly_amount_min, benefits)
values
  ('supporter', 'Supporter', 1, '["Insignia de apoyo", "Color especial en perfil", "Acceso anticipado a encuestas"]'),
  ('core-supporter', 'Core Supporter', 5, '["Insignia premium", "Prioridad en propuestas", "Mención mensual"]'),
  ('sponsor', 'Sponsor', 20, '["Bloque de sponsor", "Beneficios editoriales sujetos a revisión", "Contacto directo para campañas"]')
on conflict (slug) do update set
  name = excluded.name,
  monthly_amount_min = excluded.monthly_amount_min,
  benefits = excluded.benefits;

insert into public.site_settings (key, value)
values
  ('version', '{"version":"4.0.0-rc.1.5","name":"Network Database Baseline + General Review","build":"2026-06-25"}'),
  ('network_policy', '{"science":"formal_sources_required","green_node":"educational_documentary_only","external_news":"attribution_required","moderation":"trust_activity_and_support_not_donation_only"}')
on conflict (key) do update set value = excluded.value, updated_at = now();
