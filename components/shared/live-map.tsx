'use client'

import { APIProvider, Map } from '@vis.gl/react-google-maps'
import { ReactNode } from 'react'

interface LiveMapProps {
  children?: ReactNode
  active?: boolean // used to style the map depending on state
}

export function LiveMap({ children, active }: LiveMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''

  return (
    <div className={`absolute inset-0 w-full h-full ${active ? 'grayscale-0' : 'grayscale'}`}>
      <APIProvider apiKey={apiKey}>
        <Map
          defaultCenter={{ lat: 6.4281, lng: 3.4219 }} // Default to Victoria Island, Lagos
          defaultZoom={13}
          disableDefaultUI={true} // Hide google map controls for clean UI
          mapId="VELLA_MAP_STYLE_ID" // Can add custom map styling ID from Google Cloud Console
          className="w-full h-full"
        >
          {children}
        </Map>
      </APIProvider>
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0a101a] to-transparent pointer-events-none" />
    </div>
  )
}
