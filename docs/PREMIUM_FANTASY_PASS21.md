# Premium Fantasy — Pass 21

Release candidate: 11.4.0. Updated: 2026-09-20.
Scope: public website only. Based on the released Pass 20.

## Public experience
- Shared fantasy navigation on Home and the game portal; desktop links and a flow-based mobile menu.
- Explicit game discovery CTA, readable body copy and controls sized for touch.
- Localized World portal URLs, canonical links and reciprocal ES/EN alternates, preserving chapter anchors.
- An explanatory public Green Node entrance instead of a silent redirect. Restricted account/admin authorization is unchanged.
- A user-opened, uncropped illustration viewer with Escape, focus containment/return, backdrop dismissal, loading and failure states.

## Performance and information boundary
The viewer reuses the already released 800x800 promotional image. It does not add a larger source, game screenshot, media download, external player or 3D engine. It mounts only after the user opens it; no animation or polling loop is added. Promotional labelling stays visible.

The public-art manifest is deliberately limited to the existing promotional derivative. Do not use it as permission to publish private lore, definitive characters, internal maps, models, source textures or documentation. Official channels remain Web, Threads, Instagram, TikTok and YouTube.

## Integration and validation
The audited navigation changes are integrated as a reviewed commit, not by replacing the released site with an older working snapshot. Preserve the independent source branch and private evidence.
Run the complete production build, the standard browser suite, the focused public viewer/navigation tests and remote deployment checks before release. Keep E2E test-mode builds separate from the production bundle.

Tests cover eight viewport widths, both languages, modal keyboard interaction, image failure, blocked session storage and direct chapter links. Automated viewport emulation is not a physical-phone FPS or comprehensive accessibility certification. Real-device performance, backend authorization tests and the wider content approval process remain separate work.
