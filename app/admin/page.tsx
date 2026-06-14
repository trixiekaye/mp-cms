export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'
import { FileText, BookOpen, FileX, ImageIcon } from 'lucide-react'
import StatCard from '@/components/admin/StatCard'
import TopBar from '@/components/admin/TopBar'
import { format } from 'date-fns'
import Link from 'next/link'
import type { Blog } from '@/lib/types'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [
    { count: totalBlogs },
    { count: publishedBlogs },
    { count: draftBlogs },
    { count: totalMedia },
    { data: recentBlogs },
  ] = await Promise.all([
    supabase.from('blogs').select('*', { count: 'exact', head: true }),
    supabase.from('blogs').select('*', { count: 'exact', head: true }).eq('is_published', true),
    supabase.from('blogs').select('*', { count: 'exact', head: true }).eq('is_published', false),
    supabase.from('media_items').select('*', { count: 'exact', head: true }),
    supabase.from('blogs').select('id, title, slug, is_published, created_at').order('created_at', { ascending: false }).limit(5),
  ])

  return (
    <>
      <TopBar title="Dashboard" />
      <main className="flex-1 p-8 space-y-8">

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard label="Total Blogs"  value={totalBlogs     ?? 0} icon={FileText}  color="tan"   />
          <StatCard label="Published"    value={publishedBlogs ?? 0} icon={BookOpen}  color="warm"  />
          <StatCard label="Drafts"       value={draftBlogs     ?? 0} icon={FileX}     color="beige" />
          <StatCard label="Gallery Items" value={totalMedia     ?? 0} icon={ImageIcon} color="sand"  />
        </div>

        {/* Recent blogs */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#EDE0CF] overflow-hidden">
          {/* Card header with subtle gradient */}
          <div
            className="flex items-center justify-between px-6 py-4 border-b border-[#EDE0CF]"
            style={{ background: 'linear-gradient(to right, #F5EFE6, white)' }}
          >
            <h2 className="text-base font-semibold text-[#5C4028]" style={{ fontFamily: 'var(--font-playfair)' }}>
              Recent Blogs
            </h2>
            <Link href="/admin/blogs" className="text-xs font-medium text-[#B8916F] hover:text-[#7D5C3E] transition-colors uppercase tracking-wide">
              View all →
            </Link>
          </div>

          {recentBlogs && recentBlogs.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-100 bg-[#F5EFE6]/40">
                  <th className="px-6 py-3 font-medium">Title</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {(recentBlogs as Pick<Blog, 'id' | 'title' | 'slug' | 'is_published' | 'created_at'>[]).map((blog) => (
                  <tr key={blog.id} className="border-b border-gray-50 last:border-0 hover:bg-[#F5EFE6]/30 transition-colors">
                    <td className="px-6 py-3 text-gray-700 font-medium">{blog.title}</td>
                    <td className="px-6 py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        blog.is_published
                          ? 'bg-[#EDE0CF] text-[#5C4028]'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {blog.is_published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-400 text-xs">
                      {format(new Date(blog.created_at), 'MMM d, yyyy')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-400 text-sm p-6">No blogs yet.</p>
          )}
        </div>
      </main>
    </>
  )
}
