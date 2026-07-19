-- Nexus City Social Alpha
-- Persistent avatar state, public cosmetic catalog, world rooms and private safety reports.

create table if not exists public.nexus_avatar_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null default '{"skin":"#c98f68","hair":"spikes","outfit":"outfit-nexus-runner","aura":"aura-neon-pulse","accessory":"none","owned":["outfit-nexus-runner","aura-neon-pulse"],"spent":0}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint nexus_avatar_state_object check (jsonb_typeof(state) = 'object'),
  constraint nexus_avatar_state_size check (octet_length(state::text) <= 12000)
);

create table if not exists public.nexus_cosmetics (
  id text primary key,
  slot text not null check (slot in ('outfit','aura','accessory','badge')),
  name_es text not null,
  name_en text not null,
  description_es text not null default '',
  description_en text not null default '',
  rarity text not null default 'starter' check (rarity in ('starter','rare','epic','legendary')),
  shard_price integer not null default 0 check (shard_price between 0 and 100000),
  visual_token text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.nexus_world_rooms (
  id text primary key,
  district text not null,
  name_es text not null,
  name_en text not null,
  chat_room_id text not null,
  minimum_level integer not null default 1 check (minimum_level between 1 and 100),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.nexus_safety_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references auth.users(id) on delete cascade,
  room_id text references public.nexus_world_rooms(id) on delete set null,
  subject_user_id uuid references auth.users(id) on delete set null,
  category text not null check (category in ('spam','harassment','unsafe-content','impersonation','other')),
  detail text not null check (char_length(detail) between 10 and 1200),
  status text not null default 'new' check (status in ('new','reviewing','resolved','dismissed')),
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

insert into public.nexus_cosmetics (id,slot,name_es,name_en,description_es,description_en,rarity,shard_price,visual_token) values
  ('outfit-nexus-runner','outfit','Nexus Runner','Nexus Runner','Chaqueta violeta de explorador.','Violet explorer jacket.','starter',0,'#8b5cf6'),
  ('outfit-cyber-ronin','outfit','Cyber Ronin','Cyber Ronin','Armadura urbana del distrito Asia.','Urban armor from the Asia district.','rare',180,'#22d3ee'),
  ('outfit-void-cultist','outfit','Cultista del Vacío','Void Cultist','Textura oscura infectada por el Wisp.','Dark texture infected by the Wisp.','epic',320,'#32ff8a'),
  ('aura-neon-pulse','aura','Pulso Neón','Neon Pulse','Energía violeta y naranja.','Violet and orange energy.','starter',0,'#f97316'),
  ('aura-green-malware','aura','Malware Verde','Green Malware','Código corrupto del Green Node.','Corrupted Green Node code.','rare',240,'#32ff8a'),
  ('accessory-visor-zero','accessory','Visor Zero','Zero Visor','HUD cian para leer la ciudad.','Cyan HUD for reading the city.','rare',90,'#22d3ee'),
  ('accessory-demon-horns','accessory','Cuernos Wisp','Wisp Horns','Señal demonio-malware.','Demon-malware signal.','epic',260,'#32ff8a')
on conflict (id) do update set
  name_es=excluded.name_es,name_en=excluded.name_en,description_es=excluded.description_es,
  description_en=excluded.description_en,rarity=excluded.rarity,shard_price=excluded.shard_price,
  visual_token=excluded.visual_token,is_active=true,updated_at=now();

insert into public.nexus_world_rooms (id,district,name_es,name_en,chat_room_id,minimum_level) values
  ('lobby','core','Plaza Nexus','Nexus Plaza','general',1),
  ('gaming','gaming','Gaming District','Gaming District','gaming',1),
  ('science','science','Future Lab','Future Lab','science',1),
  ('fun','fun','Chaos Alley','Chaos Alley','fun',1)
on conflict (id) do update set district=excluded.district,name_es=excluded.name_es,name_en=excluded.name_en,chat_room_id=excluded.chat_room_id,minimum_level=excluded.minimum_level,is_active=true;

alter table public.nexus_avatar_profiles enable row level security;
alter table public.nexus_cosmetics enable row level security;
alter table public.nexus_world_rooms enable row level security;
alter table public.nexus_safety_reports enable row level security;

drop policy if exists nexus_avatar_profiles_own_read on public.nexus_avatar_profiles;
create policy nexus_avatar_profiles_own_read on public.nexus_avatar_profiles for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists nexus_avatar_profiles_own_insert on public.nexus_avatar_profiles;
create policy nexus_avatar_profiles_own_insert on public.nexus_avatar_profiles for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists nexus_avatar_profiles_own_update on public.nexus_avatar_profiles;
create policy nexus_avatar_profiles_own_update on public.nexus_avatar_profiles for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

drop policy if exists nexus_cosmetics_anon_active_read on public.nexus_cosmetics;
create policy nexus_cosmetics_anon_active_read on public.nexus_cosmetics for select to anon using (is_active = true);
drop policy if exists nexus_cosmetics_authenticated_read on public.nexus_cosmetics;
create policy nexus_cosmetics_authenticated_read on public.nexus_cosmetics for select to authenticated using (is_active = true or (select public.xethkioz_has_role(array['ADMIN'])));
drop policy if exists nexus_cosmetics_admin_insert on public.nexus_cosmetics;
create policy nexus_cosmetics_admin_insert on public.nexus_cosmetics for insert to authenticated with check ((select public.xethkioz_has_role(array['ADMIN'])));
drop policy if exists nexus_cosmetics_admin_update on public.nexus_cosmetics;
create policy nexus_cosmetics_admin_update on public.nexus_cosmetics for update to authenticated using ((select public.xethkioz_has_role(array['ADMIN']))) with check ((select public.xethkioz_has_role(array['ADMIN'])));
drop policy if exists nexus_cosmetics_admin_delete on public.nexus_cosmetics;
create policy nexus_cosmetics_admin_delete on public.nexus_cosmetics for delete to authenticated using ((select public.xethkioz_has_role(array['ADMIN'])));

drop policy if exists nexus_world_rooms_public_read on public.nexus_world_rooms;
create policy nexus_world_rooms_public_read on public.nexus_world_rooms for select to anon, authenticated using (is_active = true);

drop policy if exists nexus_safety_reports_own_insert on public.nexus_safety_reports;
create policy nexus_safety_reports_own_insert on public.nexus_safety_reports for insert to authenticated with check ((select auth.uid()) = reporter_id);
drop policy if exists nexus_safety_reports_own_read on public.nexus_safety_reports;
create policy nexus_safety_reports_own_read on public.nexus_safety_reports for select to authenticated using ((select auth.uid()) = reporter_id or (select public.xethkioz_is_moderator_or_admin()));
drop policy if exists nexus_safety_reports_staff_update on public.nexus_safety_reports;
create policy nexus_safety_reports_staff_update on public.nexus_safety_reports for update to authenticated using ((select public.xethkioz_is_moderator_or_admin())) with check ((select public.xethkioz_is_moderator_or_admin()));

grant select, insert, update on public.nexus_avatar_profiles to authenticated;
grant select on public.nexus_cosmetics, public.nexus_world_rooms to anon, authenticated;
grant insert, update, delete on public.nexus_cosmetics to authenticated;
grant insert, select, update on public.nexus_safety_reports to authenticated;

create index if not exists nexus_safety_reports_reporter_created_idx on public.nexus_safety_reports (reporter_id, created_at desc);
create index if not exists nexus_safety_reports_subject_idx on public.nexus_safety_reports (subject_user_id) where subject_user_id is not null;
create index if not exists nexus_safety_reports_room_idx on public.nexus_safety_reports (room_id) where room_id is not null;

comment on table public.nexus_avatar_profiles is 'Nexus City Alpha avatar preferences. No real-money balance or payment data is stored here.';
comment on table public.nexus_safety_reports is 'Private community safety queue; never expose reports to anonymous users.';
