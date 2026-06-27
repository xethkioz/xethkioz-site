import type { ReactNode } from 'react'
import { MotionConfig, motion, type HTMLMotionProps } from 'framer-motion'
import {
  worldMotionTransition,
  worldMotionVariants,
  worldThemeVfx,
  type WorldPortalTheme,
} from './worldMotionVariants'

export interface WorldStageBackdropProps extends Omit<HTMLMotionProps<'section'>, 'children'> {
  children: ReactNode
  labelId?: string
  showGrid?: boolean
  showScanline?: boolean
  showGrain?: boolean
  theme?: WorldPortalTheme
  className?: string
}

/**
 * Alpha 3.0 cinematic shell for the World scene.
 *
 * Responsibilities:
 * - Owns atmospheric rendering only.
 * - Does not read or mutate ProfileEngine, providers, Supabase or persistence.
 * - Accepts a portal theme to tint ambient light without changing Core logic.
 */
export function WorldStageBackdrop({
  children,
  labelId = 'world-gate-title',
  showGrid = true,
  showScanline = true,
  showGrain = true,
  theme = 'gaming',
  className = '',
  ...motionProps
}: WorldStageBackdropProps) {
  const themeVfx = worldThemeVfx[theme]

  return (
    <MotionConfig transition={worldMotionTransition.global}>
      <motion.section
        variants={worldMotionVariants.stage}
        initial="initial"
        animate="enter"
        exit="exit"
        className={`relative z-10 flex min-h-[620px] flex-col items-center gap-8 overflow-hidden rounded-[2rem] border border-violet-500/10 bg-[#0B0A0F] p-6 shadow-[0_0_60px_rgba(0,0,0,0.55)] md:p-8 ${className}`}
        aria-labelledby={labelId}
        data-world-theme={theme}
        {...motionProps}
      >
        {/* A) Fondo Base Absoluto */}
        <motion.div
          aria-hidden="true"
          variants={worldMotionVariants.backdropBase}
          className="pointer-events-none absolute inset-0 bg-[#0B0A0F]"
        />

        {/* B) Gradiente Dinámico */}
        <motion.div
          aria-hidden="true"
          variants={worldMotionVariants.backdropGradient}
          className="pointer-events-none absolute -inset-24 blur-3xl"
          style={{
            background: `radial-gradient(circle at 50% 4%, ${themeVfx.primaryGlow}, transparent 34%), radial-gradient(circle at 86% 78%, ${themeVfx.secondaryGlow}, transparent 34%), radial-gradient(circle at 14% 82%, ${themeVfx.actionGlow}, transparent 30%)`,
          }}
        />

        {/* C) Niebla Suave */}
        <motion.div
          aria-hidden="true"
          variants={worldMotionVariants.softFog}
          className="pointer-events-none absolute inset-x-[-12%] top-[12%] h-72 rounded-full blur-3xl"
          style={{
            background: `linear-gradient(90deg, transparent, ${themeVfx.fogGlow}, transparent)`,
          }}
        />

        <motion.div
          aria-hidden="true"
          variants={worldMotionVariants.softFog}
          className="pointer-events-none absolute bottom-[-18%] left-[-10%] h-80 w-[62%] rounded-full blur-3xl"
          style={{
            background: `radial-gradient(circle, ${themeVfx.primaryGlow}, transparent 68%)`,
          }}
        />

        {/* D) Ruido / Grain */}
        {showGrain && (
          <motion.div
            aria-hidden="true"
            variants={worldMotionVariants.backdropBase}
            className="pointer-events-none absolute inset-0 opacity-[0.055] mix-blend-screen [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.42)_1px,transparent_0)] [background-size:7px_7px]"
          />
        )}

        {/* Grid estructural sutil */}
        {showGrid && (
          <motion.div
            aria-hidden="true"
            variants={worldMotionVariants.gridDrift}
            className="pointer-events-none absolute inset-0 [background-image:linear-gradient(rgba(139,92,246,.16)_1px,transparent_1px),linear-gradient(90deg,rgba(249,115,22,.08)_1px,transparent_1px)] [background-size:44px_44px]"
            style={{ opacity: 0.2 }}
          />
        )}

        {/* F) Iluminación Ambiental */}
        <motion.div
          aria-hidden="true"
          variants={worldMotionVariants.ambientOrb}
          className="pointer-events-none absolute right-8 top-10 h-40 w-40 rounded-full blur-3xl"
          style={{ background: themeVfx.primaryGlow }}
        />

        <motion.div
          aria-hidden="true"
          variants={worldMotionVariants.ambientOrb}
          className="pointer-events-none absolute bottom-10 right-[18%] h-28 w-28 rounded-full blur-2xl"
          style={{ background: themeVfx.actionGlow }}
        />

        {/* Scanline cinemático */}
        {showScanline && (
          <motion.div
            aria-hidden="true"
            variants={worldMotionVariants.scanline}
            className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/5 via-violet-500/10 to-transparent blur-sm"
          />
        )}

        {/* E) Viñeta */}
        <motion.div
          aria-hidden="true"
          variants={worldMotionVariants.backdropBase}
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,transparent_0%,transparent_48%,rgba(0,0,0,0.72)_100%)]"
        />

        <div className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/70 to-transparent" />
        <div className="pointer-events-none absolute inset-x-16 bottom-0 h-px bg-gradient-to-r from-transparent via-orange-400/40 to-transparent" />

        <div className="absolute left-4 top-3 z-10 font-mono text-[9px] uppercase tracking-[0.28em] text-gray-600">
          WORLD_ENGINE // VISUAL_EXPERIENCE_ENGINE // {themeVfx.label}
        </div>

        <div className="relative z-10 flex w-full flex-col items-center gap-8">{children}</div>
      </motion.section>
    </MotionConfig>
  )
}

export default WorldStageBackdrop
