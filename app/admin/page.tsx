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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard label="Total Blogs"     value={totalBlogs     ?? 0} icon={FileText}  color="pink"    />
          <StatCard label="Published"        value={publishedBlogs ?? 0} icon={BookOpen}  color="rose"    />
          <StatCard label="Drafts"           value={draftBlogs     ?? 0} icon={FileX}     color="fuchsia" />
          <StatCard label="Media Items"      value={totalMedia     ?? 0} icon={ImageIcon} color="purple"  />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-[#ffd6e7] p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800" style={{ fontFamily: 'var(--font-playfair)' }}>
              Recent Blogs
            </h2>
            <Link href="/admin/blogs" className="text-sm text-[#e84080] hover:underline">View all</Link>
          </div>

          {recentBlogs && recentBlogs.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-100">
                  <th className="pb-3 font-medium">Title</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {(recentBlogs as Pick<Blog, 'id' | 'title' | 'slug' | 'is_published' | 'created_at'>[]).map((blog) => (
                  <tr key={blog.id} className="border-b border-gray-50 last:border-0">
                    <td className="py-3 text-gray-700">{blog.title}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        blog.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {blog.is_published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="py-3 text-gray-400">
                      {format(new Date(blog.created_at), 'MMM d, yyyy')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-400 text-sm">No blogs yet.</p>
          )}
        </div>
      </main>
    </>
  )
}
