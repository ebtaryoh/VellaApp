'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, Radio, ShieldCheck, AirVent, Sparkles, ArrowUpRight, WalletCards, Route as CarIcon } from 'lucide-react'
import { MapBackground } from '@/components/shared/map-background'
import { createTripRequest } from '@/lib/firebase/trips'
import { useAuth } from '@/context/auth-context'

export default function RequestScreen() { 
  const { user } = useAuth()
  const router = useRouter()
  const [requested, setRequested] = useState(false); 

  async function handleRequest() {
    if (!user) return
    setRequested(true)
    try {
      await createTripRequest(
        user.uid,
        'Murtala Muhammed Int. Airport', // Mock pickup
        'Eko Hotels & Suites', // Mock dropoff
        4850 // Mock fare
      )
      // Redirect to the active trip screen which will now listen for this trip
      router.push('/passenger/trip')
    } catch (error) {
      console.error(error)
      setRequested(false)
    }
  }

  return (
    <div className="screen-stack home-screen">
      <div className="hero-map">
        <MapBackground/>
        <div className="hero-brand">
          <span>VELLA</span>
          <small>Your journey, elevated.</small>
        </div>
        <button className="icon-button map-action" aria-label="Center location">
          <Radio />
        </button>
        <div className="destination-search">
          <MapPin/>
          <span>Where would you like to go?</span>
          <kbd>⌘ K</kbd>
        </div>
      </div>
      <section className="ride-panel">
        <div className="grabber"/>
        <div className="panel-heading">
          <div>
            <p className="kicker">Hybrid economics</p>
            <h2>A ride that makes sense.</h2>
          </div>
          <span className="secure-badge"><ShieldCheck/> Fare protected</span>
        </div>
        <div className="fare-card">
          <div className="fare-main">
            <div className="fare-icon"><CarIcon/></div>
            <div>
              <strong>Vella Comfort</strong>
              <small>Pickup in 4–6 min</small>
            </div>
            <div className="fare-total">
              <b>₦4,850</b>
              <small>Upfront fare</small>
            </div>
          </div>
          <div className="fare-breakdown">
            <span>Base fare <b>₦3,200</b></span>
            <span>Fuel estimate <b className="amber">₦980</b></span>
            <span>Vella fee <b>₦670</b></span>
          </div>
        </div>
        <div className="feature-row">
          <AirVent/>
          <div>
            <b>Climate Comfort<span>™</span></b>
            <small>Guaranteed AC, every trip</small>
          </div>
          <i className="toggle on"/>
        </div>
        <div className="feature-row">
          <Sparkles className="violet"/>
          <div>
            <b>SafeSister<span className="violet">™</span></b>
            <small>Female-only driver matching</small>
          </div>
          <i className="toggle"/>
        </div>
        <button 
          onClick={handleRequest} 
          disabled={requested}
          className={`vella-primary ${requested ? 'success' : ''} border-0 cursor-pointer w-full mt-4`}
        >
          {requested ? <><span className="auth-spinner" style={{width: 16, height: 16}} /> Finding your trusted ride...</> : <><WalletCards/> Request Premium Ride <ArrowUpRight/></>}
        </button>
      </section>
    </div>
  )
}
