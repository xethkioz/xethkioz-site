begin;

delete from public.news_articles
where category = 'comicon';

drop table if exists public.comicon_catalog;

alter table public.news_articles
  drop constraint if exists news_articles_category_check;

alter table public.news_articles
  add constraint news_articles_category_check
  check (category = any (array[
    'gaming'::text,
    'tech'::text,
    'science'::text,
    'ai'::text,
    'community'::text,
    'green'::text,
    'programming'::text
  ]));

commit;
