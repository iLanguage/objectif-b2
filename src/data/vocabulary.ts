import { modules } from '../modules'

/**
 * Banques de vocabulaire par thème, construites à partir des sections
 * « vocabulaire » de chaque leçon : une seule source de vérité.
 */

export interface VocabEntry {
  fr: string
  en?: string
  note?: string
  lessonId: string
  lessonTitle: string
}

export interface VocabBank {
  moduleId: string
  title: string
  entries: VocabEntry[]
}

export const vocabularyBanks: VocabBank[] = modules
  .map((m) => ({
    moduleId: m.id,
    title: m.title,
    entries: m.lessons.flatMap((lesson) =>
      lesson.sections.flatMap((section) =>
        section.kind === 'vocab'
          ? section.items.map((item) => ({ ...item, lessonId: lesson.id, lessonTitle: lesson.title }))
          : [],
      ),
    ),
  }))
  .filter((bank) => bank.entries.length > 0)

export function searchVocabulary(query: string, moduleId?: string): VocabEntry[] {
  const q = query
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
  const strip = (s: string) =>
    s
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .toLowerCase()
  return vocabularyBanks
    .filter((b) => !moduleId || b.moduleId === moduleId)
    .flatMap((b) => b.entries)
    .filter((e) => !q || strip(e.fr).includes(q) || (e.en && strip(e.en).includes(q)))
}

/** Prompt de révision espacée pour Gemini, à partir d'une liste de mots. */
export function vocabularyPrompt(entries: VocabEntry[]): string {
  const words = entries.map((e) => `- ${e.fr}${e.en ? ` (${e.en})` : ''}`).join('\n')
  return [
    'Aide-moi à réviser ce vocabulaire par répétition espacée.',
    'Pose-moi une question à la fois : donne une définition ou une phrase à trous en français, et je trouve le mot.',
    'Si je me trompe, redonne-moi ce mot un peu plus tard dans la séance. Quand j’ai trouvé chaque mot deux fois de suite, fais-moi utiliser les 5 mots les plus difficiles dans une petite histoire.',
    '',
    words,
  ].join('\n')
}
