import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from './config'

export async function uploadDriverDocument(userId: string, file: File, docType: string): Promise<string> {
  // Create a reference to 'driver_docs/userId/docType_filename'
  const fileExt = file.name.split('.').pop()
  const fileName = `${docType}_${Date.now()}.${fileExt}`
  const storageRef = ref(storage, `driver_docs/${userId}/${fileName}`)

  // Upload the file
  await uploadBytes(storageRef, file)

  // Return the public download URL
  const downloadUrl = await getDownloadURL(storageRef)
  return downloadUrl
}
