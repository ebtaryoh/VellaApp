'use client'

import { useState } from 'react'
import { Plane, Sparkles, ArrowUpRight } from 'lucide-react'
import { Topbar } from '@/components/shared/topbar'
import { Button } from '@/components/ui/button'

export default function AviationScreen() { 
  const [meet, setMeet] = useState(true); 
  return (
    <div className="screen-stack content-screen amber-screen">
      <Topbar title="Aviation concierge" kicker="Arrive beautifully"/>
      <div className="aviation-hero">
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
          <strong>BA 083</strong>
          <span>LHR <ArrowUpRight/> LOS</span>
        </div>
        <div className="ticket-route">
          <span>London Heathrow <b>14:35</b></span>
          <i/>
          <span>Lagos <b>22:10</b></span>
        </div>
      </div>
      <div className="concierge-option">
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
      <div className="toll-card">
        <div>
          <p className="kicker amber-text">Transparent toll handling</p>
          <h3>Airport access fee</h3>
          <small>Paid upfront. No surprises at the gate.</small>
        </div>
        <strong>₦7,500</strong>
      </div>
      <Button className="vella-primary gold">
        <Plane/> Schedule concierge <ArrowUpRight/>
      </Button>
    </div>
  ) 
}
