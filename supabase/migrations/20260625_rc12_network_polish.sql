-- XETHKIOZ Network RC1.2
-- Polish pass: evidence matrix, Green Node command registry, portal analytics and future moderation hooks.
-- Build date: 2026-06-25

create table if not exists public.green_node_commands (
  id uuid primary key default gen_random_uuid(),
  command text unique not null,
  response_lines text[] not null default '{}',
  unlock_key text,
  safety_level text not null default 'educational' check (safety_level in ('educational','documentary','restricted')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.science_evidence_sources (
  id uuid primary key default gen_random_uuid(),
  report_id uuid references public.science_reports(id) on delete cascade,
  source_type text not null default 'institutional' check (source_type in ('paper','preprint','institutional','dataset','newsroom','editorial')),
  title text not null,
  url text,
  doi text,
  evidence_note text,
  created_at timestamptz not null default now()
);

create table if not exists public.network_portal_events (
  id uuid primary key default gen_random_uuid(),
  portal_slug text not null,
  user_id uuid,
  event_type text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.green_node_commands enable row level security;
alter table public.science_evidence_sources enable row level security;
alter table public.network_portal_events enable row level security;

drop policy if exists "Public can read active green node commands" on public.green_node_commands;
create policy "Public can read active green node commands"
  on public.green_node_commands for select
  using (is_active = true and safety_level in ('educational','documentary'));

drop policy if exists "Public can read science evidence sources" on public.science_evidence_sources;
create policy "Public can read science evidence sources"
  on public.science_evidence_sources for select
  using (true);

drop policy if exists "Authenticated can insert portal events" on public.network_portal_events;
create policy "Authenticated can insert portal events"
  on public.network_portal_events for insert
  with check (auth.uid() is not null);

insert into public.green_node_commands (command, response_lines, unlock_key, safety_level)
values
  ('whoami', array['visitor','clearance_level=GREEN','network_scope=xethkioz'], 'visitor_green', 'educational'),
  ('sudo truth', array['truth requires evidence','speculation_mode=flagged','publish_policy=documentary_only'], 'truth_protocol', 'documentary'),
  ('matrix', array['rendering glitch layer...','neon_channel=active','portal_stability=87%'], 'matrix_fragment', 'educational'),
  ('42', array['answer accepted','unlock: analyst_fragment','remember: question everything'], 'analyst_fragment', 'documentary'),
  ('protocol', array['defensive cyber only','OSINT ethical only','mysteries require evidence labels','no illegal activity'], 'green_protocol', 'educational')
on conflict (command) do update set
  response_lines = excluded.response_lines,
  unlock_key = excluded.unlock_key,
  safety_level = excluded.safety_level,
  updated_at = now();
