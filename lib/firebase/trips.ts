import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  onSnapshot, 
  query, 
  where, 
  serverTimestamp, 
  orderBy,
  limit,
  getDoc
} from 'firebase/firestore'
import { db } from './config'

export type TripStatus = 'searching' | 'accepted' | 'arrived' | 'in_progress' | 'completed' | 'cancelled'
export type RideType = 'standard' | 'safesister' | 'aviation'

export interface Trip {
  id: string
  passengerId: string
  driverId: string | null
  status: TripStatus
  rideType: RideType
  passengerGender?: 'male' | 'female' | 'other'
  flightNumber?: string
  meetAndGreet?: boolean
  pickup: string
  dropoff: string
  fare: number
  driverLocation?: {
    lat: number
    lng: number
  }
  createdAt: any
}

// 0. Update driver's live GPS location for an active trip
export async function updateDriverLocation(tripId: string, lat: number, lng: number) {
  const tripRef = doc(db, 'trips', tripId)
  await updateDoc(tripRef, { 
    driverLocation: { lat, lng } 
  })
}

// 1. Passenger requests a ride
export async function createTripRequest(
  passengerId: string, 
  pickup: string, 
  dropoff: string, 
  fare: number,
  rideType: RideType = 'standard',
  passengerGender?: 'male' | 'female' | 'other',
  flightNumber?: string,
  meetAndGreet?: boolean
): Promise<string> {
  const tripRef = doc(collection(db, 'trips'))
  
  await setDoc(tripRef, {
    id: tripRef.id,
    passengerId,
    driverId: null,
    status: 'searching',
    rideType,
    passengerGender,
    flightNumber: flightNumber || null,
    meetAndGreet: meetAndGreet || false,
    pickup,
    dropoff,
    fare,
    createdAt: serverTimestamp()
  })

  return tripRef.id
}

// 2. Driver accepts a ride
export async function acceptTrip(tripId: string, driverId: string) {
  const tripRef = doc(db, 'trips', tripId)
  await updateDoc(tripRef, {
    driverId,
    status: 'accepted'
  })
}

// 3. Update trip status (e.g., driver arrived, trip completed)
export async function updateTripStatus(tripId: string, status: TripStatus) {
  const tripRef = doc(db, 'trips', tripId)
  await updateDoc(tripRef, { status })
}

// 4. Passenger listens to their active trip status
export function subscribeToPassengerTrip(
  passengerId: string, 
  callback: (trip: Trip | null) => void
) {
  const q = query(
    collection(db, 'trips'),
    where('passengerId', '==', passengerId),
    where('status', 'in', ['searching', 'accepted', 'arrived', 'in_progress']),
    limit(1)
  )
  
  return onSnapshot(q, (snapshot) => {
    if (snapshot.empty) {
      callback(null)
      return
    }
    const trip = snapshot.docs[0].data() as Trip
    callback(trip)
  })
}

// 5. Driver listens for new ride offers
export function subscribeToAvailableTrips(
  driverProfile: { gender?: 'male'|'female'|'other', safeSisterEnabled?: boolean } | null,
  callback: (trips: Trip[]) => void
) {
  const q = query(
    collection(db, 'trips'),
    where('status', '==', 'searching'),
    orderBy('createdAt', 'desc')
  )
  
  return onSnapshot(q, (snapshot) => {
    let trips = snapshot.docs.map(doc => doc.data() as Trip)
    
    // Client-side filtering for SafeSister to avoid composite index requirement
    if (driverProfile?.safeSisterEnabled && driverProfile.gender === 'female') {
      // Driver wants ONLY SafeSister rides
      trips = trips.filter(t => t.rideType === 'safesister')
    } else {
      // Driver is male or hasn't enabled SafeSister -> hide SafeSister rides
      trips = trips.filter(t => t.rideType !== 'safesister')
    }

    callback(trips)
  })
}

// 6. Driver listens to their currently active trip
export function subscribeToDriverTrip(
  driverId: string,
  callback: (trip: Trip | null) => void
) {
  const q = query(
    collection(db, 'trips'),
    where('driverId', '==', driverId),
    where('status', 'in', ['accepted', 'arrived', 'in_progress']),
    limit(1)
  )

  return onSnapshot(q, (snapshot) => {
    if (snapshot.empty) {
      callback(null)
      return
    }
    const trip = snapshot.docs[0].data() as Trip
    callback(trip)
  })
}

// 7. Passenger history
export function subscribeToPassengerHistory(
  passengerId: string,
  callback: (trips: Trip[]) => void
) {
  const q = query(
    collection(db, 'trips'),
    where('passengerId', '==', passengerId)
  )

  return onSnapshot(q, (snapshot) => {
    // Sort in JS to avoid requiring a composite index setup in Firebase for the MVP
    const trips = snapshot.docs
      .map(doc => doc.data() as Trip)
      .filter(t => t.status === 'completed' || t.status === 'cancelled')
      .sort((a, b) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
        return timeB - timeA;
      })
      
    callback(trips)
  })
}

// 8. Fetch a single trip by ID
export async function getTripById(tripId: string): Promise<Trip | null> {
  const tripRef = doc(db, 'trips', tripId)
  const snapshot = await getDoc(tripRef)
  if (!snapshot.exists()) return null
  return snapshot.data() as Trip
}
