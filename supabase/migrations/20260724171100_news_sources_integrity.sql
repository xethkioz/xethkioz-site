-- Published factual reporting must retain at least one source.
-- Community content can be original humor/opinion and is intentionally exempt.

alter table public.news_articles
  drop constraint if exists news_articles_published_sources_check;

alter table public.news_articles
  add constraint news_articles_published_sources_check
  check (
    status <> 'published'
    or category = 'community'
    or coalesce(cardinality(source_urls), 0) > 0
  ) not valid;

alter table public.news_articles
  validate constraint news_articles_published_sources_check;

comment on constraint news_articles_published_sources_check on public.news_articles is
  'Published factual reporting requires at least one source URL; original community/humor content is exempt.';
