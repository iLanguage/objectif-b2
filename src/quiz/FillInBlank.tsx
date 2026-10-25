import { Fragment, useRef } from 'react'
import type { FillInBlankQuestion } from '../types'
import { normalizeAnswer } from '../lib/scoring'
import { AccentBar } from './AccentBar'
import { insertAtCursor } from '../lib/text'

interface FillInBlankProps {
  question: FillInBlankQuestion
  number: number
  value: string[] | undefined
  onChange: (value: string[]) => void
  showResult: boolean
}

export function FillInBlank({ question, number, value, onChange, showResult }: FillInBlankProps) {
  const parts = question.text.split('___')
  const blanks = question.answers.length
  const answers = value ?? Array.from({ length: blanks }, () => '')
  const inputs = useRef<(HTMLInputElement | null)[]>([])
  const lastFocused = useRef(0)
  const labelId = `label-${question.id}`

  const setAt = (i: number, text: string) => {
    const next = [...answers]
    next[i] = text
    onChange(next)
  }

  const isCorrect = (i: number) => {
    const given = normalizeAnswer(answers[i] ?? '')
    return given !== '' && question.answers[i].some((a) => normalizeAnswer(a) === given)
  }

  return (
    <div role="group" aria-labelledby={labelId}>
      <p id={labelId} className="text-lg font-semibold">
        <span className="mr-2 text-slate-500">{number}.</span>
        Complète la phrase.
        {question.hint && <span className="ml-2 font-normal text-slate-600">Indice : {question.hint}</span>}
      </p>
      <p className="mt-3 text-lg leading-[2.6]">
        {parts.map((part, i) => (
          <Fragment key={i}>
            {part}
            {i < blanks && (
              <span className="inline-flex flex-col align-middle">
                <input
                  ref={(el) => {
                    inputs.current[i] = el
                  }}
                  type="text"
                  value={answers[i] ?? ''}
                  onChange={(e) => setAt(i, e.target.value)}
                  onFocus={() => (lastFocused.current = i)}
                  disabled={showResult}
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  aria-label={`Trou ${i + 1} sur ${blanks}`}
                  className={`field mx-1 w-44 py-1 ${
                    showResult ? (isCorrect(i) ? 'border-2 border-green-700 bg-green-50' : 'border-2 border-red-700 bg-red-50') : ''
                  }`}
                />
              </span>
            )}
          </Fragment>
        ))}
      </p>
      {!showResult && (
        <div className="mt-2">
          <AccentBar
            onInsert={(c) => {
              const i = lastFocused.current
              setAt(i, insertAtCursor(inputs.current[i], answers[i] ?? '', c))
            }}
          />
        </div>
      )}
      {showResult && (
        <ul className="mt-2 space-y-1">
          {question.answers.map((accepted, i) =>
            isCorrect(i) ? null : (
              <li key={i} className="text-red-800">
                Trou {i + 1} : la bonne réponse est <strong>{accepted[0]}</strong>
                {answers[i] ? ` (tu as écrit « ${answers[i]} »)` : ' (pas de réponse)'}
              </li>
            ),
          )}
        </ul>
      )}
    </div>
  )
}
