'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Printer, ArrowLeft, Download, ShieldCheck } from 'lucide-react'
import { getTripById, type Trip } from '@/lib/firebase/trips'
import { useAuth } from '@/context/auth-context'

export default function ReceiptPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const router = useRouter()
  
  const [trip, setTrip] = useState<Trip | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id || typeof id !== 'string') return
    
    getTripById(id).then((data) => {
      setTrip(data)
      setLoading(false)
    }).catch(console.error)
  }, [id])

  if (loading) {
    return (
      <div className="screen-stack bg-white">
        <div className="content-screen flex items-center justify-center min-h-screen">
          <span className="auth-spinner !border-t-[#63d0ff] !border-slate-200" />
        </div>
      </div>
    )
  }

  if (!trip) {
    return (
      <div className="screen-stack bg-white text-slate-800">
        <div className="content-screen text-center py-20">
          <h2>Receipt not found</h2>
          <button onClick={() => router.back()} className="text-[#63d0ff] mt-4">Go Back</button>
        </div>
      </div>
    )
  }

  const date = trip.createdAt?.toDate ? trip.createdAt.toDate() : new Date()
  const formattedDate = date.toLocaleDateString('en-US', { 
    weekday: 'long', year: 'numeric', month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit'
  })

  const baseFare = trip.fare * 0.8
  const serviceFee = trip.fare * 0.2

  return (
    <div className="screen-stack bg-slate-50 min-h-screen text-slate-900 print:bg-white print:m-0 print:p-0">
      
      {/* Hide Topbar/Actions during print */}
      <div className="print:hidden flex items-center justify-between p-6 max-w-2xl mx-auto w-full">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button 
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-[#050505] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors shadow-lg"
        >
          <Printer className="w-4 h-4" /> Download PDF
        </button>
      </div>

      <div className="max-w-2xl mx-auto w-full p-4 print:p-0">
        {/* The Actual Receipt */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 print:shadow-none print:border-none print:rounded-none">
          
          {/* Brand Header */}
          <div className="flex items-start justify-between border-b border-slate-100 pb-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="grid place-items-center w-8 h-8 rounded-lg bg-gradient-to-br from-[#74d7ff] to-[#185dba] text-[#03111e] font-serif font-black text-sm">V</span>
                <h1 className="font-serif text-2xl tracking-tight text-slate-900 m-0">Vella</h1>
              </div>
              <p className="text-sm text-slate-500 m-0">Mobility, elevated.</p>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-medium text-slate-900 m-0">Ride Receipt</h2>
              <p className="text-sm text-slate-500 mt-1">{formattedDate}</p>
            </div>
          </div>

          {/* Passenger & Trip Details */}
          <div className="grid grid-cols-2 gap-8 mb-10">
            <div>
              <small className="block text-xs font-semibold tracking-widest text-slate-400 uppercase mb-2">Billed To</small>
              <b className="block text-base text-slate-900">{user?.displayName || 'Passenger'}</b>
              <span className="block text-sm text-slate-500">{user?.email || 'N/A'}</span>
            </div>
            <div className="text-right">
              <small className="block text-xs font-semibold tracking-widest text-slate-400 uppercase mb-2">Trip ID</small>
              <b className="block text-sm text-slate-700 font-mono">{trip.id}</b>
              <span className="flex items-center justify-end gap-1 text-xs text-emerald-600 mt-1 font-medium">
                <ShieldCheck className="w-3 h-3" /> Paid & Secured
              </span>
            </div>
          </div>

          {/* Route */}
          <div className="bg-slate-50 rounded-2xl p-6 mb-10 border border-slate-100">
            <div className="flex gap-4 items-start relative">
              <div className="flex flex-col items-center mt-1 w-4">
                <div className="w-2.5 h-2.5 rounded-full border-2 border-[#63d0ff] bg-white z-10" />
                <div className="w-px h-10 bg-slate-300 my-1" />
                <div className="w-2.5 h-2.5 rounded-full border-2 border-emerald-500 bg-emerald-50 z-10" />
              </div>
              <div className="flex-1 space-y-6">
                <div>
                  <small className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Pickup</small>
                  <p className="text-sm text-slate-700 m-0">{trip.pickup}</p>
                </div>
                <div>
                  <small className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Dropoff</small>
                  <p className="text-sm text-slate-700 m-0">{trip.dropoff}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Economics */}
          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center text-sm text-slate-600">
              <span>Base Fare</span>
              <span>₦{baseFare.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-sm text-slate-600">
              <span>Tolls & Surcharges</span>
              <span>₦0.00</span>
            </div>
            <div className="flex justify-between items-center text-sm text-slate-600">
              <span>Service Fee</span>
              <span>₦{serviceFee.toLocaleString()}</span>
            </div>
          </div>

          {/* Total */}
          <div className="border-t-2 border-slate-900 pt-6 flex justify-between items-end">
            <span className="text-base font-medium text-slate-900">Total Billed</span>
            <span className="text-4xl font-serif text-slate-900 tracking-tight">₦{trip.fare.toLocaleString()}</span>
          </div>

        </div>
      </div>

    </div>
  )
}
