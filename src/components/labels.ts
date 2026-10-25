import type { LessonSkill, Mode } from '../types'
import type { LessonStatus } from '../lib/progress'

export const LESSON_SKILL_LABELS: Record<LessonSkill, { label: string; className: string }> = {
  CO: { label: 'Compréhension de l’oral', className: 'bg-purple-100 text-purple-900' },
  CE: { label: 'Compréhension des écrits', className: 'bg-sky-100 text-sky-900' },
  PE: { label: 'Production écrite', className: 'bg-emerald-100 text-emerald-900' },
  PO: { label: 'Production orale', className: 'bg-orange-100 text-orange-900' },
  vocabulaire: { label: 'Vocabulaire', className: 'bg-yellow-100 text-yellow-900' },
  grammaire: { label: 'Grammaire', className: 'bg-slate-200 text-slate-900' },
}

export const STATUS_LABELS: Record<LessonStatus, { label: string; className: string; icon: string }> = {
  'a-faire': { label: 'À faire', className: 'text-slate-600', icon: '○' },
  'en-cours': { label: 'En cours', className: 'text-amber-800', icon: '◐' },
  terminee: { label: 'Terminée', className: 'text-green-800', icon: '●' },
}

export const MODES: { id: Mode; label: string; icon: string; description: string }[] = [
  { id: 'eleve', label: 'Élève', icon: '🎓', description: 'Leçons, quiz et progression' },
  { id: 'professeur', label: 'Professeur', icon: '👨‍🏫', description: 'Grilles, notes pédagogiques, suivi' },
  { id: 'ta', label: 'TA Gemini', icon: '🤖', description: 'Prompts à copier dans Gemini' },
]
