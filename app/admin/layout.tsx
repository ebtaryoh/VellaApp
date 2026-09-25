'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/context/auth-context'
import { ShieldCheck } from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || profile?.role !== 'admin')) {
      // If not logged in, or not an admin, boot them to home
      // Note: For testing MVP, you can manually set your role to 'admin' in Firestore
      // or we can just allow the creator's specific email.
      if (profile?.email !== 'devtee002@gmail.com') {
        router.push('/login')
      }
    }
  }, [user, profile, loading, router])

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#0a0a0a]">
        <span className="auth-spinner" />
      </div>
    )
  }

  // Security fallback
  if (profile?.email !== 'devtee002@gmail.com' && profile?.role !== 'admin') {
    return null
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#fff] selection:text-black font-sans">
      <nav className="w-full border-b border-[#222] bg-[#0a0a0a] px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-white" />
          <span className="font-medium tracking-tight text-lg">Vella Operations Command</span>
        </div>
        <div className="text-sm text-slate-400">
          Logged in as <b className="text-white">{profile?.displayName}</b>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto p-6 md:p-12">
        {children}
      </main>
    </div>
  )
}
