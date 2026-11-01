import { Link } from 'react-router-dom'
import type { Module } from '../types'
import { completionPercent, useProgress } from '../lib/progress'
import { examPrepTasks, mockExams } from '../modules'
import { examComplete } from '../lib/exam'
import { ProgressBar } from './ProgressBar'

/** Carte de module sur le tableau de bord. */
export function ModuleCard({ module: mod }: { module: Module }) {
  const state = useProgress()
  const isExams = mod.id === 'm5'
  const percent = isExams
    ? Math.round((mockExams.filter((e) => examComplete(e, state.exams[e.id])).length / mockExams.length) * 100)
    : completionPercent(mod.lessons, state)
  const count = isExams ? `${examPrepTasks.length} tâches · ${mockExams.length} examens` : `${mod.lessons.length} leçons`
  return (
    <li className="card relative flex flex-col overflow-hidden p-0">
      <div className={`${mod.accent} px-5 py-3 text-on-solid`}>
        <p className="text-sm font-semibold uppercase tracking-wide">Module {mod.number}</p>
        <h3 className="text-lg font-bold leading-snug">
          <Link to={`/module/${mod.id}`} className="after:absolute after:inset-0 hover:underline">
            {mod.title}
          </Link>
        </h3>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <p className="text-ink-soft">{mod.subtitle}</p>
        <p className="text-sm text-ink-muted">
          Semaines {mod.weeks[0]} à {mod.weeks[1]} · {count}
        </p>
        <div className="mt-auto">
          <ProgressBar value={percent} label={isExams ? 'Examens terminés' : 'Leçons terminées'} />
        </div>
      </div>
    </li>
  )
}
