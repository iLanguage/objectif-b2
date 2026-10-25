import { describe, expect, it } from 'vitest'
import type { AutoQuestion } from '../types'
import { allLessons, mockExams, modules } from '../modules'
import { examPrompt, generalSystemPrompt, lessonPrompt, lessonPromptFile, promptFiles } from '../ta-prompts'
import { GRILLES, grilleMax } from './grilles-delf'
import { TOTAL_WEEKS } from './syllabus'
import { vocabularyBanks } from './vocabulary'

const examQuestions = mockExams.flatMap((e) => [...e.co.documents, ...e.ce.documents].flatMap((d) => d.questions))
const lessonQuestions = allLessons.flatMap((l) => l.quiz ?? [])

function checkQuestion(q: AutoQuestion) {
  switch (q.type) {
    case 'mcq':
      expect(q.options.length, q.id).toBeGreaterThanOrEqual(2)
      expect(new Set(q.options).size, `${q.id} : options en double`).toBe(q.options.length)
      expect(q.answer, q.id).toBeGreaterThanOrEqual(0)
      expect(q.answer, q.id).toBeLessThan(q.options.length)
      if (q.visual) expect(q.visualAlt, `${q.id} : illustration sans description`).toBeTruthy()
      break
    case 'fill':
      expect(q.text.split('___').length - 1, `${q.id} : nombre de trous`).toBe(q.answers.length)
      q.answers.forEach((a) => expect(a.length, q.id).toBeGreaterThan(0))
      break
    case 'matching':
      expect(q.pairs.length, q.id).toBeGreaterThanOrEqual(2)
      expect(new Set(q.pairs.map((p) => p.left)).size, q.id).toBe(q.pairs.length)
      expect(new Set(q.pairs.map((p) => p.right)).size, q.id).toBe(q.pairs.length)
      break
  }
}

describe('contenu des modules', () => {
  it('contient les modules 0 à 5 et toutes les leçons du plan', () => {
    expect(modules.map((m) => m.number)).toEqual([0, 1, 2, 3, 4, 5])
    const counts = Object.fromEntries(modules.map((m) => [m.id, m.lessons.length]))
    expect(counts).toEqual({ m0: 6, m1: 9, m2: 6, m3: 6, m4: 5, m5: 0 })
    expect(mockExams).toHaveLength(3)
  })

  it('utilise des identifiants uniques', () => {
    const lessonIds = allLessons.map((l) => l.id)
    expect(new Set(lessonIds).size).toBe(lessonIds.length)
    const questionIds = [...lessonQuestions, ...examQuestions].map((q) => q.id)
    expect(new Set(questionIds).size).toBe(questionIds.length)
  })

  it('a des questions valides', () => {
    ;[...lessonQuestions, ...examQuestions].forEach(checkQuestion)
  })

  it('donne une activité évaluable à chaque leçon', () => {
    for (const l of allLessons) {
      expect(Boolean(l.quiz?.length || l.writing || l.speaking), l.id).toBe(true)
      expect(l.objectives.length, l.id).toBeGreaterThan(0)
      expect(l.teacherNotes.length, l.id).toBeGreaterThan(0)
    }
  })

  it('place chaque leçon dans les semaines de son module', () => {
    for (const m of modules) {
      for (const l of m.lessons) {
        expect(l.moduleId).toBe(m.id)
        expect(l.week, l.id).toBeGreaterThanOrEqual(m.weeks[0])
        expect(l.untilWeek ?? l.week, l.id).toBeLessThanOrEqual(m.weeks[1])
        expect(l.untilWeek ?? l.week, l.id).toBeLessThanOrEqual(TOTAL_WEEKS)
      }
    }
    for (const e of mockExams) expect(e.week).toBeGreaterThanOrEqual(20)
  })

  it('demande au moins 250 mots pour les productions écrites B2 des examens', () => {
    for (const e of mockExams) expect(e.pe.task.minWords).toBeGreaterThanOrEqual(250)
  })

  it('alimente les banques de vocabulaire', () => {
    expect(vocabularyBanks.length).toBeGreaterThanOrEqual(5)
  })
})

describe('prompts TA', () => {
  it('a un prompt général', () => {
    expect(generalSystemPrompt).toContain('assistant')
  })

  it('a un prompt pour chaque leçon et chaque examen', () => {
    for (const l of allLessons) expect(lessonPrompt(l), lessonPromptFile(l)).toBeTruthy()
    for (const e of mockExams) expect(examPrompt(e), e.id).toBeTruthy()
  })

  it('n’a pas de fichier orphelin', () => {
    const expected = new Set([
      'general-system.md',
      ...allLessons.map(lessonPromptFile),
      ...mockExams.map((e) => `m5-${e.id}.md`),
    ])
    expect(promptFiles().filter((f) => !expected.has(f))).toEqual([])
  })
})

describe('grilles DELF', () => {
  it('sont notées sur 25', () => {
    expect(grilleMax(GRILLES.PE)).toBe(25)
    expect(grilleMax(GRILLES.PO)).toBe(25)
  })
})
