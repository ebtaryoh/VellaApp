'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Topbar } from '@/components/shared/topbar'
import { FileText, CarFront, ShieldAlert, CheckCircle, ArrowRight } from 'lucide-react'
import { useAuth } from '@/context/auth-context'
import { uploadDriverDocument } from '@/lib/firebase/storage'
import { updateDriverDocuments } from '@/lib/firebase/auth'

export default function OnboardingPage() {
  const { user, profile } = useAuth()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [loadingType, setLoadingType] = useState<string | null>(null)
  const [docs, setDocs] = useState<{ [key: string]: string }>(
    // If they already uploaded docs, pretend the first 3 match the 3 slots
    profile?.driverDocs?.length ? {
      license: profile.driverDocs[0] || '',
      registration: profile.driverDocs[1] || '',
      insurance: profile.driverDocs[2] || ''
    } : {}
  )
  const [submitting, setSubmitting] = useState(false)
  const [currentUploadType, setCurrentUploadType] = useState<string>('')

  const handleUploadClick = (type: string) => {
    setCurrentUploadType(type)
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user || !currentUploadType) return

    setLoadingType(currentUploadType)
    try {
      const url = await uploadDriverDocument(user.uid, file, currentUploadType)
      setDocs(prev => ({ ...prev, [currentUploadType]: url }))
    } catch (error) {
      console.error('Error uploading doc:', error)
      alert('Upload failed. Check your Firebase Storage rules.')
    } finally {
      setLoadingType(null)
      setCurrentUploadType('')
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async () => {
    if (!user) return
    setSubmitting(true)
    try {
      const docUrls = [docs.license, docs.registration, docs.insurance].filter(Boolean)
      await updateDriverDocuments(user.uid, docUrls)
      alert('Documents submitted successfully! Your profile is pending review.')
      router.push('/driver/offer')
    } catch (error) {
      console.error(error)
      alert('Submission failed.')
    } finally {
      setSubmitting(false)
    }
  }

  const allUploaded = docs.license && docs.registration && docs.insurance

  return (
    <div className="screen-stack">
      <div className="content-screen">
        <Topbar title="Driver Onboarding" />
        
        <div className="onboarding-header">
          <h2>Complete your profile</h2>
          <p>You're almost ready to start earning with Vella. Please upload the required documents.</p>
        </div>

        {/* Hidden file input */}
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          accept="image/*,.pdf"
          onChange={handleFileChange}
        />

        <div className="docs-list">
          {/* Driver's License */}
          <div className={`doc-card ${docs.license ? 'completed' : 'pending'}`}>
            <div className="doc-icon"><FileText /></div>
            <div className="doc-info">
              <b>Driver's License</b>
              <small>{docs.license ? 'Uploaded' : 'Action required'}</small>
            </div>
            {loadingType === 'license' ? (
              <span className="auth-spinner" style={{width:20,height:20}}/>
            ) : docs.license ? (
              <CheckCircle className="status-icon success" />
            ) : (
              <button onClick={() => handleUploadClick('license')} className="upload-btn">Upload</button>
            )}
          </div>

          {/* Vehicle Registration */}
          <div className={`doc-card ${docs.registration ? 'completed' : 'pending'}`}>
            <div className="doc-icon"><CarFront /></div>
            <div className="doc-info">
              <b>Vehicle Registration</b>
              <small>{docs.registration ? 'Uploaded' : 'Action required'}</small>
            </div>
            {loadingType === 'registration' ? (
              <span className="auth-spinner" style={{width:20,height:20}}/>
            ) : docs.registration ? (
              <CheckCircle className="status-icon success" />
            ) : (
              <button onClick={() => handleUploadClick('registration')} className="upload-btn">Upload</button>
            )}
          </div>

          {/* Insurance */}
          <div className={`doc-card ${docs.insurance ? 'completed' : 'pending'}`}>
            <div className="doc-icon"><ShieldAlert /></div>
            <div className="doc-info">
              <b>Comprehensive Insurance</b>
              <small>{docs.insurance ? 'Uploaded' : 'Action required'}</small>
            </div>
            {loadingType === 'insurance' ? (
              <span className="auth-spinner" style={{width:20,height:20}}/>
            ) : docs.insurance ? (
              <CheckCircle className="status-icon success" />
            ) : (
              <button onClick={() => handleUploadClick('insurance')} className="upload-btn">Upload</button>
            )}
          </div>
        </div>

        <div className="onboarding-footer">
          <button 
            className="vella-primary" 
            disabled={!allUploaded || submitting}
            onClick={handleSubmit}
          >
            {submitting ? <span className="auth-spinner"/> : (
              <>Submit for Review <ArrowRight /></>
            )}
          </button>
          <small>Verification usually takes 24-48 hours after all documents are submitted.</small>
        </div>
      </div>
    </div>
  )
}
