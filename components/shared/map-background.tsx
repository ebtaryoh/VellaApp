import { MapPin } from 'lucide-react'

export function MapBackground({ active = false }: { active?: boolean }) {
  return (
    <div className="vella-map" aria-label="Stylized dark map">
      <div className="map-street street-a" />
      <div className="map-street street-b" />
      <div className="map-street street-c" />
      <div className={`map-route ${active ? 'pulsing-route' : ''}`}>
        <span />
        <span />
        <span />
      </div>
      <div className="map-pin pin-one">
        <MapPin />
      </div>
      <div className="map-pin pin-two">
        <div />
      </div>
      <div className="map-compass">
        N<span>↑</span>
      </div>
    </div>
  )
}
