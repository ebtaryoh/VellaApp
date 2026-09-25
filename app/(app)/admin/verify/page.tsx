'use client'

import { useState, useEffect } from 'react'
import { Topbar } from '@/components/shared/topbar'
import { ShieldCheck, CheckCircle, XCircle, FileText, User } from 'lucide-react'
import { getPendingDrivers, verifyDriver } from '@/lib/firebase/admin'
import type { VellaUser } from '@/lib/firebase/auth'

export default function AdminVerifyPage() {
  const [drivers, setDrivers] = useState<VellaUser[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)

  useEffect(() => {
    fetchPending()
  }, [])

  async function fetchPending() {
    setLoading(true)
    try {
      const data = await getPendingDrivers()
      setDrivers(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async (uid: string, status: 'approved' | 'rejected') => {
    if (!confirm(`Are you sure you want to mark this driver as ${status}?`)) return
    
    setProcessingId(uid)
    try {
      await verifyDriver(uid, status)
      // Remove from list
      setDrivers(prev => prev.filter(d => d.uid !== uid))
    } catch (err) {
      console.error(err)
      alert('Failed to update status.')
    } finally {
      setProcessingId(null)
    }
  }

  return (
    <div className="screen-stack">
      <div className="content-screen max-w-4xl mx-auto">
        <Topbar title="Admin Dashboard" />
        
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-serif text-white mb-2">Driver Verification</h2>
            <p className="text-slate-400 text-sm">Review and approve pending driver documents.</p>
          </div>
          <div className="bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" /> Admin Access
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <span className="auth-spinner mx-auto" />
            <p className="text-slate-500 mt-4 text-sm">Loading pending applications...</p>
          </div>
        ) : drivers.length === 0 ? (
          <div className="py-20 text-center border border-white/5 rounded-3xl bg-white/5">
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
            <h3 className="text-xl text-white font-medium mb-1">All Caught Up</h3>
            <p className="text-slate-400 text-sm">There are no pending driver verifications.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {drivers.map(driver => (
              <div key={driver.uid} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="flex flex-col md:flex-row gap-6 md:items-start justify-between">
                  
                  {/* Driver Info */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-white font-serif text-xl border border-white/10 shrink-0">
                      {driver.displayName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-lg text-white font-medium flex items-center gap-2">
                        {driver.displayName}
                        <span className="text-[10px] uppercase bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">Pending Review</span>
                      </h3>
                      <p className="text-sm text-slate-400 mt-1">{driver.email}</p>
                      
                      <div className="flex gap-4 mt-3">
                         <span className="text-xs text-slate-500 flex items-center gap-1">
                           <User className="w-3 h-3" /> {driver.gender || 'Not specified'}
                         </span>
                         {driver.safeSisterEnabled && (
                           <span className="text-xs text-pink-400 flex items-center gap-1">
                             SafeSister Enabled
                           </span>
                         )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 shrink-0">
                    <button 
                      disabled={processingId === driver.uid}
                      onClick={() => handleVerify(driver.uid, 'rejected')}
                      className="px-4 py-2 rounded-xl text-sm font-medium border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                    <button 
                      disabled={processingId === driver.uid}
                      onClick={() => handleVerify(driver.uid, 'approved')}
                      className="px-4 py-2 rounded-xl text-sm font-medium bg-emerald-500 text-white hover:bg-emerald-600 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      {processingId === driver.uid ? <span className="auth-spinner !w-4 !h-4" /> : <CheckCircle className="w-4 h-4" />}
                      Approve Driver
                    </button>
                  </div>
                </div>

                {/* Documents */}
                <div className="mt-6 pt-6 border-t border-white/5">
                  <h4 className="text-sm text-slate-400 font-medium mb-4 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Submitted Documents
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {['Driver License', 'Vehicle Registration', 'Comprehensive Insurance'].map((label, idx) => {
                      const docUrl = driver.driverDocs?.[idx]
                      return (
                        <div key={label} className="bg-black/40 rounded-xl p-4 border border-white/5">
                          <p className="text-xs text-slate-500 mb-2">{label}</p>
                          {docUrl ? (
                            <a href={docUrl} target="_blank" rel="noreferrer" className="block w-full h-32 rounded-lg bg-white/5 border border-white/10 hover:border-blue-400/50 transition-colors overflow-hidden group relative">
                               <img src={docUrl} alt={label} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                               <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-xs text-white">
                                 View Document
                               </div>
                            </a>
                          ) : (
                            <div className="w-full h-32 rounded-lg border border-dashed border-white/10 flex items-center justify-center text-slate-600 text-xs">
                              Missing
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
