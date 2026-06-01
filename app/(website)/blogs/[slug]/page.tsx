export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { format } from 'date-fns'
import type { Blog } from '@/lib/types'

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: blog } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (!blog) notFound()

  const post = blog as Blog

  return (
    <article className="min-h-screen bg-white">
      {post.cover_image_url && (
        <div className="relative w-full h-72 sm:h-96">
          <Image src={post.cover_image_url} alt={post.title} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-6 py-12">
        <Link href="/blogs" className="text-sm text-[#e84080] hover:underline mb-6 inline-block">
          ← Back to Blogs
        </Link>

        <h1 className="text-4xl font-bold text-[#7a1445] mb-3 leading-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
          {post.title}
        </h1>

        {post.published_at && (
          <p className="text-sm text-gray-400 mb-10">
            {format(new Date(post.published_at), 'MMMM d, yyyy')}
          </p>
        )}

        {post.content && (
          <div
            className="prose prose-lg max-w-none prose-headings:font-playfair prose-a:text-[#e84080] prose-strong:text-[#7a1445]"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        )}
      </div>
    </article>
  )
}

