# database/migrations — historical only

This directory is retained for compatibility and applied-history reconciliation.

- **Do not add new migrations here.**
- New migrations belong in `supabase/migrations/`.
- Some files are intentionally mirrored byte-for-byte with `supabase/migrations/` because older deployment history referenced both locations.
- Do not delete or rename historical SQL until the applied migration history has been reconciled and a rollback point exists.

The build-time `npm run audit:repository-hygiene` check prevents new dated migrations from being added here after the historical cutoff.
