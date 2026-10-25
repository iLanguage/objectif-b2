import { useRef } from 'react'
import type { WritingTask } from '../types'
import { wordCount } from '../lib/scoring'
import { RichText } from '../components/RichText'
import { CopyButton } from '../components/CopyButton'
import { AccentBar } from './AccentBar'
import { insertAtCursor } from '../lib/text'

interface WritingPromptProps {
  task: WritingTask
  text: string
  onTextChange: (text: string) => void
  checked: string[]
  onCheckedChange: (checked: string[]) => void
}

/** Production écrite : consigne, zone de rédaction avec compteur de mots, auto-vérification. */
export function WritingPrompt({ task, text, onTextChange, checked, onCheckedChange }: WritingPromptProps) {
  const area = useRef<HTMLTextAreaElement>(null)
  const words = wordCount(text)
  const enough = words >= task.minWords
  const textareaId = `writing-${task.id}`
  const countId = `${textareaId}-count`

  return (
    <section className="space-y-4" aria-label={`Production écrite : ${task.title}`}>
      <div className="card">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-600">
          {task.genre} · {task.minWords} mots minimum
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

      <div className="card">
        <label htmlFor={textareaId} className="text-lg font-semibold">
          Ton texte
        </label>
        <p className="text-sm text-slate-600">Ton brouillon est enregistré automatiquement sur cet appareil.</p>
        <div className="mt-2">
          <AccentBar onInsert={(c) => onTextChange(insertAtCursor(area.current, text, c))} />
        </div>
        <textarea
          id={textareaId}
          ref={area}
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          rows={14}
          lang="fr"
          spellCheck
          aria-describedby={countId}
          className="field mt-2 w-full leading-relaxed"
        />
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <p id={countId} className={`font-semibold ${enough ? 'text-green-800' : 'text-slate-700'}`}>
            {words} mot{words > 1 ? 's' : ''} / {task.minWords} minimum {enough ? '✓' : ''}
          </p>
          <CopyButton text={text} label="Copier mon texte (pour Gemini)" />
        </div>
      </div>

      <fieldset className="card">
        <legend className="px-1 text-lg font-semibold">Avant de rendre : ma liste de vérification</legend>
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
