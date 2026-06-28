/**
 * XETHKIOZ NEWS CMS contracts.
 *
 * This file is intentionally framework-free: it mirrors the Supabase table shape
 * used by the editorial CMS while staying safe to import from React, tests or
 * isolated data adapters. Keep generated Supabase CLI types as the source of
 * truth when they become available, then map them into these presentation-safe
 * contracts instead of leaking raw database rows across the UI.
 */

import type { ProfileInsert, ProfileRow, ProfileUpdate } from '../auth/authSchema'

export type XethkiozCategorySlug = 'gaming' | 'ia' | 'hardware' | 'science' | 'deals' | 'urgent'

export type XethkiozPortalId =
  | 'xethkioz-main'
  | 'xethkioz-gaming'
  | 'xethkioz-tech'
  | 'xethkioz-science-lab'
  | 'xethkioz-green-node'
  | 'xethkioz-asia-gaming'

export interface ArticleMetrics {
  views: number
  reactions: number
  shares: number
  saves: number
  viralityScore: number
}

export interface ArticleRow {
  id: string
  title: string
  subtitle: string | null
  summary: string
  content_body: string
  main_image: string
  category_id: XethkiozCategorySlug
  portal_id: XethkiozPortalId
  metrics: ArticleMetrics
  release_date: string
  created_at: string
}

export interface CategoryConfigRow {
  id: XethkiozCategorySlug
  name: string
  color_code: `#${string}`
  icon_slug: string
}

export interface CmsNewsDatabase {
  public: {
    Tables: {
      articles: {
        Row: ArticleRow
        Insert: Omit<ArticleRow, 'created_at'> & Partial<Pick<ArticleRow, 'created_at'>>
        Update: Partial<ArticleRow>
        Relationships: []
      }
      categories_config: {
        Row: CategoryConfigRow
        Insert: CategoryConfigRow
        Update: Partial<CategoryConfigRow>
        Relationships: []
      }

      profiles: {
        Row: ProfileRow
        Insert: ProfileInsert
        Update: ProfileUpdate
        Relationships: []
      }
    }
  }
}

export const XETHKIOZ_CATEGORY_CONFIG = {
  gaming: {
    id: 'gaming',
    name: 'Gaming',
    color_code: '#FF7A18',
    icon_slug: 'gamepad-2',
  },
  ia: {
    id: 'ia',
    name: 'IA',
    color_code: '#A855F7',
    icon_slug: 'brain-circuit',
  },
  hardware: {
    id: 'hardware',
    name: 'Hardware',
    color_code: '#38BDF8',
    icon_slug: 'cpu',
  },
  science: {
    id: 'science',
    name: 'Ciencia / Hacking',
    color_code: '#22C55E',
    icon_slug: 'flask-conical',
  },
  deals: {
    id: 'deals',
    name: 'Ofertas',
    color_code: '#FACC15',
    icon_slug: 'badge-percent',
  },
  urgent: {
    id: 'urgent',
    name: 'Urgente',
    color_code: '#EF4444',
    icon_slug: 'radio-tower',
  },
} satisfies Record<XethkiozCategorySlug, CategoryConfigRow>

export const DEFAULT_ARTICLE_METRICS = {
  views: 0,
  reactions: 0,
  shares: 0,
  saves: 0,
  viralityScore: 0,
} satisfies ArticleMetrics

export function resolveCategoryConfig(categoryId: XethkiozCategorySlug): CategoryConfigRow {
  return XETHKIOZ_CATEGORY_CONFIG[categoryId]
}

export function isXethkiozCategorySlug(value: string): value is XethkiozCategorySlug {
  return value in XETHKIOZ_CATEGORY_CONFIG
}
