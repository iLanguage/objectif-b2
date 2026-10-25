import type { LessonSkill } from '../types'
import { LESSON_SKILL_LABELS } from './labels'

export function SkillBadge({ skill }: { skill: LessonSkill }) {
  const { label, className } = LESSON_SKILL_LABELS[skill]
  return <span className={`inline-block rounded-full px-3 py-0.5 text-sm font-semibold ${className}`}>{label}</span>
}
