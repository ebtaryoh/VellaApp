'use client'

import { useState } from 'react'
import { Topbar } from '@/components/shared/topbar'
import { useAuth } from '@/context/auth-context'
import { User, Mail, MapPin, Shield, Edit3, Check, X, Users, Heart } from 'lucide-react'
import { updateUserProfileDetails } from '@/lib/firebase/auth'
import { signOut } from '@/lib/firebase/auth'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const { user, profile } = useAuth()
  const router = useRouter()
  
  const [isEditing, setIsEditing] = useState(false)
  const [newName, setNewName] = useState('')
  const [gender, setGender] = useState<'male' | 'female' | 'other' | undefined>(undefined)
  const [safeSisterEnabled, setSafeSisterEnabled] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleEdit = () => {
    setNewName(profile?.displayName || '')
    setGender(profile?.gender)
    setSafeSisterEnabled(profile?.safeSisterEnabled || false)
    setIsEditing(true)
  }

  const handleSave = async () => {
    if (!user || !newName.trim()) {
      setIsEditing(false)
      return
    }

    setSaving(true)
    try {
      await updateUserProfileDetails(user.uid, newName.trim(), gender, safeSisterEnabled)
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

            <div className="setting-divider" />

            <div className="setting-row items-center">
              <div className="setting-icon"><Users /></div>
              <div className="setting-content flex-1">
                <small>Gender</small>
                {isEditing ? (
                  <select 
                    value={gender || ''}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full bg-transparent border-b border-[#333] text-white focus:outline-none focus:border-white py-1 mt-1 appearance-none"
                  >
                    <option value="" className="text-black">Select Gender</option>
                    <option value="female" className="text-black">Female</option>
                    <option value="male" className="text-black">Male</option>
                    <option value="other" className="text-black">Other</option>
                  </select>
                ) : (
                  <b className="capitalize">{profile?.gender || 'Not specified'}</b>
                )}
              </div>
            </div>

            {((isEditing && gender === 'female') || (!isEditing && profile?.gender === 'female')) && (
              <>
                <div className="setting-divider" />
                <div className="setting-row items-center">
                  <div className="setting-icon"><Heart className="text-pink-400" /></div>
                  <div className="setting-content flex-1">
                    <small>SafeSister (Women-only)</small>
                    <p className="text-xs text-slate-400 mt-1">Match exclusively with female {profile?.role === 'driver' ? 'passengers' : 'drivers'}.</p>
                  </div>
                  <div>
                    {isEditing ? (
                      <button 
                        onClick={() => setSafeSisterEnabled(!safeSisterEnabled)}
                        className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors focus:outline-none ${safeSisterEnabled ? 'bg-pink-500' : 'bg-[#333]'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${safeSisterEnabled ? 'translate-x-7' : 'translate-x-1'}`} />
                      </button>
                    ) : (
                      <b className={profile?.safeSisterEnabled ? 'text-pink-400' : ''}>
                        {profile?.safeSisterEnabled ? 'Enabled' : 'Disabled'}
                      </b>
                    )}
                  </div>
                </div>
              </>
            )}

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

        <div className="mt-8 flex justify-center">
          <button 
            onClick={async () => {
              await signOut()
              router.replace('/login')
            }}
            className="flex items-center gap-2 px-6 py-3 rounded-full border border-red-500/30 text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  )
}
