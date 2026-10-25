import type { ReactElement } from 'react'

/** Panneaux routiers simplifiés, dessinés en SVG (inspirés de la signalisation québécoise). */
const SIGNS: Record<string, ReactElement> = {
  arret: (
    <>
      <polygon points="35,5 65,5 95,35 95,65 65,95 35,95 5,65 5,35" fill="#c8102e" stroke="#fff" strokeWidth="4" />
      <text x="50" y="59" fontSize="22" fontWeight="700" fill="#fff" textAnchor="middle" fontFamily="sans-serif">
        ARRÊT
      </text>
    </>
  ),
  cedez: (
    <>
      <polygon points="5,10 95,10 50,92" fill="#c8102e" />
      <polygon points="22,20 78,20 50,72" fill="#fff" />
    </>
  ),
  danger: (
    <>
      <polygon points="50,3 97,50 50,97 3,50" fill="#ffd100" stroke="#111" strokeWidth="3" />
      <path d="M40 72 V48 Q40 32 56 32 H62" fill="none" stroke="#111" strokeWidth="7" strokeLinecap="round" />
      <polygon points="60,22 74,32 60,42" fill="#111" />
    </>
  ),
  travaux: (
    <>
      <polygon points="50,3 97,50 50,97 3,50" fill="#f58220" stroke="#111" strokeWidth="3" />
      <circle cx="52" cy="30" r="6" fill="#111" />
      <path d="M50 38 L44 58 L36 72 M44 58 L54 72 M48 44 L62 50 M60 50 L70 66" stroke="#111" strokeWidth="5" strokeLinecap="round" fill="none" />
    </>
  ),
  'sens-interdit': (
    <>
      <circle cx="50" cy="50" r="45" fill="#c8102e" />
      <rect x="18" y="42" width="64" height="16" fill="#fff" />
    </>
  ),
  'vitesse-50': (
    <>
      <rect x="15" y="3" width="70" height="94" rx="6" fill="#fff" stroke="#111" strokeWidth="3" />
      <circle cx="50" cy="44" r="26" fill="#fff" stroke="#c8102e" strokeWidth="7" />
      <text x="50" y="54" fontSize="26" fontWeight="700" fill="#111" textAnchor="middle" fontFamily="sans-serif">
        50
      </text>
      <text x="50" y="86" fontSize="11" fontWeight="700" fill="#111" textAnchor="middle" fontFamily="sans-serif">
        MAXIMUM
      </text>
    </>
  ),
  ecole: (
    <>
      <polygon points="50,4 94,40 94,96 6,96 6,40" fill="#c5e600" stroke="#111" strokeWidth="3" />
      <circle cx="38" cy="46" r="6" fill="#111" />
      <circle cx="62" cy="50" r="5" fill="#111" />
      <path d="M38 53 V72 M38 72 L32 86 M38 72 L44 86 M30 60 L46 60" stroke="#111" strokeWidth="5" strokeLinecap="round" />
      <path d="M62 56 V74 M62 74 L57 86 M62 74 L67 86 M55 62 L69 62" stroke="#111" strokeWidth="4.5" strokeLinecap="round" />
    </>
  ),
}

export function RoadSign({ id, label }: { id: string; label: string }) {
  const sign = SIGNS[id]
  if (!sign) return <span className="italic">{label}</span>
  return (
    <svg viewBox="0 0 100 100" width="120" height="120" role="img" aria-label={label} className="drop-shadow">
      {sign}
    </svg>
  )
}
