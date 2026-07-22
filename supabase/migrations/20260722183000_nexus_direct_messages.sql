-- Nexus private messaging
-- Direct messages are visible only to both participants. Moderators receive
-- evidence only when one participant explicitly files a safety report.

create table if not exists public.nexus_direct_conversations (
  id uuid primary key default gen_random_uuid(),
  participant_a uuid not null references auth.users(id) on delete cascade,
  participant_b uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint nexus_direct_conversations_ordered check (participant_a::text < participant_b::text),
  constraint nexus_direct_conversations_unique unique (participant_a, participant_b)
);

create table if not exists public.nexus_direct_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.nexus_direct_conversations(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  body text not null,
  created_at timestamptz not null default now(),
  constraint nexus_direct_messages_body_length check (char_length(body) between 1 and 500)
);

alter table public.nexus_safety_reports
  add column if not exists direct_message_id uuid references public.nexus_direct_messages(id) on delete set null,
  add column if not exists evidence_snapshot text;

alter table public.nexus_safety_reports drop constraint if exists nexus_safety_reports_evidence_length;
alter table public.nexus_safety_reports
  add constraint nexus_safety_reports_evidence_length check (evidence_snapshot is null or char_length(evidence_snapshot) between 1 and 700);

alter table public.nexus_direct_conversations enable row level security;
alter table public.nexus_direct_messages enable row level security;

drop policy if exists nexus_direct_conversations_participant_read on public.nexus_direct_conversations;
create policy nexus_direct_conversations_participant_read
on public.nexus_direct_conversations for select to authenticated
using ((select auth.uid()) in (participant_a, participant_b));

drop policy if exists nexus_direct_conversations_contact_insert on public.nexus_direct_conversations;
create policy nexus_direct_conversations_contact_insert
on public.nexus_direct_conversations for insert to authenticated
with check (
  (select auth.uid()) in (participant_a, participant_b)
  and participant_a::text < participant_b::text
  and exists (
    select 1 from public.nexus_relationships relation
    where relation.status = 'accepted'
      and (
        (relation.requester_id = participant_a and relation.addressee_id = participant_b)
        or (relation.requester_id = participant_b and relation.addressee_id = participant_a)
      )
  )
);

drop policy if exists nexus_direct_messages_participant_read on public.nexus_direct_messages;
create policy nexus_direct_messages_participant_read
on public.nexus_direct_messages for select to authenticated
using (exists (
  select 1 from public.nexus_direct_conversations conversation
  where conversation.id = conversation_id
    and (select auth.uid()) in (conversation.participant_a, conversation.participant_b)
));

drop policy if exists nexus_direct_messages_participant_insert on public.nexus_direct_messages;
create policy nexus_direct_messages_participant_insert
on public.nexus_direct_messages for insert to authenticated
with check (
  sender_id = (select auth.uid())
  and exists (
    select 1 from public.nexus_direct_conversations conversation
    where conversation.id = conversation_id
      and (select auth.uid()) in (conversation.participant_a, conversation.participant_b)
      and exists (
        select 1 from public.nexus_relationships relation
        where relation.status = 'accepted'
          and (
            (relation.requester_id = conversation.participant_a and relation.addressee_id = conversation.participant_b)
            or (relation.requester_id = conversation.participant_b and relation.addressee_id = conversation.participant_a)
          )
      )
  )
);

revoke all on public.nexus_direct_conversations from anon, authenticated;
revoke all on public.nexus_direct_messages from anon, authenticated;
grant select, insert on public.nexus_direct_conversations to authenticated;
grant select, insert on public.nexus_direct_messages to authenticated;
grant select (direct_message_id, evidence_snapshot) on public.nexus_safety_reports to authenticated;
grant insert (direct_message_id, evidence_snapshot) on public.nexus_safety_reports to authenticated;

create index if not exists nexus_direct_conversations_participant_a_idx on public.nexus_direct_conversations (participant_a, updated_at desc);
create index if not exists nexus_direct_conversations_participant_b_idx on public.nexus_direct_conversations (participant_b, updated_at desc);
create index if not exists nexus_direct_messages_conversation_created_idx on public.nexus_direct_messages (conversation_id, created_at desc);
create index if not exists nexus_direct_messages_sender_idx on public.nexus_direct_messages (sender_id);
create index if not exists nexus_safety_reports_direct_message_idx on public.nexus_safety_reports (direct_message_id) where direct_message_id is not null;

create or replace function public.xethkioz_touch_direct_conversation()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  update public.nexus_direct_conversations set updated_at = now() where id = new.conversation_id;
  return new;
end;
$$;

revoke all on function public.xethkioz_touch_direct_conversation() from public, anon, authenticated;

drop trigger if exists nexus_direct_messages_touch_conversation on public.nexus_direct_messages;
create trigger nexus_direct_messages_touch_conversation
after insert on public.nexus_direct_messages
for each row execute function public.xethkioz_touch_direct_conversation();

do $$ begin
  alter publication supabase_realtime add table public.nexus_direct_messages;
exception when duplicate_object then null;
end $$;

comment on table public.nexus_direct_conversations is 'Private Nexus conversations between accepted contacts; participant-only through RLS.';
comment on table public.nexus_direct_messages is 'Private Nexus messages; moderators cannot browse them unless a participant creates a safety report snapshot.';
comment on column public.nexus_safety_reports.evidence_snapshot is 'Immutable user-submitted excerpt captured at report time for human moderation.';
