# XETHKIOZ V7 Clean Restart Alpha 4 — Stability Scope Lock

Alpha 4 focuses on making the public website smaller, more predictable and easier to test before visual expansion.

## What changed

- Public routing was reduced to the final clean-restart concept:
  - Home/Core
  - Gaming Portal
  - Science & Technology Portal
  - Fun Portal
  - Green Node / Wisp Nexus
- Legacy routes now redirect instead of exposing unfinished dashboards.
- Account control remains visible but does not open unfinished admin/CMS flows yet.
- Supabase is no longer forced into the public Alpha 4 runtime bundle.
- Build output dropped from 118 transformed modules to 52 transformed modules.

## What did not change

- No SQL changes.
- No Supabase schema changes.
- No chat changes.
- No upload system changes.
- No new user account/auth system.
- No major visual redesign yet.

## Reason

The project needs a stable public route map before the Home cinematic recovery and portal polish. The previous public structure had too many legacy panels and made XETHKIOZ feel random instead of focused.
