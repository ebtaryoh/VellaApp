'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { doc, onSnapshot } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase/config'
import { type VellaUser } from '@/lib/firebase/auth'

interface AuthContextValue {
  user: User | null
  profile: VellaUser | null
  loading: boolean
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  profile: null,
  loading: true,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<VellaUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let profileUnsub: () => void

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      
      if (profileUnsub) {
        profileUnsub()
      }

      if (firebaseUser) {
        profileUnsub = onSnapshot(doc(db, 'users', firebaseUser.uid), (docSnap) => {
          if (docSnap.exists()) {
            setProfile(docSnap.data() as VellaUser)
          } else {
            setProfile(null)
          }
          setLoading(false)
        })
      } else {
        setProfile(null)
        setLoading(false)
      }
    })
    
    return () => {
      unsubscribe()
      if (profileUnsub) profileUnsub()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, profile, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
