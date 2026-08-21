begin;

-- Add the same-origin Huellas metrics path and server-owned progression first.
-- The following migration retires the legacy public writes after the new
-- application package is ready, keeping the rollout backward-compatible.
create schema if not exists private;

create table if not exists private.huellas_visit_events (
  event_id uuid primary key,
  network_prefix inet,
  visited_at timestamptz not null default now()
);

alter table private.huellas_visit_events enable row level security;
alter table private.huellas_visit_events force row level security;

create index if not exists huellas_visit_events_network_time_idx
  on private.huellas_visit_events (network_prefix, visited_at desc);

revoke all on table private.huellas_visit_events from public, anon, authenticated;

create or replace function public.get_huellas_stats()
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select jsonb_build_object(
    'visits', coalesce((select visits from public.huellas_stats where id = 1), 0),
    'active_posts', count(*) filter (
      where status = 'approved' and expires_at > now()
    ),
    'reunited', count(*) filter (
      where status = 'resolved' and type in ('Perdido', 'Encontrado')
    ),
    'adoptions', count(*) filter (
      where status = 'resolved' and type = 'Adopción'
    )
  )
  from public.pet_posts;
$$;

-- Keep the existing read-only client compatible during the additive phase.
-- The retirement migration removes these public roles after the new frontend
-- is confirmed in production.
revoke all on function public.get_huellas_stats() from public, anon, authenticated;
grant execute on function public.get_huellas_stats() to anon, authenticated, service_role;

create or replace function public.register_huellas_visit(
  p_event_id uuid,
  p_network_prefix inet
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  recent_network_count integer;
  result jsonb;
begin
  if p_event_id is null then
    return jsonb_build_object('status', 'invalid');
  end if;

  perform pg_advisory_xact_lock(
    hashtextextended(coalesce(p_network_prefix::text, 'unknown-network'), 0)
  );

  if exists (
    select 1 from private.huellas_visit_events where event_id = p_event_id
  ) then
    return public.get_huellas_stats() || jsonb_build_object('status', 'duplicate');
  end if;

  delete from private.huellas_visit_events
  where visited_at < now() - interval '48 hours';

  select count(*)::integer
  into recent_network_count
  from private.huellas_visit_events
  where visited_at >= now() - interval '24 hours'
    and network_prefix is not distinct from p_network_prefix;

  if recent_network_count >= 5 then
    return public.get_huellas_stats() || jsonb_build_object('status', 'rate_limited');
  end if;

  insert into private.huellas_visit_events (event_id, network_prefix)
  values (p_event_id, p_network_prefix);

  insert into public.huellas_stats (id, visits, updated_at)
  values (1, 1, now())
  on conflict (id) do update
  set visits = public.huellas_stats.visits + 1,
      updated_at = now();

  result := public.get_huellas_stats();
  return result || jsonb_build_object('status', 'accepted');
end;
$$;

revoke all on function public.register_huellas_visit(uuid, inet) from public, anon, authenticated;
grant execute on function public.register_huellas_visit(uuid, inet) to service_role;

drop policy if exists huellas_stats_service_role_access on public.huellas_stats;
create policy huellas_stats_service_role_access
on public.huellas_stats
for all
to service_role
using (true)
with check (true);

-- Authenticated progression is claimed through one server-owned award map.
-- The browser supplies the activity identity and route, never the XP value.
create or replace function public.xethkioz_claim_activity(
  p_event_id text,
  p_event_type text,
  p_route text
)
returns table (
  id text,
  event_type text,
  route text,
  points integer,
  created_at timestamptz,
  status text
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  claimant uuid := (select auth.uid());
  award integer;
  existing public.user_activity_events%rowtype;
  claimed public.user_activity_events%rowtype;
  daily_points integer;
begin
  if claimant is null then
    raise exception 'XETHKIOZ_AUTH_REQUIRED';
  end if;

  if p_event_id is null
     or char_length(p_event_id) not between 16 and 96
     or p_event_id !~ '^[A-Za-z0-9._:-]+$'
     or p_event_type not in ('visit', 'chat', 'portal', 'daily', 'mission')
     or p_route is null
     or char_length(p_route) not between 1 and 180
     or left(p_route, 1) <> '/'
     or left(p_route, 2) = '//'
     or position('\\' in p_route) > 0
  then
    raise exception 'XETHKIOZ_ACTIVITY_INVALID';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(claimant::text, 0));

  select * into existing
  from public.user_activity_events as activity
  where activity.id = p_event_id;

  if found then
    if existing.user_id <> claimant then
      raise exception 'XETHKIOZ_ACTIVITY_CONFLICT';
    end if;

    return query select existing.id, existing.event_type, existing.route,
      existing.points, existing.created_at, 'duplicate'::text;
    return;
  end if;

  award := case p_event_type
    when 'visit' then 2
    when 'chat' then 8
    when 'portal' then 5
    when 'daily' then 25
    when 'mission' then
      case
        when p_route = '/nexus-city/room/xethkioz#signal-quest-complete' then 60
        when p_route = '/nexus-city#passport' then 20
        when p_route like '/nexus-city/room/xethkioz#chest-%' then 10
        else 5
      end
  end;

  if p_event_type = 'daily' and p_route <> '/profile' then
    raise exception 'XETHKIOZ_ACTIVITY_INVALID_ROUTE';
  end if;

  if p_event_type = 'daily' and exists (
    select 1 from public.user_activity_events as activity
    where activity.user_id = claimant
      and activity.event_type = 'daily'
      and activity.created_at >= date_trunc('day', now() at time zone 'UTC') at time zone 'UTC'
  ) then
    return query select p_event_id, p_event_type, p_route, 0, now(), 'limit_reached'::text;
    return;
  end if;

  if p_event_type in ('portal', 'mission') and exists (
    select 1 from public.user_activity_events as activity
    where activity.user_id = claimant
      and activity.event_type = p_event_type
      and activity.route = p_route
      and activity.created_at >= date_trunc('day', now() at time zone 'UTC') at time zone 'UTC'
  ) then
    return query select p_event_id, p_event_type, p_route, 0, now(), 'limit_reached'::text;
    return;
  end if;

  if p_event_type = 'visit' and exists (
    select 1 from public.user_activity_events as activity
    where activity.user_id = claimant
      and activity.event_type = 'visit'
      and activity.route = p_route
      and activity.created_at >= now() - interval '1 hour'
  ) then
    return query select p_event_id, p_event_type, p_route, 0, now(), 'limit_reached'::text;
    return;
  end if;

  if p_event_type = 'chat' and (
    (select count(*) from public.user_activity_events as activity
      where activity.user_id = claimant
        and activity.event_type = 'chat'
        and activity.created_at >= date_trunc('day', now() at time zone 'UTC') at time zone 'UTC') >= 10
    or exists (
      select 1 from public.user_activity_events as activity
      where activity.user_id = claimant
        and activity.event_type = 'chat'
        and activity.created_at >= now() - interval '30 seconds'
    )
  ) then
    return query select p_event_id, p_event_type, p_route, 0, now(), 'limit_reached'::text;
    return;
  end if;

  select coalesce(sum(activity.points), 0)::integer
  into daily_points
  from public.user_activity_events as activity
  where activity.user_id = claimant
    and activity.created_at >= date_trunc('day', now() at time zone 'UTC') at time zone 'UTC';

  if daily_points + award > 250 then
    return query select p_event_id, p_event_type, p_route, 0, now(), 'limit_reached'::text;
    return;
  end if;

  insert into public.user_activity_events (id, user_id, event_type, route, points)
  values (p_event_id, claimant, p_event_type, p_route, award)
  returning * into claimed;

  return query select claimed.id, claimed.event_type, claimed.route,
    claimed.points, claimed.created_at, 'accepted'::text;
end;
$$;

revoke all on function public.xethkioz_claim_activity(text, text, text)
  from public, anon, authenticated;
grant execute on function public.xethkioz_claim_activity(text, text, text)
  to authenticated;

comment on function public.xethkioz_claim_activity(text, text, text) is
  'Authenticated XP claim endpoint. Awards, deduplication and daily limits are enforced by the database.';

create index if not exists user_activity_events_user_type_time_idx
  on public.user_activity_events (user_id, event_type, created_at desc);

create index if not exists user_activity_events_user_type_route_time_idx
  on public.user_activity_events (user_id, event_type, route, created_at desc);

-- Authenticated sessions no longer match the guest INSERT policy as well as
-- the member policy, eliminating the duplicate permissive-policy path.
drop policy if exists chat_messages_guest_insert on public.chat_messages;
create policy chat_messages_guest_insert
on public.chat_messages
for insert
to anon
with check (
  exists (
    select 1 from public.chat_rooms as room
    where room.id = chat_messages.room_id
      and room.is_public = true
  )
  and user_id is null
  and role = 'guest'
  and char_length(display_name) between 1 and 40
  and char_length(body) between 1 and 500
  and not public.xethkioz_is_reserved_display_name(display_name)
);

commit;
