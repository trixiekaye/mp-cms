'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Pencil, Trash2, Eye, EyeOff, Star } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import ConfirmModal from './ConfirmModal'
import type { Blog } from '@/lib/types'
import { format } from 'date-fns'

export default function BlogTableClient({ initialBlogs }: { initialBlogs: Blog[] }) {
  const [blogs, setBlogs] = useState<Blog[]>(initialBlogs)
  const [deleteTarget, setDeleteTarget] = useState<Blog | null>(null)
  const router = useRouter()
  const supabase = createClient()

  async function togglePublished(blog: Blog) {
    const { error } = await supabase
      .from('blogs')
      .update({ is_published: !blog.is_published, published_at: !blog.is_published ? new Date().toISOString() : null })
      .eq('id', blog.id)
    if (!error) {
      setBlogs(blogs.map(b => b.id === blog.id ? { ...b, is_published: !b.is_published } : b))
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    if (deleteTarget.cover_image_url) {
      const path = deleteTarget.cover_image_url.split('/covers/')[1]
      if (path) await supabase.storage.from('covers').remove([path])
    }
    await supabase.from('blogs').delete().eq('id', deleteTarget.id)
    setBlogs(blogs.filter(b => b.id !== deleteTarget.id))
    setDeleteTarget(null)
  }

  return (
    <>
      {deleteTarget && (
        <ConfirmModal
          title="Delete Blog?"
          message={`"${deleteTarget.title}" will be permanently deleted.`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-[#ffd6e7] overflow-hidden">
        {blogs.length === 0 ? (
          <p className="p-8 text-center text-gray-400">No blogs yet. Create your first post!</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-[#fff0f5]">
              <tr className="text-left text-gray-500">
                <th className="px-5 py-3 font-medium">Cover</th>
                <th className="px-5 py-3 font-medium">Title</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Featured</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-5 py-3">
                    {blog.cover_image_url ? (
                      <div className="w-12 h-8 rounded-lg overflow-hidden relative">
                        <Image src={blog.cover_image_url} alt="" fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-12 h-8 rounded-lg bg-[#ffd6e7]" />
                    )}
                  </td>
                  <td className="px-5 py-3 font-medium text-gray-800 max-w-xs truncate">{blog.title}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      blog.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {blog.is_published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    {blog.is_featured && <Star size={16} className="text-[#e84080] fill-[#e84080]" />}
                  </td>
                  <td className="px-5 py-3 text-gray-400">
                    {format(new Date(blog.created_at), 'MMM d, yyyy')}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/blogs/${blog.id}/edit`} className="p-1.5 rounded-lg hover:bg-[#fff0f5] text-gray-500 hover:text-[#e84080] transition-colors">
                        <Pencil size={15} />
                      </Link>
                      <button onClick={() => togglePublished(blog)} className="p-1.5 rounded-lg hover:bg-[#fff0f5] text-gray-500 hover:text-[#e84080] transition-colors">
                        {blog.is_published ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                      <button onClick={() => setDeleteTarget(blog)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-500 transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  )
}
