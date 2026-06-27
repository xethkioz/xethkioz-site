export const cyberAnimations = {
  wisp: {
    idle: 'animate-[pulse_3s_infinite_ease-in-out]',
    watching: 'animate-[pulse_2s_infinite_ease-in-out] filter saturate-150',
    greenMode: 'animate-[ping_1.5s_infinite_cubic-bezier(0,0,0.2,1)] scale-110',
  },
  portals: {
    pulse: 'transition-all duration-500 ease-out hover:scale-[1.02]',
    glitch: 'hover:animate-[pulse_0.5s_infinite_ease-in-out]',
  },
  avatar: {
    transition: 'transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]',
  },
} as const

export const designTokens = {
  colors: {
    fusionBg: '#050505',
    fusionSurface: {
      DEFAULT: '#0f0f12',
      muted: '#141418',
      glow: '#1a1a24',
      panel: '#16141F',
    },
    fusionAccent: {
      techPrimary: '#8b5cf6',
      techSecondary: '#f97316',
      science: '#3b82f6',
      greenNode: '#22c55e',
      alert: '#ef4444',
      secret: '#eab308',
    },
    status: {
      online: '#22c55e',
      offline: '#6b7280',
      warning: '#f97316',
      error: '#ef4444',
      success: '#22c55e',
      locked: '#eab308',
    },
  },
  glow: {
    tech: '0 0 15px rgba(139, 92, 246, 0.25)',
    science: '0 0 15px rgba(59, 130, 246, 0.25)',
    green: '0 0 15px rgba(34, 197, 94, 0.35)',
    secret: '0 0 20px rgba(234, 179, 8, 0.2)',
    action: '0 0 15px rgba(249, 115, 22, 0.25)',
  },
  radius: {
    hud: '4px',
    panel: '8px',
    portal: '14px',
  },
  blur: {
    cyber: '8px',
    portal: '14px',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  motion: {
    fast: 'all 0.15s ease-out',
    smooth: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    portal: 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.25s ease, box-shadow 0.25s ease',
    wisp: 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.25s ease',
  },
  animations: cyberAnimations,
  zIndex: {
    background: 0,
    content: 10,
    portal: 20,
    hud: 100,
    modal: 500,
    notification: 900,
    debug: 9999,
  },
} as const

export type DesignTokens = typeof designTokens
export type FusionAccentKey = keyof typeof designTokens.colors.fusionAccent
export type CyberAnimationTokens = typeof cyberAnimations
