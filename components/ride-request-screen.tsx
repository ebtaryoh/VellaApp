'use client'

import { useState } from 'react'
import { CarFront, ChevronDown, Crosshair, LocateFixed, MapPin, Navigation, Search, ShieldCheck, Sparkles, Snowflake, WalletCards } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function RideRequestScreen() {
  const [destination, setDestination] = useState('')
  const [climateComfort, setClimateComfort] = useState(true)
  const [safeSister, setSafeSister] = useState(false)
  const [requested, setRequested] = useState(false)

  return (
    <main className="ride-shell min-h-screen overflow-hidden text-white">
      <section className="ride-map relative h-[47vh] min-h-[340px] overflow-hidden">
        <div className="map-grid absolute inset-0" aria-hidden="true" />
        <div className="map-river absolute -left-[14%] top-[13%] h-[145%] w-[34%] rotate-[24deg] rounded-[50%] border-x-[16px] border-sky-400/10 bg-sky-400/[0.035] blur-[1px]" aria-hidden="true" />
        <div className="map-route absolute left-[20%] top-[26%] h-[36%] w-[54%] rotate-[20deg] rounded-[50%] border-b-2 border-dashed border-sky-300/80 shadow-[0_0_18px_rgba(56,189,248,.7)]" aria-hidden="true" />
        <div className="map-route map-route-secondary absolute left-[36%] top-[17%] h-[56%] w-[24%] -rotate-[47deg] rounded-[50%] border-b border-slate-400/25" aria-hidden="true" />
        <div className="absolute left-[23%] top-[39%] flex size-7 items-center justify-center rounded-full bg-sky-300/15 shadow-[0_0_0_8px_rgba(56,189,248,.07),0_0_28px_rgba(56,189,248,.55)]"><span className="size-2 rounded-full bg-sky-200" /></div>
        <div className="absolute right-[21%] top-[23%] flex size-7 items-center justify-center rounded-full bg-sky-300/15 shadow-[0_0_0_8px_rgba(56,189,248,.07),0_0_28px_rgba(56,189,248,.55)]"><MapPin className="size-4 text-sky-200" /></div>
        <div className="absolute left-[49%] top-[50%] flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl border border-white/20 bg-sky-400 text-slate-950 shadow-[0_0_0_7px_rgba(56,189,248,.1),0_8px_24px_rgba(0,0,0,.5)]"><Navigation className="size-5 rotate-45 fill-slate-950" /></div>

        <header className="absolute inset-x-0 top-0 flex items-center justify-between px-5 pt-7 sm:px-8">
          <div><p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-sky-300">VELLA</p><p className="mt-1 text-xs text-white/45">Your journey, elevated.</p></div>
          <button aria-label="Center map" className="flex size-10 items-center justify-center rounded-full border border-white/10 bg-slate-950/45 text-white/70 backdrop-blur-xl"><LocateFixed className="size-4" /></button>
        </header>

        <div className="absolute inset-x-5 bottom-5 sm:inset-x-8">
          <label htmlFor="destination" className="sr-only">Where to?</label>
          <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-slate-950/65 px-4 py-3.5 shadow-2xl shadow-black/30 backdrop-blur-2xl">
            <Search className="size-5 text-sky-300" />
            <input id="destination" value={destination} onChange={(event) => setDestination(event.target.value)} placeholder="Where would you like to go?" className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/45" />
            <span className="rounded-lg border border-white/10 px-2 py-1 text-[10px] font-medium text-white/35">⌘ K</span>
          </div>
        </div>
      </section>

      <section className="ride-sheet relative -mt-5 rounded-t-[30px] border-t border-white/10 px-5 pb-8 pt-5 shadow-[0_-20px_70px_rgba(0,0,0,.35)] sm:px-8">
        <div className="mx-auto max-w-2xl">
          <div className="mx-auto mb-6 h-1 w-10 rounded-full bg-white/20" aria-hidden="true" />
          <div className="mb-5 flex items-start justify-between gap-4"><div><p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-sky-300">Hybrid Economics</p><h1 className="text-2xl font-semibold tracking-tight">A ride that makes sense.</h1></div><span className="flex items-center gap-1.5 rounded-full border border-emerald-300/15 bg-emerald-300/10 px-3 py-1.5 text-[10px] font-semibold text-emerald-300"><ShieldCheck className="size-3.5" /> Upfront fare</span></div>
          <div className="mb-5 rounded-2xl border border-white/10 bg-white/[0.045] p-4"><div className="mb-4 flex items-center justify-between"><div className="flex items-center gap-3"><div className="flex size-10 items-center justify-center rounded-xl bg-sky-300/10 text-sky-300"><CarFront className="size-5" /></div><div><p className="text-sm font-medium">Vella Comfort</p><p className="mt-0.5 text-xs text-white/40">Pickup in 4–6 min</p></div></div><div className="text-right"><p className="text-xl font-semibold">₦4,850</p><p className="text-[10px] text-emerald-300">Fare protected</p></div></div><div className="grid grid-cols-3 gap-2 border-t border-white/8 pt-3 text-xs"><div><p className="text-white/35">Base fare</p><p className="mt-1 font-medium">₦3,200</p></div><div><p className="text-white/35">Fuel estimate</p><p className="mt-1 font-medium text-amber-200">₦980</p></div><div><p className="text-white/35">Vella fee</p><p className="mt-1 font-medium">₦670</p></div></div></div>

          <div className="flex flex-col gap-2.5">
            <button onClick={() => setClimateComfort(!climateComfort)} aria-pressed={climateComfort} className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.035] p-3.5 text-left transition hover:bg-white/[0.06]"><div className="flex items-center gap-3"><div className="flex size-9 items-center justify-center rounded-xl bg-sky-300/10 text-sky-300"><Snowflake className="size-4" /></div><div><p className="text-sm font-medium">Climate Comfort<span className="ml-1 text-sky-300">™</span></p><p className="mt-0.5 text-xs text-white/35">Guaranteed AC, every trip</p></div></div><span className={`relative h-6 w-11 rounded-full transition ${climateComfort ? 'bg-sky-400' : 'bg-white/15'}`}><span className={`absolute top-1 size-4 rounded-full bg-white shadow-sm transition ${climateComfort ? 'left-6' : 'left-1'}`} /></span></button>
            <button onClick={() => setSafeSister(!safeSister)} aria-pressed={safeSister} className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.035] p-3.5 text-left transition hover:bg-white/[0.06]"><div className="flex items-center gap-3"><div className="flex size-9 items-center justify-center rounded-xl bg-violet-400/10 text-violet-300"><Sparkles className="size-4" /></div><div><p className="text-sm font-medium">SafeSister<span className="ml-1 text-violet-300">™</span></p><p className="mt-0.5 text-xs text-white/35">Female-only driver matching</p></div></div><span className={`relative h-6 w-11 rounded-full transition ${safeSister ? 'bg-violet-400' : 'bg-white/15'}`}><span className={`absolute top-1 size-4 rounded-full bg-white shadow-sm transition ${safeSister ? 'left-6' : 'left-1'}`} /></span></button>
          </div>

          <Button onClick={() => setRequested(true)} disabled={requested} className="mt-5 h-14 w-full rounded-2xl bg-sky-400 text-base font-semibold text-slate-950 shadow-[0_0_28px_rgba(56,189,248,.25)] transition hover:bg-sky-300 disabled:bg-emerald-300 disabled:opacity-100">{requested ? <><ShieldCheck data-icon="inline-start" /> Finding your trusted ride...</> : <><WalletCards data-icon="inline-start" /> Request Ride <ChevronDown data-icon="inline-end" className="rotate-[-90deg]" /></>}</Button>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[10px] text-white/30"><ShieldCheck className="size-3" /> Your fare is held securely until the ride is complete.</p>
        </div>
      </section>
    </main>
  )
}
