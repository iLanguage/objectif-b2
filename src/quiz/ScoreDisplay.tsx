import type { DelfSkill } from '../types'
import {
  MARIANOPOLIS_MINIMUMS,
  MARIANOPOLIS_TOTAL,
  SKILL_LABELS,
  evaluateDelf,
  feedbackFor,
  type QuizResult,
} from '../lib/scoring'

export function ScoreDisplay({ result, best }: { result: QuizResult; best?: number }) {
  const feedback = feedbackFor(result.percent)
  const good = result.percent >= 70
  return (
    <div
      role="status"
      className={`rounded-xl border-2 p-5 ${good ? 'border-green-700 bg-green-50' : 'border-amber-600 bg-amber-50'}`}
    >
      <p className="text-sm font-semibold uppercase tracking-wide text-slate-700">Résultat</p>
      <p className="mt-1 text-3xl font-bold">
        {result.percent} % <span className="text-xl font-semibold text-slate-700">— {feedback.label}</span>
      </p>
      <p className="mt-1 text-slate-800">
        {result.points} / {result.max} points.
        {best !== undefined && best > result.percent && ` Ton meilleur score : ${best} %.`}
      </p>
      <p className="mt-2">{feedback.message}</p>
    </div>
  )
}

/** Tableau des quatre épreuves avec les exigences de Marianopolis. */
export function DelfScoreDisplay({ scores }: { scores: Partial<Record<DelfSkill, number>> }) {
  const evaluation = evaluateDelf(scores)
  const skills: DelfSkill[] = ['CO', 'CE', 'PE', 'PO']
  return (
    <div className="card">
      <h2 className="text-xl font-bold">Bilan de l’examen</h2>
      <table className="mt-4 w-full text-left">
        <caption className="sr-only">Notes par épreuve et minimums exigés par Marianopolis</caption>
        <thead>
          <tr className="border-b border-slate-300 text-sm text-slate-600">
            <th scope="col" className="py-2">Épreuve</th>
            <th scope="col" className="py-2">Note</th>
            <th scope="col" className="py-2">Minimum Marianopolis</th>
          </tr>
        </thead>
        <tbody>
          {skills.map((s) => {
            const score = scores[s]
            const ok = score !== undefined && score >= MARIANOPOLIS_MINIMUMS[s]
            return (
              <tr key={s} className="border-b border-slate-200">
                <th scope="row" className="py-2 font-medium">
                  {SKILL_LABELS[s]}
                </th>
                <td className={`py-2 font-semibold ${score === undefined ? 'text-slate-500' : ok ? 'text-green-800' : 'text-red-800'}`}>
                  {score === undefined ? 'À noter' : `${score} / 25`}
                </td>
                <td className="py-2">{MARIANOPOLIS_MINIMUMS[s]} / 25</td>
              </tr>
            )
          })}
          <tr>
            <th scope="row" className="py-2 font-bold">
              Total
            </th>
            <td className="py-2 font-bold">{evaluation.total} / 100</td>
            <td className="py-2">{MARIANOPOLIS_TOTAL} / 100</td>
          </tr>
        </tbody>
      </table>
      <div
        role="status"
        className={`mt-4 rounded-lg p-4 ${
          !evaluation.complete ? 'bg-slate-100' : evaluation.passedMarianopolis ? 'bg-green-50 text-green-900' : 'bg-amber-50 text-amber-900'
        }`}
      >
        {!evaluation.complete ? (
          <p className="font-semibold">Examen incomplet : certaines épreuves ne sont pas encore notées.</p>
        ) : evaluation.passedMarianopolis ? (
          <p className="font-semibold">🎉 Objectif atteint : ce score respecte les exigences de Marianopolis !</p>
        ) : evaluation.passedDelf ? (
          <p className="font-semibold">DELF B2 réussi, mais les exigences de Marianopolis ne sont pas encore atteintes.</p>
        ) : (
          <p className="font-semibold">Pas encore réussi — voici ce qu’il faut travailler :</p>
        )}
        {evaluation.issues.length > 0 && (
          <ul className="mt-2 list-disc pl-5">
            {evaluation.issues.map((issue) => (
              <li key={issue}>{issue}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
