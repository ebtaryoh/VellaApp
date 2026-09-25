import { 
  collection, 
  doc, 
  setDoc, 
  onSnapshot, 
  query, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore'
import { db } from './config'

export interface ChatMessage {
  id: string
  senderId: string
  text: string
  createdAt: any
}

// Send a new message
export async function sendMessage(tripId: string, senderId: string, text: string): Promise<void> {
  const messagesRef = collection(db, 'trips', tripId, 'messages')
  const newMsgRef = doc(messagesRef)
  
  await setDoc(newMsgRef, {
    id: newMsgRef.id,
    senderId,
    text,
    createdAt: serverTimestamp()
  })
}

// Listen to messages for a trip
export function subscribeToTripMessages(tripId: string, callback: (messages: ChatMessage[]) => void) {
  const q = query(
    collection(db, 'trips', tripId, 'messages'),
    orderBy('createdAt', 'asc')
  )
  
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => doc.data() as ChatMessage)
    callback(messages)
  })
}
