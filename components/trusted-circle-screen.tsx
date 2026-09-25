'use client'

import { useState } from 'react'
import { ArrowLeft, ArrowRight, Check, ChevronLeft, MoreHorizontal, Plus, ShieldCheck, Star, Users, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

const onlineDrivers = [
  { initials: 'JM', name: 'Jordan M.', rating: '4.98', trips: '128', tone: 'violet', photo: '/images/jordan-driver.png' },
  { initials: 'AT', name: 'Avery T.', rating: '4.96', trips: '84', tone: 'teal' },
  { initials: 'RS', name: 'Riley S.', rating: '4.99', trips: '213', tone: 'amber' },
  { initials: 'KC', name: 'Kai C.', rating: '4.97', trips: '67', tone: 'rose' },
]

const drivers = [
  { initials: 'JM', name: 'Jordan Miller', note: 'Your go-to driver', car: '2023 Mercedes-Benz E-Class', plate: 'VLA 482', rating: '4.98', trips: '128', tone: 'violet', last: 'Last ride 2 days ago', photo: '/images/jordan-driver.png' },
  { initials: 'AT', name: 'Avery Thompson', note: 'Always on time', car: '2022 Volvo XC90', plate: 'VEL 091', rating: '4.96', trips: '84', tone: 'teal', last: 'Last ride 1 week ago' },
  { initials: 'RS', name: 'Riley Stone', note: 'Airport specialist', car: '2024 BMW i5', plate: 'VLL 673', rating: '4.99', trips: '213', tone: 'amber', last: 'Last ride 3 weeks ago' },
]

const toneClasses: Record<string, string> = {
  violet: 'from-indigo-500 to-blue-700',
  teal: 'from-cyan-500 to-teal-700',
  amber: 'from-amber-400 to-orange-600',
  rose: 'from-rose-400 to-pink-700',
}

export function TrustedCircleScreen() {
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [requested, setRequested] = useState<string | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const visibleDrivers = [0, 1, 2].map((offset) => onlineDrivers[(carouselIndex + offset) % onlineDrivers.length])

  return (
    <main className="trusted-shell min-h-screen overflow-hidden text-white">
      <div className="trusted-glow trusted-glow-one" aria-hidden="true" />
      <div className="trusted-glow trusted-glow-two" aria-hidden="true" />
      <div className="mx-auto w-full max-w-5xl px-5 pb-28 pt-8 sm:px-8 lg:px-10">
        <header className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] shadow-lg shadow-blue-950/20">
              <ShieldCheck className="size-5 text-sky-300" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-300/80">Vella</p>
              <p className="mt-0.5 text-sm font-medium text-white/60">Trusted Circle</p>
            </div>
          </div>
          <button aria-label="More options" className="flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/55 transition hover:bg-white/10 hover:text-white">
            <MoreHorizontal className="size-5" />
          </button>
        </header>

        <section className="mb-11 max-w-xl">
          <div className="mb-4 flex items-center gap-2 text-sky-300">
            <Users className="size-4" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em]">Private by design</span>
          </div>
          <h1 className="font-serif text-4xl leading-[1.08] tracking-[-0.03em] text-white sm:text-5xl">Your people, <span className="text-sky-300">your ride.</span></h1>
          <p className="mt-4 max-w-md text-sm leading-6 text-white/50">Request a familiar face whenever you travel. Your trusted drivers are always one tap away.</p>
        </section>

        <section aria-labelledby="online-heading" className="mb-12">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/35">Available now</p>
              <h2 id="online-heading" className="text-xl font-semibold tracking-tight">Online Now <span className="ml-1 text-sm font-normal text-white/35">{onlineDrivers.length}</span></h2>
            </div>
            <div className="flex gap-2">
              <Button aria-label="Previous driver" variant="ghost" size="icon" onClick={() => setCarouselIndex((carouselIndex - 1 + onlineDrivers.length) % onlineDrivers.length)} className="rounded-full border border-white/10 bg-white/[0.04] text-white/60 hover:bg-white/10 hover:text-white"><ChevronLeft /></Button>
              <Button aria-label="Next driver" variant="ghost" size="icon" onClick={() => setCarouselIndex((carouselIndex + 1) % onlineDrivers.length)} className="rounded-full border border-white/10 bg-white/[0.04] text-white/60 hover:bg-white/10 hover:text-white"><ChevronLeft className="rotate-180" /></Button>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {visibleDrivers.map((driver) => (
              <article key={driver.name} className="online-card group rounded-2xl border border-white/[0.09] bg-white/[0.045] p-4 backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-sky-300/25 hover:bg-white/[0.07]">
                <div className="flex items-start justify-between">
                  {driver.photo ? <img src={driver.photo} alt={`${driver.name} portrait`} className="avatar size-12 rounded-2xl object-cover shadow-lg" /> : <div className={`avatar avatar-${driver.tone} flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br text-sm font-bold text-white shadow-lg`}>{driver.initials}</div>}
                  <span className="flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-2 py-1 text-[10px] font-semibold text-emerald-300"><span className="size-1.5 rounded-full bg-emerald-300 shadow-[0_0_8px] shadow-emerald-300" /> ONLINE</span>
                </div>
                <h3 className="mt-4 text-sm font-semibold text-white">{driver.name}</h3>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-white/40"><Star className="size-3 fill-amber-300 text-amber-300" /> {driver.rating} <span className="text-white/20">·</span> {driver.trips} trips</div>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="all-drivers-heading">
          <div className="mb-4 flex items-end justify-between"><div><p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/35">Your private list</p><h2 id="all-drivers-heading" className="text-xl font-semibold tracking-tight">All drivers <span className="ml-1 text-sm font-normal text-white/35">{drivers.length}</span></h2></div><span className="text-xs text-white/35">Only visible to you</span></div>
          <div className="flex flex-col gap-3">
            {drivers.map((driver) => <article key={driver.name} className="driver-card flex flex-col gap-4 rounded-2xl border border-white/[0.08] bg-[#101927]/80 p-4 shadow-xl shadow-black/10 backdrop-blur-xl sm:flex-row sm:items-center sm:p-5">
              {driver.photo ? <img src={driver.photo} alt={`${driver.name} portrait`} className="avatar size-14 shrink-0 rounded-2xl object-cover shadow-lg" /> : <div className={`avatar avatar-${driver.tone} flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-base font-bold text-white shadow-lg`}>{driver.initials}</div>}
              <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold text-white">{driver.name}</h3><span className="rounded-full border border-sky-300/20 bg-sky-300/10 px-2 py-0.5 text-[10px] font-medium text-sky-200">Trusted</span></div><p className="mt-1 text-xs text-white/42">{driver.note} <span className="mx-1 text-white/15">·</span> {driver.last}</p><div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/55"><span>{driver.car}</span><span className="text-white/20">{driver.plate}</span><span className="flex items-center gap-1"><Star className="size-3 fill-amber-300 text-amber-300" /> {driver.rating}</span></div></div>
              <Button onClick={() => setRequested(driver.name)} className="h-10 rounded-xl bg-sky-400 px-4 text-xs font-semibold text-slate-950 shadow-lg shadow-sky-500/10 hover:bg-sky-300 sm:w-auto">{requested === driver.name ? <><Check data-icon="inline-start" /> Requested</> : 'Request Directly'}</Button>
            </article>)}
          </div>
        </section>
      </div>

      <button onClick={() => setShowAdd(true)} className="add-circle fixed bottom-7 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-sky-200/20 bg-sky-300/15 px-5 py-3 text-sm font-semibold text-sky-100 shadow-2xl shadow-sky-950/50 backdrop-blur-2xl transition hover:-translate-y-1 hover:bg-sky-300/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"><Plus className="size-4" /> Add to Circle</button>
      {showAdd && <div role="dialog" aria-modal="true" aria-labelledby="add-title" className="fixed inset-0 z-10 flex items-end justify-center bg-slate-950/60 p-4 backdrop-blur-sm sm:items-center"><div className="w-full max-w-sm rounded-3xl border border-white/10 bg-[#111b2b] p-6 shadow-2xl"><div className="flex items-start justify-between"><div><p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-300">Grow your circle</p><h2 id="add-title" className="mt-2 text-xl font-semibold">Add a trusted driver</h2></div><button aria-label="Close dialog" onClick={() => setShowAdd(false)} className="text-white/45 hover:text-white"><X className="size-5" /></button></div><p className="mt-3 text-sm leading-6 text-white/50">After your next ride, you can add a driver to your private list from their profile.</p><Button onClick={() => setShowAdd(false)} className="mt-6 w-full rounded-xl bg-sky-400 text-slate-950 hover:bg-sky-300">Got it</Button></div></div>}
    </main>
  )
}
