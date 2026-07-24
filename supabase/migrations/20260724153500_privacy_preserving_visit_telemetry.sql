-- Privacy-preserving, idempotent telemetry ingestion.
-- The public schema function is callable only by service_role through the Vercel proxy.

alter table public.site_visit_logs
  add column if not exists event_id uuid;

create unique index if not exists site_visit_logs_event_id_unique
  on public.site_visit_logs (event_id)
  where event_id is not null;

comment on column public.site_visit_logs.event_id is
  'Client-generated idempotency key. Contains no user identity.';
comment on column public.site_visit_logs.ip_address is
  'Anonymized network prefix only: IPv4 /24 or IPv6 /48. Never a complete client IP.';
comment on column public.site_visit_logs.user_agent is
  'Deprecated raw field retained for compatibility. New records store only the literal redacted marker.';

create or replace function public.xethkioz_record_site_visit(
  p_event_id uuid,
  p_route text,
  p_network_prefix inet,
  p_device_type text,
  p_os_family text,
  p_browser_family text,
  p_viewport_width integer,
  p_viewport_height integer,
  p_language text,
  p_timezone text,
  p_referrer_host text,
  p_country_code text,
  p_region_code text
)
returns table(status text, retry_after integer)
language plpgsql
security definer
set search_path = ''
as $$
declare
  recent_network_count integer;
  recent_route_count integer;
begin
  if p_event_id is null
    or p_route is null
    or char_length(p_route) not between 1 and 240
    or left(p_route, 1) <> '/'
    or p_device_type not in ('mobile', 'tablet', 'desktop', 'unknown')
  then
    return query select 'invalid'::text, 0;
    return;
  end if;

  perform pg_advisory_xact_lock(
    hashtextextended(coalesce(p_network_prefix::text, 'unknown-network'), 0)
  );

  if exists (
    select 1
    from public.site_visit_logs
    where event_id = p_event_id
  ) then
    return query select 'duplicate'::text, 0;
    return;
  end if;

  select count(*)::integer
    into recent_network_count
  from public.site_visit_logs
  where visited_at >= now() - interval '1 minute'
    and ip_address is not distinct from p_network_prefix;

  if recent_network_count >= 60 then
    return query select 'rate_limited'::text, 60;
    return;
  end if;

  select count(*)::integer
    into recent_route_count
  from public.site_visit_logs
  where visited_at >= now() - interval '1 minute'
    and ip_address is not distinct from p_network_prefix
    and route = p_route;

  if recent_route_count >= 12 then
    return query select 'rate_limited'::text, 60;
    return;
  end if;

  delete from public.site_visit_logs
  where visited_at < now() - interval '30 days';

  begin
    insert into public.site_visit_logs (
      event_id,
      route,
      ip_address,
      user_agent,
      device_type,
      os_family,
      browser_family,
      viewport_width,
      viewport_height,
      language,
      timezone,
      referrer_host,
      country_code,
      region_code
    ) values (
      p_event_id,
      p_route,
      p_network_prefix,
      'redacted',
      p_device_type,
      nullif(p_os_family, ''),
      nullif(p_browser_family, ''),
      p_viewport_width,
      p_viewport_height,
      nullif(p_language, ''),
      nullif(p_timezone, ''),
      nullif(p_referrer_host, ''),
      nullif(p_country_code, ''),
      nullif(p_region_code, '')
    );
  exception
    when unique_violation then
      return query select 'duplicate'::text, 0;
      return;
  end;

  return query select 'accepted'::text, 0;
end;
$$;

revoke all on function public.xethkioz_record_site_visit(
  uuid, text, inet, text, text, text, integer, integer, text, text, text, text, text
) from public, anon, authenticated;

grant execute on function public.xethkioz_record_site_visit(
  uuid, text, inet, text, text, text, integer, integer, text, text, text, text, text
) to service_role;

comment on function public.xethkioz_record_site_visit(
  uuid, text, inet, text, text, text, integer, integer, text, text, text, text, text
) is 'Service-role-only telemetry ingestion with idempotency, rate limiting, 30-day retention and anonymized networks.';
