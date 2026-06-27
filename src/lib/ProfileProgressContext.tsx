import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

interface FusionProfile {
  alias: string
  role: string
  favoritePortal: string
}

interface ProfileProgressContextType {
  profile: FusionProfile
  completedMissionIds: string[]
  xp: number
  level: number
  setFavoritePortal: (portal: string) => void
  toggleMission: (missionId: string, rewardXp: number) => void
}

const STORAGE_KEY = 'xethkioz.fusion.profile.v1'
const MISSIONS_KEY = 'xethkioz.fusion.missions.v1'

const defaultProfile: FusionProfile = {
  alias: 'XETHKIOZ Guest',
  role: 'Explorer',
  favoritePortal: 'core',
}

const ProfileProgressContext = createContext<ProfileProgressContextType | undefined>(undefined)

function readProfile() {
  if (typeof window === 'undefined') return defaultProfile
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    return saved ? { ...defaultProfile, ...JSON.parse(saved) } : defaultProfile
  } catch {
    return defaultProfile
  }
}

function readCompletedMissions() {
  if (typeof window === 'undefined') return []
  try {
    const saved = window.localStorage.getItem(MISSIONS_KEY)
    const parsed = saved ? JSON.parse(saved) : []
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string') : []
  } catch {
    return []
  }
}

export function ProfileProgressProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<FusionProfile>(readProfile)
  const [completedMissionIds, setCompletedMissionIds] = useState<string[]>(readCompletedMissions)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
  }, [profile])

  useEffect(() => {
    window.localStorage.setItem(MISSIONS_KEY, JSON.stringify(completedMissionIds))
  }, [completedMissionIds])

  const xp = completedMissionIds.length * 75
  const level = Math.max(1, Math.floor(xp / 150) + 1)

  const value = useMemo<ProfileProgressContextType>(() => ({
    profile,
    completedMissionIds,
    xp,
    level,
    setFavoritePortal: (portal: string) => setProfile((current) => ({ ...current, favoritePortal: portal })),
    toggleMission: (missionId: string) => {
      setCompletedMissionIds((current) => (
        current.includes(missionId)
          ? current.filter((id) => id !== missionId)
          : [...current, missionId]
      ))
    },
  }), [profile, completedMissionIds, xp, level])

  return <ProfileProgressContext.Provider value={value}>{children}</ProfileProgressContext.Provider>
}

export function useProfileProgress() {
  const ctx = useContext(ProfileProgressContext)
  if (!ctx) throw new Error('useProfileProgress must be used inside ProfileProgressProvider')
  return ctx
}
