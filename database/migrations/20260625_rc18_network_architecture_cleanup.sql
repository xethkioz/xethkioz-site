-- XETHKIOZ v4.0 RC1.8
-- Network Architecture Cleanup + AI Lab + Creator Studio
-- Ejecutar solamente después de backup y revisión en Supabase.

create table if not exists public.network_modules (
  id text primary key,
  name text not null,
  slug text not null unique,
  route text not null,
  status text not null default 'planned',
  accent text,
  description text,
  sort_order integer not null default 100,
  is_hidden boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.editorial_policies (
  id uuid primary key default gen_random_uuid(),
  module_id text references public.network_modules(id) on delete cascade,
  title text not null,
  policy_type text not null,
  body text not null,
  is_required boolean not null default true,
  created_at timestamptz not null default now()
);

insert into public.network_modules (id, name, slug, route, status, accent, description, sort_order, is_hidden)
values
  ('gaming-tech', 'Gaming & Technology', 'gaming-tech', '/gaming', 'core-live', 'orange', 'Portal principal de gaming, tecnología, IA aplicada, streaming y comunidad.', 10, false),
  ('science-lab', 'Science Lab', 'science-lab', '/science', 'formal-division', 'blue', 'División formal de informes científicos, fuentes verificables y evidencia.', 20, false),
  ('ai-lab', 'AI Lab', 'ai-lab', '/ai-lab', 'rc1.8', 'cyan', 'Modelos, prompts, automatización editorial, SEO IA y flujos con revisión humana.', 30, false),
  ('creator-studio', 'Creator Studio', 'creator-studio', '/creator-studio', 'rc1.8', 'purple', 'OBS, streaming, audio, video, clips, shorts y producción audiovisual.', 40, false),
  ('content-os', 'Content OS', 'content-os', '/content-system', 'rc1.6', 'orange', 'Sistema editorial para noticias propias, radar externo, informes, videos y SEO.', 50, false),
  ('community-os', 'Community OS', 'community-os', '/community', 'foundation', 'orange', 'Perfiles, XP, insignias, chat, moderación y reputación.', 60, false),
  ('green-node', 'Green Node', 'green-node', '/green-node', 'hidden-egg', 'green', 'Nodo oculto: Linux, programación, ciberseguridad educativa, OSINT y misterios documentales.', 90, true)
on conflict (id) do update set
  name = excluded.name,
  slug = excluded.slug,
  route = excluded.route,
  status = excluded.status,
  accent = excluded.accent,
  description = excluded.description,
  sort_order = excluded.sort_order,
  is_hidden = excluded.is_hidden,
  updated_at = now();

insert into public.editorial_policies (module_id, title, policy_type, body, is_required)
values
  ('ai-lab', 'Revisión humana obligatoria', 'ai_safety', 'La IA puede generar borradores, resúmenes, categorías y SEO, pero ninguna noticia se publica sin revisión humana.', true),
  ('creator-studio', 'Audio y video con derechos claros', 'media_rights', 'Todo audio, imagen o video usado en producción debe ser propio, generado con licencia clara o provenir de una fuente permitida.', true),
  ('green-node', 'Modo educativo y documental', 'safety', 'Green Node no debe promover intrusión, evasión, daño ni actividad ilegal. El enfoque es Linux, programación, defensa y verificación.', true),
  ('science-lab', 'Evidencia y fuente', 'science_integrity', 'Cada informe científico debe declarar fuente, fecha, evidencia, contexto y limitaciones.', true)
on conflict do nothing;

create index if not exists idx_network_modules_status on public.network_modules(status);
create index if not exists idx_network_modules_route on public.network_modules(route);
create index if not exists idx_editorial_policies_module on public.editorial_policies(module_id);
