'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, FileText, Image, LogOut, ChevronDown, Tag } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import MPLogo from '@/components/shared/MPLogo'
import { useState } from 'react'

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const blogsOpen = pathname.startsWith('/admin/blogs')
  const [blogExpanded, setBlogExpanded] = useState(blogsOpen)

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  const linkClass = (active: boolean) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
      active ? 'bg-[#fff0f5] text-[#e84080]' : 'text-gray-600 hover:bg-[#fff0f5] hover:text-[#e84080]'
    }`

  return (
    <aside className="w-64 bg-white border-r border-[#ffd6e7] flex flex-col min-h-screen">
      <div className="flex items-center gap-3 px-6 py-6 border-b border-[#ffd6e7]">
        <MPLogo className="w-9 h-9" />
        <span className="text-xl font-bold text-[#a0205a]" style={{ fontFamily: 'var(--font-playfair)' }}>
          MP Admin
        </span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        <Link href="/admin" className={linkClass(pathname === '/admin')}>
          <LayoutDashboard size={18} />
          Dashboard
        </Link>

        {/* Blogs with submenu */}
        <div>
          <button
            onClick={() => setBlogExpanded(!blogExpanded)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              blogsOpen ? 'bg-[#fff0f5] text-[#e84080]' : 'text-gray-600 hover:bg-[#fff0f5] hover:text-[#e84080]'
            }`}
          >
            <FileText size={18} />
            <span className="flex-1 text-left">Blogs</span>
            <ChevronDown size={15} className={`transition-transform ${blogExpanded ? 'rotate-180' : ''}`} />
          </button>

          {blogExpanded && (
            <div className="ml-9 mt-1 space-y-1">
              <Link
                href="/admin/blogs"
                className={`block px-3 py-2 rounded-xl text-sm transition-colors ${
                  pathname === '/admin/blogs' || pathname.startsWith('/admin/blogs/') && !pathname.includes('categories')
                    ? 'text-[#e84080] font-medium'
                    : 'text-gray-500 hover:text-[#e84080]'
                }`}
              >
                All Posts
              </Link>
              <Link
                href="/admin/blogs/categories"
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-colors ${
                  pathname.startsWith('/admin/blogs/categories')
                    ? 'text-[#e84080] font-medium'
                    : 'text-gray-500 hover:text-[#e84080]'
                }`}
              >
                <Tag size={13} />
                Blog Categories
              </Link>
            </div>
          )}
        </div>

        <Link href="/admin/media" className={linkClass(pathname.startsWith('/admin/media'))}>
          <Image size={18} />
          Media
        </Link>
      </nav>

      <div className="px-4 py-4 border-t border-[#ffd6e7]">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors w-full"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
