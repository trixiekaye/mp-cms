'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, FileText, Image, LogOut, ChevronDown, Tag, User } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import MPLogo from '@/components/shared/MPLogo'
import { useState } from 'react'

// Aztec tile encoded as CSS background (no SVG ID conflicts)
const aztecSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60'>
  <polygon points='30,0 60,30 30,60 0,30' fill='none' stroke='%23C9A98A' stroke-width='1.5'/>
  <polygon points='30,7 52,30 30,53 8,30' fill='none' stroke='%23D9C4A8' stroke-width='1.1'/>
  <polygon points='30,14 44,30 30,46 16,30' fill='none' stroke='%23C9A98A' stroke-width='0.9'/>
  <polygon points='30,21 38,30 30,39 22,30' fill='%23C9A98A' opacity='0.45'/>
  <circle cx='30' cy='0' r='1.5' fill='%23D9C4A8' opacity='0.4'/>
  <circle cx='60' cy='30' r='1.5' fill='%23D9C4A8' opacity='0.4'/>
  <circle cx='30' cy='60' r='1.5' fill='%23D9C4A8' opacity='0.4'/>
  <circle cx='0' cy='30' r='1.5' fill='%23D9C4A8' opacity='0.4'/>
</svg>`

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
      active
        ? 'bg-[#EDE0CF] text-[#5C4028] font-semibold'
        : 'text-gray-600 hover:bg-[#F5EFE6] hover:text-[#7D5C3E]'
    }`

  return (
    <aside className="w-64 bg-white border-r border-[#EDE0CF] flex flex-col min-h-screen">

      {/* Branded header with Aztec pattern */}
      <div
        className="relative overflow-hidden flex items-center gap-3 px-6 py-6 border-b border-[#EDE0CF]"
        style={{
          background: '#5C4028',
          backgroundImage: `url("data:image/svg+xml,${aztecSvg}")`,
          backgroundSize: '60px 60px',
        }}
      >
        {/* Gradient overlay to keep it legible */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(135deg, rgba(92,64,40,0.85) 0%, rgba(92,64,40,0.6) 100%)' }}
        />
        <div className="relative z-10 flex items-center gap-3">
          <MPLogo className="w-9 h-9" />
          <span className="text-xl font-bold text-[#F5EFE6]" style={{ fontFamily: 'var(--font-playfair)' }}>
            MP Admin
          </span>
        </div>
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
              blogsOpen
                ? 'bg-[#EDE0CF] text-[#5C4028] font-semibold'
                : 'text-gray-600 hover:bg-[#F5EFE6] hover:text-[#7D5C3E]'
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
                  (pathname === '/admin/blogs' || pathname.startsWith('/admin/blogs/')) && !pathname.includes('categories')
                    ? 'text-[#5C4028] font-semibold'
                    : 'text-gray-500 hover:text-[#7D5C3E]'
                }`}
              >
                All Posts
              </Link>
              <Link
                href="/admin/blogs/categories"
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-colors ${
                  pathname.startsWith('/admin/blogs/categories')
                    ? 'text-[#5C4028] font-semibold'
                    : 'text-gray-500 hover:text-[#7D5C3E]'
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

        <Link href="/admin/about" className={linkClass(pathname.startsWith('/admin/about'))}>
          <User size={18} />
          About Me
        </Link>
      </nav>

      {/* Sign out */}
      <div className="px-4 py-4 border-t border-[#EDE0CF]">
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
