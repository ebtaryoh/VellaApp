'use client'

import { useEffect, useState } from 'react'
import { Topbar } from '@/components/shared/topbar'
import { Clock, ArrowRight, Star } from 'lucide-react'
import { useAuth } from '@/context/auth-context'
import { subscribeToPassengerHistory, type Trip } from '@/lib/firebase/trips'
import { useRouter } from 'next/navigation'

export default function HistoryPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [pastTrips, setPastTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const unsubscribe = subscribeToPassengerHistory(user.uid, (trips) => {
      setPastTrips(trips)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [user])

  if (loading) {
    return (
      <div className="screen-stack">
        <div className="content-screen flex items-center justify-center">
          <span className="auth-spinner" />
        </div>
      </div>
    )
  }

  return (
    <div className="screen-stack">
      <div className="content-screen">
        <Topbar title="Ride History" />
        
        {pastTrips.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Clock className="w-12 h-12 mb-4 opacity-50" />
            <p>You haven't taken any rides yet.</p>
          </div>
        ) : (
          <div className="history-list">
            {pastTrips.map((trip) => {
              const date = trip.createdAt?.toDate ? trip.createdAt.toDate() : new Date();
              const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })

              return (
                <div key={trip.id} className="history-card">
                  <div className="history-head">
                    <div className="history-date">
                      <Clock /> {formattedDate}
                    </div>
                    <strong>₦{trip.fare.toLocaleString()}</strong>
                  </div>
                  
                  <div className="history-route">
                    <div className="history-point">
                      <div className="dot start" />
                      <p>{trip.pickup}</p>
                    </div>
                    <div className="history-point">
                      <div className="dot end" />
                      <p>{trip.dropoff}</p>
                    </div>
                  </div>
                  
                  <div className="history-foot">
                    <div className="history-driver">
                      {/* Placeholder for driver details until driver profiles are fully stored */}
                      <div className="driver-mini-avatar">D</div>
                      <span>Vella Driver • Premium</span>
                    </div>
                    <div className="history-rating">
                      5 <Star className="filled-star" />
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => router.push(`/passenger/receipt/${trip.id}`)}
                    className="receipt-btn hover:bg-white/10 transition-colors"
                  >
                    View Receipt <ArrowRight />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
