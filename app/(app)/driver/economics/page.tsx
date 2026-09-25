'use client'

import { useState } from 'react'
import { Activity, BarChart3, CircleDollarSign, Sparkles, ArrowUpRight, Wifi, Check } from 'lucide-react'
import { Topbar } from '@/components/shared/topbar'
import { useAuth } from '@/context/auth-context'
import { cashOutFunds } from '@/lib/firebase/auth'
import { useRouter } from 'next/navigation'

export default function EconomicsScreen() { 
  const { user, profile } = useAuth()
  const router = useRouter()
  const [online, setOnline] = useState(false)
  const [cashingOut, setCashingOut] = useState(false)
  const [cashedOut, setCashedOut] = useState(false)
  
  const balance = profile?.walletBalance || 0

  async function handleCashOut() {
    if (!user || balance <= 0) return
    setCashingOut(true)
    try {
      await cashOutFunds(user.uid, balance)
      setCashedOut(true)
      setTimeout(() => setCashedOut(false), 3000)
    } catch (err) {
      console.error(err)
    } finally {
      setCashingOut(false)
    }
  }

  function handleGoOnline() {
    setOnline(true)
    setTimeout(() => {
      router.push('/driver/offer')
    }, 500)
  }

  const firstName = profile?.displayName?.split(' ')[0] || 'Driver'

  return (
    <div className="screen-stack content-screen driver-screen">
      <Topbar title={`Good morning, ${firstName}`} kicker="Driver economics"/>
      
      <div className="profit-card relative">
        <div className="profit-label flex justify-between w-full">
          <span>Net profit balance</span>
          <Activity/>
        </div>
        <strong>₦{balance.toLocaleString()}</strong>
        
        <button 
          onClick={handleCashOut}
          disabled={balance === 0 || cashingOut || cashedOut}
          className={`mt-4 w-full vella-primary border-0 rounded-xl py-3 flex items-center justify-center gap-2 cursor-pointer ${cashedOut ? 'success' : ''} ${balance === 0 ? 'opacity-50' : ''}`}
        >
          {cashingOut ? <span className="auth-spinner" style={{width:16,height:16}}/> : cashedOut ? <Check /> : <CircleDollarSign />}
          {cashingOut ? 'Processing...' : cashedOut ? 'Cashed Out Successfully' : 'Cash Out Now'}
        </button>
      </div>

      <div className="economics-grid mt-4">
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
        onClick={handleGoOnline} 
        disabled={online}
        className={`online-switch ${online ? 'online pointer-events-none' : ''}`}
      >
        <span className="switch-orb"><Wifi/></span>
        <span>
          <small>Driver mode</small>
          <b>{online ? 'CONNECTING TO RADAR...' : 'GO ONLINE'}</b>
        </span>
        <ArrowUpRight/>
      </button>
    </div>
  ) 
}
