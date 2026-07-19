-- Auth profile recovery + official Nexus Atrium
-- Restores the canonical auth.users -> profiles contract without assigning elevated roles.

alter table public.profiles
  alter column email drop not null;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (
    id,email,subscription_tier,role,created_at,updated_at
  ) values (
    new.id,new.email,'BASIC','GUEST',coalesce(new.created_at,now()),now()
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

revoke all on function public.handle_new_user() from public, anon, authenticated;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Recover accounts created while the trigger was absent. Roles remain least-privilege.
insert into public.profiles (
  id,email,subscription_tier,role,created_at,updated_at
)
select
  users.id,users.email,'BASIC','GUEST',coalesce(users.created_at,now()),now()
from auth.users users
on conflict (id) do nothing;

-- Reserve system handles before users begin publishing Nexus passports.
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.nexus_public_profiles'::regclass
      and conname = 'nexus_public_profiles_system_handle'
  ) then
    alter table public.nexus_public_profiles
      add constraint nexus_public_profiles_system_handle
      check (handle not in ('xethkioz','nexus','admin','moderator','system'));
  end if;
end
$$;

-- System-owned public room: no human account, email or privilege is attached.
insert into public.chat_rooms (
  id,name,icon,description,is_public,owner_id,room_kind
) values (
  'capsule-xethkioz',
  'Atrio oficial XETHKIOZ',
  '◆',
  'Punto de entrada público a Nexus City.',
  true,
  null,
  'public'
)
on conflict (id) do update set
  name=excluded.name,
  icon=excluded.icon,
  description=excluded.description,
  is_public=true,
  owner_id=null,
  room_kind='public';

comment on function public.handle_new_user() is 'Creates a least-privilege BASIC/GUEST profile after an Auth signup. Not callable through the API.';

