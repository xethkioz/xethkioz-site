-- Safe editorial scheduling for public news.
-- A row can be prepared as published in the CMS, but anonymous and regular
-- authenticated readers cannot select it until published_at has arrived.

alter table public.news_articles enable row level security;

comment on column public.news_articles.scheduled_at is
  'Editorial scheduling timestamp. Public visibility is enforced by published_at <= now().';

-- Keep future publications invisible to anonymous visitors.
drop policy if exists news_articles_public_read on public.news_articles;
create policy news_articles_public_read
on public.news_articles
for select
to anon
using (
  status = 'published'
  and published_at is not null
  and published_at <= now()
);

-- Regular authenticated users receive the same public window. Administrators
-- keep full read access so the CMS can manage drafts and future publications.
drop policy if exists news_articles_authenticated_read on public.news_articles;
create policy news_articles_authenticated_read
on public.news_articles
for select
to authenticated
using (
  (
    status = 'published'
    and published_at is not null
    and published_at <= now()
  )
  or public.is_admin()
);

grant select on table public.news_articles to anon;
