import { useCallback, useRef } from 'react'
import { useMotionValue, useSpring, useTransform, type MotionValue } from 'framer-motion'

export type WorldCameraMotionConfig = {
  disabled?: boolean
  intensity?: number
  spring?: {
    stiffness?: number
    damping?: number
    mass?: number
  }
}

export type WorldCameraMotionApi = {
  stageRef: React.RefObject<HTMLDivElement>
  onPointerMove: React.PointerEventHandler<HTMLDivElement>
  onPointerLeave: React.PointerEventHandler<HTMLDivElement>
  cameraX: MotionValue<number>
  cameraY: MotionValue<number>
  stageRotateX: MotionValue<number>
  stageRotateY: MotionValue<number>
  backdropX: MotionValue<number>
  backdropY: MotionValue<number>
  foregroundX: MotionValue<number>
  foregroundY: MotionValue<number>
  wispDriftX: MotionValue<number>
  wispDriftY: MotionValue<number>
}

const clampUnit = (value: number) => Math.max(-1, Math.min(1, value))

/**
 * Sprint E — Camera Engine foundation.
 *
 * Encapsulates cursor-to-camera math for the World scene without touching data,
 * providers or persistence layers. The hook exposes MotionValues so Backdrop,
 * Wisps, Relics, Avatar and HUD can later consume shared parallax without
 * forcing React re-renders on every pointer movement.
 */
export function useWorldCameraMotion({
  disabled = false,
  intensity = 1,
  spring = {},
}: WorldCameraMotionConfig = {}): WorldCameraMotionApi {
  const stageRef = useRef<HTMLDivElement>(null)

  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)

  const cameraX = useSpring(rawX, {
    stiffness: spring.stiffness ?? 120,
    damping: spring.damping ?? 24,
    mass: spring.mass ?? 0.8,
  })

  const cameraY = useSpring(rawY, {
    stiffness: spring.stiffness ?? 120,
    damping: spring.damping ?? 24,
    mass: spring.mass ?? 0.8,
  })

  const stageRotateX = useTransform(cameraY, [-1, 1], [3.5 * intensity, -3.5 * intensity])
  const stageRotateY = useTransform(cameraX, [-1, 1], [-4.5 * intensity, 4.5 * intensity])

  const backdropX = useTransform(cameraX, [-1, 1], [-14 * intensity, 14 * intensity])
  const backdropY = useTransform(cameraY, [-1, 1], [-10 * intensity, 10 * intensity])

  const foregroundX = useTransform(cameraX, [-1, 1], [18 * intensity, -18 * intensity])
  const foregroundY = useTransform(cameraY, [-1, 1], [12 * intensity, -12 * intensity])

  const wispDriftX = useTransform(cameraX, [-1, 1], [-7 * intensity, 7 * intensity])
  const wispDriftY = useTransform(cameraY, [-1, 1], [-5 * intensity, 5 * intensity])

  const onPointerMove = useCallback<React.PointerEventHandler<HTMLDivElement>>(
    (event) => {
      if (disabled || !stageRef.current) return

      const rect = stageRef.current.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return

      const normalizedX = ((event.clientX - rect.left) / rect.width) * 2 - 1
      const normalizedY = ((event.clientY - rect.top) / rect.height) * 2 - 1

      rawX.set(clampUnit(normalizedX))
      rawY.set(clampUnit(normalizedY))
    },
    [disabled, rawX, rawY],
  )

  const onPointerLeave = useCallback<React.PointerEventHandler<HTMLDivElement>>(() => {
    rawX.set(0)
    rawY.set(0)
  }, [rawX, rawY])

  return {
    stageRef,
    onPointerMove,
    onPointerLeave,
    cameraX,
    cameraY,
    stageRotateX,
    stageRotateY,
    backdropX,
    backdropY,
    foregroundX,
    foregroundY,
    wispDriftX,
    wispDriftY,
  }
}
