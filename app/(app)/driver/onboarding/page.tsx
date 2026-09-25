'use client'

import { Topbar } from '@/components/shared/topbar'
import { FileText, CarFront, ShieldAlert, CheckCircle, ArrowRight } from 'lucide-react'

export default function OnboardingPage() {
  return (
    <div className="screen-stack">
      <div className="content-screen">
        <Topbar title="Driver Onboarding" />
        
        <div className="onboarding-header">
          <h2>Complete your profile</h2>
          <p>You're almost ready to start earning with Vella. Please upload the required documents.</p>
        </div>

        <div className="docs-list">
          <div className="doc-card completed">
            <div className="doc-icon"><FileText /></div>
            <div className="doc-info">
              <b>Driver's License</b>
              <small>Approved on Oct 10</small>
            </div>
            <CheckCircle className="status-icon success" />
          </div>

          <div className="doc-card pending">
            <div className="doc-icon"><CarFront /></div>
            <div className="doc-info">
              <b>Vehicle Registration</b>
              <small>Action required</small>
            </div>
            <button className="upload-btn">Upload</button>
          </div>

          <div className="doc-card pending">
            <div className="doc-icon"><ShieldAlert /></div>
            <div className="doc-info">
              <b>Comprehensive Insurance</b>
              <small>Action required</small>
            </div>
            <button className="upload-btn">Upload</button>
          </div>
        </div>

        <div className="onboarding-footer">
          <button className="vella-primary" disabled>
            Submit for Review <ArrowRight />
          </button>
          <small>Verification usually takes 24-48 hours after all documents are submitted.</small>
        </div>
      </div>
    </div>
  )
}
