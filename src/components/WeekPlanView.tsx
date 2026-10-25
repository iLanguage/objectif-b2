import { Link } from 'react-router-dom'
import type { Lesson } from '../types'
import { formatDate, type WeekPlan } from '../data/syllabus'
import { lessonStatus, useProgress } from '../lib/progress'
import { STATUS_LABELS } from './labels'
import { SkillBadge } from './SkillBadge'

function LessonLink({ lesson }: { lesson: Lesson }) {
  const state = useProgress()
  const status = STATUS_LABELS[lessonStatus(lesson, state.lessons[lesson.id])]
  return (
    <li className="flex flex-wrap items-center gap-2">
      <span className={status.className} aria-label={status.label} role="img">
        {status.icon}
      </span>
      <Link to={`/lecon/${lesson.id}`} className="font-medium text-blue-800 underline">
        {lesson.id} — {lesson.title}
      </Link>
      <SkillBadge skill={lesson.skill} />
    </li>
  )
}

export function WeekPlanView({ plan, headingLevel = 3 }: { plan: WeekPlan; headingLevel?: 2 | 3 }) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3'
  const empty = plan.foundations.length + plan.lessons.length + plan.exams.length === 0
  return (
    <div>
      <Heading className="text-lg font-bold">
        Semaine {plan.week} <span className="font-normal text-slate-600">· du {formatDate(plan.start)}</span>
      </Heading>
      {plan.phase && (
        <p className="text-sm text-slate-700">
          Phase {plan.phase.id} ({plan.phase.level}) : {plan.phase.title}
        </p>
      )}
      {plan.milestones.map((m) => (
        <p key={m.label} className="mt-2 rounded-md bg-red-50 px-3 py-2 font-semibold text-red-900">
          📌 {m.label} — {formatDate(new Date(`${m.date}T12:00:00`))}
        </p>
      ))}
      <ul className="mt-3 space-y-2">
        {plan.foundations.map((l) => (
          <LessonLink key={l.id} lesson={l} />
        ))}
        {plan.lessons.map((l) => (
          <LessonLink key={l.id} lesson={l} />
        ))}
        {plan.exams.map((e) => (
          <li key={e.id}>
            <span aria-hidden="true">⏱️ </span>
            <Link to={`/examen/${e.id}`} className="font-medium text-blue-800 underline">
              {e.title} — {e.theme}
            </Link>
          </li>
        ))}
      </ul>
      {empty && (
        <p className="mt-2 text-slate-700">
          Pas de nouvelle leçon : semaine de révision. Refais les quiz sous 70 % et pratique avec Gemini.
        </p>
      )}
    </div>
  )
}
