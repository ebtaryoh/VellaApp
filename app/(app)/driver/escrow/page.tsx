'use client'

import { useState } from 'react'
import { Check, LockKeyhole, WalletCards, ShieldCheck } from 'lucide-react'
import { Topbar } from '@/components/shared/topbar'
import { Button } from '@/components/ui/button'

export default function EscrowScreen() { 
  const [transferred, setTransferred] = useState(false); 
  return (
    <div className="screen-stack content-screen escrow-screen">
      <Topbar title="Trip complete" kicker="Resolution center"/>
      <div className="success-icon"><Check/></div>
      <div className="center-copy">
        <p className="kicker mint-text">Ride completed securely</p>
        <h2>{transferred ? 'Everything is settled.' : 'Collect cash: ₦4,200'}</h2>
        <p>{transferred ? 'The ₦800 difference was instantly returned to the passenger wallet.' : 'One last step to close out this ride.'}</p>
      </div>
      <div className="cash-summary">
        <span>Passenger paid cash</span>
        <strong>₦5,000</strong>
        <small>Exact fare · ₦4,200</small>
      </div>
      <div className="transfer-card">
        <div className="transfer-head">
          <div className="lock-icon"><LockKeyhole/></div>
          <div>
            <b>Escrow wallet transfer</b>
            <small>No change? Return the difference digitally.</small>
          </div>
          <span className="secure-badge"><ShieldCheck/> Secure</span>
        </div>
        <div className="amount-input">
          <span>₦</span>
          <strong>800</strong>
          <small>to passenger</small>
        </div>
        <Button 
          onClick={() => setTransferred(true)} 
          className={`vella-primary ${transferred ? 'success' : ''}`}
        >
          {transferred ? <><Check/> Transfer resolved</> : <><LockKeyhole/> Transfer via escrow</>}
        </Button>
      </div>
      <div className="escrow-foot">
        <WalletCards/> Vella Escrow settles instantly and keeps both sides protected.
      </div>
    </div>
  ) 
}
