import { describe, expect, it } from 'vitest'
import type { AutoQuestion } from '../types'
import { allLessons, getLesson, mockExams, modules } from '../modules'
import {
  buildExamPrompt,
  buildLessonPrompt,
  buildPersonaPrompt,
  examPrompt,
  generalSystemPrompt,
  lessonPrompt,
  lessonPromptFile,
  promptFiles,
} from '../ta-prompts'
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
    expect(modules.map((m) => m.number)).toEqual([0, 1, 2, 3, 4, 5, 6, 7])
    const counts = Object.fromEntries(modules.map((m) => [m.id, m.lessons.length]))
    expect(counts).toEqual({ m0: 6, m1: 9, m2: 6, m3: 6, m4: 5, m5: 0, m6: 5, m7: 5 })
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

describe('expressions du Module 6', () => {
  const drills = allLessons.flatMap((l) => l.sections).flatMap((s) => (s.kind === 'drills' ? s.drills : []))
  const clean = (text: string) => text.toLowerCase().replace(/[.,?!]/g, '').replace(/\s+/g, ' ').trim()

  it('couvre toutes les expressions demandées, sans doublon', () => {
    expect(drills).toHaveLength(31)
    expect(new Set(drills.map((d) => d.id)).size).toBe(drills.length)
  })

  it('commence par les phrases de clarification, avant celles de l’épisode', () => {
    const lessons = modules.find((m) => m.id === 'm6')!.lessons
    expect(lessons.map((l) => l.id)).toEqual(['6.0', '6.1', '6.2', '6.3', '6.4'])
    expect(lessons[0].week).toBe(1)
    expect(lessons[1].week).toBeGreaterThan(lessons[0].week)
    expect(lessons[0].sections.flatMap((s) => (s.kind === 'drills' ? s.drills : []))).toHaveLength(8)
  })

  it('garde les phrases de travail hors des suggestions pour l’oral du DELF', () => {
    const prompt = buildExamPrompt(mockExams[0])
    expect(prompt).not.toContain('Tu peux me montrer')
    expect(prompt).not.toContain('Je me suis mélangé')
  })

  it('garde chaque expression dans sa phrase en contexte', () => {
    for (const d of drills) expect(clean(d.context), d.id).toContain(clean(d.phrase))
  })

  it('construit chaque expression à partir de la fin, jusqu’à l’expression complète', () => {
    for (const d of drills) {
      expect(d.buildUp.length, d.id).toBeGreaterThanOrEqual(2)
      expect(clean(d.buildUp.at(-1) ?? ''), d.id).toBe(clean(d.phrase))
      d.buildUp.slice(1).forEach((chunk, i) => expect(clean(chunk).endsWith(clean(d.buildUp[i])), `${d.id} : ${chunk}`).toBe(true))
    }
  })
})

describe('personnes du Module 7', () => {
  const personas = allLessons.flatMap((l) => l.sections).flatMap((s) => (s.kind === 'personas' ? s.personas : []))

  it('couvre les 14 personnes avec cinq questions chacune', () => {
    expect(personas).toHaveLength(14)
    expect(new Set(personas.map((p) => p.id)).size).toBe(14)
    for (const p of personas) {
      expect(new Set(p.questions).size, p.id).toBe(5)
      p.questions.forEach((q) => expect(q.endsWith('?'), q).toBe(true))
    }
  })

  it('présente toujours un ado anglophone arrivé au Québec il y a un an', () => {
    for (const p of personas) expect(p.modelIntro, p.id).toMatch(/\[ton prénom\]/)
  })

  it('garde les gérants de la crêperie hors du travail, sans consigne à comprendre', () => {
    const managers = personas.filter((p) => p.id === 'gerant-matin' || p.id === 'gerante-soir')
    expect(managers).toHaveLength(2)
    for (const p of managers) {
      for (const text of [...p.questions, p.modelIntro]) {
        expect(text).not.toMatch(/service|client|horaire|\bplats?\b|gér|restauration|travail/i)
      }
      const prompt = buildPersonaPrompt(p)
      expect(prompt).toContain('aucune consigne')
      expect(prompt).toContain('Je n’ai pas besoin de tout comprendre')
    }
  })

  it('prépare le jeu de rôle en deux temps, avec les cinq questions', () => {
    const prompt = buildPersonaPrompt(personas[0])
    expect(prompt).toContain('comme je le fais d’habitude')
    expect(prompt).toContain('un ado anglophone arrivé au Québec il y a un an')
    for (const q of personas[0].questions) expect(prompt).toContain(q)
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

  it('donne à Gemini les morceaux de chaque expression du Module 6', () => {
    const prompt = buildLessonPrompt(getLesson('6.1')!)
    expect(prompt).toContain('« que », « ons que », « mettons que »')
    expect(prompt).toContain('deux fois plus lentement')
  })

  it('fait réutiliser les expressions courantes à l’oral, jamais les familières', () => {
    for (const prompt of [buildLessonPrompt(getLesson('1.6')!), buildExamPrompt(mockExams[0])]) {
      expect(prompt).toContain('Mes expressions à réutiliser')
      expect(prompt).toContain('dont le nom m’échappe')
      expect(prompt).not.toContain('pognent')
    }
    expect(buildLessonPrompt(getLesson('1.1')!)).not.toContain('Mes expressions à réutiliser')
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
