-- Cover the invited_by foreign key for moderation, account deletion and
-- invitation auditing without scanning the complete membership table.

create index if not exists nexus_vip_members_inviter_created_idx
  on public.nexus_vip_room_members (invited_by, created_at desc);
