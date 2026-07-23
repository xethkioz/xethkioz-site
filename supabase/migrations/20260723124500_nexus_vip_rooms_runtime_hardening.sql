-- Follow-up for the already-created VIP tables.
-- PostgreSQL STABLE helpers cannot see the row being inserted by the current
-- statement, so owners need a direct SELECT policy branch for INSERT RETURNING.
-- Supabase default table grants are also revoked before least-privilege grants.

drop policy if exists nexus_vip_rooms_member_read on public.nexus_vip_rooms;
create policy nexus_vip_rooms_member_read
on public.nexus_vip_rooms
for select
to authenticated
using (
  owner_id = (select auth.uid())
  or (select private.xethkioz_vip_can_view(id))
);

revoke all on public.nexus_vip_rooms, public.nexus_vip_room_members, public.nexus_vip_messages
from public, anon, authenticated;

grant select, insert on public.nexus_vip_rooms to authenticated;
grant update (codename, theme, status, updated_at) on public.nexus_vip_rooms to authenticated;
grant select, insert, delete on public.nexus_vip_room_members to authenticated;
grant update (status, responded_at) on public.nexus_vip_room_members to authenticated;
grant select, insert on public.nexus_vip_messages to authenticated;
