-- XETHKIOZ Meme Radar cover repair.
-- Reuses existing first-party WebP assets already shipped by the site.
-- Idempotent: updated_at changes only when the cover metadata differs.

update public.news_articles
set
  cover_image_url = '/assets/identity/memes-anime-chaos-v1.webp',
  cover_image_alt = 'Caos digital anime y nostalgia de internet para el Great Meme Reset de Meme Radar',
  updated_at = now()
where slug = 'meme-radar-great-meme-reset-2026'
  and (
    cover_image_url is distinct from '/assets/identity/memes-anime-chaos-v1.webp'
    or cover_image_alt is distinct from 'Caos digital anime y nostalgia de internet para el Great Meme Reset de Meme Radar'
  );

update public.news_articles
set
  cover_image_url = '/assets/portal-fun-chaos-v2.webp',
  cover_image_alt = 'Portal de humor naranja y violeta para el gesto viral de Sophie Cunningham en Meme Radar',
  updated_at = now()
where slug = 'meme-radar-sophie-cunningham-dedo-viral'
  and (
    cover_image_url is distinct from '/assets/portal-fun-chaos-v2.webp'
    or cover_image_alt is distinct from 'Portal de humor naranja y violeta para el gesto viral de Sophie Cunningham en Meme Radar'
  );
