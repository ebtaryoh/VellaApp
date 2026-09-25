'use client'

import { useState, useEffect } from 'react'
import { Radio, Route, CircleDollarSign, Check, MapPin, Plane, Sparkles } from 'lucide-react'
import { Topbar } from '@/components/shared/topbar'
import { useRouter } from 'next/navigation'
import { subscribeToAvailableTrips, acceptTrip, type Trip } from '@/lib/firebase/trips'
import { useAuth } from '@/context/auth-context'

export default function OfferScreen() { 
  const { user, profile } = useAuth()
  const router = useRouter()
  const [accepted, setAccepted] = useState(false)
  const [availableTrips, setAvailableTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Pass profile to handle SafeSister filtering
    const unsubscribe = subscribeToAvailableTrips(profile, (trips) => {
      setAvailableTrips(trips)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [profile])

  const currentTrip = availableTrips[0] // Just show the first available one for MVP

  async function handleAccept() {
    if (!currentTrip || !user) return
    setAccepted(true)
    try {
      await acceptTrip(currentTrip.id, user.uid)
      setTimeout(() => {
        router.push('/driver/active-trip')
      }, 1500)
    } catch (err) {
      console.error(err)
      setAccepted(false)
    }
  }

  if (loading) {
    return (
      <div className="screen-stack content-screen offer-screen flex items-center justify-center">
        <span className="auth-spinner" />
      </div>
    )
  }

  if (!currentTrip) {
    return (
      <div className="screen-stack content-screen offer-screen flex flex-col items-center justify-center p-8 text-center">
        <div className="radar-bg opacity-30">
          <div className="radar-ring ring-one"/>
          <div className="radar-ring ring-two"/>
          <div className="radar-sweep"/>
        </div>
        <MapPin className="w-12 h-12 text-slate-500 mb-4" />
        <h2 className="font-[Georgia] text-2xl mb-2">Finding trips...</h2>
        <p className="text-slate-400 text-sm">We are looking for passengers near you. Stay online to receive requests.</p>
      </div>
    )
  }

  return (
    <div className="screen-stack content-screen offer-screen">
      <div className="radar-bg">
        <div className="radar-ring ring-one"/>
        <div className="radar-ring ring-two"/>
        <div className="radar-sweep"/>
      </div>
      <Topbar title="Incoming trip" kicker="A passenger is waiting"/>
      <div className="offer-head">
        <span className="request-pulse"><Radio/></span>
        <div>
          <p className="kicker">New request · 00:18</p>
          <h2>{accepted ? 'Trip accepted.' : 'Make your move.'}</h2>
        </div>
        <span className="offer-timer">00:18</span>
      </div>
      <div className="route-card">
        {currentTrip.rideType === 'aviation' && (
          <div className="bg-[#1f1f1f] p-3 rounded-xl mb-4 border border-[#cca355]/30">
            <div className="flex items-center gap-2 text-[#cca355] mb-1">
              <Plane className="w-4 h-4" /> <strong>Aviation Concierge</strong>
            </div>
            <div className="text-sm">Flight: <b>{currentTrip.flightNumber}</b></div>
            {currentTrip.meetAndGreet && (
              <div className="text-sm flex items-center gap-1 mt-1">
                <Sparkles className="w-3 h-3 text-pink-400"/> 
                <span className="text-slate-300">Passenger requested Meet & Greet at arrivals</span>
              </div>
            )}
          </div>
        )}
        <div className="route-line">
          <span className="pickup"/>
          <div>
            <small>Pickup</small>
            <b>{currentTrip.pickup}</b>
          </div>
        </div>
        <div className="route-line">
          <span className="dropoff"/>
          <div>
            <small>Dropoff</small>
            <b>{currentTrip.dropoff}</b>
          </div>
        </div>
        <div className="route-distance">
          <Route/> 17.8 km <span>·</span> Est. 31 min
        </div>
      </div>
      <div className="proposed-fare">
        <span>Proposed fare</span>
        <strong>₦{currentTrip.fare.toLocaleString()}</strong>
        <small>Passenger has secured payment</small>
      </div>
      <div className="offer-economics">
        <div>
          <span>Proposed fare</span>
          <b>₦{currentTrip.fare.toLocaleString()}</b>
        </div>
        <div>
          <span>Fuel estimate</span>
          <b className="amber">− ₦{(currentTrip.fare * 0.2).toLocaleString()}</b>
        </div>
        <div>
          <span>Vella commission</span>
          <b>− ₦{(currentTrip.fare * 0.1).toLocaleString()}</b>
        </div>
        <div className="net">
          <span>Your net</span>
          <b>₦{(currentTrip.fare * 0.7).toLocaleString()}</b>
        </div>
      </div>
      <div className="offer-actions">
        <button 
          onClick={handleAccept} 
          disabled={accepted}
          className="accept-button border-0 w-full rounded-xl py-3 cursor-pointer text-sm font-medium flex items-center justify-center gap-2 mt-4"
        >
          {accepted ? <span className="auth-spinner" style={{width: 16, height: 16}} /> : <Check/>}
          {accepted ? 'Accepting...' : 'Accept trip'}
        </button>
      </div>
    </div>
  ) 
}
