-- XETHKIOZ Stage 2F
-- Public news engagement foundation: views and lightweight reactions.
-- Safe to run more than once in Supabase SQL Editor.

create table if not exists public.news_article_engagement (
  article_id uuid primary key references public.news_articles(id) on delete cascade,
  views integer not null default 0 check (views >= 0),
  hype integer not null default 0 check (hype >= 0),
  useful integer not null default 0 check (useful >= 0),
  updated_at timestamptz not null default now()
);

alter table public.news_article_engagement enable row level security;

drop policy if exists news_article_engagement_public_read on public.news_article_engagement;
create policy news_article_engagement_public_read
on public.news_article_engagement
for select
using (
  exists (
    select 1
    from public.news_articles
    where news_articles.id = news_article_engagement.article_id
      and news_articles.status = 'published'
  )
);

create or replace function public.increment_news_article_engagement(
  target_article_id uuid,
  target_metric text
)
returns table(article_id uuid, views integer, hype integer, useful integer)
language plpgsql
security definer
set search_path = public
as $$
begin
  if target_metric not in ('views', 'hype', 'useful') then
    raise exception 'Invalid metric: %', target_metric;
  end if;

  if not exists (
    select 1 from public.news_articles
    where id = target_article_id
      and status = 'published'
  ) then
    raise exception 'Article is not published or does not exist.';
  end if;

  insert into public.news_article_engagement (article_id, views, hype, useful, updated_at)
  values (
    target_article_id,
    case when target_metric = 'views' then 1 else 0 end,
    case when target_metric = 'hype' then 1 else 0 end,
    case when target_metric = 'useful' then 1 else 0 end,
    now()
  )
  on conflict (article_id) do update set
    views = public.news_article_engagement.views + case when target_metric = 'views' then 1 else 0 end,
    hype = public.news_article_engagement.hype + case when target_metric = 'hype' then 1 else 0 end,
    useful = public.news_article_engagement.useful + case when target_metric = 'useful' then 1 else 0 end,
    updated_at = now();

  return query
  select e.article_id, e.views, e.hype, e.useful
  from public.news_article_engagement e
  where e.article_id = target_article_id;
end;
$$;

grant select on public.news_article_engagement to anon, authenticated;
grant execute on function public.increment_news_article_engagement(uuid, text) to anon, authenticated;
