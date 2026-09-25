'use client'

import { Topbar } from '@/components/shared/topbar'
import { CreditCard, Plus, Gift, CheckCircle2 } from 'lucide-react'

export default function WalletPage() {
  return (
    <div className="screen-stack">
      <div className="content-screen">
        <Topbar title="Wallet & Payments" />
        
        <div className="wallet-balance-card">
          <small>Vella Cash Balance</small>
          <strong>$0.00</strong>
          <button className="vella-primary"><Plus /> Add Funds</button>
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
