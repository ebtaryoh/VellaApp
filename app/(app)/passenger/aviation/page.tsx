'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plane, Sparkles, ArrowUpRight, MapPin } from 'lucide-react'
import { Topbar } from '@/components/shared/topbar'
import { useAuth } from '@/context/auth-context'
import { createTripRequest } from '@/lib/firebase/trips'
import { usePaystackPayment } from 'react-paystack'
import { LocationSearch } from '@/components/shared/location-search'

export default function AviationScreen() { 
  const { user, profile } = useAuth()
  const router = useRouter()
  
  const [meet, setMeet] = useState(true)
  const [flightNumber, setFlightNumber] = useState('BA 083')
  const [dropoff, setDropoff] = useState('Victoria Island, Lagos')
  const [requested, setRequested] = useState(false)
  
  const fare = 7500 // Airport access fee + base fare for aviation

  const config = {
    reference: (new Date()).getTime().toString(),
    email: profile?.email || 'user@example.com',
    amount: fare * 100,
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_test_mock_key',
  };

  const initializePayment = usePaystackPayment(config);

  const onSuccess = async () => {
    try {
      await createTripRequest(
        user!.uid, 
        'Murtala Muhammed Int. Airport', 
        dropoff, 
        fare, 
        'aviation', 
        profile?.gender,
        flightNumber,
        meet
      )
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
    <div className="screen-stack content-screen amber-screen">
      <Topbar title="Aviation concierge" kicker="Arrive beautifully"/>
      
      <div className="aviation-hero pb-4">
        <div className="plane-orbit"><Plane/></div>
        <div>
          <p className="kicker amber-text">VIP airport transfer</p>
          <h2>We will be there<br/><i>before you land.</i></h2>
        </div>
        <div className="flight-status">
          <span className="live-dot"/> Live flight tracking <b>On time</b>
        </div>
      </div>

      <div className="ticket-card">
        <div className="ticket-label">Flight number</div>
        <div className="ticket-input">
          <Plane/>
          <input 
            type="text"
            value={flightNumber}
            onChange={(e) => setFlightNumber(e.target.value.toUpperCase())}
            placeholder="e.g. BA 083"
            className="bg-transparent border-b border-[#cca355] text-white font-bold outline-none uppercase w-24 mx-2 text-center placeholder-[#cca355]"
          />
          <span>LHR <ArrowUpRight/> LOS</span>
        </div>
        <div className="ticket-route">
          <span>London Heathrow <b>14:35</b></span>
          <i/>
          <span>Lagos <b>22:10</b></span>
        </div>
      </div>

      <div className="ticket-card mt-2 py-4">
        <div className="ticket-label mb-2"><MapPin className="inline w-4 h-4 mr-1"/> Dropoff Destination</div>
        <LocationSearch 
          placeholder="Where are you heading?"
          onSelectPlace={(address) => setDropoff(address)}
        />
        {dropoff && <div className="mt-2 text-sm text-slate-300 ml-8">{dropoff}</div>}
      </div>

      <div className="concierge-option mt-4">
        <Sparkles/>
        <div>
          <b>Meet & Greet</b>
          <small>Personal concierge at arrivals</small>
        </div>
        <button 
          onClick={() => setMeet(!meet)} 
          className={`toggle ${meet ? 'on amber-toggle' : ''}`} 
          aria-label="Toggle Meet and Greet"
        />
      </div>

      <div className="toll-card mt-4">
        <div>
          <p className="kicker amber-text">Transparent toll handling</p>
          <h3>Airport access fee & fare</h3>
          <small>Paid upfront. No surprises at the gate.</small>
        </div>
        <strong>₦{fare.toLocaleString()}</strong>
      </div>

      <button 
        onClick={handleRequest}
        disabled={requested}
        className="vella-primary gold w-full border-0 mt-4 h-[56px]"
      >
        {requested ? (
          <><span className="auth-spinner" style={{width: 16, height: 16}} /> Reserving...</>
        ) : (
          <><Plane/> Schedule concierge <ArrowUpRight/></>
        )}
      </button>
    </div>
  ) 
}
