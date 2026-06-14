'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import BlogCard from './BlogCard'
import type { Blog } from '@/lib/types'

interface BlogsListClientProps {
  initialBlogs: Blog[]
  totalCount: number
  pageSize: number
}

export default function BlogsListClient({ initialBlogs, totalCount, pageSize }: BlogsListClientProps) {
  const [blogs, setBlogs] = useState<Blog[]>(initialBlogs)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const filtered = search
    ? blogs.filter(b => b.title.toLowerCase().includes(search.toLowerCase()))
    : blogs

  const canLoadMore = blogs.length < totalCount && !search

  async function loadMore() {
    setLoading(true)
    const { data } = await supabase
      .from('blogs')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .range(blogs.length, blogs.length + pageSize - 1)
    if (data) setBlogs(prev => [...prev, ...(data as Blog[])])
    setLoading(false)
  }

  return (
    <div>
      <div className="mb-8 max-w-sm">
        <input
          type="search"
          placeholder="Search posts…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full px-4 py-2.5 border border-[#EDE0CF] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B8916F] bg-white text-sm"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-gray-400 py-16">No posts found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(blog => <BlogCard key={blog.id} blog={blog} />)}
        </div>
      )}

      {canLoadMore && (
        <div className="mt-12 text-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-8 py-3 border-2 border-[#B8916F] text-[#B8916F] font-semibold rounded-2xl hover:bg-[#F5EFE6] transition-colors disabled:opacity-60"
          >
            {loading ? 'Loading…' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  )
}
