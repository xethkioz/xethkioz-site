alter table public.news_articles
  add column if not exists cover_image_path text;

alter table public.news_articles
  drop constraint if exists news_articles_cover_image_path_check,
  add constraint news_articles_cover_image_path_check check (
    cover_image_path is null
    or (
      char_length(cover_image_path) <= 512
      and cover_image_path !~ '(^|/)\.\.(/|$)'
    )
  );

comment on column public.news_articles.cover_image_path is
  'Internal Supabase Storage object path for CMS-managed news covers.';

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'news-media',
  'news-media',
  true,
  8388608,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']::text[]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists news_media_authorized_insert on storage.objects;
create policy news_media_authorized_insert
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'news-media'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and (select public.xethkioz_can_submit_article())
);

drop policy if exists news_media_owner_update on storage.objects;
create policy news_media_owner_update
on storage.objects
for update
to authenticated
using (
  bucket_id = 'news-media'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and (select public.xethkioz_can_submit_article())
)
with check (
  bucket_id = 'news-media'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and (select public.xethkioz_can_submit_article())
);

drop policy if exists news_media_owner_delete on storage.objects;
create policy news_media_owner_delete
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'news-media'
  and (
    (storage.foldername(name))[1] = (select auth.uid())::text
    or (select public.xethkioz_can_publish_article())
  )
);
