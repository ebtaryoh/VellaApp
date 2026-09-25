'use client'

import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete"
import { MapPin, Navigation } from 'lucide-react'

interface LocationSearchProps {
  onSelectPlace: (address: string, lat: number, lng: number) => void
  placeholder?: string
}

export function LocationSearch({ onSelectPlace, placeholder = "Where to?" }: LocationSearchProps) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      // Prioritize Nigeria (Lagos specifically, but this biases country)
      componentRestrictions: { country: 'ng' }
    },
    debounce: 300,
  })

  const handleSelect =
    ({ description }: { description: string }) =>
    () => {
      setValue(description, false)
      clearSuggestions()

      getGeocode({ address: description }).then((results) => {
        const { lat, lng } = getLatLng(results[0])
        onSelectPlace(description, lat, lng)
      })
    }

  return (
    <div className="relative w-full text-slate-800">
      <div className="flex items-center bg-white rounded-xl px-4 py-3 shadow-lg border border-slate-200 focus-within:ring-2 focus-within:ring-[#63d0ff]">
        <MapPin className="w-5 h-5 text-slate-400 mr-3" />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent border-none outline-none text-sm font-medium text-slate-800 placeholder-slate-400"
        />
        <Navigation className="w-4 h-4 text-[#63d0ff]" />
      </div>

      {/* Autocomplete Suggestions Dropdown */}
      {status === "OK" && (
        <ul className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl overflow-hidden z-50 border border-slate-100 max-h-60 overflow-y-auto">
          {data.map((suggestion) => {
            const {
              place_id,
              structured_formatting: { main_text, secondary_text },
            } = suggestion

            return (
              <li
                key={place_id}
                onClick={handleSelect(suggestion)}
                className="px-4 py-3 cursor-pointer hover:bg-slate-50 border-b border-slate-100 last:border-0 flex flex-col"
              >
                <strong className="text-sm font-semibold">{main_text}</strong>
                <small className="text-xs text-slate-500">{secondary_text}</small>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
