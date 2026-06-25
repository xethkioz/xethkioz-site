export interface Category { id: string; name: string; slug: string; description: string | null; icon: string | null; portal: 'gaming' | 'tech' | 'science' | 'streaming' | 'community' | 'green-node' | 'ai-lab' | 'creator-studio'; sort_order: number }
export interface Author { id: string; name: string; slug: string; bio: string | null; avatar_url: string | null; role: string; created_at?: string }
export interface Article {
  id: string; title: string; slug: string; excerpt: string | null; content: string; cover_image: string | null;
  category_id: string | null; author_id: string | null; tags: string[]; status: string;
  is_featured: boolean; is_trending: boolean; is_editors_pick: boolean; is_popular: boolean;
  views: number; published_at: string; created_at: string; updated_at: string;
  category?: Category | null; author?: Author | null
}
export interface Stream { id: string; title: string; platform: string; channel_name: string; channel_url: string; video_id: string | null; thumbnail: string | null; is_live: boolean; is_featured: boolean; views: number; published_at: string }
export interface MediaItem { id: string; title: string; type: 'image' | 'video' | 'short' | 'reel' | 'carousel'; url: string; thumbnail: string | null; description: string | null; is_featured: boolean; created_at: string }
export interface SocialLink { id: string; platform: string; handle: string; url: string; followers: string | null; icon: string; sort_order: number }
export interface ChatRoom { id: string; name: string; icon: string; description: string; color: 'orange' | 'neon' | 'green' | 'red' }
export interface ChatMessage { id: string; room: string; user: string; role: 'host' | 'mod' | 'member' | 'guest'; text: string; created_at: string }


export interface ScienceReport {
  id: string
  title: string
  slug: string
  summary: string
  field: 'Astronomía' | 'Medicina' | 'Biotecnología' | 'Física' | 'IA Científica' | 'Ambiente' | 'Espacio'
  evidence_level: 'Divulgación' | 'Informe' | 'Paper revisado' | 'Preprint' | 'Fuente institucional'
  source_name: string
  source_url: string
  published_at: string
}

export interface NetworkPortal {
  id: string
  name: string
  path: string
  status: 'core' | 'formal' | 'hidden' | 'branch' | 'planned'
  accent: string
  description: string
}
