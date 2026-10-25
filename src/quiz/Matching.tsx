import type { MatchingQuestion } from '../types'

interface MatchingProps {
  question: MatchingQuestion
  number: number
  value: Record<string, string> | undefined
  onChange: (value: Record<string, string>) => void
  showResult: boolean
}

/**
 * Appariement accessible : une liste déroulante par élément de gauche,
 * plutôt qu'un glisser-déposer impossible au clavier ou avec TalkBack.
 */
export function Matching({ question, number, value, onChange, showResult }: MatchingProps) {
  const answers = value ?? {}
  const choices = question.pairs.map((p) => p.right).sort((a, b) => a.localeCompare(b, 'fr'))
  const labelId = `label-${question.id}`
  return (
    <div role="group" aria-labelledby={labelId}>
      <p id={labelId} className="text-lg font-semibold">
        <span className="mr-2 text-slate-500">{number}.</span>
        {question.prompt}
      </p>
      <ul className="mt-3 space-y-3">
        {question.pairs.map((pair, i) => {
          const selectId = `${question.id}-${i}`
          const correct = answers[pair.left] === pair.right
          return (
            <li
              key={pair.left}
              className={`flex flex-col gap-2 rounded-lg border-2 p-3 sm:flex-row sm:items-center sm:justify-between ${
                showResult ? (correct ? 'border-green-700 bg-green-50' : 'border-red-700 bg-red-50') : 'border-slate-200 bg-white'
              }`}
            >
              <label htmlFor={selectId} className="font-medium">
                {pair.left}
              </label>
              <div className="flex flex-col sm:items-end">
                <select
                  id={selectId}
                  className="field max-w-full sm:max-w-sm"
                  value={answers[pair.left] ?? ''}
                  disabled={showResult}
                  onChange={(e) => onChange({ ...answers, [pair.left]: e.target.value })}
                >
                  <option value="">— Choisir —</option>
                  {choices.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                {showResult && !correct && (
                  <span className="mt-1 text-sm text-red-800">
                    Bonne réponse : <strong>{pair.right}</strong>
                  </span>
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
