'use client'

import { useState } from 'react'
import { Activity, BarChart3, CircleDollarSign, Sparkles, ArrowUpRight, Wifi } from 'lucide-react'
import { Topbar } from '@/components/shared/topbar'

export default function EconomicsScreen() { 
  const [online, setOnline] = useState(false); 
  return (
    <div className="screen-stack content-screen driver-screen">
      <Topbar title="Good morning, Chidi" kicker="Driver economics"/>
      <div className="profit-card">
        <div className="profit-label">
          <span>Today's net profit</span>
          <Activity/>
        </div>
        <strong>₦38,640</strong>
        <div className="profit-meta">
          <span><ArrowUpRight/> 18.4% vs yesterday</span>
          <small>Updated just now</small>
        </div>
      </div>
      <div className="economics-grid">
        <div className="breakdown-card">
          <div className="card-title">
            <span>Profit composition</span>
            <BarChart3/>
          </div>
          <div className="bars">
            <i style={{height:'88%'}}/>
            <i style={{height:'64%'}}/>
            <i style={{height:'39%'}}/>
            <i style={{height:'73%'}}/>
            <i style={{height:'51%'}}/>
            <i style={{height:'82%'}}/>
            <i style={{height:'58%'}}/>
          </div>
          <div className="bar-legend">
            <span><i/> Gross <b>₦52.8k</b></span>
            <span><i/> Net <b>₦38.6k</b></span>
          </div>
        </div>
        <div className="margin-card">
          <CircleDollarSign/>
          <strong>73%</strong>
          <span>Profit margin</span>
          <small>₦8,420 fuel · ₦5,740 fee</small>
        </div>
      </div>
      <div className="insight-card">
        <Sparkles/>
        <div>
          <b>Smart Hybrid Pricing</b>
          <p>Excellent margin today. You are earning <strong>₦112 more per trip</strong> than your 7-day average.</p>
        </div>
        <ArrowUpRight/>
      </div>
      <button 
        onClick={() => setOnline(!online)} 
        className={`online-switch ${online ? 'online' : ''}`}
      >
        <span className="switch-orb"><Wifi/></span>
        <span>
          <small>Driver mode</small>
          <b>{online ? 'GOING ONLINE' : 'GO ONLINE'}</b>
        </span>
        <ArrowUpRight/>
      </button>
    </div>
  ) 
}
