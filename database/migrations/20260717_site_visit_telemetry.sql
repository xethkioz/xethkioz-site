-- Minimal operational telemetry. Raw IP is admin-only and retained for 30 days by the server collector.
create table if not exists public.site_visit_logs (
  id bigint generated always as identity primary key,
  visited_at timestamptz not null default now(),
  route text not null check (char_length(route) between 1 and 240),
  ip_address inet,
  user_agent text not null check (char_length(user_agent) <= 700),
  device_type text not null check (device_type in ('mobile','tablet','desktop','unknown')),
  os_family text,
  browser_family text,
  viewport_width integer check (viewport_width between 0 and 10000),
  viewport_height integer check (viewport_height between 0 and 10000),
  language text,
  timezone text,
  referrer_host text,
  country_code text,
  region_code text
);

create index if not exists site_visit_logs_visited_idx on public.site_visit_logs (visited_at desc);
create index if not exists site_visit_logs_route_visited_idx on public.site_visit_logs (route, visited_at desc);
alter table public.site_visit_logs enable row level security;
alter table public.site_visit_logs force row level security;

drop policy if exists "site_visit_logs_admin_read" on public.site_visit_logs;
create policy "site_visit_logs_admin_read" on public.site_visit_logs for select to authenticated
using (public.xethkioz_is_admin());

revoke all on table public.site_visit_logs from public, anon, authenticated;
grant select on table public.site_visit_logs to authenticated;
grant insert, delete on table public.site_visit_logs to service_role;
revoke all on sequence public.site_visit_logs_id_seq from public, anon, authenticated;
grant usage, select on sequence public.site_visit_logs_id_seq to service_role;

comment on table public.site_visit_logs is 'Operational diagnostics only. Admin read, server write, 30-day retention.';
