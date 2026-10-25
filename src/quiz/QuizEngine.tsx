import { useRef, useState, type FormEvent, type ReactNode } from 'react'
import type { Answer, AutoQuestion } from '../types'
import { scoreQuiz, type QuizResult } from '../lib/scoring'
import { MultipleChoice } from './MultipleChoice'
import { FillInBlank } from './FillInBlank'
import { Matching } from './Matching'
import { ScoreDisplay } from './ScoreDisplay'

export interface QuizGroup {
  id: string
  /** Contenu affiché avant les questions du groupe (document audio ou texte). */
  header: ReactNode
  questions: AutoQuestion[]
}

interface QuizEngineProps {
  questions?: AutoQuestion[]
  /** Questions regroupées par document (examens blancs). */
  groups?: QuizGroup[]
  title?: string
  /** Réponses déjà enregistrées (examens blancs). */
  initialAnswers?: Record<string, Answer>
  initialSubmitted?: boolean
  onAnswerChange?: (questionId: string, answer: Answer) => void
  onSubmit?: (result: QuizResult) => void
  /** Permet de recommencer le quiz après la correction (leçons). */
  allowRetry?: boolean
  bestPercent?: number
  /** Cache le score en pourcentage (examens : le score est affiché sur 25 ailleurs). */
  hideScore?: boolean
}

function isAnswered(q: AutoQuestion, a: Answer | undefined): boolean {
  if (a === undefined) return false
  if (q.type === 'mcq') return typeof a === 'number'
  if (q.type === 'fill') return Array.isArray(a) && a.some((s) => s.trim() !== '')
  return typeof a === 'object' && !Array.isArray(a) && Object.values(a).some(Boolean)
}

/** Moteur de quiz générique : affiche les questions, corrige et explique. */
export function QuizEngine({
  questions: flatQuestions = [],
  groups: groupsProp,
  title = 'Quiz',
  initialAnswers = {},
  initialSubmitted = false,
  onAnswerChange,
  onSubmit,
  allowRetry = false,
  bestPercent,
  hideScore = false,
}: QuizEngineProps) {
  const [answers, setAnswers] = useState<Record<string, Answer>>(initialAnswers)
  const [submitted, setSubmitted] = useState(initialSubmitted)
  const [attempt, setAttempt] = useState(0)
  const resultRef = useRef<HTMLDivElement>(null)
  const groups = groupsProp ?? [{ id: 'quiz', header: null, questions: flatQuestions }]
  const questions = groups.flatMap((g) => g.questions)

  const setAnswer = (id: string, answer: Answer) => {
    setAnswers((prev) => ({ ...prev, [id]: answer }))
    onAnswerChange?.(id, answer)
  }

  const result = scoreQuiz(questions, answers)
  const unanswered = questions.filter((q) => !isAnswered(q, answers[q.id])).length

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    onSubmit?.(result)
    requestAnimationFrame(() => resultRef.current?.focus())
  }

  const retry = () => {
    setAnswers({})
    setSubmitted(false)
    setAttempt((a) => a + 1)
  }

  return (
    <form onSubmit={submit} aria-label={title} noValidate>
      <div key={attempt} className="space-y-8">
        {groups.map((group, g) => {
          const offset = groups.slice(0, g).reduce((n, x) => n + x.questions.length, 0)
          return (
            <div key={group.id} className="space-y-6">
              {group.header}
              <ol className="space-y-6" start={offset + 1}>
                {group.questions.map((q, i) => (
                  <li key={q.id} className="card list-none">
                    {q.type === 'mcq' && (
                      <MultipleChoice
                        question={q}
                        number={offset + i + 1}
                        value={answers[q.id] as number | undefined}
                        onChange={(v) => setAnswer(q.id, v)}
                        showResult={submitted}
                      />
                    )}
                    {q.type === 'fill' && (
                      <FillInBlank
                        question={q}
                        number={offset + i + 1}
                        value={answers[q.id] as string[] | undefined}
                        onChange={(v) => setAnswer(q.id, v)}
                        showResult={submitted}
                      />
                    )}
                    {q.type === 'matching' && (
                      <Matching
                        question={q}
                        number={offset + i + 1}
                        value={answers[q.id] as Record<string, string> | undefined}
                        onChange={(v) => setAnswer(q.id, v)}
                        showResult={submitted}
                      />
                    )}
                    {submitted && q.explanation && (
                      <p className="mt-3 rounded-md bg-slate-100 p-3 text-slate-800">
                        <strong>Explication : </strong>
                        {q.explanation}
                      </p>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          )
        })}
      </div>

      <div className="mt-6" ref={resultRef} tabIndex={-1}>
        {submitted ? (
          <div className="space-y-4">
            {!hideScore && <ScoreDisplay result={result} best={bestPercent} />}
            {allowRetry && (
              <button type="button" className="btn-secondary" onClick={retry}>
                Recommencer le quiz
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-4">
            <button type="submit" className="btn-primary">
              Vérifier mes réponses
            </button>
            {unanswered > 0 && (
              <span className="text-slate-700">
                {unanswered} question{unanswered > 1 ? 's' : ''} sans réponse
              </span>
            )}
          </div>
        )}
      </div>
    </form>
  )
}
