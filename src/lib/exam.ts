import type { DelfSkill, MockExam } from '../types'
import type { ExamProgress } from './progress'
import { scoreQuiz, to25 } from './scoring'
import { GRILLES, grilleComplete, grilleTotal } from '../data/grilles-delf'

export function sectionQuestions(exam: MockExam, skill: 'CO' | 'CE') {
  return exam[skill === 'CO' ? 'co' : 'ce'].documents.flatMap((d) => d.questions)
}

/**
 * Notes sur 25 d'un examen blanc : compréhensions corrigées automatiquement
 * une fois l'épreuve soumise, productions notées avec une grille complète.
 */
export function examScores(exam: MockExam, progress: ExamProgress | undefined): Partial<Record<DelfSkill, number>> {
  const scores: Partial<Record<DelfSkill, number>> = {}
  if (!progress) return scores
  for (const skill of ['CO', 'CE'] as const) {
    if (progress.submitted[skill]) {
      const r = scoreQuiz(sectionQuestions(exam, skill), progress.answers)
      scores[skill] = to25(r.points, r.max)
    }
  }
  for (const skill of ['PE', 'PO'] as const) {
    const grades = progress.grades?.[skill]
    if (grilleComplete(GRILLES[skill], grades)) scores[skill] = grilleTotal(GRILLES[skill], grades)
  }
  return scores
}

export function examComplete(exam: MockExam, progress: ExamProgress | undefined): boolean {
  return Object.keys(examScores(exam, progress)).length === 4
}
