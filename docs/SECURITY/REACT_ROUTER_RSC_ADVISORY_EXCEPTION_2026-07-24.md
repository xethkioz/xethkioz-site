# React Router RSC advisory exception — 2026-07-24

## Advisory

- ID: `GHSA-qwww-vcr4-c8h2`
- npm audit source: `1124282`
- Reported package: `react-router` through `react-router-dom@7.18.1`
- Reported impact: CSRF bypass in React Router RSC Mode.

## Why the package is not downgraded

Testing `react-router-dom@7.11.0` and `6.30.4` reintroduced older advisories affecting SSR, redirects and navigation. Version `7.18.1` fixes those previous issues. At the time of this decision there is no published React Router version that is both compatible with the current application and reported clean by npm audit.

## Applicability to XETHKIOZ

XETHKIOZ uses React Router Declarative Mode through `<BrowserRouter>` in `src/main.tsx`.

The project does not use:

- React Server Components;
- React Router Framework Mode;
- route server actions;
- `ServerRouter` or `HydratedRouter`;
- `createRequestHandler`;
- `@react-router/*` runtime packages;
- `react-server-dom-*` packages.

The affected RSC execution path is therefore absent from the deployed application.

## Enforced controls

`scripts/dependency-audit-policy.mjs`:

1. requires the exact direct and locked version `7.18.1`;
2. verifies that `src/main.tsx` mounts `<BrowserRouter>`;
3. scans application source for Framework/RSC runtime signals;
4. allows only npm advisory source `1124282` / `GHSA-qwww-vcr4-c8h2`;
5. rejects every other production vulnerability;
6. still rejects any critical vulnerability;
7. writes the complete npm audit JSON as CI evidence;
8. expires this exception after **2026-08-31**.

## Exit criteria

Remove this exception immediately when one of these conditions becomes true:

- React Router publishes a compatible release outside the affected range;
- XETHKIOZ adopts Framework Mode, Data APIs with server actions, SSR or RSC;
- the advisory scope or severity changes;
- another advisory appears in the production dependency graph;
- the exception reaches its expiry date.

This is a narrow compensating control, not a blanket suppression of `npm audit`.
