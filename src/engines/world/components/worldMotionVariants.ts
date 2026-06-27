import type { Variants } from 'framer-motion'

/**
 * Shared motion variants for the Alpha 3.0 Visual Experience Engine.
 *
 * Current repository dependency: framer-motion.
 * Target migration: replace imports with `motion/react` once the `motion` package
 * is installed and approved in the dependency policy.
 */
export const worldMotionVariants = {
  stage: {
    initial: {
      opacity: 0,
      y: 28,
      scale: 0.985,
      filter: 'blur(14px)',
    },
    enter: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 0.72,
        ease: [0.16, 1, 0.3, 1],
        when: 'beforeChildren',
        staggerChildren: 0.08,
      },
    },
    exit: {
      opacity: 0,
      y: -18,
      scale: 0.99,
      filter: 'blur(10px)',
      transition: {
        duration: 0.28,
        ease: 'easeIn',
      },
    },
  } satisfies Variants,

  cinematicItem: {
    initial: {
      opacity: 0,
      y: 16,
      scale: 0.96,
      filter: 'blur(8px)',
    },
    enter: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.98,
      filter: 'blur(8px)',
      transition: {
        duration: 0.2,
        ease: 'easeIn',
      },
    },
  } satisfies Variants,

  wispCore: {
    idle: {
      y: [0, -12, 0],
      scale: [1, 1.06, 1],
      opacity: [0.82, 1, 0.82],
      rotate: [0, 1.5, -1.5, 0],
      transition: {
        duration: 3.4,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
    focus: {
      y: [0, -8, 0],
      scale: [1.04, 1.14, 1.04],
      opacity: [0.9, 1, 0.9],
      rotate: [0, 4, -4, 0],
      transition: {
        duration: 1.9,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
    surge: {
      y: [0, -18, 0],
      scale: [1.08, 1.24, 1.08],
      opacity: [0.95, 1, 0.95],
      rotate: [0, 8, -8, 0],
      transition: {
        duration: 1.15,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  } satisfies Variants,

  relic: {
    initial: {
      opacity: 0,
      y: 20,
      scale: 0.82,
      rotateZ: -4,
      filter: 'drop-shadow(0 0 0 rgba(138,46,255,0))',
    },
    enter: {
      opacity: 1,
      y: [0, -10, 0],
      scale: 1,
      rotateZ: [-1.2, 1.2, -1.2],
      filter: [
        'drop-shadow(0 0 10px rgba(138,46,255,.4))',
        'drop-shadow(0 0 24px rgba(255,122,0,.55))',
        'drop-shadow(0 0 10px rgba(138,46,255,.4))',
      ],
      transition: {
        opacity: { duration: 0.34, ease: 'easeOut' },
        scale: { duration: 0.34, ease: 'easeOut' },
        y: { duration: 4.6, repeat: Infinity, ease: 'easeInOut' },
        rotateZ: { duration: 5.2, repeat: Infinity, ease: 'easeInOut' },
        filter: { duration: 2.8, repeat: Infinity, ease: 'easeInOut' },
      },
    },
    exit: {
      opacity: 0,
      y: -12,
      scale: 0.94,
      filter: 'drop-shadow(0 0 0 rgba(138,46,255,0))',
      transition: { duration: 0.22, ease: 'easeIn' },
    },
    hover: {
      scale: 1.08,
      y: -14,
      rotateZ: 0,
      filter: 'drop-shadow(0 0 32px rgba(255,122,0,.75))',
      transition: { duration: 0.26, ease: 'easeOut' },
    },
    tap: {
      scale: 0.96,
      transition: { duration: 0.12, ease: 'easeOut' },
    },
  } satisfies Variants,

  lightTrail: {
    initial: {
      opacity: 0,
      scaleX: 0,
      x: -32,
    },
    enter: {
      opacity: [0, 0.75, 0],
      scaleX: [0, 1, 0],
      x: [-32, 32, 72],
      transition: {
        duration: 2.6,
        repeat: Infinity,
        repeatDelay: 0.9,
        ease: 'easeInOut',
      },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.15 },
    },
  } satisfies Variants,

  interactiveHover: {
    rest: {
      scale: 1,
      rotateX: 0,
      rotateY: 0,
    },
    hover: {
      scale: 1.045,
      rotateX: 2,
      rotateY: -3,
      transition: { duration: 0.25, ease: 'easeOut' },
    },
    tap: {
      scale: 0.97,
      rotateX: 0,
      rotateY: 0,
      transition: { duration: 0.12, ease: 'easeOut' },
    },
  } satisfies Variants,
} as const

export type WorldMotionVariantKey = keyof typeof worldMotionVariants
export type WispMotionState = keyof typeof worldMotionVariants.wispCore
