import Link from 'next/link'
import { format } from 'date-fns'
import type { Blog } from '@/lib/types'

export default function BlogCard({ blog }: { blog: Blog }) {
  return (
    <Link href={`/blogs/${blog.slug}`} className="group bg-white rounded-2xl shadow-sm hover:shadow-md border border-[#EDE0CF] overflow-hidden transition-shadow">
      <div className="h-48 bg-[#F5EFE6] overflow-hidden">
        {blog.cover_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={blog.cover_image_url} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="h-full bg-gradient-to-br from-[#EDE0CF] to-[#E5D5BC]" />
        )}
      </div>
      <div className="p-5">
        <p className="text-xs text-[#B8916F] font-medium mb-1">
          {blog.published_at ? format(new Date(blog.published_at), 'MMMM d, yyyy') : ''}
        </p>
        <h3 className="text-base font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-[#B8916F] transition-colors" style={{ fontFamily: 'var(--font-playfair)' }}>
          {blog.title}
        </h3>
        {blog.excerpt && (
          <p className="text-sm text-gray-500 line-clamp-2">{blog.excerpt}</p>
        )}
        <span className="inline-block mt-3 text-xs font-medium text-[#B8916F]">Read more →</span>
      </div>
    </Link>
  )
}
