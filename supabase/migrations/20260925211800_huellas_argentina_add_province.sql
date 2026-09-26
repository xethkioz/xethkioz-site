-- Huellas Argentina: add national province support while preserving existing local posts.
alter table public.pet_posts
  add column if not exists province text not null default 'Buenos Aires';

alter table public.pet_posts
  drop constraint if exists pet_posts_province_length_check;

alter table public.pet_posts
  add constraint pet_posts_province_length_check
  check (char_length(province) between 2 and 80);

create index if not exists idx_pet_posts_public_region
  on public.pet_posts (status, province, locality, expires_at desc);

comment on column public.pet_posts.province is
  'Argentine province or CABA for public pet notices. Existing local Huellas records default to Buenos Aires.';
