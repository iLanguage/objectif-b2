import type { Answer, AutoQuestion, DelfSkill } from '../types'

/** Pourcentage à atteindre pour considérer un quiz de leçon comme réussi. */
export const PASSING_PERCENT = 70

/** Seuil officiel du DELF : 50/100 et au moins 5/25 dans chaque épreuve. */
export const DELF_PASS_TOTAL = 50
export const DELF_MIN_PER_SKILL = 5

/** Exigences de Marianopolis (voir le plan). */
export const MARIANOPOLIS_MINIMUMS: Record<DelfSkill, number> = { CO: 5, CE: 13, PE: 13, PO: 5 }
export const MARIANOPOLIS_TOTAL = 67

export const SKILL_LABELS: Record<DelfSkill, string> = {
  CO: 'Compréhension de l’oral',
  CE: 'Compréhension des écrits',
  PE: 'Production écrite',
  PO: 'Production orale',
}

/**
 * Normalise une réponse libre : casse, espaces, apostrophes et ponctuation finale.
 * Les accents restent significatifs : « a » et « à » ne sont pas le même mot.
 */
export function normalizeAnswer(value: string): string {
  return value
    .normalize('NFC')
    .toLowerCase()
    .replace(/[’`´]/g, "'")
    .replace(/œ/g, 'oe')
    .replace(/\s+/g, ' ')
    .replace(/\s*'\s*/g, "'")
    .trim()
    .replace(/[.!?;,]+$/, '')
    .trim()
}

/** Score d'une question entre 0 et 1 (crédit partiel pour les trous et l'appariement). */
export function scoreQuestion(question: AutoQuestion, answer: Answer | undefined): number {
  if (answer === undefined) return 0
  switch (question.type) {
    case 'mcq':
      return answer === question.answer ? 1 : 0
    case 'fill': {
      if (!Array.isArray(answer)) return 0
      const correct = question.answers.filter((accepted, i) => {
        const given = normalizeAnswer(answer[i] ?? '')
        return given !== '' && accepted.some((a) => normalizeAnswer(a) === given)
      }).length
      return correct / question.answers.length
    }
    case 'matching': {
      if (typeof answer !== 'object' || Array.isArray(answer)) return 0
      const correct = question.pairs.filter((p) => answer[p.left] === p.right).length
      return correct / question.pairs.length
    }
  }
}

export interface QuizResult {
  points: number
  max: number
  percent: number
  /** Identifiants des questions qui n'ont pas obtenu tous les points. */
  missed: string[]
}

export function scoreQuiz(questions: AutoQuestion[], answers: Record<string, Answer>): QuizResult {
  let points = 0
  const missed: string[] = []
  for (const q of questions) {
    const s = scoreQuestion(q, answers[q.id])
    points += s
    if (s < 1) missed.push(q.id)
  }
  const max = questions.length
  points = Math.round(points * 100) / 100
  return { points, max, percent: max === 0 ? 0 : Math.round((points / max) * 100), missed }
}

/** Ramène un score brut sur 25, arrondi au demi-point comme au DELF. */
export function to25(points: number, max: number): number {
  if (max <= 0) return 0
  return Math.round((points / max) * 25 * 2) / 2
}

export interface DelfEvaluation {
  total: number
  /** Les quatre épreuves ont une note. */
  complete: boolean
  passedDelf: boolean
  passedMarianopolis: boolean
  /** Messages expliquant ce qui manque, en français. */
  issues: string[]
}

export function evaluateDelf(scores: Partial<Record<DelfSkill, number>>): DelfEvaluation {
  const skills: DelfSkill[] = ['CO', 'CE', 'PE', 'PO']
  const issues: string[] = []
  let total = 0
  let complete = true
  let eliminated = false
  let belowMarianopolis = false

  for (const skill of skills) {
    const score = scores[skill]
    if (score === undefined) {
      complete = false
      issues.push(`${SKILL_LABELS[skill]} : pas encore notée.`)
      continue
    }
    total += score
    if (score < DELF_MIN_PER_SKILL) {
      eliminated = true
      issues.push(`${SKILL_LABELS[skill]} : ${score}/25 — note éliminatoire (moins de ${DELF_MIN_PER_SKILL}/25).`)
    } else if (score < MARIANOPOLIS_MINIMUMS[skill]) {
      belowMarianopolis = true
      issues.push(`${SKILL_LABELS[skill]} : ${score}/25 — Marianopolis exige ${MARIANOPOLIS_MINIMUMS[skill]}/25.`)
    }
  }

  if (complete && total < MARIANOPOLIS_TOTAL) {
    issues.push(`Total : ${total}/100 — Marianopolis exige ${MARIANOPOLIS_TOTAL}/100.`)
  }

  const passedDelf = complete && !eliminated && total >= DELF_PASS_TOTAL
  return {
    total,
    complete,
    passedDelf,
    passedMarianopolis: passedDelf && !belowMarianopolis && total >= MARIANOPOLIS_TOTAL,
    issues,
  }
}

/**
 * Compte les mots comme au DELF : tout ensemble de signes entre deux espaces
 * (« l'hôpital » et « c'est-à-dire » comptent pour un mot).
 */
export function wordCount(text: string): number {
  return text.split(/\s+/).filter((token) => /[\p{L}\p{N}]/u.test(token)).length
}

export function feedbackFor(percent: number): { label: string; message: string } {
  if (percent >= 85) return { label: 'Excellent', message: 'Tu maîtrises cette leçon. Passe à la suivante !' }
  if (percent >= PASSING_PERCENT)
    return { label: 'Réussi', message: 'Bon travail. Revois les erreurs ci-dessous pour consolider.' }
  if (percent >= 50)
    return {
      label: 'Presque',
      message: 'Tu y es presque. Utilise le prompt TA Gemini pour travailler les points manqués, puis réessaie.',
    }
  return {
    label: 'À retravailler',
    message: 'Pas de panique : relis la leçon, pratique avec Gemini, et retente le quiz dans un jour ou deux.',
  }
}
