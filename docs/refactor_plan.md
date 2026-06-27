# Fusion Platform Alpha 3.0 — Visual Experience Engine Refactor Plan

## Scope

This document defines the visual-layer refactor for the transition from Alpha 2.9 to Alpha 3.0.

The goal is to evolve the current `InteractionEngine` into a cleaner set of micro-engines without touching the Core, persistence, Supabase services, profile logic or global providers.

## Non-negotiable boundaries

Do not modify:

- `src/engines/profile/`
- `src/services/`
- `src/providers/`
- Supabase schema, RLS policies or persistence logic
- XP, level, inventory or auth behavior

Allowed scope:

- `src/engines/world/`
- `src/engines/world/components/`
- visual-only animation utilities
- documentation

## Current state

`src/engines/animations/InteractionEngine.tsx` currently mixes several responsibilities:

- hover/tap interaction behavior
- glow rendering
- particle burst rendering
- cinematic entry variants
- Wisp pulse variants
- tone color mapping

This is useful for Alpha 2.9, but it will become difficult to scale once World, Wisp, Avatar, CMS cards and future portals require different visual behaviors.

## Target structure

Recommended Alpha 3.0 structure:

```txt
src/engines/animations/
  AnimationEngine.ts
  ParticleEngine.tsx
  GlowEngine.tsx
  TransitionEngine.ts
  HoverEngine.ts
  index.ts

src/engines/world/components/
  WorldStageBackdrop.tsx
  WorldWispMotion.tsx
  WorldFloatingRelic.tsx
  worldMotionVariants.ts
  index.ts
```

## 1. AnimationEngine

### Responsibility

Own named animation states and reusable motion variants.

### Should contain

- cinematic entry/exit variants
- UI state variants
- Wisp state variants
- stage transition presets
- shared easing curves

### Should not contain

- JSX particles
- direct glow DOM elements
- business logic
- profile, XP, inventory or Supabase logic

### Example API

```ts
export const animationStates = {
  cinematicEnter,
  cinematicExit,
  wispIdle,
  wispFocus,
  wispSurge,
}
```

## 2. ParticleEngine

### Responsibility

Render and configure visual particles.

### Should contain

- particle generation helpers
- burst particles
- ambient particles
- trail particles
- particle intensity presets

### Should not contain

- hover state decisions
- Supabase events
- profile state
- layout wrappers

### Example API

```tsx
<ParticleField tone="gaming" density="medium" />
<ParticleBurst triggerKey={burstKey} tone="green" />
```

## 3. GlowEngine

### Responsibility

Centralize aura, glow, bloom-like shadows and tone-based lighting.

### Should contain

- tone-to-color maps
- glow intensity presets
- aura components
- animated radial light layers

### Should not contain

- particles
- buttons
- action state logic
- profile or Wisp persistence

### Example API

```tsx
<GlowAura tone="gaming" intensity="high" />
<GlowRing tone="fun" speed="slow" />
```

## Migration sequence

### Step 1 — Freeze Alpha 2.9

Create a tag before refactoring:

```bash
git tag -a alpha-2.9 -m "Fusion Alpha 2.9 Interaction Engine Stable"
git push origin alpha-2.9
```

### Step 2 — Create isolated branch

```bash
git checkout -b feature/world-motion-aaa
```

### Step 3 — Add World visual components

Add:

- `WorldStageBackdrop.tsx`
- `WorldWispMotion.tsx`
- `WorldFloatingRelic.tsx`
- `worldMotionVariants.ts`

Do not wire them into `WorldHeroStage.tsx` until the build passes.

### Step 4 — Extract variants first

Move shared variants from `InteractionEngine.tsx` into `AnimationEngine.ts` or `worldMotionVariants.ts`.

The first extraction should be type-safe and visual-only.

### Step 5 — Extract particles

Move particle generation and burst rendering into `ParticleEngine.tsx`.

Keep the old `AnimatedItem` API functional during the transition.

### Step 6 — Extract glow

Move tone color maps and aura rendering into `GlowEngine.tsx`.

Avoid duplicating Tailwind glow classes across World components.

### Step 7 — Replace imports gradually

Replace internal `InteractionEngine` imports one file at a time.

After each block:

```bash
npm run build
```

### Step 8 — Deprecate InteractionEngine

Once all consumers use the micro-engines, keep `InteractionEngine.tsx` as a compatibility wrapper for one release.

Recommended final deprecation header:

```ts
/**
 * @deprecated Use AnimationEngine, ParticleEngine and GlowEngine.
 * This wrapper will be removed after Alpha 3.x stabilization.
 */
```

## Motion import policy

Current repository dependency uses `framer-motion`.

Target Alpha 3.0 preference is `motion/react`.

Safe migration path:

1. Keep current imports from `framer-motion` while Alpha 2.9 remains the base.
2. Add the `motion` package in a dedicated dependency commit.
3. Replace imports with:

```ts
import { motion } from 'motion/react'
```

4. Run:

```bash
npm install
npm run build
```

5. Commit only if the build passes.

## Quality checklist

Before merging Alpha 3.0 visual work:

- [ ] Build passes
- [ ] No changes in profile, services or providers
- [ ] World components are import-ready
- [ ] Variants are centralized
- [ ] Motion effects do not control business logic
- [ ] Reduced motion support is planned before Beta
- [ ] Visual components are documented
- [ ] InteractionEngine remains backward-compatible or is cleanly deprecated

## Expected result

The World scene should become cinematic, modular and visually powerful without compromising the Core.

Alpha 3.0 must feel like a visual upgrade, not a risky rewrite.
