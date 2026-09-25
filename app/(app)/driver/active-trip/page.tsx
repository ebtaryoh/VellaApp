'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Check, User, ArrowRight, X } from 'lucide-react'
import { Topbar } from '@/components/shared/topbar'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/auth-context'
import { subscribeToDriverTrip, updateTripStatus, updateDriverLocation, type Trip } from '@/lib/firebase/trips'
import { LiveMap } from '@/components/shared/live-map'
import { AdvancedMarker } from '@vis.gl/react-google-maps'

export default function ActiveTripScreen() { 
  const { user } = useAuth()
  const router = useRouter()
  const [trip, setTrip] = useState<Trip | null>(null)
  const [driverPos, setDriverPos] = useState<{lat: number, lng: number} | null>(null)
  
  useEffect(() => {
    if (!user) return
    const unsubscribe = subscribeToDriverTrip(user.uid, (activeTrip) => {
      setTrip(activeTrip)
    })
    return () => unsubscribe()
  }, [user])

  // Broadcast GPS location
  useEffect(() => {
    if (!trip || trip.status === 'completed') return

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setDriverPos({ lat: latitude, lng: longitude })
        // Broadcast to firestore
        updateDriverLocation(trip.id, latitude, longitude).catch(console.error)
      },
      (error) => {
        console.error("Error getting driver location:", error)
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
    )

    return () => navigator.geolocation.clearWatch(watchId)
  }, [trip?.id, trip?.status])

  async function handleArrived() {
    if (!trip) return
    await updateTripStatus(trip.id, 'arrived')
  }

  async function handleStartTrip() {
    if (!trip) return
    await updateTripStatus(trip.id, 'in_progress')
  }

  async function handleCompleteTrip() {
    if (!trip) return
    // Route to escrow to finalize the trip payment
    router.push('/driver/escrow')
  }

  if (!trip) {
    return (
      <div className="screen-stack content-screen flex items-center justify-center">
        <span className="auth-spinner" />
      </div>
    )
  }

  return (
    <div className="screen-stack relative">
      <LiveMap active={true} center={driverPos || undefined}>
        {driverPos && (
          <AdvancedMarker position={driverPos}>
            <div className="bg-emerald-500 w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center relative">
              <div className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-50"></div>
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </AdvancedMarker>
        )}
      </LiveMap>

      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between">
        <div className="pointer-events-auto">
          <Topbar title="Active Trip" />
        </div>
        
        <div className="bg-[#0a0a0a] border-t border-[#222] rounded-t-3xl p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] pointer-events-auto">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#222] rounded-full flex items-center justify-center text-[#888]">
                <User />
              </div>
              <div>
                <h3 className="font-medium text-lg m-0">Passenger</h3>
                <p className="text-slate-400 text-sm m-0">Secured with Vella Escrow</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-emerald-400 font-bold block text-lg">₦{trip.fare.toLocaleString()}</span>
              <span className="text-xs text-slate-500">Net payout</span>
            </div>
          </div>

          <div className="bg-[#111] border border-[#222] rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="text-sm font-medium">Pickup: {trip.pickup}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-[#E6FF00] rounded-full"></div>
              <span className="text-sm font-medium">Dropoff: {trip.dropoff}</span>
            </div>
          </div>

          {trip.status === 'accepted' && (
            <Button onClick={handleArrived} className="vella-primary w-full py-4 text-lg border-0 h-auto">
              I have arrived
            </Button>
          )}

          {trip.status === 'arrived' && (
            <Button onClick={handleStartTrip} className="w-full bg-emerald-500 text-black hover:bg-emerald-400 py-4 text-lg border-0 h-auto font-medium">
              Start Trip
            </Button>
          )}

          {trip.status === 'in_progress' && (
            <Button onClick={handleCompleteTrip} className="w-full bg-[#E6FF00] text-black hover:bg-[#cce600] py-4 text-lg border-0 h-auto font-medium">
              Complete & Collect Cash
            </Button>
          )}
        </div>
      </div>
    </div>
  ) 
}
