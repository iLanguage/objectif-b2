import type { AutoQuestion, DelfSkill, ExamPrepTask, Lesson, MockExam, Persona } from '../types'
import { lessonDrills, oralPhrases } from '../modules/m6-expressions'
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

/** Liste des expressions d'une leçon du Module 6, avec les morceaux à construire. */
function drillsBlock(lesson: Lesson): string | undefined {
  const drills = lessonDrills(lesson)
  if (drills.length === 0) return undefined
  const lines = drills.map(
    (d) => `- « ${d.phrase} » (${d.register}) — Phrase : « ${d.context} » — Morceaux : ${d.buildUp.map((c) => `« ${c} »`).join(', ')}`,
  )
  return ['# Mes expressions', '', ...lines].join('\n')
}

/** Rappelle à Gemini de faire réutiliser les expressions du Module 6 à l'oral. */
function oralPhrasesBlock(): string {
  return [
    '# Mes expressions à réutiliser',
    '',
    'Pendant cet oral, encourage-moi à placer naturellement au moins deux de ces expressions :',
    oralPhrases.map((d) => `« ${d.phrase} »`).join(', ') + '.',
  ].join('\n')
}

/** Prompt complet à copier dans Gemini. */
export function buildLessonPrompt(lesson: Lesson, progress?: WorkProgress): string {
  return [
    generalSystemPrompt.trim(),
    lessonPrompt(lesson)?.trim(),
    drillsBlock(lesson),
    lesson.speaking && oralPhrasesBlock(),
    remediationBlock(lesson, progress),
  ]
    .filter(Boolean)
    .join('\n\n---\n\n')
}

export function buildExamPrompt(exam: MockExam): string {
  return [generalSystemPrompt.trim(), examPrompt(exam)?.trim(), oralPhrasesBlock()].filter(Boolean).join('\n\n---\n\n')
}

const PREP_ROLES: Record<DelfSkill, string> = {
  PE: 'Aide-moi à trouver mes idées, mais n’écris pas ma lettre à ma place. Je veux assembler des phrases que je connais. Quand je te colle mon texte, compte les mots, évalue-le avec la grille DELF B2 (note indicative sur 25), et donne-moi mes trois priorités. Vérifie surtout : la formule de fin, les exemples en phrases complètes et les anglicismes.',
  CE: 'Quand je te colle mon article, pose-moi cinq questions de compréhension comme au DELF, dont deux Vrai/Faux où je dois citer le texte. Fais-moi ensuite expliquer cinq mots du texte avec mes mots.',
  CO: 'Quand je te résume ce que j’ai écouté, pose-moi des questions pour préciser : qui parle, quels chiffres, quelle opinion. Ensuite, lis-moi un court texte sur le même sujet et pose-moi trois questions.',
  PO: 'Joue l’examinateur. Écoute mon exposé sans m’interrompre, puis débats avec moi pendant cinq minutes en me contredisant poliment. Évalue-moi avec la grille DELF B2 de production orale.',
}

/** Prompt de la tâche hebdomadaire de préparation au DELF. */
export function buildExamPrepPrompt(task: ExamPrepTask): string {
  const scene = [
    `# Préparation au DELF, semaine ${task.week} : ${task.title}`,
    '',
    ...task.instructions,
    '',
    task.skill ? PREP_ROLES[task.skill] : 'Aide-moi à faire le bilan : pose-moi des questions, puis propose-moi un plan de révision simple.',
  ].join('\n')
  return [generalSystemPrompt.trim(), scene, task.skill === 'PO' ? oralPhrasesBlock() : undefined].filter(Boolean).join('\n\n---\n\n')
}

/** Prompt de jeu de rôle avec une personne du Module 7. */
export function buildPersonaPrompt(persona: Persona): string {
  const scene = [
    `# Jeu de rôle : ${persona.title}`,
    '',
    `Joue cette personne : ${persona.about} Tu me parles en disant « ${persona.address} », et je te parle de la même façon.`,
    ...(persona.guidance ? ['', persona.guidance] : []),
    '',
    '## Déroulement',
    '1. Reste dans ton rôle, salue-moi et laisse-moi me présenter comme je le fais d’habitude. Ne me corrige pas encore.',
    '2. Sors du rôle un instant. Dis-moi ce qui sonne naturel et ce qui sonne récité, puis aide-moi à retravailler ma présentation en 3 ou 4 phrases, dans ma propre voix : un ado anglophone arrivé au Québec il y a un an.',
    '3. Reprends ton rôle. Je me présente de nouveau, puis je te pose mes questions. Réponds en 2 ou 3 phrases et relance-moi une fois sur deux, pour que ça reste une vraie conversation.',
    '4. Quand je dis « bilan », fais mon bilan.',
    '',
    '## Exemple de présentation (à adapter avec mes mots)',
    persona.modelIntro,
    '',
    '## Mes cinq questions',
    ...persona.questions.map((q, i) => `${i + 1}. ${q}`),
  ].join('\n')
  return [generalSystemPrompt.trim(), scene].join('\n\n---\n\n')
}
