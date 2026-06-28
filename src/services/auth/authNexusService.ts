import type { AuthChangeEvent, Session } from '@supabase/supabase-js'
import { cmsSupabaseClient, isCmsSupabaseConfigured, type CmsSupabaseClient } from '../cms/supabaseClient'
import {
  DEFAULT_GUEST_PROFILE,
  createAuthorizedSession,
  type ProfileRow,
  type XethkiozAuthorizedSession,
} from './authSchema'
import type { PortalEventBusLike } from '../../engines/world/sandbox/portalEventContracts'

export interface AuthNexusServiceOptions {
  readonly client?: CmsSupabaseClient
  readonly eventBus?: PortalEventBusLike
  readonly now?: () => number
}

export interface AuthCredentials {
  readonly email: string
  readonly password: string
}

export type AuthSessionListener = (session: XethkiozAuthorizedSession | null) => void
export type AuthErrorListener = (error: Error) => void

export class AuthNexusService {
  private readonly client: CmsSupabaseClient
  private readonly eventBus: PortalEventBusLike | null
  private readonly now: () => number
  private readonly listeners = new Set<AuthSessionListener>()
  private readonly errorListeners = new Set<AuthErrorListener>()
  private currentSession: XethkiozAuthorizedSession | null = null
  private authSubscription: { unsubscribe: () => void } | null = null

  constructor(options: AuthNexusServiceOptions = {}) {
    this.client = options.client ?? cmsSupabaseClient
    this.eventBus = options.eventBus ?? null
    this.now = options.now ?? (() => performance.now())
  }

  getSnapshot(): XethkiozAuthorizedSession | null {
    return this.currentSession
  }

  startAuthStateListener(): () => void {
    if (!isCmsSupabaseConfigured) {
      this.publishSession(null)
      return () => undefined
    }

    if (this.authSubscription) {
      return () => this.stopAuthStateListener()
    }

    const { data } = this.client.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      void this.handleAuthStateChange(event, session)
    })

    this.authSubscription = data.subscription
    return () => this.stopAuthStateListener()
  }

  stopAuthStateListener(): void {
    this.authSubscription?.unsubscribe()
    this.authSubscription = null
  }

  onChange(listener: AuthSessionListener): () => void {
    this.listeners.add(listener)
    listener(this.currentSession)
    return () => this.listeners.delete(listener)
  }

  onError(listener: AuthErrorListener): () => void {
    this.errorListeners.add(listener)
    return () => this.errorListeners.delete(listener)
  }

  async hydrateCurrentSession(): Promise<XethkiozAuthorizedSession | null> {
    if (!isCmsSupabaseConfigured) {
      this.publishSession(null)
      return null
    }

    const { data, error } = await this.client.auth.getSession()
    if (error) {
      const wrapped = new Error(`[AuthNexusService] Session hydrate failed: ${error.message}`)
      this.publishError(wrapped)
      throw wrapped
    }

    const session = data.session ? await this.authorizeSupabaseSession(data.session) : null
    this.publishSession(session)
    return session
  }

  async signIn(credentials: AuthCredentials): Promise<XethkiozAuthorizedSession> {
    const { data, error } = await this.client.auth.signInWithPassword(credentials)
    if (error || !data.session) {
      const wrapped = new Error(`[AuthNexusService] Login failed: ${error?.message ?? 'Missing session'}`)
      this.publishError(wrapped)
      throw wrapped
    }

    const session = await this.authorizeSupabaseSession(data.session)
    this.publishSession(session)
    return session
  }

  async signUp(credentials: AuthCredentials): Promise<XethkiozAuthorizedSession | null> {
    const { data, error } = await this.client.auth.signUp(credentials)
    if (error) {
      const wrapped = new Error(`[AuthNexusService] Register failed: ${error.message}`)
      this.publishError(wrapped)
      throw wrapped
    }

    const session = data.session ? await this.authorizeSupabaseSession(data.session) : null
    this.publishSession(session)
    return session
  }

  async signOut(): Promise<void> {
    const { error } = await this.client.auth.signOut()
    if (error) {
      const wrapped = new Error(`[AuthNexusService] Sign out failed: ${error.message}`)
      this.publishError(wrapped)
      throw wrapped
    }
    this.publishSession(null)
  }


  private async handleAuthStateChange(event: AuthChangeEvent, session: Session | null): Promise<void> {
    if (event === 'SIGNED_OUT' || !session) {
      this.publishSession(null)
      return
    }

    if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED' || event === 'INITIAL_SESSION') {
      try {
        const authorizedSession = await this.authorizeSupabaseSession(session)
        this.publishSession(authorizedSession)
      } catch (error) {
        const wrapped = error instanceof Error ? error : new Error(String(error))
        this.publishError(wrapped)
      }
    }
  }

  private async authorizeSupabaseSession(session: Session): Promise<XethkiozAuthorizedSession> {
    const profile = await this.ensureProfile(session.user.id)
    return createAuthorizedSession({
      userId: session.user.id,
      email: session.user.email ?? null,
      subscriptionTier: profile.subscription_tier,
      role: profile.role,
      now: this.now,
    })
  }

  private async ensureProfile(userId: string): Promise<ProfileRow> {
    const { data, error } = await this.client.from('profiles').select('*').eq('id', userId).maybeSingle()

    if (data) return data
    if (error) {
      const wrapped = new Error(`[AuthNexusService] Profile read failed: ${error.message}`)
      this.publishError(wrapped)
      throw wrapped
    }

    // The canonical creation path is the Supabase handle_new_user trigger.
    // If the profile is temporarily absent because of replication/timing, do
    // not attempt a privilege-bearing client write here. Fall back to BASIC/GUEST
    // for this client session and let the database trigger/admin repair source of truth.
    const timestamp = new Date().toISOString()
    return Object.freeze({
      id: userId,
      subscription_tier: DEFAULT_GUEST_PROFILE.subscription_tier,
      role: DEFAULT_GUEST_PROFILE.role,
      created_at: timestamp,
      updated_at: timestamp,
    } satisfies ProfileRow)
  }

  private publishSession(session: XethkiozAuthorizedSession | null): void {
    this.currentSession = session
    if (session) {
      try {
        this.eventBus?.emit?.('USER_SESSION_AUTHORIZED', session)
        this.eventBus?.dispatch?.({ type: 'USER_SESSION_AUTHORIZED', payload: session })
      } catch (error) {
        console.error('[AuthNexusService] Failed to publish USER_SESSION_AUTHORIZED', error)
      }
    }
    this.listeners.forEach((listener) => listener(session))
  }

  private publishError(error: Error): void {
    console.error(error)
    this.errorListeners.forEach((listener) => listener(error))
  }
}

export const authNexusService = new AuthNexusService()
