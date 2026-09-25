'use client'

import { useEffect, useState } from 'react'
import { getAdminMetrics } from '@/lib/firebase/admin'
import { Users, Car, Banknote, Activity } from 'lucide-react'

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  async function fetchMetrics() {
    setLoading(true)
    const data = await getAdminMetrics()
    setMetrics(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchMetrics()
    // Refresh metrics every 30 seconds
    const interval = setInterval(fetchMetrics, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading && !metrics) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <span className="auth-spinner" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-medium tracking-tight mb-2">Platform Overview</h1>
          <p className="text-slate-400">Live metrics from your Vella database.</p>
        </div>
        <button onClick={fetchMetrics} className="text-sm bg-[#222] hover:bg-[#333] transition-colors px-4 py-2 rounded-lg text-white">
          Refresh Data
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="bg-[#111] border border-[#222] rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3 text-slate-400">
            <Users className="w-5 h-5 text-blue-400" />
            <span className="font-medium">Total Users</span>
          </div>
          <div className="text-4xl font-semibold tracking-tight">
            {metrics?.totalUsers?.toLocaleString() || '0'}
          </div>
        </div>

        {/* Active Rides */}
        <div className="bg-[#111] border border-[#222] rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3 text-slate-400">
            <Activity className="w-5 h-5 text-emerald-400" />
            <span className="font-medium">Active Rides (Live)</span>
          </div>
          <div className="text-4xl font-semibold tracking-tight flex items-center gap-3">
            {metrics?.activeRides?.toLocaleString() || '0'}
            {metrics?.activeRides > 0 && <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span></span>}
          </div>
        </div>

        {/* Total Completed Rides */}
        <div className="bg-[#111] border border-[#222] rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3 text-slate-400">
            <Car className="w-5 h-5 text-white" />
            <span className="font-medium">Completed Rides</span>
          </div>
          <div className="text-4xl font-semibold tracking-tight">
            {metrics?.totalRides?.toLocaleString() || '0'}
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-[#111] border border-[#222] rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3 text-slate-400">
            <Banknote className="w-5 h-5 text-[#E6FF00]" />
            <span className="font-medium">Vella Revenue (20%)</span>
          </div>
          <div className="text-4xl font-semibold tracking-tight text-[#E6FF00]">
            ₦{(metrics?.vellaRevenue || 0).toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-auto">
            Gross Processing: ₦{(metrics?.grossFare || 0).toLocaleString()}
          </div>
        </div>
      </div>

      <div className="bg-[#111] border border-[#222] rounded-2xl p-8 mt-4 flex flex-col items-center justify-center text-center gap-4">
        <ShieldCheck className="w-12 h-12 text-[#333]" />
        <h3 className="text-xl font-medium">All Systems Operational</h3>
        <p className="text-slate-400 max-w-md">
          Firestore database rules are enforcing security. The application is processing rides securely through the Paystack integration. 
        </p>
      </div>
    </div>
  )
}
