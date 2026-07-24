-- Safe first-party monetization foundation.
-- Keeps current CMS inserts compatible through generated campaign keys and sponsor defaults.

alter table public.ads_campaigns
  add column if not exists campaign_key text,
  add column if not exists campaign_kind text not null default 'sponsor';

update public.ads_campaigns
set campaign_key = 'campaign-' || replace(id::text, '-', '')
where campaign_key is null or btrim(campaign_key) = '';

alter table public.ads_campaigns
  alter column campaign_key set default ('campaign-' || replace(gen_random_uuid()::text, '-', '')),
  alter column campaign_key set not null;

create unique index if not exists ads_campaigns_campaign_key_unique
  on public.ads_campaigns (campaign_key);

alter table public.ads_campaigns
  drop constraint if exists ads_campaigns_campaign_key_check,
  add constraint ads_campaigns_campaign_key_check
    check (campaign_key ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  drop constraint if exists ads_campaigns_campaign_kind_check,
  add constraint ads_campaigns_campaign_kind_check
    check (campaign_kind in ('house', 'sponsor', 'affiliate', 'network')),
  drop constraint if exists ads_campaigns_content_length_check,
  add constraint ads_campaigns_content_length_check
    check (
      char_length(btrim(sponsor_name)) between 1 and 120
      and char_length(btrim(title)) between 1 and 160
      and (description is null or char_length(description) <= 500)
      and (target_url is null or char_length(target_url) <= 2048)
      and (image_url is null or char_length(image_url) <= 2048)
    ),
  drop constraint if exists ads_campaigns_target_url_safe_check,
  add constraint ads_campaigns_target_url_safe_check
    check (
      target_url is null
      or (
        target_url !~ '[[:cntrl:]]'
        and position(chr(92) in target_url) = 0
        and (
          (left(target_url, 1) = '/' and left(target_url, 2) <> '//')
          or lower(target_url) like 'https://%'
        )
      )
    ),
  drop constraint if exists ads_campaigns_image_url_safe_check,
  add constraint ads_campaigns_image_url_safe_check
    check (
      image_url is null
      or (
        image_url !~ '[[:cntrl:]]'
        and position(chr(92) in image_url) = 0
        and (
          (left(image_url, 1) = '/' and left(image_url, 2) <> '//')
          or lower(image_url) like 'https://%'
        )
      )
    );

insert into public.ads_campaigns (
  campaign_key,
  campaign_kind,
  slot_id,
  sponsor_name,
  title,
  description,
  target_url,
  image_url,
  status,
  starts_at,
  ends_at,
  updated_at
)
values
  (
    'house-web-creation',
    'house',
    'home-hero',
    'XETHKIOZ',
    'Tu web, lista para crecer',
    'Diseño, rendimiento, seguridad y administración pensados para proyectos reales.',
    '/creacion-web',
    null,
    'active',
    now(),
    null,
    now()
  ),
  (
    'house-gaming-guides',
    'house',
    'news-inline',
    'XETHKIOZ',
    'Guías para jugar mejor',
    'Builds, configuraciones y explicaciones prácticas dentro del portal Gaming.',
    '/gaming/guides',
    null,
    'active',
    now(),
    null,
    now()
  ),
  (
    'house-community',
    'house',
    'section-sidebar',
    'XETHKIOZ',
    'Entrá a la comunidad',
    'Perfiles, actividad, Nexus City y espacios para gamers adultos de Argentina y Latinoamérica.',
    '/community',
    null,
    'active',
    now(),
    null,
    now()
  ),
  (
    'house-kick-stream',
    'house',
    'stream-banner',
    'XETHKIOZ',
    'Directos y partidas en Kick',
    'Seguí el canal oficial para acompañar transmisiones, eventos y pruebas de juegos.',
    'https://kick.com/xethkioz',
    null,
    'active',
    now(),
    null,
    now()
  )
on conflict (campaign_key) do update set
  campaign_kind = excluded.campaign_kind,
  slot_id = excluded.slot_id,
  sponsor_name = excluded.sponsor_name,
  title = excluded.title,
  description = excluded.description,
  target_url = excluded.target_url,
  image_url = excluded.image_url,
  status = excluded.status,
  starts_at = coalesce(public.ads_campaigns.starts_at, excluded.starts_at),
  ends_at = excluded.ends_at,
  updated_at = now();

comment on column public.ads_campaigns.campaign_key is
  'Stable idempotency key for deployments and editorial operations.';
comment on column public.ads_campaigns.campaign_kind is
  'Disclosure category: house, sponsor, affiliate or network.';
