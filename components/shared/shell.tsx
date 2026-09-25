'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ShieldCheck, ChevronRight, LogOut } from 'lucide-react'
import { useAuth } from '@/context/auth-context'
import { signOut } from '@/lib/firebase/auth'

const screens = [
  { id: 'request', href: '/passenger/request', label: 'Ride request', eyebrow: 'Passenger' },
  { id: 'trip', href: '/passenger/trip', label: 'Active trip', eyebrow: 'Passenger' },
  { id: 'aviation', href: '/passenger/aviation', label: 'Aviation concierge', eyebrow: 'Passenger' },
  { id: 'circle', href: '/passenger/circle', label: 'Trusted circle', eyebrow: 'Passenger' },
  { id: 'wallet', href: '/passenger/wallet', label: 'Wallet & Payments', eyebrow: 'Passenger' },
  { id: 'history', href: '/passenger/history', label: 'Ride history', eyebrow: 'Passenger' },
  { id: 'profile', href: '/passenger/profile', label: 'Settings', eyebrow: 'Passenger' },
  { id: 'economics', href: '/driver/economics', label: 'Economics engine', eyebrow: 'Driver' },
  { id: 'offer', href: '/driver/offer', label: 'Trip offer', eyebrow: 'Driver' },
  { id: 'escrow', href: '/driver/escrow', label: 'Escrow resolution', eyebrow: 'Driver' },
  { id: 'onboarding', href: '/driver/onboarding', label: 'Documents', eyebrow: 'Driver' },
  { id: 'driver-profile', href: '/driver/profile', label: 'Settings', eyebrow: 'Driver' },
  { id: 'admin-verify', href: '/admin/verify', label: 'Driver Verifications', eyebrow: 'Admin' },
]

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { profile } = useAuth()

  async function handleSignOut() {
    await signOut()
    router.replace('/login')
  }

  return (
    <main className="vella-app min-h-screen text-white">
      <aside className="vella-nav">
        <div className="vella-mark">
          <span>V</span>
          <div>
            <p>VELLA</p>
            <small>Mobility, elevated.</small>
          </div>
        </div>

        {profile && (
          <div className="nav-user">
            <div className="nav-user-avatar">
              {profile.displayName.charAt(0).toUpperCase()}
            </div>
            <div>
              <b>{profile.displayName}</b>
              <small className="capitalize">{profile.role}</small>
            </div>
          </div>
        )}

        <nav aria-label="Vella screens">
          {screens
            .filter((screen) => {
              if (screen.eyebrow === 'Admin') return true; // Show admin to everyone for testing
              return profile?.role === 'driver' ? screen.eyebrow === 'Driver' : screen.eyebrow === 'Passenger'
            })
            .map((screen) => {
            const isActive = pathname.startsWith(screen.href)
            return (
              <Link
                key={screen.id}
                href={screen.href}
                className={isActive ? 'active' : ''}
              >
                <span>{screen.eyebrow}</span>
                {screen.label}
                <ChevronRight />
              </Link>
            )
          })}
        </nav>

        <div className="vella-nav-footer">
          <button className="signout-btn" onClick={handleSignOut} aria-label="Sign out">
            <LogOut /> Sign out
          </button>
          <div className="private-badge">
            <ShieldCheck /> Private by design
          </div>
        </div>
      </aside>
      <section className="vella-content">
        {children}
      </section>
    </main>
  )
}
