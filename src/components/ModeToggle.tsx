import { useEffect } from 'react'
import { setMode, useMode } from '../lib/progress'
import { MODES } from './labels'
import { trackMode } from '../lib/newrelic'

/** Sélecteur Élève / Professeur / TA, sous forme de boutons radio (accessible au clavier). */
export function ModeToggle() {
  const mode = useMode()

  useEffect(() => {
    trackMode(mode)
  }, [mode])

  return (
    <fieldset className="flex flex-wrap items-center gap-1 rounded-xl bg-blue-950/40 p-1">
      <legend className="sr-only">Mode d’affichage</legend>
      {MODES.map((m) => (
        <label
          key={m.id}
          title={m.description}
          className={`flex min-h-11 cursor-pointer items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-semibold has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-white ${
            mode === m.id ? 'bg-white text-blue-900' : 'text-white hover:bg-blue-800'
          }`}
        >
          <input
            type="radio"
            name="mode"
            value={m.id}
            checked={mode === m.id}
            onChange={() => setMode(m.id)}
            className="sr-only"
          />
          <span aria-hidden="true">{m.icon}</span>
          {m.label}
        </label>
      ))}
    </fieldset>
  )
}
