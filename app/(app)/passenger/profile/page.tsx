'use client'

import { Topbar } from '@/components/shared/topbar'
import { useAuth } from '@/context/auth-context'
import { User, Mail, MapPin, Shield, Edit3 } from 'lucide-react'

export default function ProfilePage() {
  const { profile } = useAuth()

  return (
    <div className="screen-stack">
      <div className="content-screen">
        <Topbar title="Profile & Settings" />
        
        <div className="profile-header">
          <div className="profile-avatar-large">
            {profile?.displayName?.charAt(0).toUpperCase() || 'U'}
          </div>
          <h2>{profile?.displayName || 'User'}</h2>
          <span className="secure-badge">
            <Shield /> Verified {profile?.role}
          </span>
        </div>

        <div className="settings-section">
          <h3>Account Details</h3>
          
          <div className="setting-card">
            <div className="setting-row">
              <div className="setting-icon"><User /></div>
              <div className="setting-content">
                <small>Full Name</small>
                <b>{profile?.displayName}</b>
              </div>
              <button className="text-link"><Edit3 /> Edit</button>
            </div>
            
            <div className="setting-divider" />
            
            <div className="setting-row">
              <div className="setting-icon"><Mail /></div>
              <div className="setting-content">
                <small>Email Address</small>
                <b>{profile?.email}</b>
              </div>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h3>Saved Places</h3>
          
          <div className="setting-card">
            <div className="setting-row">
              <div className="setting-icon"><MapPin /></div>
              <div className="setting-content">
                <small>Home</small>
                <b>Not set</b>
              </div>
              <button className="text-link">Add</button>
            </div>
            
            <div className="setting-divider" />
            
            <div className="setting-row">
              <div className="setting-icon"><MapPin /></div>
              <div className="setting-content">
                <small>Work</small>
                <b>Not set</b>
              </div>
              <button className="text-link">Add</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
