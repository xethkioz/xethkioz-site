begin;

-- Browsers now reach Huellas through the same-origin Vercel endpoint and the
-- origin-checked Edge fallback. Keeping a SECURITY DEFINER RPC directly
-- executable by browser roles adds no product value and triggers the database
-- security advisor, so finish the additive rollout by making it server-only.
revoke execute on function public.get_huellas_stats() from public, anon, authenticated;
grant execute on function public.get_huellas_stats() to service_role;

comment on function public.get_huellas_stats() is
  'Server-only read aggregate for Huellas metrics. Browser traffic must use the same-origin API or the protected Edge fallback.';

-- The progression claim intentionally remains SECURITY DEFINER: authenticated
-- users may request an award, while Postgres owns identity, points, cooldowns
-- and the daily cap. Document the accepted privileged boundary explicitly.
comment on function public.xethkioz_claim_activity(text, text, text) is
  'Authenticated XP claim boundary. SECURITY DEFINER is intentional; auth.uid(), input validation, idempotency, cooldowns and a 250-point daily cap constrain writes.';

commit;
