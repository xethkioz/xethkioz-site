alter table public.news_articles
  add column if not exists cover_image_url text,
  add column if not exists cover_image_alt text;

alter table public.news_articles
  drop constraint if exists news_articles_cover_image_url_check,
  add constraint news_articles_cover_image_url_check check (
    cover_image_url is null
    or (
      char_length(cover_image_url) <= 2048
      and (cover_image_url like 'https://%' or cover_image_url like '/%')
    )
  ),
  drop constraint if exists news_articles_cover_image_alt_check,
  add constraint news_articles_cover_image_alt_check check (
    cover_image_alt is null or char_length(cover_image_alt) <= 240
  );

comment on column public.news_articles.cover_image_url is
  'Public HTTPS or site-relative cover image URL used by the news feed and article page.';
comment on column public.news_articles.cover_image_alt is
  'Accessible alternative text for the article cover image.';

revoke all on public.news_articles from anon, authenticated;
grant select (
  id, slug, title, summary, content, category, status, published_at, tags,
  source_urls, ai_generated, created_at, cover_image_url, cover_image_alt
) on public.news_articles to anon;
grant select, insert, update, delete on public.news_articles to authenticated;
grant all on public.news_articles to service_role;
