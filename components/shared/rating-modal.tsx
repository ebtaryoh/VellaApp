'use client'

import { useState } from 'react'
import { Star, ShieldAlert, ArrowRight } from 'lucide-react'

interface RatingModalProps {
  isOpen: boolean
  onClose: () => void
  targetName: string
  role: 'driver' | 'passenger'
  fare?: string
}

export function RatingModal({ isOpen, onClose, targetName, role, fare }: RatingModalProps) {
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [tip, setTip] = useState(0)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#0a101a] border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[#185dba]/20 to-transparent pointer-events-none" />

        <div className="text-center relative z-10">
          <h2 className="font-[Georgia] text-2xl text-white mb-2">How was your trip?</h2>
          <p className="text-sm text-slate-400 mb-8">
            Rate your {role === 'driver' ? 'driver' : 'passenger'}, {targetName}
          </p>

          <div className="flex justify-center gap-2 mb-8">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="bg-transparent border-0 p-2 cursor-pointer transition-transform hover:scale-110"
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(star)}
              >
                <Star
                  className={`w-10 h-10 transition-colors ${
                    star <= (hover || rating)
                      ? 'fill-[#f5bd62] text-[#f5bd62]'
                      : 'text-slate-600'
                  }`}
                />
              </button>
            ))}
          </div>

          {role === 'driver' && (
            <div className="mb-8">
              <p className="text-sm text-slate-400 mb-4">Add a tip</p>
              <div className="flex justify-center gap-3">
                {[2, 5, 10].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setTip(amount)}
                    className={`px-6 py-3 rounded-xl text-sm font-medium border transition-all ${
                      tip === amount
                        ? 'bg-[#10b981]/20 border-[#10b981] text-[#6ee7b7]'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    ${amount}
                  </button>
                ))}
              </div>
            </div>
          )}

          {fare && (
            <div className="py-4 border-t border-white/10 mb-6 flex justify-between items-center">
              <span className="text-sm text-slate-400">Total Charged</span>
              <strong className="text-xl font-[Georgia] text-[#90e2ff]">{fare}</strong>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <button
              onClick={onClose}
              disabled={rating === 0}
              className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all ${
                rating > 0
                  ? 'bg-[#63d0ff] text-[#05111a] hover:opacity-90 shadow-[0_0_28px_rgba(66,190,247,0.2)]'
                  : 'bg-white/5 text-slate-500 cursor-not-allowed'
              }`}
            >
              Submit Rating <ArrowRight className="w-4 h-4" />
            </button>
            
            <button className="text-xs text-red-400/80 hover:text-red-400 flex items-center justify-center gap-2 py-2">
              <ShieldAlert className="w-3 h-3" /> Report an issue
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
