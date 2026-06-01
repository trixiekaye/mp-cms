export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'
import TopBar from '@/components/admin/TopBar'
import BlogForm from '@/components/admin/BlogForm'
import { notFound } from 'next/navigation'
import type { Blog } from '@/lib/types'

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: blog } = await supabase.from('blogs').select('*').eq('id', id).single()

  if (!blog) notFound()

  return (
    <>
      <TopBar title="Edit Blog" />
      <main className="flex-1 p-8 min-w-0">
        <BlogForm blog={blog as Blog} />
      </main>
    </>
  )
}
