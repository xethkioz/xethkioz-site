create table if not exists public.aion_class_videos (
  class_id text primary key check (class_id in ('gladiator','templar','assassin','ranger','sorcerer','spiritmaster','cleric','chanter')),
  video_path text not null,
  video_url text not null,
  uploaded_by uuid not null references auth.users(id) on delete restrict,
  updated_at timestamptz not null default now()
);

alter table public.aion_class_videos enable row level security;
revoke all on public.aion_class_videos from anon, authenticated;
grant select on public.aion_class_videos to anon, authenticated;
grant insert, update, delete on public.aion_class_videos to authenticated;

drop policy if exists aion_class_videos_public_read on public.aion_class_videos;
create policy aion_class_videos_public_read on public.aion_class_videos for select to anon, authenticated using (true);
drop policy if exists aion_class_videos_admin_insert on public.aion_class_videos;
create policy aion_class_videos_admin_insert on public.aion_class_videos for insert to authenticated with check (uploaded_by = (select auth.uid()) and (select public.xethkioz_can_publish_article()));
drop policy if exists aion_class_videos_admin_update on public.aion_class_videos;
create policy aion_class_videos_admin_update on public.aion_class_videos for update to authenticated using ((select public.xethkioz_can_publish_article())) with check (uploaded_by = (select auth.uid()) and (select public.xethkioz_can_publish_article()));
drop policy if exists aion_class_videos_admin_delete on public.aion_class_videos;
create policy aion_class_videos_admin_delete on public.aion_class_videos for delete to authenticated using ((select public.xethkioz_can_publish_article()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('aion-class-videos', 'aion-class-videos', true, 524288000, array['video/mp4','video/webm','video/ogg','video/quicktime']::text[])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists aion_class_video_admin_insert on storage.objects;
create policy aion_class_video_admin_insert on storage.objects for insert to authenticated with check (bucket_id = 'aion-class-videos' and (storage.foldername(name))[1] = (select auth.uid())::text and (select public.xethkioz_can_publish_article()));
drop policy if exists aion_class_video_admin_update on storage.objects;
create policy aion_class_video_admin_update on storage.objects for update to authenticated using (bucket_id = 'aion-class-videos' and (storage.foldername(name))[1] = (select auth.uid())::text and (select public.xethkioz_can_publish_article())) with check (bucket_id = 'aion-class-videos' and (storage.foldername(name))[1] = (select auth.uid())::text and (select public.xethkioz_can_publish_article()));
drop policy if exists aion_class_video_admin_delete on storage.objects;
create policy aion_class_video_admin_delete on storage.objects for delete to authenticated using (bucket_id = 'aion-class-videos' and (select public.xethkioz_can_publish_article()));