# Fusion Alpha 1.5 Code / Routes / Structure Review

Generated: 2026-06-27T12:39:27.053Z

## Summary
- Source TS/TSX files: 128
- Page route files: 36
- Component files: 48
- Fusion engine components: 13
- Lib/config/context files: 20

## Public route contract detected in App.tsx
- /: present
- /gaming: present
- /science: present
- /fun: present
- /green-node: present

## Fusion components
- src/components/fusion/FusionCalendarGrid.tsx
- src/components/fusion/FusionContentPanel.tsx
- src/components/fusion/FusionFeatureGrid.tsx
- src/components/fusion/FusionGlobalStatus.tsx
- src/components/fusion/FusionGlobalWisp.tsx
- src/components/fusion/FusionHero.tsx
- src/components/fusion/FusionLevelGrid.tsx
- src/components/fusion/FusionPortalGate.tsx
- src/components/fusion/FusionShell.tsx
- src/components/fusion/FusionStatusRail.tsx
- src/components/fusion/FusionWispEntity.tsx
- src/components/fusion/FusionWorldStage.tsx
- src/components/fusion/FusionWorldStageV5.tsx

## Risk notes
- Legacy pages still exist in src/pages. They are mostly redirected/unused during Fusion Alpha and should not be deleted until CMS/News contracts are approved.
- Main route surface is intentionally small. This matches the Master Design Bible requirement: stable public shell first, engines second.
- The project now has multiple audit scripts. Future work should keep them passing before Live deploy.
