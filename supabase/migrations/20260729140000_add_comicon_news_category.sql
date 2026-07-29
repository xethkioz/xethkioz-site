begin;

alter table public.news_articles
  drop constraint if exists news_articles_category_check;

alter table public.news_articles
  add constraint news_articles_category_check
  check (category in ('gaming', 'tech', 'science', 'ai', 'community', 'green', 'programming', 'comicon'));

comment on constraint news_articles_category_check on public.news_articles is
  'Public editorial verticals, including the Universo COMICON culture and entertainment portal.';

commit;
