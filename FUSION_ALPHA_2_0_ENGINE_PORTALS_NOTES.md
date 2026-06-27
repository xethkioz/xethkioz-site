# XETHKIOZ Fusion Alpha 2.0 — Engine Portals

## Scope
- Integrates the 6-part input set supplied for the Core 2.0 transition.
- Adds `WorldHeroStage` to the World Engine with avatar pose interactions.
- Adds domain-level portal components for Gaming, Science, Fun and Green.
- Keeps route files as thin wrappers; engine logic now lives under `src/engines/*`.
- Keeps Wisp Green Gateway and Avatar Renderer from Alpha 1.10.

## Technical Notes
- No SQL executed.
- No Supabase runtime changes.
- Static portal panels remain prepared for CMS/Supabase injection.
- The avatar sprite path is standardized at `/assets/fusion-shared/xethkioz_avatar_sheet.png`.
