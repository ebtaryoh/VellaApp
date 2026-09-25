'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, Radio, ShieldCheck, AirVent, Sparkles, ArrowUpRight, WalletCards, Route as CarIcon } from 'lucide-react'
import { LiveMap } from '@/components/shared/live-map'
import { createTripRequest } from '@/lib/firebase/trips'
import { useAuth } from '@/context/auth-context'
import { LocationSearch } from '@/components/shared/location-search'
import { usePaystackPayment } from 'react-paystack'

export default function RequestScreen() { 
  const { user, profile } = useAuth()
  const router = useRouter()
  const [requested, setRequested] = useState(false); 
  const [pickup, setPickup] = useState('Victoria Island, Lagos')
  const [dropoff, setDropoff] = useState('Murtala Muhammed Int. Airport')
  const [fare, setFare] = useState(4850)

  const config = {
    reference: (new Date()).getTime().toString(),
    email: profile?.email || 'user@example.com',
    amount: fare * 100, // Paystack amount is in kobo (kobo = 1/100 Naira)
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_test_mock_key',
  };

  const initializePayment = usePaystackPayment(config);

  const onSuccess = async () => {
    try {
      await createTripRequest(user!.uid, pickup, dropoff, fare)
      router.push('/passenger/trip')
    } catch (error) {
      console.error(error)
      setRequested(false)
    }
  };

  const onClose = () => {
    setRequested(false);
  }

  async function handleRequest() {
    if (!user) return
    setRequested(true)
    initializePayment({ onSuccess, onClose })
  }

  return (
    <div className="screen-stack home-screen">
      <div className="hero-map relative w-full h-[45vh]">
        <LiveMap />
        <div className="hero-brand absolute top-6 left-6 z-10">
          <span className="text-white font-bold tracking-wider text-xl">VELLA</span>
          <small className="block text-slate-300">Your journey, elevated.</small>
        </div>
        
        <div className="absolute bottom-10 left-4 right-4 z-20">
          <LocationSearch 
            placeholder="Where would you like to go?" 
            onSelectPlace={(address, lat, lng) => setDropoff(address)} 
          />
        </div>
      </div>
      <section className="ride-panel relative z-30">
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
