-- Activate only after the disclosure-aware frontend is ready for production.

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
