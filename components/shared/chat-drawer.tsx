'use client'

import { useState, useEffect, useRef } from 'react'
import { Send, X, MessageSquare } from 'lucide-react'
import { useAuth } from '@/context/auth-context'
import { subscribeToTripMessages, sendMessage, type ChatMessage } from '@/lib/firebase/chat'

interface ChatDrawerProps {
  tripId: string
  isOpen: boolean
  onClose: () => void
}

export function ChatDrawer({ tripId, isOpen, onClose }: ChatDrawerProps) {
  const { user } = useAuth()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen || !tripId) return
    const unsubscribe = subscribeToTripMessages(tripId, (msgs) => {
      setMessages(msgs)
    })
    return () => unsubscribe()
  }, [tripId, isOpen])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!user || !text.trim() || sending) return
    setSending(true)
    try {
      await sendMessage(tripId, user.uid, text.trim())
      setText('')
    } catch (err) {
      console.error(err)
    } finally {
      setSending(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end pointer-events-none">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 pointer-events-auto transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="bg-[#111] w-full max-w-md mx-auto rounded-t-3xl shadow-2xl pointer-events-auto h-[60vh] flex flex-col relative animate-slide-up">
        <div className="flex items-center justify-between p-4 border-b border-[#222]">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-white" />
            <h3 className="font-medium">Trip Chat</h3>
          </div>
          <button onClick={onClose} className="p-2 bg-[#222] rounded-full text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {messages.length === 0 ? (
            <div className="text-center text-slate-500 my-auto text-sm">
              Send a message to your partner.
            </div>
          ) : (
            messages.map((msg) => {
              const isMine = msg.senderId === user?.uid
              return (
                <div key={msg.id} className={`flex w-full ${isMine ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] p-3 rounded-2xl text-sm ${isMine ? 'bg-[#E6FF00] text-black rounded-br-sm' : 'bg-[#222] text-white rounded-bl-sm'}`}>
                    {msg.text}
                  </div>
                </div>
              )
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-[#222] bg-[#0a0a0a]">
          <div className="flex items-center gap-2">
            <input 
              type="text" 
              placeholder="Type a message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 bg-[#222] text-white rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#E6FF00]"
            />
            <button 
              onClick={handleSend}
              disabled={!text.trim() || sending}
              className="p-3 bg-emerald-500 text-black rounded-full disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
