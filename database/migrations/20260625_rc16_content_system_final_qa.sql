-- XETHKIOZ v4.0 RC1.6 — Content System + Final Network UX
-- Base incremental sobre RC1.5. No destruye datos existentes.

create table if not exists public.portal_content_lanes (
  id text primary key,
  title text not null,
  portal text not null,
  status text not null check (status in ('ready','needs-source','editorial-review','cms-ready','automation-ready')),
  description text not null,
  owner_role text not null,
  database_targets text[] not null default '{}',
  next_step text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.editorial_queue (
  id uuid primary key default gen_random_uuid(),
  lane_id text references public.portal_content_lanes(id) on delete set null,
  title text not null,
  source_url text,
  original_source text,
  portal text not null,
  content_type text not null check (content_type in ('own_news','external_radar','science_report','green_node_log','video_stream','community_post')),
  status text not null default 'draft' check (status in ('draft','review','scheduled','published','archived')),
  priority int not null default 3 check (priority between 1 and 5),
  ai_summary text,
  editorial_note text,
  scheduled_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.portal_qa_checks (
  id uuid primary key default gen_random_uuid(),
  area text not null,
  check_label text not null,
  status text not null default 'review' check (status in ('ready','review','partial','blocked')),
  notes text,
  owner_role text default 'admin',
  checked_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.wisp_discovery_events (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete set null,
  route text not null,
  event_type text not null check (event_type in ('visible','hover','click','keyword','portal_open','green_node_enter')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.content_distribution_targets (
  id text primary key,
  label text not null,
  target_url text not null,
  target_type text not null check (target_type in ('canonical','verified-social','pending-social','streaming','internal')),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists idx_editorial_queue_portal_status on public.editorial_queue(portal, status);
create index if not exists idx_editorial_queue_lane on public.editorial_queue(lane_id);
create index if not exists idx_wisp_events_route_type on public.wisp_discovery_events(route, event_type);
create index if not exists idx_qa_checks_status on public.portal_qa_checks(status);

alter table public.portal_content_lanes enable row level security;
alter table public.editorial_queue enable row level security;
alter table public.portal_qa_checks enable row level security;
alter table public.wisp_discovery_events enable row level security;
alter table public.content_distribution_targets enable row level security;

-- Lectura pública para configuración no sensible.
drop policy if exists "Public can read portal lanes" on public.portal_content_lanes;
create policy "Public can read portal lanes" on public.portal_content_lanes for select using (true);

drop policy if exists "Public can read distribution targets" on public.content_distribution_targets;
create policy "Public can read distribution targets" on public.content_distribution_targets for select using (is_active = true);

drop policy if exists "Public can read qa checks" on public.portal_qa_checks;
create policy "Public can read qa checks" on public.portal_qa_checks for select using (true);

-- Inserción pública limitada para eventos Wisp anónimos; se evita guardar datos sensibles.
drop policy if exists "Public can insert wisp events" on public.wisp_discovery_events;
create policy "Public can insert wisp events" on public.wisp_discovery_events for insert with check (true);

-- La cola editorial debe administrarse por roles desde políticas futuras basadas en roles/permissions.
drop policy if exists "Authenticated can read editorial queue" on public.editorial_queue;
create policy "Authenticated can read editorial queue" on public.editorial_queue for select using (auth.role() = 'authenticated');

insert into public.portal_content_lanes (id, title, portal, status, description, owner_role, database_targets, next_step)
values
  ('own-news','Noticias propias','Gaming & Technology / AI Lab / Asia Gaming','cms-ready','Contenido propio de XETHKIOZ con portada, autor, SEO, categorías y programación.','editor', array['articles','categories','authors','media','tags'], 'Conectar editor CMS con Supabase.'),
  ('external-radar','Radar externo diario','News Engine','automation-ready','Fuentes externas usadas como disparador editorial con atribución y revisión humana.','admin', array['news_sources','external_items','editorial_queue'], 'Activar RSS/API fuente por fuente.'),
  ('science-report','Informes Science Lab','Science Lab','needs-source','Informes científicos con fuente, evidencia, DOI/enlace, fecha de revisión y nota editorial.','editor', array['science_reports','science_sources','article_sources'], 'Agregar evidencia y revisión formal antes de publicar.'),
  ('green-node-log','Green Node logs','Green Node','editorial-review','Linux, programación, OSINT ético, ciberseguridad defensiva y misterios documentales.','moderator', array['green_node_entries','wisp_events','achievements'], 'Conectar EGGs con logros sin invadir UX.'),
  ('video-stream','Videos y directos','Creator Studio / Streaming','cms-ready','Miniaturas, embeds, directos, clips, shorts y recursos OBS.','creator', array['videos','streams','media'], 'Normalizar plataforma, video_id, thumbnail y canonical_url.'),
  ('community-post','Comunidad y red social','Community OS','editorial-review','Publicaciones, comentarios, XP, reacciones, donadores y moderadores temporales.','moderator', array['community_posts','comments','reactions','xp_logs'], 'Activar realtime y RLS por rol.')
on conflict (id) do update set
  status = excluded.status,
  description = excluded.description,
  owner_role = excluded.owner_role,
  database_targets = excluded.database_targets,
  next_step = excluded.next_step,
  updated_at = now();

insert into public.portal_qa_checks (area, check_label, status, notes, owner_role)
values
  ('Rutas','Verificar /, /network, /content-system, /news-engine, /science, /green-node, /cms, /roles, /qa','ready','RC1.6 agrega tablero explícito para QA.', 'admin'),
  ('Links','Revisar redes oficiales y marcar YouTube si requiere confirmación final','review','Los links se centralizan desde siteConfig.', 'admin'),
  ('SQL','Aplicar baseline RC1.5 + incremental RC1.6 antes de usar CMS real','ready','No destruye datos existentes.', 'admin'),
  ('Green Node','Validar Wisp, keyword greennode/wisp y modo reduce-motion','ready','El Wisp no aparece en chat-overlay ni dentro del nodo.', 'moderator'),
  ('Science Lab','No publicar informes sin fuente, evidencia y fecha de revisión','ready','Science Lab debe mantener tono formal.', 'editor'),
  ('CMS','Conexión real a Supabase pendiente para fase RC2','partial','Studio visual listo; falta wiring completo.', 'admin')
on conflict do nothing;

insert into public.content_distribution_targets (id, label, target_url, target_type, is_active)
values
  ('web','Web oficial','https://xethkioz.com.ar','canonical',true),
  ('instagram','Instagram','https://www.instagram.com/xethkioz','verified-social',true),
  ('threads','Threads','https://www.threads.com/@xethkioz','verified-social',true),
  ('tiktok-main','TikTok principal','https://www.tiktok.com/@xethkioz0','verified-social',true),
  ('tiktok-asia','TikTok Asia','https://www.tiktok.com/@xethkioz.asia','verified-social',true),
  ('twitch','Twitch','https://www.twitch.tv/xethkioz','streaming',true),
  ('kick','Kick','https://kick.com/xethkioz','streaming',true),
  ('youtube','YouTube','https://www.youtube.com/@XETHKIOZ','pending-social',true)
on conflict (id) do update set
  label = excluded.label,
  target_url = excluded.target_url,
  target_type = excluded.target_type,
  is_active = excluded.is_active;
