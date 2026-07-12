-- XETHKIOZ Web Services Foundation
-- Public visual catalog, private quote inbox and admin-only media uploads.

create extension if not exists pgcrypto;

-- Authorization stays server-side and never trusts user_metadata.
-- The function is intentionally executable only by authenticated sessions.
create or replace function public.xethkioz_web_is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select
    lower(coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '')) = 'admin'
    or exists (
      select 1
      from public.profiles
      where id = (select auth.uid())
        and upper(role::text) = 'ADMIN'
    );
$$;

revoke all on function public.xethkioz_web_is_admin() from public;
revoke all on function public.xethkioz_web_is_admin() from anon;
grant execute on function public.xethkioz_web_is_admin() to authenticated;

create table if not exists public.web_service_offers (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 100),
  eyebrow text check (eyebrow is null or char_length(eyebrow) <= 80),
  title text not null check (char_length(title) between 3 and 100),
  summary text not null check (char_length(summary) between 20 and 320),
  description text check (description is null or char_length(description) <= 1200),
  image_url text not null check (
    char_length(image_url) <= 2048
    and (image_url like '/%' or image_url like 'https://%')
  ),
  image_path text check (image_path is null or char_length(image_path) <= 500),
  image_alt text not null check (char_length(image_alt) between 5 and 180),
  price_label text not null default 'Presupuesto a medida' check (char_length(price_label) between 2 and 80),
  delivery_label text check (delivery_label is null or char_length(delivery_label) <= 100),
  features text[] not null default '{}'::text[] check (cardinality(features) between 2 and 12),
  cta_label text not null default 'Pedir presupuesto' check (char_length(cta_label) between 2 and 60),
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  featured boolean not null default false,
  sort_order integer not null default 100 check (sort_order between 0 and 9999),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.web_quote_requests (
  id uuid primary key default gen_random_uuid(),
  service_id uuid references public.web_service_offers(id) on delete set null,
  service_slug text check (service_slug is null or char_length(service_slug) <= 100),
  name text not null check (char_length(name) between 2 and 80),
  email text not null check (char_length(email) between 5 and 254),
  whatsapp text check (whatsapp is null or char_length(whatsapp) <= 40),
  business_name text check (business_name is null or char_length(business_name) <= 120),
  project_type text not null check (project_type in ('landing', 'corporate', 'ecommerce', 'portfolio', 'redesign', 'other')),
  budget_range text not null check (budget_range in ('to-define', 'starter', 'growth', 'advanced')),
  contact_preference text not null check (contact_preference in ('email', 'whatsapp', 'either')),
  details text not null check (char_length(details) between 20 and 2000),
  status text not null default 'new' check (status in ('new', 'contacted', 'quoted', 'won', 'lost', 'spam', 'archived')),
  source text not null default '/creacion-web' check (char_length(source) <= 120),
  internal_notes text check (internal_notes is null or char_length(internal_notes) <= 3000),
  consent_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists web_service_offers_public_catalog_idx
  on public.web_service_offers (featured desc, sort_order asc)
  where status = 'published';

create index if not exists web_quote_requests_inbox_idx
  on public.web_quote_requests (status, created_at desc);

create index if not exists web_quote_requests_email_rate_idx
  on public.web_quote_requests (email, created_at desc);

alter table public.web_service_offers enable row level security;
alter table public.web_service_offers force row level security;
alter table public.web_quote_requests enable row level security;
alter table public.web_quote_requests force row level security;

drop policy if exists web_service_offers_public_read on public.web_service_offers;
create policy web_service_offers_public_read
on public.web_service_offers
for select
to anon, authenticated
using (status = 'published');

drop policy if exists web_service_offers_admin_all on public.web_service_offers;
create policy web_service_offers_admin_all
on public.web_service_offers
for all
to authenticated
using ((select public.xethkioz_web_is_admin()))
with check ((select public.xethkioz_web_is_admin()));

drop policy if exists web_quote_requests_admin_all on public.web_quote_requests;
create policy web_quote_requests_admin_all
on public.web_quote_requests
for all
to authenticated
using ((select public.xethkioz_web_is_admin()))
with check ((select public.xethkioz_web_is_admin()));

revoke all on public.web_service_offers from anon, authenticated;
grant select (
  id, slug, eyebrow, title, summary, description, image_url, image_path, image_alt,
  price_label, delivery_label, features, cta_label, status, featured, sort_order, created_at, updated_at
) on public.web_service_offers to anon, authenticated;
grant insert, update, delete on public.web_service_offers to authenticated;
grant all on public.web_service_offers to service_role;

revoke all on public.web_quote_requests from anon, authenticated;
grant select, update on public.web_quote_requests to authenticated;
grant all on public.web_quote_requests to service_role;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'web-service-media',
  'web-service-media',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']::text[]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists web_service_media_admin_select on storage.objects;
create policy web_service_media_admin_select
on storage.objects
for select
to authenticated
using (bucket_id = 'web-service-media' and (select public.xethkioz_web_is_admin()));

drop policy if exists web_service_media_admin_insert on storage.objects;
create policy web_service_media_admin_insert
on storage.objects
for insert
to authenticated
with check (bucket_id = 'web-service-media' and (select public.xethkioz_web_is_admin()));

drop policy if exists web_service_media_admin_update on storage.objects;
create policy web_service_media_admin_update
on storage.objects
for update
to authenticated
using (bucket_id = 'web-service-media' and (select public.xethkioz_web_is_admin()))
with check (bucket_id = 'web-service-media' and (select public.xethkioz_web_is_admin()));

drop policy if exists web_service_media_admin_delete on storage.objects;
create policy web_service_media_admin_delete
on storage.objects
for delete
to authenticated
using (bucket_id = 'web-service-media' and (select public.xethkioz_web_is_admin()));

insert into public.web_service_offers (
  id, slug, eyebrow, title, summary, description, image_url, image_alt,
  price_label, delivery_label, features, cta_label, status, featured, sort_order
)
values
(
  '8c93f7e4-1c2b-4bf5-8a93-000000000001',
  'landing-premium',
  'Presencia digital',
  'Landing premium',
  'Una página rápida y enfocada en convertir visitas en consultas, reservas o ventas.',
  'Ideal para profesionales, lanzamientos, eventos y campañas que necesitan una propuesta clara con identidad propia.',
  '/web-services/landing-premium.svg',
  'Ejemplo de landing page premium para una marca creativa',
  'Presupuesto a medida',
  'Entrega estimada: 2–4 semanas',
  array['Diseño responsive', 'Formulario de contacto', 'SEO técnico base', 'Analítica y métricas'],
  'Quiero una landing',
  'published',
  true,
  10
),
(
  '8c93f7e4-1c2b-4bf5-8a93-000000000002',
  'tienda-online',
  'Venta online',
  'Tienda digital',
  'Catálogo, carrito y experiencia de compra preparados para vender desde cualquier pantalla.',
  'Una base comercial escalable para mostrar productos, recibir pedidos y conectar medios de pago según el proyecto.',
  '/web-services/tienda-digital.svg',
  'Ejemplo de tienda online moderna con catálogo de productos',
  'Cotización personalizada',
  'Entrega estimada: 4–8 semanas',
  array['Catálogo administrable', 'Carrito y checkout', 'Integración de pagos', 'Optimización mobile'],
  'Quiero vender online',
  'published',
  true,
  20
),
(
  '8c93f7e4-1c2b-4bf5-8a93-000000000003',
  'sitio-profesional',
  'Marca y confianza',
  'Sitio profesional',
  'Un sitio completo para contar quién sos, mostrar servicios y construir confianza con tu audiencia.',
  'Pensado para empresas, estudios, proyectos personales y equipos que necesitan varias secciones y contenido fácil de mantener.',
  '/web-services/sitio-profesional.svg',
  'Ejemplo de sitio web profesional para una empresa de servicios',
  'Presupuesto a medida',
  'Entrega estimada: 3–6 semanas',
  array['Arquitectura multipágina', 'Secciones administrables', 'Accesibilidad y rendimiento', 'Preparado para crecer'],
  'Quiero mi sitio',
  'published',
  false,
  30
)
on conflict (slug) do nothing;

comment on table public.web_service_offers is 'Public web creation catalog managed from XETHKIOZ CMS.';
comment on table public.web_quote_requests is 'Private quote requests. Never expose to anon or public catalog queries.';
