-- Keep the public feed readable while evaluating one role-specific policy per request.
drop policy if exists news_public_read on public.news_articles;
create policy news_public_read
on public.news_articles
for select
to anon
using (status = 'published');

drop policy if exists news_admin_read_all on public.news_articles;
create policy news_authenticated_read
on public.news_articles
for select
to authenticated
using (
  status = 'published'
  or (select auth.uid()) = author_id
  or (select public.xethkioz_is_moderator_or_admin())
);

drop policy if exists news_admin_insert on public.news_articles;
create policy news_authorized_insert
on public.news_articles
for insert
to authenticated
with check (
  (select public.xethkioz_can_submit_article())
  and author_id = (select auth.uid())
  and (
    status in ('draft', 'review')
    or (status = 'published' and (select public.xethkioz_can_publish_article()))
  )
);

drop policy if exists news_admin_update on public.news_articles;
create policy news_authorized_update
on public.news_articles
for update
to authenticated
using (
  author_id = (select auth.uid())
  or (select public.xethkioz_is_moderator_or_admin())
)
with check (
  (select public.xethkioz_can_submit_article())
  and (
    author_id = (select auth.uid())
    or (select public.xethkioz_is_moderator_or_admin())
  )
  and (
    status in ('draft', 'review', 'archived')
    or (status = 'published' and (select public.xethkioz_can_publish_article()))
  )
);

drop policy if exists news_admin_delete on public.news_articles;
create policy news_admin_delete
on public.news_articles
for delete
to authenticated
using ((select public.xethkioz_can_publish_article()));

alter function public.update_news_updated_at() set search_path = '';

revoke execute on function public.xethkioz_has_role(text[]) from public, anon;
revoke execute on function public.xethkioz_is_moderator_or_admin() from public, anon;
revoke execute on function public.xethkioz_can_publish_article() from public, anon;
revoke execute on function public.xethkioz_can_submit_article() from public, anon;

grant execute on function public.xethkioz_has_role(text[]) to authenticated, service_role;
grant execute on function public.xethkioz_is_moderator_or_admin() to authenticated, service_role;
grant execute on function public.xethkioz_can_publish_article() to authenticated, service_role;
grant execute on function public.xethkioz_can_submit_article() to authenticated, service_role;
