-- Keep one SELECT policy per role/action on the legacy articles table.
-- Anonymous users see only published rows. Authenticated users additionally
-- see their own drafts or rows allowed by editorial moderation.

drop policy if exists articles_select_published on public.articles;
create policy articles_anon_published_read
on public.articles
for select
to anon
using (status = 'published');

drop policy if exists articles_authenticated_editorial_read on public.articles;
create policy articles_authenticated_read
on public.articles
for select
to authenticated
using (
  status = 'published'
  or (select auth.uid()) = author_id
  or (select private.xethkioz_is_moderator_or_admin())
);
