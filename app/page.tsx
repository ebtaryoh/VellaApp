import Link from 'next/link'
import { ShieldCheck, Sparkles, Plane, ArrowRight, Shield } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-slate-100 font-sans selection:bg-[#63d0ff] selection:text-[#050505] overflow-x-hidden">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-6 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-3">
          <span className="grid place-items-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#74d7ff] to-[#185dba] text-[#03111e] font-serif font-black text-xl shadow-[0_0_20px_rgba(116,215,255,0.3)]">V</span>
          <span className="font-serif text-2xl tracking-tight text-white">Vella</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors hidden md:block">
            Log In
          </Link>
          <Link href="/signup" className="bg-white text-black px-5 py-2.5 rounded-full text-sm font-bold hover:bg-slate-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.15)] flex items-center gap-2">
            Get Started <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 md:pt-52 md:pb-32 px-6 md:px-12 flex flex-col items-center text-center">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#185dba]/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-[#63d0ff]/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#63d0ff]/30 bg-[#63d0ff]/10 text-[#63d0ff] text-xs font-bold uppercase tracking-widest mb-8 relative z-10">
          <Sparkles className="w-4 h-4" /> The New Standard
        </div>
        
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tight leading-[1.1] mb-8 relative z-10 text-white max-w-4xl">
          Mobility, <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#74d7ff] via-white to-[#185dba]">elevated.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-12 relative z-10 leading-relaxed">
          Experience premium rides built around trust, transparency, and safety. 
          Whether you're a passenger seeking comfort or a driver seeking fair economics.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10 w-full sm:w-auto">
          <Link href="/login" className="w-full sm:w-auto bg-[#63d0ff] text-[#05111a] px-8 py-4 rounded-2xl text-base font-bold hover:bg-[#8ee0ff] transition-all shadow-[0_0_30px_rgba(99,208,255,0.3)] hover:shadow-[0_0_40px_rgba(99,208,255,0.5)] hover:-translate-y-1 flex items-center justify-center gap-2">
            Ride with Vella
          </Link>
          <Link href="/login" className="w-full sm:w-auto bg-white/5 border border-white/10 text-white px-8 py-4 rounded-2xl text-base font-bold hover:bg-white/10 transition-all hover:-translate-y-1 flex items-center justify-center gap-2">
            Drive with Vella
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 md:px-12 bg-[#080a0f] relative border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl mb-6">Designed for peace of mind.</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">We've completely re-engineered the ride-hailing experience with features you won't find anywhere else.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-colors group">
              <div className="w-14 h-14 rounded-2xl bg-[#63d0ff]/10 text-[#63d0ff] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Vella Comfort</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Guaranteed AC on every trip, rigorously vetted premium vehicles, and transparent upfront pricing with zero hidden fees.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-b from-pink-500/5 to-transparent border border-pink-500/20 rounded-3xl p-8 hover:border-pink-500/40 transition-colors group">
              <div className="w-14 h-14 rounded-2xl bg-pink-500/10 text-pink-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-7 h-7" />
              </div>
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-xl font-bold">SafeSister</h3>
                <span className="bg-pink-500/20 text-pink-400 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">Exclusive</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                A dedicated matching pool allowing female passengers to exclusively request female drivers for absolute comfort and security.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-b from-amber-500/5 to-transparent border border-amber-500/20 rounded-3xl p-8 hover:border-amber-500/40 transition-colors group">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Plane className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Aviation Concierge</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Seamless airport transfers. Enter your flight number, and we'll track your arrival. Opt-in for our signature terminal Meet & Greet.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 md:px-12 border-t border-white/5 text-center text-sm text-slate-500">
        <p>© {new Date().getFullYear()} Vella Mobility. All rights reserved.</p>
      </footer>
    </div>
  )
}
