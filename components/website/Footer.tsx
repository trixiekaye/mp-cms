import Link from 'next/link'
import MPLogo from '@/components/shared/MPLogo'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#EDE0CF] py-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2">
          <MPLogo className="w-8 h-8" />
          <span className="text-lg font-bold text-[#7D5C3E]" style={{ fontFamily: 'var(--font-playfair)' }}>MP</span>
        </Link>
        <nav className="flex gap-5 text-sm text-gray-500">
          <Link href="/" className="hover:text-[#B8916F] transition-colors">Home</Link>
          <Link href="/blogs" className="hover:text-[#B8916F] transition-colors">Blogs</Link>
          <Link href="/#about" className="hover:text-[#B8916F] transition-colors">About</Link>
          <Link href="/#contact" className="hover:text-[#B8916F] transition-colors">Contact</Link>
        </nav>
        <p className="text-sm text-gray-400">© {new Date().getFullYear()} MP. All rights reserved.</p>
      </div>
    </footer>
  )
}
