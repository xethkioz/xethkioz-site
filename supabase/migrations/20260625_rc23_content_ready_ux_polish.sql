-- XETHKIOZ v4.0 RC2.3 - Content Ready UX Polish
-- Baseline incremental para flujo editorial. Idempotente.

create table if not exists public.xeth_editorial_slots (
  id text primary key,
  portal text not null,
  title text not null,
  priority text not null default 'media',
  status text not null default 'pendiente',
  goal text,
  next_action text,
  owner text,
  updated_at timestamptz not null default now()
);

create table if not exists public.xeth_publishing_lanes (
  id text primary key,
  name text not null,
  cadence text,
  source_policy text,
  output_policy text,
  owner text,
  active boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.xeth_content_quality_gates (
  id uuid primary key default gen_random_uuid(),
  gate text not null,
  portal text default 'network',
  required boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.xeth_editorial_slots enable row level security;
alter table public.xeth_publishing_lanes enable row level security;
alter table public.xeth_content_quality_gates enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'xeth_editorial_slots' and policyname = 'public_read_editorial_slots'
  ) then
    create policy public_read_editorial_slots on public.xeth_editorial_slots for select using (true);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'xeth_publishing_lanes' and policyname = 'public_read_publishing_lanes'
  ) then
    create policy public_read_publishing_lanes on public.xeth_publishing_lanes for select using (true);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'xeth_content_quality_gates' and policyname = 'public_read_quality_gates'
  ) then
    create policy public_read_quality_gates on public.xeth_content_quality_gates for select using (true);
  end if;
end $$;
