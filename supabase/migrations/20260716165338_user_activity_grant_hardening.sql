-- Remove broad grants inherited from older defaults. RLS remains the row-level
-- boundary, while these grants limit which operations can reach that boundary.

revoke all on table public.profiles from authenticated;
grant select, insert on table public.profiles to authenticated;
grant update (username, display_name, avatar_url, bio) on table public.profiles to authenticated;

revoke all on table public.user_activity_events from authenticated;
grant select, insert on table public.user_activity_events to authenticated;

revoke update, delete, truncate, references, trigger
  on table public.chat_messages
  from anon, authenticated;
