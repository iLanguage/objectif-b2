import { useState } from 'react'
import type { Lesson } from '../types'
import { GRILLES } from '../data/grilles-delf'
import { GrilleForm } from '../quiz/GrilleForm'
import { describeAnswer, describeQuestion } from '../ta-prompts'
import { saveLessonGrades, setTeacherComment, type WorkProgress } from '../lib/progress'

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('fr-CA', { dateStyle: 'medium', timeStyle: 'short' })
}

/** Panneau du mode Professeur : notes pédagogiques, historique, grille et commentaire. */
export function TeacherPanel({ lesson, progress }: { lesson: Lesson; progress: WorkProgress | undefined }) {
  const [comment, setComment] = useState(progress?.teacherComment ?? '')
  const [saved, setSaved] = useState(false)
  const lastMissed = progress?.attempts.at(-1)?.missed ?? []
  const productions: ('PE' | 'PO')[] = [...(lesson.writing ? ['PE' as const] : []), ...(lesson.speaking ? ['PO' as const] : [])]

  return (
    <section className="space-y-4 rounded-xl border-2 border-emerald-300 bg-emerald-50 p-5" aria-labelledby="teacher-panel">
      <h2 id="teacher-panel" className="text-xl font-bold text-emerald-950">
        👨‍🏫 Espace professeur
      </h2>

      <div>
        <h3 className="font-semibold">Notes pédagogiques</h3>
        <ul className="mt-2 list-disc space-y-1 pl-6">
          {lesson.teacherNotes.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      </div>

      {lesson.quiz && (
        <div>
          <h3 className="font-semibold">Résultats de l’élève au quiz</h3>
          {progress && progress.attempts.length > 0 ? (
            <>
              <table className="mt-2 w-full max-w-md text-left">
                <caption className="sr-only">Historique des tentatives</caption>
                <thead>
                  <tr className="border-b border-emerald-200 text-sm">
                    <th scope="col" className="py-1">Date</th>
                    <th scope="col" className="py-1">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {progress.attempts.map((a) => (
                    <tr key={a.date} className="border-b border-emerald-100">
                      <td className="py-1">{formatDateTime(a.date)}</td>
                      <td className="py-1 font-semibold">{a.percent} %</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {lastMissed.length > 0 && (
                <>
                  <h4 className="mt-3 font-medium">Questions manquées à la dernière tentative</h4>
                  <ul className="mt-1 list-disc space-y-1 pl-6">
                    {lesson.quiz
                      .filter((q) => lastMissed.includes(q.id))
                      .map((q) => (
                        <li key={q.id}>
                          {describeQuestion(q)} — <span className="text-emerald-900">{describeAnswer(q)}</span>
                        </li>
                      ))}
                  </ul>
                </>
              )}
            </>
          ) : (
            <p className="mt-1 text-slate-700">Pas encore de tentative.</p>
          )}
        </div>
      )}

      {productions.map((skill) => (
        <GrilleForm
          key={skill}
          grille={GRILLES[skill]}
          grades={progress?.grades?.[skill]}
          onSave={(g) => saveLessonGrades(lesson.id, skill, g)}
        />
      ))}

      <div>
        <label htmlFor="teacher-comment" className="font-semibold">
          Commentaire pour l’élève
        </label>
        <textarea
          id="teacher-comment"
          rows={3}
          className="field mt-1 w-full"
          value={comment}
          onChange={(e) => {
            setComment(e.target.value)
            setSaved(false)
          }}
        />
        <div className="mt-2 flex items-center gap-3">
          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              setTeacherComment(lesson.id, comment)
              setSaved(true)
            }}
          >
            Enregistrer le commentaire
          </button>
          <span role="status" className="text-green-800">
            {saved ? 'Commentaire enregistré.' : ''}
          </span>
        </div>
      </div>
    </section>
  )
}
