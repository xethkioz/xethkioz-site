import type { PointerEvent } from 'react'
import { useCallback } from 'react'
import { type MotionValue, useMotionValue, useSpring } from 'framer-motion'
import { worldTransitions } from '../components/worldMotionVariants'

export type WorldCameraMotion = {
  mouseX: MotionValue<number>
  mouseY: MotionValue<number>
  smoothX: MotionValue<number>
  smoothY: MotionValue<number>
  /** Backward-compatible aliases for previous camera draft patches. */
  smoothMouseX: MotionValue<number>
  smoothMouseY: MotionValue<number>
  setPointerFromEvent: (event: PointerEvent<HTMLElement>) => void
  resetPointer: () => void
}

const clampNormalized = (value: number) => Math.max(-1, Math.min(1, value))

/**
 * Alpha 3.0 / Sprint E — Camera Engine.
 *
 * Centralizes normalized pointer coordinates using Framer MotionValues.
 * Pointer updates do not use React state, so the visual parallax pipeline can
 * run on animated style bindings without forcing React re-renders.
 */
export function useCameraMotion(): WorldCameraMotion {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const smoothX = useSpring(mouseX, worldTransitions.default)
  const smoothY = useSpring(mouseY, worldTransitions.default)

  const setPointerFromEvent = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      const bounds = event.currentTarget.getBoundingClientRect()

      if (bounds.width <= 0 || bounds.height <= 0) return

      const relativeX = (event.clientX - bounds.left) / bounds.width
      const relativeY = (event.clientY - bounds.top) / bounds.height

      mouseX.set(clampNormalized(relativeX * 2 - 1))
      mouseY.set(clampNormalized(relativeY * 2 - 1))
    },
    [mouseX, mouseY],
  )

  const resetPointer = useCallback(() => {
    mouseX.set(0)
    mouseY.set(0)
  }, [mouseX, mouseY])

  return {
    mouseX,
    mouseY,
    smoothX,
    smoothY,
    smoothMouseX: smoothX,
    smoothMouseY: smoothY,
    setPointerFromEvent,
    resetPointer,
  }
}

export default useCameraMotion
