drop policy if exists news_audit_admin_read on public.news_audit_log;
create policy news_audit_staff_read
on public.news_audit_log
for select
to authenticated
using ((select public.xethkioz_is_moderator_or_admin()));

drop policy if exists news_audit_admin_insert on public.news_audit_log;
create policy news_audit_staff_insert
on public.news_audit_log
for insert
to authenticated
with check (
  actor_id = (select auth.uid())
  and (select public.xethkioz_is_moderator_or_admin())
);
