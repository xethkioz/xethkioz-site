// src/design/designTokens.ts
// XETHKIOZ Fusion Platform — Global Design Tokens
// Single source of truth for the official mystical palette, neon glows,
// motion presets, Wisp cycles, Avatar transitions and shared surface rules.

export const cyberAnimations = {
  wisp: {
    idle: 'animate-[pulse_3s_infinite_ease-in-out]',
    watching: 'animate-[pulse_2s_infinite_ease-in-out] filter saturate-150',
    greenMode: 'animate-[ping_1.5s_infinite_cubic-bezier(0,0,0.2,1)] scale-110',
    override: 'animate-[ping_1.5s_infinite_cubic-bezier(0,0,0.2,1)] scale-110',
  },
  portals: {
    pulse: 'transition-all duration-500 ease-out hover:scale-[1.02]',
    glitch: 'hover:animate-[pulse_0.5s_infinite_ease-in-out]',
    stable: 'transition-all duration-300 ease-out hover:scale-[1.01]',
  },
  avatar: {
    transition: 'transition-all duration-500 ease-out hover:scale-[1.03]',
    heroic: 'transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]',
    glitch: 'animate-pulse opacity-70',
  },
} as const

export const designTokens = {
  colors: {
    fusionBg: '#050608',
    fusionSurface: {
      DEFAULT: '#0F1118',
      base: '#0F1118',
      muted: '#1A1D26',
      glow: '#242836',
      panel: '#16141F',
      glass: 'rgba(15,17,24,0.74)',
    },
    fusionAccent: {
      // Domain colors
      gaming: '#8A2EFF',
      fun: '#FF7A00',
      science: '#3B82F6',
      greenNode: '#32FF8A',
      secret: '#EAB308',
      alert: '#EF4444',

      // Compatibility aliases used by current Tailwind class names.
      techPrimary: '#8A2EFF',
      techSecondary: '#FF7A00',

      // Text identity
      textPrimary: '#F5F7FA',
      textSecondary: '#9CA3AF',
    },
    status: {
      online: '#32FF8A',
      offline: '#6B7280',
      loading: '#3B82F6',
      warning: '#FF7A00',
      error: '#EF4444',
      success: '#32FF8A',
      locked: '#EAB308',
    },
  },
  glow: {
    gaming: '0 0 20px rgba(138, 46, 255, 0.35)',
    fun: '0 0 20px rgba(255, 122, 0, 0.35)',
    science: '0 0 20px rgba(59, 130, 246, 0.35)',
    green: '0 0 25px rgba(50, 255, 138, 0.5)',
    secret: '0 0 20px rgba(234, 179, 8, 0.24)',
    action: '0 0 20px rgba(255, 122, 0, 0.35)',
    tech: '0 0 20px rgba(138, 46, 255, 0.35)',
    panel: '0 0 34px rgba(138, 46, 255, 0.12)',
  },
  radius: {
    hud: '4px',
    panel: '8px',
    portal: '14px',
    avatar: '10px',
  },
  blur: {
    cyber: '8px',
    portal: '14px',
    gateway: '18px',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  typography: {
    display: 'font-display font-black uppercase tracking-[0.12em]',
    title: 'font-bold uppercase tracking-[0.08em]',
    body: 'font-sans leading-relaxed',
    mono: 'font-mono uppercase tracking-[0.18em]',
    caption: 'font-mono text-xs uppercase tracking-[0.22em]',
  },
  motion: {
    instant: 'all 0.08s ease-out',
    fast: 'all 0.15s ease-out',
    smooth: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    portal: 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.25s ease, box-shadow 0.25s ease',
    wisp: 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.25s ease',
    avatar: 'transform 0.5s ease-out, opacity 0.3s ease-out',
    gateway: 'opacity 1s ease-in-out, backdrop-filter 1s ease-in-out',
  },
  animations: {
    ...cyberAnimations,
    // Flat aliases for components/scripts that need direct string access.
    wispIdle: cyberAnimations.wisp.idle,
    wispWatching: cyberAnimations.wisp.watching,
    wispOverride: cyberAnimations.wisp.override,
    avatarTransition: cyberAnimations.avatar.transition,
  },
  shadow: {
    panel: '0 12px 40px rgba(0, 0, 0, 0.32)',
    portal: '0 0 34px rgba(138, 46, 255, 0.16)',
    hud: '0 8px 28px rgba(0, 0, 0, 0.42)',
    modal: '0 20px 80px rgba(0, 0, 0, 0.55)',
    avatar: '0 0 22px rgba(138, 46, 255, 0.2)',
  },
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
export type FusionStatusKey = keyof typeof designTokens.colors.status
export type CyberAnimationTokens = typeof cyberAnimations
