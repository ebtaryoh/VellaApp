'use client'

import { Star, Sparkles } from 'lucide-react'
import { Topbar } from '@/components/shared/topbar'
import { Button } from '@/components/ui/button'

export default function CircleScreen() { 
  return (
    <div className="screen-stack content-screen">
      <Topbar title="Trusted circle" kicker="Your people, always one tap away."/>
      <div className="circle-intro">
        <h2>Online now <span>3 trusted drivers</span></h2>
        <div className="online-row">
          {['AO','JD','FK'].map((initials, i) => (
            <div className="online-driver" key={initials}>
              <div className={`mini-avatar av-${i}`}>
                {initials}<span/>
              </div>
              <b>{['Amara','Jordan','Fatima'][i]}</b>
              <small>4.{9-i}</small>
            </div>
          ))}
        </div>
      </div>
      <div className="circle-list">
        <div className="list-heading">
          <h2>All drivers</h2>
          <span>5 in your circle</span>
        </div>
        {[
          ['AO','Amara Okafor','Toyota Highlander','LAG 482 FX'],
          ['JD','Jordan Davis','Mercedes C300','LAG 819 KP'],
          ['FK','Fatima Kalu','Lexus RX 350','LAG 210 AB']
        ].map(([initials,name,car,plate], i) => (
          <div className="contact-card" key={name}>
            <div className={`contact-avatar av-${i}`}>{initials}</div>
            <div className="contact-info">
              <b>{name}</b>
              <span><Star/> 4.{9-i} · {car}</span>
              <small>{plate} · {i === 0 ? 'Last trip today' : 'Available on request'}</small>
            </div>
            <Button variant="outline">Request directly</Button>
          </div>
        ))}
      </div>
      <Button className="circle-fab"><Sparkles/> Add to circle</Button>
    </div>
  ) 
}
