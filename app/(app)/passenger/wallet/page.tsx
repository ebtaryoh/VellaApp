'use client'

import { useState } from 'react'
import { Topbar } from '@/components/shared/topbar'
import { CreditCard, Plus, Gift, CheckCircle2 } from 'lucide-react'
import { useAuth } from '@/context/auth-context'
import { usePaystackPayment } from 'react-paystack'
import { addFundsToWallet } from '@/lib/firebase/auth'

export default function WalletPage() {
  const { user, profile } = useAuth()
  const [funding, setFunding] = useState(false)
  const fundAmount = 5000 // Fixed ₦5,000 top-up for MVP

  const config = {
    reference: (new Date()).getTime().toString(),
    email: profile?.email || 'user@example.com',
    amount: fundAmount * 100, // kobo
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
  }

  const initializePayment = usePaystackPayment(config)

  const onSuccess = async () => {
    try {
      if (user) {
        await addFundsToWallet(user.uid, fundAmount)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setFunding(false)
    }
  }

  const onClose = () => {
    setFunding(false)
  }

  const handleFund = () => {
    setFunding(true)
    initializePayment({ onSuccess, onClose })
  }

  const balance = profile?.walletBalance || 0

  return (
    <div className="screen-stack">
      <div className="content-screen">
        <Topbar title="Wallet & Payments" />
        
        <div className="wallet-balance-card">
          <small>Vella Cash Balance</small>
          <strong>₦{balance.toLocaleString()}</strong>
          <button 
            className={`vella-primary ${funding ? 'opacity-50 pointer-events-none' : ''}`}
            onClick={handleFund}
            disabled={funding}
          >
            {funding ? <span className="auth-spinner" style={{width: 16, height: 16}} /> : <Plus />}
            {funding ? 'Funding...' : 'Add ₦5,000'}
          </button>
        </div>

        <div className="settings-section">
          <h3>Payment Methods</h3>
          
          <div className="setting-card">
            <div className="setting-row">
              <div className="card-icon black-card">
                <span>V</span>
              </div>
              <div className="setting-content">
                <small>Primary Card</small>
                <b>•••• 4242</b>
              </div>
              <CheckCircle2 className="verified-icon" />
            </div>
            
            <div className="setting-divider" />
            
            <button className="add-card-button">
              <Plus /> Add new payment method
            </button>
          </div>
        </div>

        <div className="settings-section">
          <h3>Promotions</h3>
          <div className="promo-card">
            <Gift />
            <div className="setting-content">
              <b>No active promotions</b>
              <small>Enter a promo code to get discounts on rides.</small>
            </div>
            <button className="text-link">Add code</button>
          </div>
        </div>
      </div>
    </div>
  )
}
