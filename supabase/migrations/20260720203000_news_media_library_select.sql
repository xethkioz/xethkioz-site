-- Allow authorized editorial users to browse and reuse assets from the
-- public news-media bucket. Public delivery remains URL-based; listing is
-- restricted to authenticated users who can submit editorial content.

drop policy if exists news_media_authorized_select on storage.objects;
create policy news_media_authorized_select
on storage.objects
for select
to authenticated
using (
  bucket_id = 'news-media'
  and (select public.xethkioz_can_submit_article())
);
