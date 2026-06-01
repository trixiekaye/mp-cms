export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'
import BlogsListClient from '@/components/website/BlogsListClient'
import type { Blog } from '@/lib/types'

const PAGE_SIZE = 9

export default async function BlogsPage() {
  const supabase = await createClient()
  const { data: blogs, count } = await supabase
    .from('blogs')
    .select('*', { count: 'exact' })
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .range(0, PAGE_SIZE - 1)

  return (
    <div className="min-h-screen bg-[#fff8fb]">
      <div className="bg-gradient-to-r from-[#fff0f5] to-[#ffd6e7] py-16 px-6 text-center">
        <h1 className="text-4xl font-bold text-[#7a1445]" style={{ fontFamily: 'var(--font-playfair)' }}>
          All Posts
        </h1>
      </div>
      <div className="max-w-6xl mx-auto px-6 py-12">
        <BlogsListClient initialBlogs={(blogs as Blog[]) ?? []} totalCount={count ?? 0} pageSize={PAGE_SIZE} />
      </div>
    </div>
  )
}
