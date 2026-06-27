import { memo, type PointerEvent, type ReactNode, useCallback } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import type { WorldCameraMotion } from '../hooks'
import { worldMotionVariants, worldTransitions } from './worldMotionVariants'

export type WorldFloatingRelicProps = {
  children: ReactNode
  className?: string
  disabled?: boolean
  camera?: WorldCameraMotion
  /** Multiplicador para la fuerza del parallax. Recomendado: 10 a 15. */
  intensity?: number
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

const normalizePointerPosition = (event: PointerEvent<HTMLDivElement>) => {
  const bounds = event.currentTarget.getBoundingClientRect()
  const relativeX = bounds.width > 0 ? (event.clientX - bounds.left) / bounds.width : 0.5
  const relativeY = bounds.height > 0 ? (event.clientY - bounds.top) / bounds.height : 0.5

  return {
    x: clamp(relativeX * 2 - 1, -1, 1),
    y: clamp(relativeY * 2 - 1, -1, 1),
  }
}

/**
 * Alpha 3.0 / Sprint D + E — Floating Relic.
 * Combines global Camera Engine parallax with local pointer tilt.
 */
function WorldFloatingRelicComponent({
  children,
  className = '',
  disabled = false,
  camera,
  intensity = 12,
}: WorldFloatingRelicProps) {
  const safeIntensity = clamp(intensity, 4, 18)
  const hoverSpring = worldTransitions.hoverSpring

  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const hoverProgress = useMotionValue(0)

  const fallbackCameraX = useMotionValue(0)
  const fallbackCameraY = useMotionValue(0)
  const sourceCameraX = camera?.smoothX ?? fallbackCameraX
  const sourceCameraY = camera?.smoothY ?? fallbackCameraY

  const cameraX = useTransform(sourceCameraX, [-1, 1], [-18, 18])
  const cameraY = useTransform(sourceCameraY, [-1, 1], [-10, 10])

  const springX = useSpring(pointerX, hoverSpring)
  const springY = useSpring(pointerY, hoverSpring)
  const springHover = useSpring(hoverProgress, hoverSpring)

  const rotateX = useTransform(springY, [-1, 1], [safeIntensity * 0.72, safeIntensity * -0.72])
  const rotateY = useTransform(springX, [-1, 1], [safeIntensity * -0.86, safeIntensity * 0.86])
  const translateY = useTransform(springY, [-1, 1], [4, -4])
  const scale = useTransform(springHover, [0, 1], [1, 1.08])

  const glowFilter = useTransform(
    springHover,
    [0, 1],
    [
      'drop-shadow(0 0 16px rgba(139,92,246,.32))',
      'drop-shadow(0 0 32px rgba(249,115,22,.75))',
    ],
  )

  const ambientShadow = useTransform([springX, springHover], ([x, hover]) => {
    const offsetX = Number(x) * 18
    const blur = 28 + Number(hover) * 18
    const opacity = 0.2 + Number(hover) * 0.18
    return `${offsetX}px 26px ${blur}px rgba(0,0,0,${opacity})`
  })

  const floorShadowX = useTransform(springX, [-1, 1], [-18, 18])
  const floorShadowOpacity = useTransform(springHover, [0, 1], [0.2, 0.38])
  const floorShadowScale = useTransform(springHover, [0, 1], [0.86, 1.08])
  const orangeAuraOpacity = useTransform(springHover, [0, 1], [0, 0.56])

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (disabled) return

      const normalized = normalizePointerPosition(event)
      pointerX.set(normalized.x)
      pointerY.set(normalized.y)
      hoverProgress.set(1)
    },
    [disabled, hoverProgress, pointerX, pointerY],
  )

  const handlePointerEnter = useCallback(() => {
    if (!disabled) hoverProgress.set(1)
  }, [disabled, hoverProgress])

  const handlePointerLeave = useCallback(() => {
    pointerX.set(0)
    pointerY.set(0)
    hoverProgress.set(0)
  }, [hoverProgress, pointerX, pointerY])

  return (
    <motion.div className="relative inline-flex [perspective:960px] will-change-transform" style={{ x: cameraX, y: cameraY }}>
      <motion.div className="relative inline-flex" style={{ y: translateY }}>
        <motion.div
          variants={worldMotionVariants.relic}
          initial="initial"
          animate="enter"
          exit="exit"
          whileHover={disabled ? undefined : 'hover'}
          whileTap={disabled ? undefined : 'tap'}
          className={`relative inline-flex select-none items-center justify-center overflow-hidden rounded-2xl border border-violet-500/10 bg-[#16141F]/90 p-4 text-slate-100 backdrop-blur-xl [transform-style:preserve-3d] [will-change:transform,filter] ${disabled ? 'pointer-events-none opacity-60' : 'cursor-pointer'} ${className}`}
          role={disabled ? 'img' : 'button'}
          tabIndex={disabled ? -1 : 0}
          onPointerEnter={handlePointerEnter}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          style={{ rotateX, rotateY, scale, filter: glowFilter, boxShadow: ambientShadow }}
        >
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-violet-500/22 via-transparent to-orange-500/16 blur-xl"
            style={{ opacity: orangeAuraOpacity }}
          />

          <span aria-hidden="true" className="pointer-events-none absolute inset-px rounded-2xl bg-[linear-gradient(135deg,rgba(139,92,246,0.14),transparent_42%,rgba(249,115,22,0.10))]" />
          <span aria-hidden="true" className="pointer-events-none absolute left-3 right-3 top-0 h-px bg-gradient-to-r from-transparent via-violet-300/35 to-transparent" />
          <span className="relative z-10 [transform:translateZ(28px)]">{children}</span>
        </motion.div>

        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-5 left-1/2 h-6 w-4/5 -translate-x-1/2 rounded-full bg-black blur-2xl"
          style={{ x: floorShadowX, opacity: floorShadowOpacity, scaleX: floorShadowScale }}
        />
      </motion.div>
    </motion.div>
  )
}

export const WorldFloatingRelic = memo(WorldFloatingRelicComponent)
WorldFloatingRelic.displayName = 'WorldFloatingRelic'

export default WorldFloatingRelic
