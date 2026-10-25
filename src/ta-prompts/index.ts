import type { AutoQuestion, Lesson, MockExam } from '../types'
import type { WorkProgress } from '../lib/progress'
import { lastAttempt } from '../lib/progress'
import { PASSING_PERCENT } from '../lib/scoring'

/**
 * Registre des prompts TA (Gemini). Chaque leçon a un fichier
 * `[module]-[leçon].md` ; `general-system.md` est commun à toutes les leçons.
 */
const files = import.meta.glob('./*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>

export const generalSystemPrompt = files['./general-system.md'] ?? ''

export function lessonPromptFile(lesson: Lesson): string {
  return `${lesson.moduleId}-${lesson.id}.md`
}

export function lessonPrompt(lesson: Lesson): string | undefined {
  return files[`./${lessonPromptFile(lesson)}`]
}

export function examPrompt(exam: MockExam): string | undefined {
  return files[`./m5-${exam.id}.md`]
}

export function promptFiles(): string[] {
  return Object.keys(files).map((k) => k.replace('./', ''))
}

/** Bonne réponse d'une question, en texte, pour que Gemini puisse cibler l'erreur. */
export function describeAnswer(q: AutoQuestion): string {
  switch (q.type) {
    case 'mcq':
      return q.options[q.answer]
    case 'fill':
      return q.answers.map((a) => a[0]).join(' / ')
    case 'matching':
      return q.pairs.map((p) => `${p.left} → ${p.right}`).join(' ; ')
  }
}

export function describeQuestion(q: AutoQuestion): string {
  return q.type === 'fill' ? q.text : q.prompt
}

/**
 * Bloc ajouté au prompt quand le dernier quiz est sous le seuil de réussite :
 * il liste les questions manquées pour que Gemini propose des exercices ciblés.
 */
export function remediationBlock(lesson: Lesson, progress: WorkProgress | undefined): string | undefined {
  const attempt = lastAttempt(progress)
  if (!attempt || !lesson.quiz) return undefined
  const missed = lesson.quiz.filter((q) => attempt.missed.includes(q.id))
  if (missed.length === 0) return undefined
  const intro =
    attempt.percent < PASSING_PERCENT
      ? `Mon dernier score au quiz de cette leçon est de ${attempt.percent} %. Je dois atteindre ${PASSING_PERCENT} % pour réussir.`
      : `Mon dernier score au quiz est de ${attempt.percent} %, mais j'ai manqué quelques questions.`
  const lines = missed.map((q, i) => `${i + 1}. ${describeQuestion(q)} — bonne réponse : ${describeAnswer(q)}`)
  return [
    '# Mes points à retravailler',
    '',
    intro,
    'Voici les questions que j’ai manquées :',
    ...lines,
    '',
    'Explique-moi la règle derrière chaque erreur, puis donne-moi 3 nouveaux exercices du même type pour chacune. Quand je réussis 3 exercices de suite, dis-moi que je suis prêt à retenter le quiz.',
  ].join('\n')
}

/** Prompt complet à copier dans Gemini. */
export function buildLessonPrompt(lesson: Lesson, progress?: WorkProgress): string {
  return [generalSystemPrompt.trim(), lessonPrompt(lesson)?.trim(), remediationBlock(lesson, progress)]
    .filter(Boolean)
    .join('\n\n---\n\n')
}

export function buildExamPrompt(exam: MockExam): string {
  return [generalSystemPrompt.trim(), examPrompt(exam)?.trim()].filter(Boolean).join('\n\n---\n\n')
}
