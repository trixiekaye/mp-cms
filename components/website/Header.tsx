'use client'

import Link from 'next/link'
import MPLogo from '@/components/shared/MPLogo'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/blogs', label: 'Blogs' },
  { href: '/#about', label: 'About' },
  { href: '/#contact', label: 'Contact' },
]

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#EDE0CF] shadow-sm">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <MPLogo className="w-9 h-9" />
          <span className="text-xl font-bold text-[#7D5C3E]" style={{ fontFamily: 'var(--font-playfair)' }}>
            MP
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm font-medium text-gray-600 hover:text-[#B8916F] transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
