import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import type { Blog } from '@/lib/types'

export default function BlogCard({ blog }: { blog: Blog }) {
  return (
    <Link href={`/blogs/${blog.slug}`} className="group bg-white rounded-2xl shadow-sm hover:shadow-md border border-[#ffd6e7] overflow-hidden transition-shadow">
      <div className="relative h-48 bg-[#fff0f5]">
        {blog.cover_image_url ? (
          <Image src={blog.cover_image_url} alt={blog.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="h-full bg-gradient-to-br from-[#ffd6e7] to-[#ffadd2]" />
        )}
      </div>
      <div className="p-5">
        <p className="text-xs text-[#e84080] font-medium mb-1">
          {blog.published_at ? format(new Date(blog.published_at), 'MMMM d, yyyy') : ''}
        </p>
        <h3 className="text-base font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-[#e84080] transition-colors" style={{ fontFamily: 'var(--font-playfair)' }}>
          {blog.title}
        </h3>
        {blog.excerpt && (
          <p className="text-sm text-gray-500 line-clamp-2">{blog.excerpt}</p>
        )}
        <span className="inline-block mt-3 text-xs font-medium text-[#e84080]">Read more →</span>
      </div>
    </Link>
  )
}
