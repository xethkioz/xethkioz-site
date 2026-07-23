-- Security and administration consistency pass.
-- Keeps privileged helpers out of the exposed public API schema, aligns the
-- existing secure Auth administrator with profiles, and closes permissive
-- legacy read policies.

create schema if not exists private;
grant usage on schema private to authenticated, service_role;

alter function public.xethkioz_has_role(text[]) set schema private;
alter function public.xethkioz_is_moderator_or_admin() set schema private;
alter function public.xethkioz_can_publish_article() set schema private;
alter function public.xethkioz_can_submit_article() set schema private;

create or replace function private.xethkioz_has_role(allowed_roles text[])
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select
    auth.uid() is not null
    and (
      (
        upper(coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '')) = 'ADMIN'
        and 'ADMIN' = any(allowed_roles)
      )
      or exists (
        select 1
        from public.profiles
        where id = auth.uid()
          and role::text = any(allowed_roles)
      )
    );
$$;

create or replace function private.xethkioz_is_moderator_or_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select private.xethkioz_has_role(array['MODERATOR', 'ADMIN']);
$$;

create or replace function private.xethkioz_can_publish_article()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select private.xethkioz_has_role(array['ADMIN']);
$$;

create or replace function private.xethkioz_can_submit_article()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select
    private.xethkioz_has_role(array['CONTRIBUTOR', 'EDITOR', 'MODERATOR', 'ADMIN'])
    or exists (
      select 1
      from public.profiles
      where id = auth.uid()
        and subscription_tier::text in ('CREATOR', 'ARCHITECT')
    );
$$;

revoke all on function private.xethkioz_has_role(text[]) from public, anon;
revoke all on function private.xethkioz_is_moderator_or_admin() from public, anon;
revoke all on function private.xethkioz_can_publish_article() from public, anon;
revoke all on function private.xethkioz_can_submit_article() from public, anon;
grant execute on function private.xethkioz_has_role(text[]) to authenticated, service_role;
grant execute on function private.xethkioz_is_moderator_or_admin() to authenticated, service_role;
grant execute on function private.xethkioz_can_publish_article() to authenticated, service_role;
grant execute on function private.xethkioz_can_submit_article() to authenticated, service_role;

update public.profiles as profile
set
  role = 'ADMIN'::public.xethkioz_user_role,
  subscription_tier = 'ARCHITECT'::public.xethkioz_subscription_tier,
  updated_at = now()
from auth.users as auth_user
where auth_user.id = profile.id
  and lower(coalesce(auth_user.raw_app_meta_data ->> 'role', '')) = 'admin'
  and (
    profile.role::text <> 'ADMIN'
    or profile.subscription_tier::text <> 'ARCHITECT'
  );

drop policy if exists news_authenticated_read on public.news_articles;
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
  or (select auth.uid()) = author_id
  or (select private.xethkioz_is_moderator_or_admin())
);

drop policy if exists articles_select_published on public.articles;
create policy articles_select_published
on public.articles
for select
to anon, authenticated
using (status = 'published');

drop policy if exists articles_authenticated_editorial_read on public.articles;
create policy articles_authenticated_editorial_read
on public.articles
for select
to authenticated
using (
  (select auth.uid()) = author_id
  or (select private.xethkioz_is_moderator_or_admin())
);

drop policy if exists site_visit_logs_admin_read on public.site_visit_logs;
create policy site_visit_logs_admin_read
on public.site_visit_logs
for select
to authenticated
using ((select private.xethkioz_has_role(array['ADMIN'])));

comment on function private.xethkioz_has_role(text[]) is
  'Private RLS helper. ADMIN may come only from secure app_metadata or profiles, never user_metadata.';
