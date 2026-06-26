# XETHKIOZ V7 — Clean Restart Alpha 4 Audit

## Objective
Stabilize the current public web before adding new functionality or heavy visual upgrades.

## Scope
Alpha 4 does not add CMS, SQL, Supabase changes, chat, uploads, or new public sections.

## Confirmed public routes
- `/`
- `/gaming`
- `/science`
- `/fun`
- `/green-node`

## Redirected legacy routes
- `/news` → `/gaming`
- `/community` → `/fun`
- `/admin` → `/`
- `/cms` → `/`

## Reason
The current stage must prioritize a simple, stable user journey: Core → three portals → hidden Wisp/Green Node.
Old panels and dashboards were useful during development, but exposing them publicly makes the product feel random and unfinished.

## Technical notes
- The public bundle path no longer imports Admin, CMS, News or Community pages from `App.tsx`.
- Supabase files remain in the repository for future phases, but are not part of the Alpha 4 public route flow.
- Header account control is now a preparation state instead of a live admin link.

## QA checklist
- `npm install`
- `npm run build`
- Home loads
- ES/EN changes apply on visible public pages
- Portals open independently
- Back-to-core flow works from all portals
- Green Wisp opens Green Node
- Legacy URLs redirect safely

## Pending
- Home cinematic art recovery: avatar vs dragon with proper XETHKIOZ visual identity.
- Final portal visual polish.
- Real account/auth system.
- Supabase/CMS integration after the public UX is stable.

## Build validation
Validated in clean environment after removing `node_modules` and `dist`:

```text
npm install
npm run build
✓ 52 modules transformed
✓ built in 1.73s
0 TypeScript errors
```

## Bundle observation
Alpha 3 transformed 118 modules. Alpha 4 transforms 52 modules because unfinished legacy routes are no longer part of the public route flow.
