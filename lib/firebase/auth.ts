import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  type User,
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp, updateDoc, increment } from 'firebase/firestore'
import { auth, db } from './config'

export type UserRole = 'passenger' | 'driver'

export interface VellaUser {
  uid: string
  email: string
  displayName: string
  role: UserRole
  walletBalance: number
  driverDocs?: string[]
  gender?: 'male' | 'female' | 'other'
  safeSisterEnabled?: boolean
  createdAt: unknown
}

export async function signUp(
  email: string,
  password: string,
  displayName: string,
  role: UserRole
): Promise<VellaUser> {
  const credential = await createUserWithEmailAndPassword(auth, email, password)
  const { user } = credential

  await updateProfile(user, { displayName })

  const vellaUser: VellaUser = {
    uid: user.uid,
    email: user.email!,
    displayName,
    role,
    walletBalance: 0,
    createdAt: serverTimestamp(),
  }

  await setDoc(doc(db, 'users', user.uid), vellaUser)
  return vellaUser
}

export async function signIn(email: string, password: string): Promise<User> {
  const credential = await signInWithEmailAndPassword(auth, email, password)
  return credential.user
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth)
}

export async function getUserProfile(uid: string): Promise<VellaUser | null> {
  const snap = await getDoc(doc(db, 'users', uid))
  if (!snap.exists()) return null
  return snap.data() as VellaUser
}

export async function addFundsToWallet(uid: string, amount: number): Promise<void> {
  const userRef = doc(db, 'users', uid)
  await updateDoc(userRef, {
    walletBalance: increment(amount)
  })
}

export async function cashOutFunds(uid: string, amount: number): Promise<void> {
  const userRef = doc(db, 'users', uid)
  await updateDoc(userRef, {
    walletBalance: increment(-amount)
  })
}

export async function updateUserProfileDetails(
  uid: string, 
  displayName: string,
  gender?: 'male' | 'female' | 'other',
  safeSisterEnabled?: boolean
): Promise<void> {
  const userRef = doc(db, 'users', uid)
  
  const updates: any = { displayName }
  if (gender) updates.gender = gender
  if (safeSisterEnabled !== undefined) updates.safeSisterEnabled = safeSisterEnabled

  await updateDoc(userRef, updates)
  
  if (auth.currentUser && auth.currentUser.uid === uid) {
    await updateProfile(auth.currentUser, { displayName })
  }
}

export async function updateDriverDocuments(uid: string, docUrls: string[]): Promise<void> {
  const userRef = doc(db, 'users', uid)
  await updateDoc(userRef, { driverDocs: docUrls })
}
