import { useState } from 'react'
import { grilleMax, grilleTotal, type Grille } from '../data/grilles-delf'
import type { Grades } from '../lib/progress'

interface GrilleFormProps {
  grille: Grille
  grades: Grades | undefined
  onSave?: (grades: Grades) => void
  /** Affichage seul (mode élève) : l'élève voit la note du professeur. */
  readOnly?: boolean
  title?: string
}

function steps(max: number): number[] {
  return Array.from({ length: max * 2 + 1 }, (_, i) => i / 2)
}

const fmt = (n: number) => n.toLocaleString('fr-CA')

/** Grille DELF à remplir critère par critère (paliers de 0,5 point). */
export function GrilleForm({ grille, grades, onSave, readOnly = false, title }: GrilleFormProps) {
  const [draft, setDraft] = useState<Grades>(grades ?? {})
  const [saved, setSaved] = useState(false)
  const values = readOnly ? (grades ?? {}) : draft
  const total = grilleTotal(grille, values)
  const max = grilleMax(grille)

  return (
    <section className="card" aria-label={title ?? grille.title}>
      <h3 className="text-lg font-bold">{title ?? grille.title}</h3>
      {grille.groups.map((group) => (
        <fieldset key={group.title} className="mt-4">
          <legend className="font-semibold text-slate-800">{group.title}</legend>
          <ul className="mt-2 space-y-3">
            {group.criteria.map((c) => {
              const id = `${grille.skill}-${c.id}`
              return (
                <li key={c.id} className="flex flex-col gap-2 border-b border-slate-100 pb-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <label htmlFor={id} className="font-medium">
                      {c.label} <span className="text-slate-600">(/{fmt(c.max)})</span>
                    </label>
                    <p className="text-sm text-slate-600">{c.descriptor}</p>
                  </div>
                  {readOnly ? (
                    <span className="font-semibold">{values[c.id] === undefined ? '—' : fmt(values[c.id])}</span>
                  ) : (
                    <select
                      id={id}
                      className="field w-28"
                      value={values[c.id] ?? ''}
                      onChange={(e) => {
                        setSaved(false)
                        const next = { ...draft }
                        if (e.target.value === '') delete next[c.id]
                        else next[c.id] = Number(e.target.value)
                        setDraft(next)
                      }}
                    >
                      <option value="">—</option>
                      {steps(c.max).map((s) => (
                        <option key={s} value={s}>
                          {fmt(s)}
                        </option>
                      ))}
                    </select>
                  )}
                </li>
              )
            })}
          </ul>
        </fieldset>
      ))}
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <p className="text-xl font-bold" aria-live="polite">
          Total : {fmt(total)} / {max}
        </p>
        {!readOnly && onSave && (
          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              onSave(draft)
              setSaved(true)
            }}
          >
            Enregistrer la note
          </button>
        )}
        <span role="status" className="text-green-800">
          {saved ? 'Note enregistrée.' : ''}
        </span>
      </div>
    </section>
  )
}
