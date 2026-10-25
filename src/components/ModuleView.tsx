import { Link, useParams } from 'react-router-dom'
import { getModule, mockExams } from '../modules'
import { bestAttempt, completionPercent, lessonStatus, useProgress } from '../lib/progress'
import { examScores } from '../lib/exam'
import { evaluateDelf } from '../lib/scoring'
import { STATUS_LABELS } from './labels'
import { SkillBadge } from './SkillBadge'
import { ProgressBar } from './ProgressBar'
import { NotFound } from './NotFound'

function ExamList() {
  const state = useProgress()
  return (
    <>
      <ul className="space-y-4">
        {mockExams.map((exam) => {
          const scores = examScores(exam, state.exams[exam.id])
          const evaluation = evaluateDelf(scores)
          const graded = Object.keys(scores).length
          return (
            <li key={exam.id} className="card">
              <h2 className="text-xl font-bold">
                <Link to={`/examen/${exam.id}`} className="text-blue-800 underline">
                  {exam.title} — {exam.theme}
                </Link>
              </h2>
              <p className="mt-1 text-slate-700">
                Semaine {exam.week} · CO {exam.co.minutes} min · CE {exam.ce.minutes} min · PE {exam.pe.minutes} min · PO{' '}
                {exam.po.prepMinutes} min de préparation + {exam.po.task.speakMinutes} min
              </p>
              <p className="mt-1 font-semibold">
                {graded === 0
                  ? 'Pas encore commencé'
                  : evaluation.complete
                    ? `Total : ${evaluation.total}/100`
                    : `${graded} épreuve${graded > 1 ? 's' : ''} sur 4 notée${graded > 1 ? 's' : ''}`}
              </p>
            </li>
          )
        })}
      </ul>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link to="/guides/oral" className="card hover:bg-blue-50">
          <span className="text-lg font-bold">🎤 Guide de l’oral</span>
          <span className="block text-slate-700">Fiches : structurer un exposé B2 et réussir le débat.</span>
        </Link>
        <Link to="/grilles" className="card hover:bg-blue-50">
          <span className="text-lg font-bold">📋 Grilles d’évaluation</span>
          <span className="block text-slate-700">Grilles DELF B2 pour le professeur (écrit et oral).</span>
        </Link>
      </div>
    </>
  )
}

export function ModuleView() {
  const { moduleId = '' } = useParams()
  const mod = getModule(moduleId)
  const state = useProgress()
  if (!mod) return <NotFound />

  return (
    <div className="space-y-8">
      <nav aria-label="Fil d’Ariane" className="text-sm">
        <Link to="/" className="underline">
          Tableau de bord
        </Link>{' '}
        › <span aria-current="page">Module {mod.number}</span>
      </nav>
      <header className={`rounded-2xl ${mod.accent} p-6 text-white`}>
        <p className="font-semibold uppercase tracking-wide">
          Module {mod.number} · Semaines {mod.weeks[0]} à {mod.weeks[1]}
        </p>
        <h1 className="mt-1 text-3xl font-bold">{mod.title}</h1>
        <p className="mt-2 text-lg">{mod.subtitle}</p>
      </header>

      <section aria-labelledby="immersion" className="card">
        <h2 id="immersion" className="text-xl font-bold">
          Immersion
        </h2>
        <p className="mt-2">{mod.immersion}</p>
        {mod.sources.length > 0 && (
          <>
            <h3 className="mt-4 font-semibold">Sources authentiques</h3>
            <ul className="mt-1 list-disc space-y-1 pl-6">
              {mod.sources.map((s) =>
                s.url ? (
                  <li key={s.label}>
                    <a href={s.url} target="_blank" rel="noreferrer" className="text-blue-800 underline">
                      {s.label}
                      <span className="sr-only"> (s’ouvre dans un nouvel onglet)</span>
                    </a>
                  </li>
                ) : (
                  <li key={s.label}>{s.label}</li>
                ),
              )}
            </ul>
          </>
        )}
      </section>

      {mod.lessons.length === 0 ? (
        <ExamList />
      ) : (
        <section aria-labelledby="lecons" className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="lecons" className="text-2xl font-bold">
              Leçons
            </h2>
            <div className="w-full max-w-xs">
              <ProgressBar value={completionPercent(mod.lessons, state)} label="Progression du module" color={mod.accent} />
            </div>
          </div>
          <ol className="space-y-3">
            {mod.lessons.map((lesson) => {
              const p = state.lessons[lesson.id]
              const status = STATUS_LABELS[lessonStatus(lesson, p)]
              const best = bestAttempt(p)
              return (
                <li key={lesson.id} className="card relative flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-lg font-bold">
                      <Link to={`/lecon/${lesson.id}`} className="after:absolute after:inset-0 hover:underline">
                        {lesson.id} — {lesson.title}
                      </Link>
                    </h3>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-700">
                      <SkillBadge skill={lesson.skill} />
                      <span>
                        Semaine {lesson.week}
                        {lesson.untilWeek ? `–${lesson.untilWeek}` : ''}
                      </span>
                      <span>· {lesson.quizLabel}</span>
                    </div>
                  </div>
                  <p className={`font-semibold ${status.className}`}>
                    <span aria-hidden="true">{status.icon} </span>
                    {status.label}
                    {best && ` · ${best.percent} %`}
                  </p>
                </li>
              )
            })}
          </ol>
        </section>
      )}
    </div>
  )
}
