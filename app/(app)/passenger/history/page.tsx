'use client'

import { Topbar } from '@/components/shared/topbar'
import { Map, Clock, ArrowRight, Star } from 'lucide-react'

export default function HistoryPage() {
  const pastTrips = [
    {
      id: 'TRP-001',
      date: 'Yesterday, 4:30 PM',
      from: 'Murtala Muhammed Int. Airport',
      to: 'Eko Hotels & Suites, VI',
      price: '$45.00',
      driver: 'Kolawole B.',
      car: 'Mercedes S-Class',
      rating: 5,
    },
    {
      id: 'TRP-002',
      date: 'Oct 12, 9:15 AM',
      from: 'Lekki Phase 1',
      to: 'Ikoyi Club 1938',
      price: '$28.50',
      driver: 'Chinedu O.',
      car: 'Lexus RX 350',
      rating: 5,
    },
    {
      id: 'TRP-003',
      date: 'Sep 28, 11:45 PM',
      from: 'Quilox',
      to: 'Victoria Island',
      price: '$18.00',
      driver: 'Adebayo T.',
      car: 'Toyota Camry XLE',
      rating: 4,
    }
  ]

  return (
    <div className="screen-stack">
      <div className="content-screen">
        <Topbar title="Ride History" />
        
        <div className="history-list">
          {pastTrips.map((trip) => (
            <div key={trip.id} className="history-card">
              <div className="history-head">
                <div className="history-date">
                  <Clock /> {trip.date}
                </div>
                <strong>{trip.price}</strong>
              </div>
              
              <div className="history-route">
                <div className="history-point">
                  <div className="dot start" />
                  <p>{trip.from}</p>
                </div>
                <div className="history-point">
                  <div className="dot end" />
                  <p>{trip.to}</p>
                </div>
              </div>
              
              <div className="history-foot">
                <div className="history-driver">
                  <div className="driver-mini-avatar">{trip.driver.charAt(0)}</div>
                  <span>{trip.driver} • {trip.car}</span>
                </div>
                <div className="history-rating">
                  {trip.rating} <Star className="filled-star" />
                </div>
              </div>
              
              <button className="receipt-btn">View Receipt <ArrowRight /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
