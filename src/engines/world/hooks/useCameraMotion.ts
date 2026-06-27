import { useCallback, useMemo } from "react";
import {
  type MotionValue,
  motionValue,
  useSpring,
  useTransform,
} from "framer-motion";

export type CameraMotionConfig = {
  /**
   * Spring stiffness for the global camera motion.
   * Higher values react faster.
   */
  stiffness?: number;

  /**
   * Spring damping for cinematic smoothing.
   * Higher values reduce oscillation.
   */
  damping?: number;

  /**
   * Spring mass for subtle premium camera inertia.
   */
  mass?: number;

  /**
   * Hard clamp for normalized pointer coordinates.
   * Default keeps values between -1 and 1.
   */
  clamp?: number;
};

export type CameraParallaxLayer = "backdrop" | "fog" | "wisp" | "relic" | "avatar" | "hud";

export type CameraMotionController = {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  smoothMouseX: MotionValue<number>;
  smoothMouseY: MotionValue<number>;
  setPointerFromEvent: (event: React.PointerEvent<HTMLElement>) => void;
  resetPointer: () => void;
  getParallaxStyle: (
    layer: CameraParallaxLayer,
    factor?: number
  ) => {
    x: MotionValue<number>;
    y: MotionValue<number>;
  };
};

const DEFAULT_CONFIG: Required<CameraMotionConfig> = {
  stiffness: 90,
  damping: 26,
  mass: 0.8,
  clamp: 1,
};

const DEFAULT_LAYER_FACTORS: Record<CameraParallaxLayer, number> = {
  backdrop: -8,
  fog: -14,
  wisp: 18,
  relic: 26,
  avatar: 34,
  hud: 4,
};

const clampValue = (value: number, limit: number) => {
  return Math.max(-limit, Math.min(limit, value));
};

/**
 * Camera Engine Foundation.
 *
 * Centralizes normalized pointer coordinates as MotionValues.
 * Updating the pointer does not trigger React re-renders; Framer Motion
 * pushes changes directly to animated nodes.
 */
export function useCameraMotion(config: CameraMotionConfig = {}): CameraMotionController {
  const resolvedConfig = useMemo(
    () => ({
      ...DEFAULT_CONFIG,
      ...config,
    }),
    [config]
  );

  const mouseX = useMemo(() => motionValue(0), []);
  const mouseY = useMemo(() => motionValue(0), []);

  const smoothMouseX = useSpring(mouseX, {
    stiffness: resolvedConfig.stiffness,
    damping: resolvedConfig.damping,
    mass: resolvedConfig.mass,
  });

  const smoothMouseY = useSpring(mouseY, {
    stiffness: resolvedConfig.stiffness,
    damping: resolvedConfig.damping,
    mass: resolvedConfig.mass,
  });

  const setPointerFromEvent = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      const rect = event.currentTarget.getBoundingClientRect();

      if (rect.width === 0 || rect.height === 0) {
        return;
      }

      const localX = event.clientX - rect.left;
      const localY = event.clientY - rect.top;

      const normalizedX = (localX / rect.width) * 2 - 1;
      const normalizedY = (localY / rect.height) * 2 - 1;

      mouseX.set(clampValue(normalizedX, resolvedConfig.clamp));
      mouseY.set(clampValue(normalizedY, resolvedConfig.clamp));
    },
    [mouseX, mouseY, resolvedConfig.clamp]
  );

  const resetPointer = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  const getParallaxStyle = useCallback(
    (layer: CameraParallaxLayer, factor?: number) => {
      const resolvedFactor = factor ?? DEFAULT_LAYER_FACTORS[layer];

      return {
        x: useTransform(smoothMouseX, [-1, 1], [-resolvedFactor, resolvedFactor]),
        y: useTransform(smoothMouseY, [-1, 1], [-resolvedFactor, resolvedFactor]),
      };
    },
    [smoothMouseX, smoothMouseY]
  );

  return {
    mouseX,
    mouseY,
    smoothMouseX,
    smoothMouseY,
    setPointerFromEvent,
    resetPointer,
    getParallaxStyle,
  };
}
