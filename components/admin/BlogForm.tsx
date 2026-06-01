'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import RichTextEditor from '@/components/shared/RichTextEditor'
import ImageUploader from '@/components/shared/ImageUploader'
import type { Blog, BlogCategory } from '@/lib/types'
import slugifyLib from 'slugify'

interface BlogFormProps {
  blog?: Blog
}

export default function BlogForm({ blog }: BlogFormProps) {
  const router = useRouter()
  const supabase = createClient()

  const [title, setTitle] = useState(blog?.title ?? '')
  const [slug, setSlug] = useState(blog?.slug ?? '')
  const [excerpt, setExcerpt] = useState(blog?.excerpt ?? '')
  const [content, setContent] = useState(blog?.content ?? '')
  const [coverUrl, setCoverUrl] = useState<string | null>(blog?.cover_image_url ?? null)
  const [categoryId, setCategoryId] = useState<string>(blog?.category_id ?? '')
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [isFeatured, setIsFeatured] = useState(blog?.is_featured ?? false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    supabase.from('blog_categories').select('*').order('name').then(({ data }) => {
      if (data) setCategories(data as BlogCategory[])
    })
  }, [])

  function handleTitleChange(v: string) {
    setTitle(v)
    if (!blog) setSlug(slugifyLib(v, { lower: true, strict: true }))
  }

  async function handleSave(publish: boolean) {
    setSaving(true)
    setError(null)
    const payload = {
      title,
      slug,
      excerpt: excerpt || null,
      content: content || null,
      cover_image_url: coverUrl,
      category_id: categoryId || null,
      is_featured: isFeatured,
      is_published: publish,
      published_at: publish ? (blog?.published_at ?? new Date().toISOString()) : null,
      updated_at: new Date().toISOString(),
    }

    let err
    if (blog) {
      const res = await supabase.from('blogs').update(payload).eq('id', blog.id)
      err = res.error
    } else {
      const res = await supabase.from('blogs').insert(payload)
      err = res.error
    }

    setSaving(false)
    if (err) { setError(err.message); return }
    router.push('/admin/blogs')
    router.refresh()
  }

  const inputClass = 'w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e84080] focus:border-transparent text-sm'
  const toggleClass = (on: boolean) => `relative inline-flex w-10 h-6 rounded-full transition-colors cursor-pointer ${on ? 'bg-[#e84080]' : 'bg-gray-200'}`

  return (
    <div className="w-full space-y-6">
      {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

      {/* Featured toggle — top */}
      <div className="flex items-center gap-3">
        <div className={toggleClass(isFeatured)} onClick={() => setIsFeatured(!isFeatured)}>
          <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${isFeatured ? 'translate-x-4' : ''}`} />
        </div>
        <span className="text-sm font-medium text-gray-700">Featured</span>
      </div>

      {/* Title + Slug in one row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input className={inputClass} value={title} onChange={e => handleTitleChange(e.target.value)} placeholder="Blog title" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
          <input className={inputClass} value={slug} onChange={e => setSlug(e.target.value)} placeholder="url-friendly-slug" />
        </div>
      </div>

      {/* Category + Excerpt in one row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select className={inputClass} value={categoryId} onChange={e => setCategoryId(e.target.value)}>
            <option value="">— No category —</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
          <textarea className={`${inputClass} resize-none`} rows={3} value={excerpt} onChange={e => setExcerpt(e.target.value)} placeholder="Short description…" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
        <ImageUploader
          bucket="covers"
          value={coverUrl}
          onChange={(url) => setCoverUrl(url)}
          label="Upload cover image"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
        <RichTextEditor value={content} onChange={setContent} />
      </div>

      <div className="flex items-center gap-4 pt-2">
        <button
          type="button"
          disabled={saving}
          onClick={() => handleSave(false)}
          className="px-6 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save as Draft'}
        </button>
        <button
          type="button"
          disabled={saving}
          onClick={() => handleSave(true)}
          className="px-6 py-2.5 bg-[#e84080] hover:bg-[#c93070] text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-60"
        >
          {saving ? 'Publishing…' : 'Publish'}
        </button>
      </div>
    </div>
  )
}
