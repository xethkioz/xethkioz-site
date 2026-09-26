begin;

revoke all on table private.huellas_visit_events from public, anon, authenticated;

drop policy if exists huellas_visit_events_browser_deny_all
  on private.huellas_visit_events;

create policy huellas_visit_events_browser_deny_all
  on private.huellas_visit_events
  as restrictive
  for all
  to anon, authenticated
  using (false)
  with check (false);

comment on table private.huellas_visit_events is
  'Private Huellas anti-abuse visit events. Browser roles are explicitly denied; writes occur only through protected server-side/RPC paths.';

revoke execute on function public.xethkioz_claim_activity(text, text, text)
  from public, anon;

grant execute on function public.xethkioz_claim_activity(text, text, text)
  to authenticated, service_role;

comment on function public.xethkioz_claim_activity(text, text, text) is
  'Intentional authenticated-only SECURITY DEFINER RPC for XP/activity claims. Validates event IDs/types/routes, serializes per-user claims, rate-limits award classes and caps daily points.';

commit;