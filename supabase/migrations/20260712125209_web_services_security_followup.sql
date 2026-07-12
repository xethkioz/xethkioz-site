-- XETHKIOZ Web Services security/performance follow-up.
-- Moves privileged checks out of the exposed public schema and removes overlapping policies.

create schema if not exists private;
revoke all on schema private from public;
revoke all on schema private from anon;
grant usage on schema private to authenticated;

create or replace function private.xethkioz_web_is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select
    lower(coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '')) = 'admin'
    or exists (
      select 1
      from public.profiles
      where id = (select auth.uid())
        and upper(role::text) = 'ADMIN'
    );
$$;

revoke all on function private.xethkioz_web_is_admin() from public;
revoke all on function private.xethkioz_web_is_admin() from anon;
grant execute on function private.xethkioz_web_is_admin() to authenticated;

drop policy if exists web_service_offers_public_read on public.web_service_offers;
drop policy if exists web_service_offers_admin_all on public.web_service_offers;

create policy web_service_offers_anon_read
on public.web_service_offers
for select
to anon
using (status = 'published');

create policy web_service_offers_authenticated_read
on public.web_service_offers
for select
to authenticated
using (status = 'published' or (select private.xethkioz_web_is_admin()));

create policy web_service_offers_admin_insert
on public.web_service_offers
for insert
to authenticated
with check ((select private.xethkioz_web_is_admin()));

create policy web_service_offers_admin_update
on public.web_service_offers
for update
to authenticated
using ((select private.xethkioz_web_is_admin()))
with check ((select private.xethkioz_web_is_admin()));

create policy web_service_offers_admin_delete
on public.web_service_offers
for delete
to authenticated
using ((select private.xethkioz_web_is_admin()));

drop policy if exists web_quote_requests_admin_all on public.web_quote_requests;
create policy web_quote_requests_admin_all
on public.web_quote_requests
for all
to authenticated
using ((select private.xethkioz_web_is_admin()))
with check ((select private.xethkioz_web_is_admin()));

drop policy if exists web_service_media_admin_select on storage.objects;
create policy web_service_media_admin_select
on storage.objects
for select
to authenticated
using (bucket_id = 'web-service-media' and (select private.xethkioz_web_is_admin()));

drop policy if exists web_service_media_admin_insert on storage.objects;
create policy web_service_media_admin_insert
on storage.objects
for insert
to authenticated
with check (bucket_id = 'web-service-media' and (select private.xethkioz_web_is_admin()));

drop policy if exists web_service_media_admin_update on storage.objects;
create policy web_service_media_admin_update
on storage.objects
for update
to authenticated
using (bucket_id = 'web-service-media' and (select private.xethkioz_web_is_admin()))
with check (bucket_id = 'web-service-media' and (select private.xethkioz_web_is_admin()));

drop policy if exists web_service_media_admin_delete on storage.objects;
create policy web_service_media_admin_delete
on storage.objects
for delete
to authenticated
using (bucket_id = 'web-service-media' and (select private.xethkioz_web_is_admin()));

drop function if exists public.xethkioz_web_is_admin();

create index if not exists web_quote_requests_service_id_idx
  on public.web_quote_requests (service_id);

create index if not exists web_service_offers_created_by_idx
  on public.web_service_offers (created_by);
