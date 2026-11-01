import { useEffect, useRef, useState } from 'react'
import type { PhraseDrill } from '../types'
import { drillSteps, speakingPause, NORMAL_RATE, SLOW_RATE } from '../lib/drill'
import { speak, speechSupported } from '../lib/speech'
import { RichText } from './RichText'
import { REGISTER_LABELS } from './labels'

interface PhraseDrillPlayerProps {
  drill: PhraseDrill
  practised: boolean
  onPractisedChange: (practised: boolean) => void
}

// Un seul exercice à la fois : en lancer un autre arrête celui en cours.
let stopActive: (() => void) | null = null

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms))

/** Exercice guidé : écoute en contexte, puis construction arrière de l'expression. */
export function PhraseDrillPlayer({ drill, practised, onPractisedChange }: PhraseDrillPlayerProps) {
  const supported = speechSupported()
  const steps = drillSteps(drill)
  const [current, setCurrent] = useState<number | null>(null)
  const run = useRef(0)
  // Fonction stable : sert à reconnaître l'exercice en cours d'un rendu à l'autre.
  const stopRef = useRef(() => {
    run.current += 1
    window.speechSynthesis.cancel()
    setCurrent(null)
    if (stopActive === stopRef.current) stopActive = null
  })
  const stop = stopRef.current

  // Quitter la page arrête la voix.
  useEffect(
    () => () => {
      if (stopActive === stopRef.current) stopRef.current()
    },
    [],
  )

  const start = async () => {
    stopActive?.()
    stopActive = stop
    const token = ++run.current
    for (let i = 0; i < steps.length; i++) {
      if (token !== run.current) return
      setCurrent(i)
      const step = steps[i]
      if (step.rate) await speak(step.text, step.rate)
      else await wait(speakingPause(step.text))
      await wait(500)
    }
    if (token === run.current) {
      setCurrent(null)
      stopActive = null
      onPractisedChange(true)
    }
  }

  const hear = (text: string, rate: number) => {
    stopActive?.()
    void speak(text, rate)
  }

  const register = REGISTER_LABELS[drill.register]
  const running = current !== null
  return (
    <li className="card space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <h4 className="text-xl font-bold" lang="fr">
          {drill.phrase}
        </h4>
        <span className={`rounded-full px-3 py-0.5 text-sm font-semibold ${register.className}`}>{register.label}</span>
      </div>
      <p>
        <RichText text={drill.meaning} /> <span className="text-ink-muted" lang="en">({drill.en})</span>
      </p>
      <p className="rounded-lg bg-surface-muted p-3 text-lg" lang="fr">
        {drill.context}
      </p>

      {supported ? (
        <div className="flex flex-wrap items-center gap-3">
          {running ? (
            <button type="button" className="btn-secondary" onClick={stop}>
              ⏹ Arrêter
            </button>
          ) : (
            <button type="button" className="btn-primary" onClick={() => void start()}>
              ▶ Commencer l’exercice
            </button>
          )}
          {current !== null && (
            <p className="font-semibold">
              {steps[current].label}
              {drill.buildUp.includes(steps[current].text) && (
                <span className="ml-2 text-link" lang="fr">
                  « {steps[current].text} »
                </span>
              )}
            </p>
          )}
        </div>
      ) : (
        <p className="rounded-md bg-warning-soft p-3 text-warning-ink">
          Ton navigateur ne propose pas de synthèse vocale. Fais cet exercice avec Gemini : le prompt TA contient les mêmes étapes.
        </p>
      )}

      <div>
        <p className="text-sm font-semibold text-ink-muted">Construire l’expression, en commençant par la fin :</p>
        <ol className="mt-2 flex flex-wrap gap-2">
          {drill.buildUp.map((chunk) => (
            <li key={chunk}>
              <button
                type="button"
                className="btn-secondary min-h-9 px-3 py-1 text-sm"
                disabled={!supported || running}
                aria-label={`Écouter « ${chunk} »`}
                onClick={() => hear(chunk, SLOW_RATE)}
                lang="fr"
              >
                <span aria-hidden="true">🔊</span> {chunk}
              </button>
            </li>
          ))}
          <li>
            <button
              type="button"
              className="btn-secondary min-h-9 px-3 py-1 text-sm"
              disabled={!supported || running}
              onClick={() => hear(drill.context, NORMAL_RATE)}
            >
              <span aria-hidden="true">🔊</span> Toute la phrase
            </button>
          </li>
        </ol>
      </div>

      <label className="flex min-h-11 cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          className="h-5 w-5 accent-primary"
          checked={practised}
          onChange={(e) => onPractisedChange(e.target.checked)}
        />
        J’ai pratiqué cette expression à voix haute
      </label>
    </li>
  )
}
