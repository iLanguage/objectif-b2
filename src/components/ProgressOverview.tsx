import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { modules, mockExams } from '../modules'
import {
  bestAttempt,
  exportProgress,
  importProgress,
  lessonStatus,
  resetProgress,
  useProgress,
} from '../lib/progress'
import { examScores } from '../lib/exam'
import { evaluateDelf, PASSING_PERCENT } from '../lib/scoring'
import { GRILLES, grilleTotal } from '../data/grilles-delf'
import { STATUS_LABELS } from './labels'

function download(filename: string, content: string) {
  const url = URL.createObjectURL(new Blob([content], { type: 'application/json' }))
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function ExportImport() {
  const input = useRef<HTMLInputElement>(null)
  const [message, setMessage] = useState('')
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        className="btn-primary"
        onClick={() => download(`objectif-b2-progression-${new Date().toISOString().slice(0, 10)}.json`, exportProgress())}
      >
        Exporter la progression
      </button>
      <label className="btn-secondary cursor-pointer has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-blue-600">
        Importer un fichier
        <input
          ref={input}
          type="file"
          accept="application/json,.json"
          className="sr-only"
          onChange={async (e) => {
            const file = e.target.files?.[0]
            if (!file) return
            const ok = importProgress(await file.text())
            setMessage(ok ? 'Progression importée.' : 'Fichier invalide : rien n’a été modifié.')
            if (input.current) input.current.value = ''
          }}
        />
      </label>
      <button
        type="button"
        className="btn-secondary"
        onClick={() => {
          if (window.confirm('Effacer toute la progression enregistrée sur cet appareil ? Pense à exporter avant.')) {
            resetProgress()
            setMessage('Progression effacée.')
          }
        }}
      >
        Tout effacer
      </button>
      <span role="status" className="text-slate-800">
        {message}
      </span>
    </div>
  )
}

/** Vue d'ensemble pour le professeur : chaque leçon, son statut, ses scores et ses notes. */
export function ProgressOverview({ compact = false }: { compact?: boolean }) {
  const state = useProgress()
  const lessons = modules.flatMap((m) => m.lessons.map((l) => ({ module: m, lesson: l })))
  const weak = lessons.filter(({ lesson }) => {
    const best = bestAttempt(state.lessons[lesson.id])
    return best !== undefined && best.percent < PASSING_PERCENT
  })

  if (compact) {
    const done = lessons.filter(({ lesson }) => lessonStatus(lesson, state.lessons[lesson.id]) === 'terminee').length
    return (
      <section aria-labelledby="suivi" className="rounded-xl border-2 border-emerald-300 bg-emerald-50 p-5">
        <h2 id="suivi" className="text-xl font-bold text-emerald-950">
          👨‍🏫 Suivi de l’élève
        </h2>
        <p className="mt-2">
          {done} leçons terminées sur {lessons.length}. {weak.length} quiz sous {PASSING_PERCENT} % :
          {weak.length === 0 ? ' aucun.' : ''}
        </p>
        {weak.length > 0 && (
          <ul className="mt-1 list-disc pl-6">
            {weak.map(({ lesson }) => (
              <li key={lesson.id}>
                <Link to={`/lecon/${lesson.id}`} className="text-blue-800 underline">
                  {lesson.id} {lesson.title}
                </Link>{' '}
                ({bestAttempt(state.lessons[lesson.id])?.percent} %)
              </li>
            ))}
          </ul>
        )}
        <Link to="/progression" className="btn-primary mt-4">
          Tableau de suivi complet
        </Link>
      </section>
    )
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Suivi de la progression</h1>
        <p className="mt-2 max-w-3xl text-slate-700">
          La progression est enregistrée dans le navigateur de l’élève. Pour la consulter sur un autre appareil, l’élève exporte un
          fichier et le professeur l’importe ici.
        </p>
      </header>

      <section aria-labelledby="sauvegarde" className="card">
        <h2 id="sauvegarde" className="text-xl font-bold">
          Sauvegarde
        </h2>
        <div className="mt-3">
          <ExportImport />
        </div>
      </section>

      <section aria-labelledby="lecons" className="card overflow-x-auto">
        <h2 id="lecons" className="text-xl font-bold">
          Leçons
        </h2>
        <table className="mt-3 w-full min-w-[40rem] text-left">
          <caption className="sr-only">Statut, meilleur score et notes de chaque leçon</caption>
          <thead>
            <tr className="border-b border-slate-300 text-sm text-slate-600">
              <th scope="col" className="py-2 pr-3">Leçon</th>
              <th scope="col" className="py-2 pr-3">Statut</th>
              <th scope="col" className="py-2 pr-3">Meilleur score</th>
              <th scope="col" className="py-2 pr-3">Tentatives</th>
              <th scope="col" className="py-2">Grille</th>
            </tr>
          </thead>
          <tbody>
            {lessons.map(({ lesson }) => {
              const p = state.lessons[lesson.id]
              const best = bestAttempt(p)
              const status = STATUS_LABELS[lessonStatus(lesson, p)]
              const grades = (['PE', 'PO'] as const)
                .filter((s) => p?.grades?.[s])
                .map((s) => `${s} ${grilleTotal(GRILLES[s], p?.grades?.[s])}/25`)
              return (
                <tr key={lesson.id} className="border-b border-slate-100">
                  <th scope="row" className="py-2 pr-3 font-normal">
                    <Link to={`/lecon/${lesson.id}`} className="text-blue-800 underline">
                      {lesson.id} {lesson.title}
                    </Link>
                  </th>
                  <td className={`py-2 pr-3 font-semibold ${status.className}`}>{status.label}</td>
                  <td className={`py-2 pr-3 ${best && best.percent < PASSING_PERCENT ? 'font-semibold text-red-800' : ''}`}>
                    {best ? `${best.percent} %` : '—'}
                  </td>
                  <td className="py-2 pr-3">{p?.attempts.length ?? 0}</td>
                  <td className="py-2">{grades.join(' · ') || '—'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>

      <section aria-labelledby="examens" className="card overflow-x-auto">
        <h2 id="examens" className="text-xl font-bold">
          Examens blancs
        </h2>
        <table className="mt-3 w-full min-w-[36rem] text-left">
          <caption className="sr-only">Notes des examens blancs sur 25 par épreuve</caption>
          <thead>
            <tr className="border-b border-slate-300 text-sm text-slate-600">
              <th scope="col" className="py-2 pr-3">Examen</th>
              <th scope="col" className="py-2 pr-3">CO</th>
              <th scope="col" className="py-2 pr-3">CE</th>
              <th scope="col" className="py-2 pr-3">PE</th>
              <th scope="col" className="py-2 pr-3">PO</th>
              <th scope="col" className="py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {mockExams.map((exam) => {
              const scores = examScores(exam, state.exams[exam.id])
              const evaluation = evaluateDelf(scores)
              return (
                <tr key={exam.id} className="border-b border-slate-100">
                  <th scope="row" className="py-2 pr-3 font-normal">
                    <Link to={`/examen/${exam.id}`} className="text-blue-800 underline">
                      {exam.title}
                    </Link>
                  </th>
                  {(['CO', 'CE', 'PE', 'PO'] as const).map((s) => (
                    <td key={s} className="py-2 pr-3">
                      {scores[s] ?? '—'}
                    </td>
                  ))}
                  <td className="py-2 font-semibold">{evaluation.complete ? `${evaluation.total}/100` : '—'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>
    </div>
  )
}
