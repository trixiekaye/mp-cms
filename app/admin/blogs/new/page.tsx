export const dynamic = 'force-dynamic'
import TopBar from '@/components/admin/TopBar'
import BlogForm from '@/components/admin/BlogForm'

export default function NewBlogPage() {
  return (
    <>
      <TopBar title="New Blog" />
      <main className="flex-1 p-8">
        <BlogForm />
      </main>
    </>
  )
}
