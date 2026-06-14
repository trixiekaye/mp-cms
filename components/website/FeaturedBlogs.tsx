import { createClient } from '@/lib/supabase/server'
import BlogCard from './BlogCard'
import type { Blog } from '@/lib/types'

const aztecSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'>
  <polygon points='40,0 80,40 40,80 0,40' fill='none' stroke='%239E7758' stroke-width='1.8'/>
  <polygon points='40,8 72,40 40,72 8,40' fill='none' stroke='%23B8916F' stroke-width='1.3'/>
  <polygon points='40,16 64,40 40,64 16,40' fill='none' stroke='%239E7758' stroke-width='1.1'/>
  <polygon points='40,24 56,40 40,56 24,40' fill='none' stroke='%23B8916F' stroke-width='0.9'/>
  <polygon points='40,32 48,40 40,48 32,40' fill='%239E7758' opacity='0.4'/>
  <circle cx='40' cy='0' r='1.8' fill='%239E7758' opacity='0.35'/>
  <circle cx='80' cy='40' r='1.8' fill='%239E7758' opacity='0.35'/>
  <circle cx='40' cy='80' r='1.8' fill='%239E7758' opacity='0.35'/>
  <circle cx='0' cy='40' r='1.8' fill='%239E7758' opacity='0.35'/>
</svg>`

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
    <section id="blogs" className="relative py-20 px-6 bg-white overflow-hidden">
      {/* Subtle aztec background pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,${aztecSvg}")`,
          backgroundSize: '80px 80px',
          opacity: 0.06,
        }}
      />
      {/* Gradient overlay to keep it subtle */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0.7) 100%)',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-[#5C4028] mb-12" style={{ fontFamily: 'var(--font-playfair)' }}>
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
