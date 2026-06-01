export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'
import TopBar from '@/components/admin/TopBar'
import BlogTableClient from '@/components/admin/BlogTableClient'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import type { Blog } from '@/lib/types'

export default async function AdminBlogsPage() {
  const supabase = await createClient()
  const { data: blogs } = await supabase
    .from('blogs')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <>
      <TopBar title="Blogs" />
      <main className="flex-1 p-8">
        <div className="flex justify-end mb-6">
          <Link
            href="/admin/blogs/new"
            className="flex items-center gap-2 px-5 py-2.5 bg-[#e84080] hover:bg-[#c93070] text-white text-sm font-semibold rounded-xl transition-colors"
          >
            <Plus size={16} />
            New Blog
          </Link>
        </div>
        <BlogTableClient initialBlogs={(blogs as Blog[]) ?? []} />
      </main>
    </>
  )
}
