-- Cover the sender foreign key for account deletion and safety lookups.
create index if not exists nexus_direct_messages_sender_idx
on public.nexus_direct_messages (sender_id);
