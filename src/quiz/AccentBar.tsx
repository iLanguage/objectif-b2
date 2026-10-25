const ACCENTS = ['é', 'è', 'ê', 'à', 'â', 'ç', 'ù', 'û', 'î', 'ï', 'ô', 'ë', 'œ', '’']

/**
 * Boutons pour taper les lettres accentuées sans clavier français.
 * `onMouseDown` empêche le champ de perdre le focus quand on clique.
 */
export function AccentBar({ onInsert, disabled }: { onInsert: (char: string) => void; disabled?: boolean }) {
  return (
    <div role="group" aria-label="Lettres accentuées" className="flex flex-wrap gap-1">
      {ACCENTS.map((c) => (
        <button
          key={c}
          type="button"
          disabled={disabled}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => onInsert(c)}
          aria-label={`Insérer ${c}`}
          className="min-h-9 min-w-9 rounded border border-slate-300 bg-white px-2 font-mono text-lg hover:bg-slate-100 disabled:opacity-50"
        >
          {c}
        </button>
      ))}
    </div>
  )
}
