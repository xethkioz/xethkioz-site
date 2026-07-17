-- Allow anonymous discovery endpoints to read the public editorial feed.
-- Row-level security remains authoritative and only exposes status = 'published'.

grant select on table public.news_articles to anon;

