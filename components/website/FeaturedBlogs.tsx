import { createClient } from '@/lib/supabase/server'
import BlogCard from './BlogCard'
import type { Blog } from '@/lib/types'

export default async function FeaturedBlogs() {
  const supabase = await createClient()
  const { data: blogs } = await supabase
    .from('blogs')
    .select('*')
    .eq('is_featured', true)
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(6)

  if (!blogs?.length) return null

  return (
    <section id="blogs" className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-[#7a1445] mb-12" style={{ fontFamily: 'var(--font-playfair)' }}>
          Featured Posts
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(blogs as Blog[]).map(blog => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      </div>
    </section>
  )
}
