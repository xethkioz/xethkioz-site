-- Safe editorial scheduling for public news.
-- A row can be prepared as published in the CMS, but anonymous and regular
-- authenticated readers cannot select it until published_at has arrived.

alter table public.news_articles
  add column if not exists scheduled_at timestamptz;

alter table public.news_articles enable row level security;

comment on column public.news_articles.scheduled_at is
  'Editorial scheduling timestamp. Public visibility is enforced by published_at <= now().';

create index if not exists news_articles_scheduled_at_idx
  on public.news_articles (scheduled_at)
  where scheduled_at is not null;

-- Remove both historical repository policy names and the names currently used
-- in production. PostgreSQL OR-combines permissive policies, so leaving an old
-- status-only policy in place would expose future publications.
drop policy if exists news_articles_public_read on public.news_articles;
drop policy if exists news_public_read on public.news_articles;
drop policy if exists news_articles_authenticated_read on public.news_articles;
drop policy if exists news_authenticated_read on public.news_articles;

-- Anonymous visitors can only read publications whose release time arrived.
create policy news_public_read
on public.news_articles
for select
to anon
using (
  status = 'published'
  and published_at is not null
  and published_at <= now()
);

-- Regular authenticated readers receive the same public window. Authors and
-- the existing moderator/admin roles retain editorial access to their drafts,
-- reviews and future publications inside the protected CMS.
create policy news_authenticated_read
on public.news_articles
for select
to authenticated
using (
  (
    status = 'published'
    and published_at is not null
    and published_at <= now()
  )
  or auth.uid() = author_id
  or public.xethkioz_is_moderator_or_admin()
);

grant select on table public.news_articles to anon;
