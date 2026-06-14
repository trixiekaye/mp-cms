'use client'
export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import MPLogo from '@/components/shared/MPLogo'

const aztecSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'>
  <polygon points='40,0 80,40 40,80 0,40' fill='none' stroke='%23C9A98A' stroke-width='2'/>
  <polygon points='40,8 72,40 40,72 8,40' fill='none' stroke='%23D9C4A8' stroke-width='1.5'/>
  <polygon points='40,16 64,40 40,64 16,40' fill='none' stroke='%23C9A98A' stroke-width='1.2'/>
  <polygon points='40,24 56,40 40,56 24,40' fill='none' stroke='%23D9C4A8' stroke-width='1'/>
  <polygon points='40,32 48,40 40,48 32,40' fill='%23C9A98A' opacity='0.5'/>
  <circle cx='40' cy='0' r='2' fill='%23D9C4A8' opacity='0.4'/>
  <circle cx='80' cy='40' r='2' fill='%23D9C4A8' opacity='0.4'/>
  <circle cx='40' cy='80' r='2' fill='%23D9C4A8' opacity='0.4'/>
  <circle cx='0' cy='40' r='2' fill='%23D9C4A8' opacity='0.4'/>
</svg>`

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/admin')
      router.refresh()
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: '#5C4028' }}
    >
      {/* Aztec background pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,${aztecSvg}")`,
          backgroundSize: '80px 80px',
          opacity: 0.15,
        }}
      />
      {/* Radial gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 65% 70% at 50% 50%, rgba(92,64,40,0.55) 0%, rgba(92,64,40,0.85) 100%)',
        }}
      />

      {/* Login card */}
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md mx-4">
        {/* Card top stripe */}
        <div
          className="absolute top-0 left-0 right-0 h-1.5 rounded-t-2xl"
          style={{ background: 'linear-gradient(to right, #5C4028, #B8916F, #5C4028)' }}
        />

        <div className="flex flex-col items-center mb-8 pt-2">
          <MPLogo className="w-16 h-16 mb-4" />
          <h1 className="text-2xl font-bold text-[#5C4028]" style={{ fontFamily: 'var(--font-playfair)' }}>
            Admin Login
          </h1>
          <p className="text-xs text-[#9E7758] mt-1 tracking-widest uppercase">MP Content Studio</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-[#EDE0CF] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B8916F] focus:border-transparent"
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-[#EDE0CF] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B8916F] focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#5C4028] hover:bg-[#7D5C3E] text-white font-semibold rounded-xl transition-colors disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
