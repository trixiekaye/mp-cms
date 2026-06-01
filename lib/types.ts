export interface Blog {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string | null
  cover_image_url: string | null
  is_featured: boolean
  is_published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface MediaItem {
  id: string
  file_name: string
  file_url: string
  file_type: string | null
  file_size: number | null
  storage_path: string | null
  created_at: string
}

export interface SiteConfig {
  id: number
  about_me_text: string | null
  about_me_image_url: string | null
  contact_email: string | null
  contact_message: string | null
  updated_at: string
}

export interface Profile {
  id: string
  email: string | null
  role: string
  created_at: string
}
