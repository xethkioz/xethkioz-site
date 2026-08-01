-- Huellas de Puan: publicaciones comunitarias moderadas
create table if not exists public.pet_posts (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('Perdido','Encontrado','Adopción')),
  name text not null default 'Sin nombre' check (char_length(name) between 1 and 80),
  species text not null check (char_length(species) between 1 and 60),
  locality text not null check (char_length(locality) between 1 and 80),
  zone text not null check (char_length(zone) between 2 and 140),
  description text not null check (char_length(description) between 10 and 1200),
  phone text not null check (char_length(phone) between 8 and 30),
  castrated text not null check (castrated in ('Sí','No','Desconocido')),
  image_urls text[] not null default '{}'::text[] check (cardinality(image_urls) <= 2),
  status text not null default 'pending' check (status in ('pending','approved','resolved','rejected')),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '15 days'),
  approved_at timestamptz,
  source text not null default 'web'
);

alter table public.pet_posts enable row level security;

drop policy if exists "Public can read active approved pet posts" on public.pet_posts;
create policy "Public can read active approved pet posts" on public.pet_posts for select to anon, authenticated
using (status = 'approved' and expires_at > now());

drop policy if exists "Public can submit pending pet posts" on public.pet_posts;
create policy "Public can submit pending pet posts" on public.pet_posts for insert to anon, authenticated
with check (status = 'pending' and cardinality(image_urls) <= 2 and expires_at <= now() + interval '16 days');

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('pet-posts','pet-posts',true,5242880,array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public=excluded.public,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;

drop policy if exists "Public can view pet post images" on storage.objects;
create policy "Public can view pet post images" on storage.objects for select to public using (bucket_id='pet-posts');

drop policy if exists "Public can upload pet post images" on storage.objects;
create policy "Public can upload pet post images" on storage.objects for insert to anon, authenticated
with check (bucket_id='pet-posts' and (storage.foldername(name))[1]='submissions');

create index if not exists pet_posts_public_feed_idx on public.pet_posts (status, expires_at desc, created_at desc);
