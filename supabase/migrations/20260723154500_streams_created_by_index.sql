-- Covers the streams.created_by foreign key for editorial deletes and ownership lookups.

create index if not exists streams_created_by_idx
  on public.streams (created_by)
  where created_by is not null;
