import type { LessonSkill, Mode } from '../types'
import type { LessonStatus } from '../lib/progress'

export const LESSON_SKILL_LABELS: Record<LessonSkill, { label: string; className: string }> = {
  CO: { label: 'Compréhension de l’oral', className: 'bg-tag-purple text-tag-purple-ink' },
  CE: { label: 'Compréhension des écrits', className: 'bg-tag-sky text-tag-sky-ink' },
  PE: { label: 'Production écrite', className: 'bg-tag-emerald text-tag-emerald-ink' },
  PO: { label: 'Production orale', className: 'bg-tag-orange text-tag-orange-ink' },
  vocabulaire: { label: 'Vocabulaire', className: 'bg-tag-yellow text-tag-yellow-ink' },
  grammaire: { label: 'Grammaire', className: 'bg-surface-strong text-ink' },
}

export const STATUS_LABELS: Record<LessonStatus, { label: string; className: string; icon: string }> = {
  'a-faire': { label: 'À faire', className: 'text-ink-muted', icon: '○' },
  'en-cours': { label: 'En cours', className: 'text-warning-ink', icon: '◐' },
  terminee: { label: 'Terminée', className: 'text-success-ink', icon: '●' },
}

export const MODES: { id: Mode; label: string; icon: string; description: string }[] = [
  { id: 'eleve', label: 'Élève', icon: '🎓', description: 'Leçons, quiz et progression' },
  { id: 'professeur', label: 'Professeur', icon: '👨‍🏫', description: 'Grilles, notes pédagogiques, suivi' },
  { id: 'ta', label: 'TA Gemini', icon: '🤖', description: 'Prompts à copier dans Gemini' },
]
