import { useState } from 'react'
import type { SpeakingTask } from '../types'
import { RichText } from '../components/RichText'
import { Timer } from '../components/Timer'

interface SpeakingPromptProps {
  task: SpeakingTask
  checked: string[]
  onCheckedChange: (checked: string[]) => void
  /** Afficher d'emblée les questions du débat (modes professeur et TA). */
  revealFollowUps?: boolean
}

/** Production orale : document déclencheur, chronomètres de préparation et de passage, auto-évaluation. */
export function SpeakingPrompt({ task, checked, onCheckedChange, revealFollowUps = false }: SpeakingPromptProps) {
  const [showFollowUps, setShowFollowUps] = useState(revealFollowUps)
  return (
    <section className="space-y-4" aria-label={`Production orale : ${task.title}`}>
      <div className="card">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-600">
          Préparation {task.prepMinutes} min · Passage {task.speakMinutes} min
        </p>
        <h3 className="mt-1 text-xl font-bold">{task.title}</h3>
        <div className="prose-lesson mt-3">
          {task.instructions.map((p, i) => (
            <p key={i}>
              <RichText text={p} />
            </p>
          ))}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <Timer minutes={task.prepMinutes} label="Préparation" />
        <Timer minutes={task.speakMinutes} label="Passage" />
      </div>

      <div className="card">
        <h4 className="text-lg font-semibold">Questions possibles pendant le débat</h4>
        <p className="text-slate-700">
          Ne les regarde pas avant de faire ton exposé ! Demande à ton professeur — ou à Gemini en mode vocal — de te les poser.
        </p>
        <button
          type="button"
          className="btn-secondary mt-3"
          aria-expanded={showFollowUps}
          onClick={() => setShowFollowUps((s) => !s)}
        >
          {showFollowUps ? 'Masquer les questions' : 'Afficher les questions'}
        </button>
        {showFollowUps && (
          <ul className="mt-3 list-disc space-y-1 pl-6">
            {task.followUps.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ul>
        )}
      </div>

      <fieldset className="card">
        <legend className="px-1 text-lg font-semibold">Auto-évaluation après mon passage</legend>
        <ul className="mt-2 space-y-2">
          {task.checklist.map((item) => (
            <li key={item}>
              <label className="flex min-h-11 cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  className="mt-1 h-5 w-5 shrink-0 accent-blue-800"
                  checked={checked.includes(item)}
                  onChange={(e) =>
                    onCheckedChange(e.target.checked ? [...checked, item] : checked.filter((c) => c !== item))
                  }
                />
                <span>{item}</span>
              </label>
            </li>
          ))}
        </ul>
      </fieldset>
    </section>
  )
}
