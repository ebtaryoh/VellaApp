'use client'

import { useState, useEffect } from 'react'
import { Check, LockKeyhole, WalletCards, ShieldCheck } from 'lucide-react'
import { Topbar } from '@/components/shared/topbar'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/auth-context'
import { useRouter } from 'next/navigation'
import { subscribeToDriverTrip, updateTripStatus, type Trip } from '@/lib/firebase/trips'

export default function EscrowScreen() { 
  const { user } = useAuth()
  const router = useRouter()
  const [transferred, setTransferred] = useState(false)
  const [trip, setTrip] = useState<Trip | null>(null)

  useEffect(() => {
    if (!user) return
    const unsubscribe = subscribeToDriverTrip(user.uid, (activeTrip) => {
      setTrip(activeTrip)
    })
    return () => unsubscribe()
  }, [user])

  async function handleComplete() {
    if (!trip) return
    setTransferred(true)
    try {
      await updateTripStatus(trip.id, 'completed')
      setTimeout(() => {
        router.push('/driver/economics')
      }, 1500)
    } catch (error) {
      console.error(error)
      setTransferred(false)
    }
  }

  // If we just completed it, or there is no trip, we just show a generic view or spinner
  if (!trip && !transferred) {
    return (
      <div className="screen-stack content-screen flex items-center justify-center">
        <span className="auth-spinner" />
      </div>
    )
  }

  const fare = trip?.fare || 0

  return (
    <div className="screen-stack content-screen escrow-screen">
      <Topbar title="Trip complete" kicker="Resolution center"/>
      <div className="success-icon"><Check/></div>
      <div className="center-copy">
        <p className="kicker mint-text">Ride completed securely</p>
        <h2>{transferred ? 'Everything is settled.' : `Collect cash: ₦${fare.toLocaleString()}`}</h2>
        <p>{transferred ? 'Escrow has been closed and funds transferred.' : 'One last step to close out this ride.'}</p>
      </div>
      <div className="cash-summary">
        <span>Total Fare</span>
        <strong>₦{fare.toLocaleString()}</strong>
        <small>Secured via Vella Escrow</small>
      </div>
      <div className="transfer-card">
        <div className="transfer-head">
          <div className="lock-icon"><LockKeyhole/></div>
          <div>
            <b>Escrow wallet transfer</b>
            <small>Funds will be released to your wallet.</small>
          </div>
          <span className="secure-badge"><ShieldCheck/> Secure</span>
        </div>
        
        <Button 
          onClick={handleComplete} 
          disabled={transferred}
          className={`vella-primary ${transferred ? 'success' : ''} border-0 w-full mt-4`}
        >
          {transferred ? <><Check/> Transfer resolved</> : <><LockKeyhole/> Release funds & complete trip</>}
        </Button>
      </div>
      <div className="escrow-foot">
        <WalletCards/> Vella Escrow settles instantly and keeps both sides protected.
      </div>
    </div>
  ) 
}
