'use client'

import { useState } from 'react'
import { Activity, BarChart3, CircleDollarSign, Sparkles, ArrowUpRight, Wifi, Check, X } from 'lucide-react'
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
  const [showModal, setShowModal] = useState(false)
  const [bankCode, setBankCode] = useState('044') // Default Access Bank
  const [accountNumber, setAccountNumber] = useState('0690000031')
  const [errorMsg, setErrorMsg] = useState('')
  
  const balance = profile?.walletBalance || 0

  async function handleConfirmCashout() {
    if (!user || balance <= 0) return
    setCashingOut(true)
    setErrorMsg('')
    try {
      // 1. Call Next.js API to process Paystack Transfer
      const res = await fetch('/api/paystack/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: balance,
          account_number: accountNumber,
          bank_code: bankCode,
          name: profile?.displayName || 'Vella Driver'
        })
      })

      const data = await res.json()
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to process cashout')
      }

      // 2. Subtract from Firestore
      await cashOutFunds(user.uid, balance)
      
      setShowModal(false)
      setCashedOut(true)
      setTimeout(() => setCashedOut(false), 3000)
    } catch (err: any) {
      console.error(err)
      setErrorMsg(err.message || 'An error occurred')
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
    <div className="screen-stack content-screen driver-screen relative">
      <Topbar title={`Good morning, ${firstName}`} kicker="Driver economics"/>
      
      <div className="profit-card relative">
        <div className="profit-label flex justify-between w-full">
          <span>Net profit balance</span>
          <Activity/>
        </div>
        <strong>₦{balance.toLocaleString()}</strong>
        
        <button 
          onClick={() => setShowModal(true)}
          disabled={balance === 0 || cashedOut}
          className={`mt-4 w-full vella-primary border-0 rounded-xl py-3 flex items-center justify-center gap-2 cursor-pointer ${cashedOut ? 'success' : ''} ${balance === 0 ? 'opacity-50' : ''}`}
        >
          {cashedOut ? <Check /> : <CircleDollarSign />}
          {cashedOut ? 'Cashed Out Successfully' : 'Cash Out Now'}
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

      {/* Cashout Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => !cashingOut && setShowModal(false)} />
          <div className="bg-[#111] border border-[#222] rounded-2xl w-full max-w-sm relative z-10 p-6 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold font-[Georgia]">Bank Details</h3>
              <button disabled={cashingOut} onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5"/>
              </button>
            </div>

            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm mb-4">
                {errorMsg}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Bank</label>
                <select 
                  value={bankCode} 
                  onChange={(e) => setBankCode(e.target.value)}
                  className="w-full bg-[#222] border-0 rounded-xl p-4 text-white appearance-none"
                  disabled={cashingOut}
                >
                  <option value="044">Access Bank</option>
                  <option value="058">GTBank</option>
                  <option value="033">UBA</option>
                  <option value="011">First Bank</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-slate-400 mb-2 block">Account Number</label>
                <input 
                  type="text" 
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="0000000000"
                  className="w-full bg-[#222] border-0 rounded-xl p-4 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  disabled={cashingOut}
                />
              </div>

              <button 
                onClick={handleConfirmCashout}
                disabled={cashingOut || !accountNumber || !bankCode}
                className="w-full bg-emerald-500 text-black font-medium py-4 rounded-xl mt-4 disabled:opacity-50 flex justify-center items-center"
              >
                {cashingOut ? <span className="auth-spinner" style={{width:20,height:20}}/> : `Withdraw ₦${balance.toLocaleString()}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  ) 
}
