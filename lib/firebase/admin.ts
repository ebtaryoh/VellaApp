import { collection, query, where, getCountFromServer, getAggregateFromServer, sum, getDocs, doc, updateDoc } from 'firebase/firestore'
import { db } from './config'
import type { VellaUser } from './auth'

export async function getAdminMetrics() {
  try {
    // Total Users Count
    const usersColl = collection(db, 'users')
    const usersCountSnap = await getCountFromServer(usersColl)
    const totalUsers = usersCountSnap.data().count

    // Total Completed Rides & Revenue
    const tripsColl = collection(db, 'trips')
    const completedTripsQuery = query(tripsColl, where('status', '==', 'completed'))
    
    const tripsCountSnap = await getCountFromServer(completedTripsQuery)
    const totalRides = tripsCountSnap.data().count

    const revenueSnap = await getAggregateFromServer(completedTripsQuery, {
      totalRevenue: sum('fare')
    })
    // For Vella's revenue, we take a 20% cut of the total fare
    const grossFare = revenueSnap.data().totalRevenue
    const vellaRevenue = grossFare * 0.20

    // Active Rides
    const activeTripsQuery = query(tripsColl, where('status', 'in', ['searching', 'accepted', 'arrived', 'in_progress']))
    const activeTripsSnap = await getCountFromServer(activeTripsQuery)
    const activeRides = activeTripsSnap.data().count

    return {
      totalUsers,
      totalRides,
      vellaRevenue,
      grossFare,
      activeRides
    }
  } catch (error) {
    console.error('Error fetching admin metrics:', error)
    return null
  }
}

export async function getPendingDrivers(): Promise<VellaUser[]> {
  const usersColl = collection(db, 'users')
  const q = query(
    usersColl,
    where('role', '==', 'driver'),
    where('verificationStatus', '==', 'pending')
  )
  
  const snapshot = await getDocs(q)
  return snapshot.docs.map(d => d.data() as VellaUser)
}

export async function verifyDriver(uid: string, status: 'approved' | 'rejected'): Promise<void> {
  const userRef = doc(db, 'users', uid)
  await updateDoc(userRef, {
    verificationStatus: status
  })
}
