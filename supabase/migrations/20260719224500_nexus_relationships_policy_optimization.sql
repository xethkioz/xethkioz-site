-- Consolidate participant UPDATE rules into one policy so Postgres evaluates
-- a single predicate per relationship mutation.

drop policy if exists nexus_relationships_requester_update on public.nexus_relationships;
drop policy if exists nexus_relationships_addressee_update on public.nexus_relationships;
drop policy if exists nexus_relationships_participant_update on public.nexus_relationships;

create policy nexus_relationships_participant_update
on public.nexus_relationships for update to authenticated
using (
  (select auth.uid()) = requester_id
  or (select auth.uid()) = addressee_id
)
with check (
  ((select auth.uid()) = requester_id and status in ('pending','blocked'))
  or ((select auth.uid()) = addressee_id and status in ('accepted','blocked'))
);
