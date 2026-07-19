-- XETHKIOZ 10.0 ads policy optimization
-- Keep public active reads and admin management without overlapping SELECT policies.

drop policy if exists ads_slots_public_read on public.ads_slots;
drop policy if exists ads_slots_admin_all on public.ads_slots;

create policy ads_slots_anon_active_read
on public.ads_slots
for select
to anon
using (is_active = true);

create policy ads_slots_authenticated_read
on public.ads_slots
for select
to authenticated
using (
  is_active = true
  or (select public.xethkioz_has_role(array['ADMIN']))
);

create policy ads_slots_admin_insert
on public.ads_slots
for insert
to authenticated
with check ((select public.xethkioz_has_role(array['ADMIN'])));

create policy ads_slots_admin_update
on public.ads_slots
for update
to authenticated
using ((select public.xethkioz_has_role(array['ADMIN'])))
with check ((select public.xethkioz_has_role(array['ADMIN'])));

create policy ads_slots_admin_delete
on public.ads_slots
for delete
to authenticated
using ((select public.xethkioz_has_role(array['ADMIN'])));

drop policy if exists ads_campaigns_public_active_read on public.ads_campaigns;
drop policy if exists ads_campaigns_admin_all on public.ads_campaigns;

create policy ads_campaigns_anon_active_read
on public.ads_campaigns
for select
to anon
using (
  status = 'active'
  and (starts_at is null or starts_at <= now())
  and (ends_at is null or ends_at >= now())
);

create policy ads_campaigns_authenticated_read
on public.ads_campaigns
for select
to authenticated
using (
  (
    status = 'active'
    and (starts_at is null or starts_at <= now())
    and (ends_at is null or ends_at >= now())
  )
  or (select public.xethkioz_has_role(array['ADMIN']))
);

create policy ads_campaigns_admin_insert
on public.ads_campaigns
for insert
to authenticated
with check ((select public.xethkioz_has_role(array['ADMIN'])));

create policy ads_campaigns_admin_update
on public.ads_campaigns
for update
to authenticated
using ((select public.xethkioz_has_role(array['ADMIN'])))
with check ((select public.xethkioz_has_role(array['ADMIN'])));

create policy ads_campaigns_admin_delete
on public.ads_campaigns
for delete
to authenticated
using ((select public.xethkioz_has_role(array['ADMIN'])));
