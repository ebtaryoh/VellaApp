'use client'

import { APIProvider, Map } from '@vis.gl/react-google-maps'
import { ReactNode } from 'react'

interface LiveMapProps {
  children?: ReactNode
  active?: boolean // used to style the map depending on state
  center?: { lat: number, lng: number }
}

export function LiveMap({ children, active, center }: LiveMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
  
  // Default to Victoria Island, Lagos if no center provided
  const mapCenter = center || { lat: 6.4281, lng: 3.4219 }

  return (
    <div className={`absolute inset-0 w-full h-full ${active ? 'grayscale-0' : 'grayscale'}`}>
      <APIProvider apiKey={apiKey}>
        <Map
          center={mapCenter}
          defaultZoom={15}
          disableDefaultUI={true}
          mapId="VELLA_MAP_STYLE_ID"
          className="w-full h-full"
          gestureHandling="greedy"
        >
          {children}
        </Map>
      </APIProvider>
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none" />
    </div>
  )
}
