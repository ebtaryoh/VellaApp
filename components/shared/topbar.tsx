import { ArrowLeft } from 'lucide-react'

export function Topbar({ 
  title, 
  kicker, 
  onBack 
}: { 
  title: string; 
  kicker: string; 
  onBack?: () => void 
}) {
  return (
    <header className="vella-topbar">
      {onBack && (
        <button className="icon-button" onClick={onBack} aria-label="Go back">
          <ArrowLeft />
        </button>
      )}
      <div>
        <p className="kicker">{kicker}</p>
        <h1>{title}</h1>
      </div>
      <div className="status-pill">
        <span /> Live
      </div>
    </header>
  )
}
