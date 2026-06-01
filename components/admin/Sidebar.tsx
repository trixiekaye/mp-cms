'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, FileText, Image, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import MPLogo from '@/components/shared/MPLogo'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/blogs', label: 'Blogs', icon: FileText },
  { href: '/admin/media', label: 'Media', icon: Image },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  return (
    <aside className="w-64 bg-white border-r border-[#ffd6e7] flex flex-col min-h-screen">
      <div className="flex items-center gap-3 px-6 py-6 border-b border-[#ffd6e7]">
        <MPLogo className="w-9 h-9" />
        <span className="text-xl font-bold text-[#a0205a]" style={{ fontFamily: 'var(--font-playfair)' }}>
          MP Admin
        </span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active
                  ? 'bg-[#fff0f5] text-[#e84080]'
                  : 'text-gray-600 hover:bg-[#fff0f5] hover:text-[#e84080]'
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          )
        })}
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
