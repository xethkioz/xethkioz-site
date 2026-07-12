export type WebServiceStatus = 'draft' | 'published' | 'archived'

export type WebServiceOffer = {
  id: string
  slug: string
  eyebrow: string | null
  title: string
  summary: string
  description: string | null
  image_url: string
  image_path: string | null
  image_alt: string
  price_label: string
  delivery_label: string | null
  features: string[]
  cta_label: string
  status: WebServiceStatus
  featured: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export type WebQuoteStatus = 'new' | 'contacted' | 'quoted' | 'won' | 'lost' | 'spam' | 'archived'

export type WebQuoteRequest = {
  id: string
  service_id: string | null
  service_slug: string | null
  name: string
  email: string
  whatsapp: string | null
  business_name: string | null
  project_type: string
  budget_range: string
  contact_preference: string
  details: string
  status: WebQuoteStatus
  source: string
  internal_notes: string | null
  created_at: string
  updated_at: string
}
