'use client'

import { useState, useEffect } from 'react'
import { Mic, LockKeyhole, Check, Star, Headphones } from 'lucide-react'
import { MapBackground } from '@/components/shared/map-background'
import { Topbar } from '@/components/shared/topbar'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/auth-context'
import { subscribeToPassengerTrip, type Trip } from '@/lib/firebase/trips'
import { RatingModal } from '@/components/shared/rating-modal'

export default function TripScreen() { 
  const { user } = useAuth()
  const router = useRouter()
  const [recording, setRecording] = useState(false)
  const [trip, setTrip] = useState<Trip | null>(null)
  const [loading, setLoading] = useState(true)
  const [showRating, setShowRating] = useState(false)

  useEffect(() => {
    if (!user) return
    const unsubscribe = subscribeToPassengerTrip(user.uid, (data) => {
      if (data?.status === 'completed' && trip?.status !== 'completed') {
        setShowRating(true)
      }
      setTrip(data)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [user, trip?.status])

  if (loading) {
    return (
      <div className="screen-stack trip-screen flex items-center justify-center">
        <span className="auth-spinner" />
      </div>
    )
  }

  if (!trip) {
    return (
      <div className="screen-stack trip-screen flex flex-col items-center justify-center text-center p-8">
        <h2 className="font-[Georgia] text-2xl mb-2">No active trip</h2>
        <p className="text-slate-400 mb-8 text-sm">You don't have any ongoing trips at the moment.</p>
        <button className="vella-primary w-full max-w-[300px] border-0 cursor-pointer" onClick={() => router.push('/passenger/request')}>
          Request a ride
        </button>
      </div>
    )
  }

  let statusTitle = "Looking for a driver"
  if (trip.status === 'accepted') statusTitle = "Driver is on the way"
  if (trip.status === 'arrived') statusTitle = "Driver has arrived"
  if (trip.status === 'in_progress') statusTitle = "Your ride is in motion"

  return (
    <div className="screen-stack trip-screen">
      <div className="trip-map">
        <MapBackground active={trip.status === 'in_progress'}/>
        <div className="trip-top">
          <Topbar title={statusTitle} kicker="Active trip" onBack={() => router.push('/passenger/request')}/>
          <div className="eta-card">
            {trip.status === 'searching' ? (
              <>
                <span>Matching with</span>
                <strong>Vella <small>partners</small></strong>
                <em>Connecting...</em>
              </>
            ) : (
              <>
                <span>Arriving in</span>
                <strong>18 <small>min</small></strong>
                <em>7.4 km remaining</em>
              </>
            )}
          </div>
        </div>
        <div className="sos-wrap">
          <button className={`sos-button ${recording ? 'recording' : ''}`} onClick={() => setRecording(!recording)}>
            <Mic/>
            {recording ? 'Recording' : 'SecureAudio SOS'}
          </button>
          <small>{recording ? 'Audio is encrypted and being shared' : 'Press and hold in an emergency'}</small>
        </div>
        <div className="escrow-chip">
          <LockKeyhole/> Escrow secured <Check/>
        </div>
      </div>
      
      {trip.status !== 'searching' && (
        <section className="driver-profile">
          <div className="avatar-photo">
            AM<span/>
          </div>
          <div className="driver-details">
            <p className="kicker">Your trusted driver</p>
            <h2>Amara Okafor <span><Star/> 4.9</span></h2>
            <p>Toyota Highlander · LAG 482 FX</p>
          </div>
          <button className="icon-button"><Headphones/></button>
        </section>
      )}

      <RatingModal 
        isOpen={showRating} 
        onClose={() => {
          setShowRating(false)
          router.push('/passenger/request')
        }} 
        targetName="Amara Okafor" 
        role="driver"
      />
    </div>
  ) 
}
