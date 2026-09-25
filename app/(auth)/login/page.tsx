'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ShieldCheck, Mail, Lock, ArrowUpRight, Eye, EyeOff } from 'lucide-react'
import { signIn } from '@/lib/firebase/auth'
import { getUserProfile } from '@/lib/firebase/auth'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await signIn(email, password)
      const profile = await getUserProfile(user.uid)
      if (profile?.role === 'driver') {
        if (!profile.driverDocs || profile.driverDocs.length < 3) {
          router.push('/driver/onboarding')
        } else {
          router.push('/driver/economics')
        }
      } else {
        router.push('/passenger/request')
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid credentials. Please try again.'
      setError(msg.replace('Firebase: ', '').replace(/\(auth\/.*\)\.?/, '').trim())
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-screen">
      {/* Background */}
      <div className="auth-bg">
        <div className="auth-bg-orb orb-one" />
        <div className="auth-bg-orb orb-two" />
        <div className="auth-grid" />
      </div>

      <div className="auth-card">
        {/* Brand */}
        <div className="auth-brand">
          <div className="auth-mark">V</div>
          <div>
            <h1>VELLA</h1>
            <p>Mobility, elevated.</p>
          </div>
        </div>

        <div className="auth-heading">
          <h2>Welcome back</h2>
          <p>Sign in to continue your journey.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label htmlFor="email">Email address</label>
            <div className="auth-input-wrap">
              <Mail />
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="auth-field">
            <label htmlFor="password">Password</label>
            <div className="auth-input-wrap">
              <Lock />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="input-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button
            type="submit"
            className={`auth-submit ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <span className="auth-spinner" />
            ) : (
              <><ShieldCheck /> Sign in <ArrowUpRight /></>
            )}
          </button>
        </form>

        <p className="auth-footer">
          Don&apos;t have an account?{' '}
          <Link href="/signup">Create one <ArrowUpRight /></Link>
        </p>
      </div>
    </div>
  )
}
