'use client'

import { useState } from 'react'
import { Topbar } from '@/components/shared/topbar'
import { useAuth } from '@/context/auth-context'
import { User, Mail, MapPin, Shield, Edit3, Check, X } from 'lucide-react'
import { updateUserProfileDetails } from '@/lib/firebase/auth'

export default function ProfilePage() {
  const { user, profile } = useAuth()
  
  const [isEditing, setIsEditing] = useState(false)
  const [newName, setNewName] = useState('')
  const [saving, setSaving] = useState(false)

  const handleEdit = () => {
    setNewName(profile?.displayName || '')
    setIsEditing(true)
  }

  const handleSave = async () => {
    if (!user || !newName.trim() || newName.trim() === profile?.displayName) {
      setIsEditing(false)
      return
    }

    setSaving(true)
    try {
      await updateUserProfileDetails(user.uid, newName.trim())
      setIsEditing(false)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

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
            <div className="setting-row items-center">
              <div className="setting-icon"><User /></div>
              <div className="setting-content flex-1">
                <small>Full Name</small>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={newName} 
                    onChange={e => setNewName(e.target.value)}
                    className="w-full bg-transparent border-b border-[#333] text-white focus:outline-none focus:border-white py-1 mt-1"
                    autoFocus
                  />
                ) : (
                  <b>{profile?.displayName}</b>
                )}
              </div>
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <button onClick={() => setIsEditing(false)} className="text-slate-400 p-2"><X className="w-5 h-5"/></button>
                  <button onClick={handleSave} disabled={saving} className="text-emerald-400 p-2">
                    {saving ? <span className="auth-spinner" style={{width: 20, height: 20}}/> : <Check className="w-5 h-5"/>}
                  </button>
                </div>
              ) : (
                <button onClick={handleEdit} className="text-link"><Edit3 /> Edit</button>
              )}
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
