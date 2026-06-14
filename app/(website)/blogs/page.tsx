export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'
import BlogsListClient from '@/components/website/BlogsListClient'
import AztecDivider from '@/components/website/AztecDivider'
import type { Blog } from '@/lib/types'

const PAGE_SIZE = 9

const aztecLightSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'>
  <polygon points='40,0 80,40 40,80 0,40' fill='none' stroke='%23C9A98A' stroke-width='2'/>
  <polygon points='40,8 72,40 40,72 8,40' fill='none' stroke='%23D9C4A8' stroke-width='1.5'/>
  <polygon points='40,16 64,40 40,64 16,40' fill='none' stroke='%23C9A98A' stroke-width='1.2'/>
  <polygon points='40,24 56,40 40,56 24,40' fill='none' stroke='%23D9C4A8' stroke-width='1'/>
  <polygon points='40,32 48,40 40,48 32,40' fill='%23C9A98A' opacity='0.5'/>
  <circle cx='40' cy='0' r='2.5' fill='%23D9C4A8' opacity='0.5'/>
  <circle cx='80' cy='40' r='2.5' fill='%23D9C4A8' opacity='0.5'/>
  <circle cx='40' cy='80' r='2.5' fill='%23D9C4A8' opacity='0.5'/>
  <circle cx='0' cy='40' r='2.5' fill='%23D9C4A8' opacity='0.5'/>
</svg>`

export default async function BlogsPage() {
  const supabase = await createClient()
  const { data: blogs, count } = await supabase
    .from('blogs')
    .select('*', { count: 'exact' })
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .range(0, PAGE_SIZE - 1)

  return (
    <div className="min-h-screen bg-[#F5EFE6]">

      {/* Aztec hero header */}
      <div className="relative overflow-hidden bg-[#5C4028]">
        {/* Aztec tile pattern */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,${aztecLightSvg}")`,
            backgroundSize: '80px 80px',
            opacity: 0.18,
          }}
        />
        {/* Gradient overlay to darken edges and protect readability */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, rgba(92,64,40,0.4) 0%, rgba(92,64,40,0.1) 50%, rgba(92,64,40,0.4) 100%)',
          }}
        />

        <AztecDivider color="#D9C4A8" opacity={0.5} height={44} />

        <div className="relative z-10 text-center py-12 px-6">
          <h1
            className="text-4xl sm:text-5xl font-bold text-[#F5EFE6]"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            All Posts
          </h1>
          <p className="text-[#EDE0CF]/70 mt-3 text-sm tracking-wide uppercase">
            Stories, ideas &amp; reflections
          </p>
        </div>

        <AztecDivider color="#D9C4A8" opacity={0.5} height={44} />
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <BlogsListClient initialBlogs={(blogs as Blog[]) ?? []} totalCount={count ?? 0} pageSize={PAGE_SIZE} />
      </div>
    </div>
  )
}
