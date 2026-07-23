-- Restores the public Gaming stream radar contract without exposing editorial writes.

create table if not exists public.streams (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(btrim(title)) between 1 and 180),
  platform text not null check (platform in ('kick', 'youtube', 'twitch', 'other')),
  channel_name text not null check (char_length(btrim(channel_name)) between 1 and 100),
  channel_url text not null check (channel_url ~ '^https://'),
  video_id text check (video_id is null or char_length(video_id) <= 180),
  thumbnail text check (thumbnail is null or thumbnail ~ '^https://'),
  is_live boolean not null default false,
  is_featured boolean not null default false,
  views bigint not null default 0 check (views >= 0),
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null
);

create index if not exists streams_published_at_idx
  on public.streams (published_at desc);

create index if not exists streams_live_featured_idx
  on public.streams (is_live desc, is_featured desc, published_at desc);

alter table public.streams enable row level security;

revoke all on table public.streams from public, anon, authenticated;
grant select on table public.streams to anon, authenticated;
grant insert, update, delete on table public.streams to authenticated;

create policy streams_public_read
on public.streams
for select
to anon, authenticated
using (true);

create policy streams_admin_insert
on public.streams
for insert
to authenticated
with check ((select private.xethkioz_has_role(array['ADMIN'])));

create policy streams_admin_update
on public.streams
for update
to authenticated
using ((select private.xethkioz_has_role(array['ADMIN'])))
with check ((select private.xethkioz_has_role(array['ADMIN'])));

create policy streams_admin_delete
on public.streams
for delete
to authenticated
using ((select private.xethkioz_has_role(array['ADMIN'])));

comment on table public.streams is
  'Public streaming and VOD radar. Everyone may read; only secure ADMIN roles may mutate.';
