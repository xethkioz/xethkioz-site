import { supabase, isSupabaseConfigured } from '../../services/supabaseClient'
import type { AvatarPoseId } from './AvatarRenderer'

export type RpgActionId = 'walk' | 'fight_dragon' | 'forge' | 'magic' | 'fish'

export interface UserProfile {
  id: string
  username: string | null
  display_name: string | null
  avatar_url: string | null
  xp: number
  level: number
  role: string
  language: 'es' | 'en'
  created_at: string
  updated_at: string
}

export interface UserAvatarState {
  id: string
  user_id: string
  current_pose: AvatarPoseId
  unlocked_poses: number[]
  skin_id: string
  equipped_items: Record<string, unknown>
  animation_state: string
  last_action: string | null
  created_at: string
  updated_at: string
}

export interface ProgressUpdateResult {
  profile: UserProfile
  avatarState: UserAvatarState | null
  xpAdded: number
  leveledUp: boolean
  previousLevel: number
  nextLevel: number
}

export interface EngineResult<T> {
  data: T | null
  error: string | null
}

const XP_PER_LEVEL = 100
const MIN_XP_REWARD = 1
const MAX_XP_REWARD = 500

const RPG_ACTION_REWARDS: Record<RpgActionId, { xp: number; pose: AvatarPoseId; animationState: string }> = {
  walk: { xp: 5, pose: 1, animationState: 'exploring' },
  fight_dragon: { xp: 35, pose: 4, animationState: 'combat' },
  forge: { xp: 25, pose: 8, animationState: 'forging' },
  magic: { xp: 30, pose: 12, animationState: 'casting' },
  fish: { xp: 10, pose: 20, animationState: 'fishing' },
}

const normalizeXpReward = (amount: number): number => {
  if (!Number.isFinite(amount)) return MIN_XP_REWARD
  return Math.max(MIN_XP_REWARD, Math.min(MAX_XP_REWARD, Math.floor(amount)))
}

const calculateLevel = (xp: number): number => Math.max(1, Math.floor(xp / XP_PER_LEVEL) + 1)

const resolveUserId = async (providedUserId?: string): Promise<EngineResult<string>> => {
  if (providedUserId) {
    return { data: providedUserId, error: null }
  }

  const { data, error } = await supabase.auth.getUser()

  if (error || !data.user?.id) {
    return {
      data: null,
      error: error?.message ?? 'No hay usuario autenticado para ProfileEngine.',
    }
  }

  return { data: data.user.id, error: null }
}

const persistWispLog = async (userId: string, eventType: string, details: Record<string, unknown>) => {
  await supabase.from('wisp_logs').insert({
    user_id: userId,
    event_type: eventType,
    wisp_state: 'CONNECTED',
    details,
  })
}

export const ProfileEngine = {
  xpPerLevel: XP_PER_LEVEL,
  actionRewards: RPG_ACTION_REWARDS,

  async getProfile(userId?: string): Promise<EngineResult<UserProfile>> {
    if (!isSupabaseConfigured) {
      return {
        data: null,
        error: 'Supabase no está configurado. Revisar VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.',
      }
    }

    const resolved = await resolveUserId(userId)
    if (!resolved.data) return { data: null, error: resolved.error }

    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, display_name, avatar_url, xp, level, role, language, created_at, updated_at')
      .eq('id', resolved.data)
      .single<UserProfile>()

    if (error) {
      return { data: null, error: error.message }
    }

    return { data, error: null }
  },

  async getAvatarState(userId?: string): Promise<EngineResult<UserAvatarState>> {
    if (!isSupabaseConfigured) {
      return {
        data: null,
        error: 'Supabase no está configurado. Revisar VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.',
      }
    }

    const resolved = await resolveUserId(userId)
    if (!resolved.data) return { data: null, error: resolved.error }

    const { data, error } = await supabase
      .from('user_avatar_state')
      .select('id, user_id, current_pose, unlocked_poses, skin_id, equipped_items, animation_state, last_action, created_at, updated_at')
      .eq('user_id', resolved.data)
      .single<UserAvatarState>()

    if (error) {
      return { data: null, error: error.message }
    }

    return { data, error: null }
  },

  async addXp(userId: string, amount: number): Promise<EngineResult<ProgressUpdateResult>> {
    return this.updateProgress(userId, normalizeXpReward(amount))
  },

  async updateProgress(
    userId: string,
    amount: number,
    actionId?: RpgActionId
  ): Promise<EngineResult<ProgressUpdateResult>> {
    if (!isSupabaseConfigured) {
      return {
        data: null,
        error: 'Supabase no está configurado. Revisar VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.',
      }
    }

    const xpAdded = normalizeXpReward(amount)

    const { data: currentProfile, error: readError } = await supabase
      .from('profiles')
      .select('id, username, display_name, avatar_url, xp, level, role, language, created_at, updated_at')
      .eq('id', userId)
      .single<UserProfile>()

    if (readError || !currentProfile) {
      return { data: null, error: readError?.message ?? 'No se pudo cargar el perfil.' }
    }

    const previousLevel = currentProfile.level
    const nextXp = currentProfile.xp + xpAdded
    const nextLevel = calculateLevel(nextXp)

    const { data: updatedProfile, error: updateError } = await supabase
      .from('profiles')
      .update({ xp: nextXp, level: nextLevel })
      .eq('id', userId)
      .select('id, username, display_name, avatar_url, xp, level, role, language, created_at, updated_at')
      .single<UserProfile>()

    if (updateError || !updatedProfile) {
      return { data: null, error: updateError?.message ?? 'No se pudo actualizar el progreso.' }
    }

    let avatarState: UserAvatarState | null = null
    const reward = actionId ? RPG_ACTION_REWARDS[actionId] : null

    if (reward) {
      const { data: updatedAvatarState } = await supabase
        .from('user_avatar_state')
        .upsert(
          {
            user_id: userId,
            current_pose: reward.pose,
            animation_state: reward.animationState,
            last_action: actionId,
          },
          { onConflict: 'user_id' }
        )
        .select('id, user_id, current_pose, unlocked_poses, skin_id, equipped_items, animation_state, last_action, created_at, updated_at')
        .single<UserAvatarState>()

      avatarState = updatedAvatarState ?? null
    }

    await persistWispLog(userId, 'profile_progress_updated', {
      actionId: actionId ?? null,
      xpAdded,
      previousXp: currentProfile.xp,
      nextXp,
      previousLevel,
      nextLevel,
    })

    return {
      data: {
        profile: updatedProfile,
        avatarState,
        xpAdded,
        leveledUp: nextLevel > previousLevel,
        previousLevel,
        nextLevel,
      },
      error: null,
    }
  },

  async completeRpgAction(userId: string, actionId: RpgActionId): Promise<EngineResult<ProgressUpdateResult>> {
    const reward = RPG_ACTION_REWARDS[actionId]
    return this.updateProgress(userId, reward.xp, actionId)
  },
}

export default ProfileEngine
