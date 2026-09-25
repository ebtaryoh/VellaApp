'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/auth-context'
import { Shell } from '@/components/shared/shell'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="auth-screen">
        <div className="auth-bg">
          <div className="auth-bg-orb orb-one" />
          <div className="auth-bg-orb orb-two" />
        </div>
        <div className="splash-loader">
          <div className="auth-mark">V</div>
          <span className="auth-spinner" />
        </div>
      </div>
    )
  }

  if (!user) return null

  return <Shell>{children}</Shell>
}
