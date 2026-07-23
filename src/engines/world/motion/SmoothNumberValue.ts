import { useEffect, useRef } from 'react'

export type NumericValueListener = (value: number) => void

export type SmoothNumberConfig = {
  stiffness: number
  damping: number
  mass: number
  precision?: number
  immediate?: boolean
}

export interface NumericMotionValue {
  get: () => number
  getVelocity: () => number
  set: (value: number) => void
  jump: (value: number) => void
  on: (event: 'change', listener: NumericValueListener) => () => void
  stop: () => void
  isAnimating: () => boolean
  destroy: () => void
}

const DEFAULT_PRECISION = 0.001
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

function prefersReducedMotion() {
  return typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia(REDUCED_MOTION_QUERY).matches
}

class SpringNumberValue implements NumericMotionValue {
  private current: number
  private target: number
  private velocity = 0
  private frame: number | null = null
  private previousTimestamp = 0
  private readonly listeners = new Set<NumericValueListener>()
  private reducedMotionQuery: MediaQueryList | null = null

  constructor(initial: number, private readonly config: SmoothNumberConfig) {
    this.current = initial
    this.target = initial

    if (
      !config.immediate
      && typeof window !== 'undefined'
      && typeof window.matchMedia === 'function'
    ) {
      this.reducedMotionQuery = window.matchMedia(REDUCED_MOTION_QUERY)
      this.reducedMotionQuery.addEventListener('change', this.handleReducedMotionChange)
    }
  }

  get = () => this.current

  getVelocity = () => this.velocity

  isAnimating = () => this.frame !== null

  on = (event: 'change', listener: NumericValueListener) => {
    if (event !== 'change') return () => undefined
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  set = (next: number) => {
    if (!Number.isFinite(next)) return
    this.target = next

    if (
      this.config.immediate
      || typeof window === 'undefined'
      || typeof window.requestAnimationFrame !== 'function'
      || this.reducedMotionQuery?.matches
      || prefersReducedMotion()
    ) {
      this.jump(next)
      return
    }

    if (Math.abs(this.target - this.current) <= (this.config.precision ?? DEFAULT_PRECISION)) {
      this.jump(next)
      return
    }

    if (this.frame === null) {
      this.previousTimestamp = 0
      this.frame = window.requestAnimationFrame(this.step)
    }
  }

  jump = (next: number) => {
    if (!Number.isFinite(next)) return
    this.stop()
    this.current = next
    this.target = next
    this.velocity = 0
    this.notify()
  }

  stop = () => {
    if (this.frame !== null && typeof window !== 'undefined') window.cancelAnimationFrame(this.frame)
    this.frame = null
    this.previousTimestamp = 0
  }

  destroy = () => {
    this.reducedMotionQuery?.removeEventListener('change', this.handleReducedMotionChange)
    this.reducedMotionQuery = null
    this.stop()
    this.listeners.clear()
  }

  private handleReducedMotionChange = (event: MediaQueryListEvent) => {
    if (event.matches) this.jump(this.target)
  }

  private notify() {
    this.listeners.forEach((listener) => listener(this.current))
  }

  private step = (timestamp: number) => {
    if (!this.previousTimestamp) this.previousTimestamp = timestamp
    const deltaSeconds = Math.min(0.032, Math.max(0.001, (timestamp - this.previousTimestamp) / 1000))
    this.previousTimestamp = timestamp

    const displacement = this.target - this.current
    const springForce = displacement * this.config.stiffness
    const dampingForce = -this.velocity * this.config.damping
    const acceleration = (springForce + dampingForce) / Math.max(0.001, this.config.mass)

    this.velocity += acceleration * deltaSeconds
    this.current += this.velocity * deltaSeconds
    this.notify()

    const precision = this.config.precision ?? DEFAULT_PRECISION
    if (Math.abs(this.target - this.current) <= precision && Math.abs(this.velocity) <= precision) {
      this.current = this.target
      this.velocity = 0
      this.frame = null
      this.previousTimestamp = 0
      this.notify()
      return
    }

    this.frame = window.requestAnimationFrame(this.step)
  }
}

export function createSmoothNumberValue(initial: number, config: SmoothNumberConfig): NumericMotionValue {
  return new SpringNumberValue(initial, config)
}

export function useSmoothNumberValue(initial: number, config: SmoothNumberConfig): NumericMotionValue {
  const valueRef = useRef<NumericMotionValue | null>(null)
  if (!valueRef.current) valueRef.current = createSmoothNumberValue(initial, config)

  useEffect(() => () => valueRef.current?.destroy(), [])
  return valueRef.current
}
