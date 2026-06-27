import type { ReactNode } from 'react'
import { motion, MotionConfig, type HTMLMotionProps, useMotionValue, useTransform } from 'framer-motion'
import type { WorldCameraMotion } from '../hooks'
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
  camera?: WorldCameraMotion
  className?: string
}

/**
 * Alpha 3.0 cinematic shell for the World scene.
 * Owns atmospheric rendering only and can subscribe to the Camera Engine
 * through MotionValues without triggering React re-renders.
 */
export function WorldStageBackdrop({
  children,
  labelId = 'world-gate-title',
  showGrid = true,
  showScanline = true,
  showGrain = true,
  theme = 'gaming',
  camera,
  className = '',
  ...motionProps
}: WorldStageBackdropProps) {
  const themeVfx = worldThemeVfx[theme]
  const fallbackX = useMotionValue(0)
  const fallbackY = useMotionValue(0)
  const sourceX = camera?.smoothX ?? fallbackX
  const sourceY = camera?.smoothY ?? fallbackY

  const backdropX = useTransform(sourceX, [-1, 1], [10, -10])
  const backdropY = useTransform(sourceY, [-1, 1], [7, -7])
  const fogX = useTransform(sourceX, [-1, 1], [15, -15])
  const fogY = useTransform(sourceY, [-1, 1], [10, -10])
  const lightX = useTransform(sourceX, [-1, 1], [-9, 9])
  const lightY = useTransform(sourceY, [-1, 1], [-6, 6])

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
        <motion.div
          aria-hidden="true"
          variants={worldMotionVariants.backdropBase}
          className="pointer-events-none absolute inset-0 bg-[#0B0A0F]"
        />

        <motion.div
          aria-hidden="true"
          variants={worldMotionVariants.backdropGradient}
          className="pointer-events-none absolute -inset-24 blur-3xl will-change-transform"
          style={{
            x: backdropX,
            y: backdropY,
            background: `radial-gradient(circle at 50% 4%, ${themeVfx.primaryGlow}, transparent 34%), radial-gradient(circle at 86% 78%, ${themeVfx.secondaryGlow}, transparent 34%), radial-gradient(circle at 14% 82%, ${themeVfx.actionGlow}, transparent 30%)`,
          }}
        />

        <motion.div
          aria-hidden="true"
          variants={worldMotionVariants.softFog}
          className="pointer-events-none absolute inset-x-[-12%] top-[12%] h-72 rounded-full blur-3xl will-change-transform"
          style={{
            x: fogX,
            y: fogY,
            background: `linear-gradient(90deg, transparent, ${themeVfx.fogGlow}, transparent)`,
          }}
        />

        <motion.div
          aria-hidden="true"
          variants={worldMotionVariants.softFog}
          className="pointer-events-none absolute bottom-[-18%] left-[-10%] h-80 w-[62%] rounded-full blur-3xl will-change-transform"
          style={{
            x: fogX,
            y: fogY,
            background: `radial-gradient(circle, ${themeVfx.primaryGlow}, transparent 68%)`,
          }}
        />

        {showGrain && (
          <motion.div
            aria-hidden="true"
            variants={worldMotionVariants.backdropBase}
            className="pointer-events-none absolute inset-0 opacity-[0.055] mix-blend-screen [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.42)_1px,transparent_0)] [background-size:7px_7px]"
          />
        )}

        {showGrid && (
          <motion.div
            aria-hidden="true"
            variants={worldMotionVariants.gridDrift}
            className="pointer-events-none absolute inset-0 [background-image:linear-gradient(rgba(139,92,246,.16)_1px,transparent_1px),linear-gradient(90deg,rgba(249,115,22,.08)_1px,transparent_1px)] [background-size:44px_44px]"
            style={{ opacity: 0.2, x: backdropX, y: backdropY }}
          />
        )}

        <motion.div
          aria-hidden="true"
          variants={worldMotionVariants.ambientOrb}
          className="pointer-events-none absolute right-8 top-10 h-40 w-40 rounded-full blur-3xl will-change-transform"
          style={{ x: lightX, y: lightY, background: themeVfx.primaryGlow }}
        />

        <motion.div
          aria-hidden="true"
          variants={worldMotionVariants.ambientOrb}
          className="pointer-events-none absolute bottom-12 left-8 h-36 w-36 rounded-full blur-3xl will-change-transform"
          style={{ x: lightY, y: lightX, background: themeVfx.actionGlow }}
        />

        {showScanline && (
          <motion.div
            aria-hidden="true"
            variants={worldMotionVariants.scanline}
            className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/5 via-violet-500/10 to-transparent blur-sm"
          />
        )}

        <motion.div
          aria-hidden="true"
          variants={worldMotionVariants.backdropBase}
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,0.72)_100%)]"
        />

        <div className="absolute left-4 top-3 z-10 font-mono text-[9px] uppercase tracking-[0.28em] text-gray-600">
          WORLD_ENGINE // CAMERA_ENGINE
        </div>

        <div className="relative z-10 flex w-full flex-col items-center gap-8">{children}</div>
      </motion.section>
    </MotionConfig>
  )
}

export default WorldStageBackdrop
