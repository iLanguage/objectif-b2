import { describe, expect, it } from 'vitest'
import type { AutoQuestion } from '../types'
import { allLessons, examPrepTasks, getLesson, mockExams, modules } from '../modules'
import { lessonDrills } from '../modules/m6-expressions'
import { personaModel } from '../modules/m7-conversation'
import { parseMarkdown, spokenLines } from '../lib/markdown'
import {
  buildExamPrepPrompt,
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
    expect(counts).toEqual({ m0: 6, m1: 9, m2: 6, m3: 6, m4: 5, m5: 1, m6: 5, m7: 5 })
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

describe('préparation aux examens blancs (Module 5)', () => {
  const key = (text: string) => text.toLowerCase()

  it('prévoit une tâche pour chacune des 27 semaines, dès la semaine 1', () => {
    expect(examPrepTasks.map((t) => t.week)).toEqual(Array.from({ length: TOTAL_WEEKS }, (_, i) => i + 1))
  })

  it('alterne les quatre épreuves pendant la préparation', () => {
    const skills = new Set(examPrepTasks.filter((t) => t.week <= 18).map((t) => t.skill))
    expect([...skills].sort()).toEqual(['CE', 'CO', 'PE', 'PO'])
  })

  it('demande au moins 250 mots à chaque production écrite', () => {
    const letters = examPrepTasks.flatMap((t) => (t.writing ? [t.writing] : []))
    expect(letters.length).toBeGreaterThanOrEqual(5)
    for (const w of letters) expect(w.minWords, w.id).toBeGreaterThanOrEqual(250)
  })

  it('renvoie vers des leçons et des examens qui existent, à la bonne semaine', () => {
    for (const t of examPrepTasks) {
      if (t.lessonId) expect(getLesson(t.lessonId), `${t.week}`).toBeDefined()
      if (t.examId) expect(mockExams.some((e) => e.id === t.examId), `${t.week}`).toBe(true)
    }
    for (const e of mockExams) expect(examPrepTasks.find((t) => t.week === e.week)?.examId).toBe(e.id)
  })

  it('ne révèle pas les sujets des examens blancs', () => {
    const subjects = ['cellulaires', 'téléphones', 'semaine de quatre jours', 'télétravail', 'rue piétonne', 'service communautaire', 'surtourisme', 'gratuit', 'montres connectées']
    const text = key(examPrepTasks.map((t) => [t.title, ...t.instructions, t.model?.markdown].join(' ')).join(' '))
    for (const subject of subjects) expect(text, subject).not.toContain(subject)
  })

  it('prépare un prompt Gemini pour chaque tâche', () => {
    for (const t of examPrepTasks) {
      const prompt = buildExamPrepPrompt(t)
      expect(prompt, `${t.week}`).toContain(t.title)
      expect(prompt, `${t.week}`).toContain(generalSystemPrompt.trim())
    }
    expect(buildExamPrepPrompt(examPrepTasks[1])).toContain('n’écris pas ma lettre à ma place')
  })

  it('corrige les anglicismes dans la lettre de la leçon 5.1', () => {
    const lesson = getLesson('5.1')!
    const letter = lesson.sections.flatMap((s) => (s.kind === 'reading' ? s.paragraphs : [])).join(' ')
    expect(letter).toContain('Je vous prie d’agréer')
    for (const word of ['appliquent', 'opportunité', 'procédures']) expect(letter).not.toContain(word)
  })
})

describe('expressions du Module 6', () => {
  const drills = allLessons.flatMap((l) => l.sections).flatMap((s) => (s.kind === 'drills' ? s.drills : []))
  const clean = (text: string) => text.toLowerCase().replace(/[.,?!]/g, '').replace(/\s+/g, ' ').trim()

  it('couvre toutes les expressions demandées, sans doublon', () => {
    const m6 = modules.find((m) => m.id === 'm6')!.lessons.flatMap((l) => lessonDrills(l))
    expect(m6).toHaveLength(31)
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

describe('leçon 1.0 : le débat par morceaux', () => {
  const lesson = getLesson('1.0')!
  const titles = lesson.sections.flatMap((s) => (s.kind === 'tip' ? [] : [s.title ?? '']))

  it('montre d’abord la démonstration, puis la pratique', () => {
    const demo = titles.flatMap((t, i) => (t.startsWith('Partie A') ? [i] : []))
    const practice = titles.flatMap((t, i) => (t.startsWith('Partie B') ? [i] : []))
    expect(demo).toHaveLength(8)
    expect(practice).toHaveLength(11)
    expect(Math.max(...demo)).toBeLessThan(Math.min(...practice))
  })

  it('montre un modèle écrit et parlé avant chaque défi', () => {
    const challenges = lesson.sections.flatMap((s) => (s.kind !== 'tip' && s.title?.includes('Défi') ? [s] : []))
    expect(challenges).toHaveLength(9)
    for (const s of challenges) {
      expect(s.kind, s.title).toBe('model')
      if (s.kind === 'model') {
        expect(spokenLines(parseMarkdown(s.markdown)).length, s.title).toBeGreaterThan(0)
        expect(s.task, s.title).toBeTruthy()
      }
    }
  })

  it('utilise le plan du professeur, et le monologue le suit', () => {
    const models = lesson.sections.flatMap((s) => (s.kind === 'model' ? [s.markdown] : []))
    const headings = parseMarkdown(models[0]).filter((b) => b.type === 'heading').map((b) => b.text)
    expect(headings).toEqual([
      'Sujet et déclaration',
      'I. Introduction',
      'II. Arguments en faveur de la télémédecine (Avantages)',
      'III. Arguments contre / Limites',
      'IV. Conclusion',
    ])
    const monologue = models.find((m) => m.includes('Je vais expliquer'))!
    for (const connector of ['Pour commencer', 'Par contre', 'De plus', 'En conclusion']) expect(monologue).toContain(connector)
  })

  it('garde les phrases du débat pour Gemini, avec le vouvoiement', () => {
    expect(lessonDrills(lesson)).toHaveLength(12)
    expect(buildLessonPrompt(lesson)).toContain('« Si je comprends bien, vous voulez dire que »')
  })

  it('ne donne pas les questions de la simulation dans la démonstration', () => {
    const models = lesson.sections.flatMap((s) => (s.kind === 'model' ? [s.markdown] : [])).join(' ')
    for (const q of lesson.speaking!.followUps) expect(models).not.toContain(q)
  })
})

describe('un modèle avant chaque production', () => {
  // La leçon 1.0 a ses propres modèles, et chaque personne du Module 7 a le sien dans sa carte.
  const productionLessons = allLessons.filter((l) => l.id !== '1.0' && l.moduleId !== 'm7' && (l.writing || l.speaking))
  const productionPrep = examPrepTasks.filter((t) => t.writing || t.speaking || t.skill === 'CO' || t.week === 21 || t.week === 23)

  it('fait lire et écouter un modèle avant chaque tâche d’une leçon', () => {
    expect(productionLessons.length).toBeGreaterThanOrEqual(10)
    for (const l of productionLessons) expect(spokenLines(parseMarkdown(l.model?.markdown ?? '')).length, l.id).toBeGreaterThan(0)
  })

  it('fait lire et écouter un modèle avant chaque tâche de préparation', () => {
    expect(productionPrep).toHaveLength(16)
    for (const t of productionPrep) expect(spokenLines(parseMarkdown(t.model?.markdown ?? '')).length, `${t.week}`).toBeGreaterThan(0)
  })

  it('donne à chaque personne du Module 7 son propre modèle, à son nom', () => {
    const personas = allLessons.flatMap((l) => l.sections).flatMap((s) => (s.kind === 'personas' ? s.personas : []))
    for (const p of personas) {
      const lines = spokenLines(parseMarkdown(personaModel(p)))
      expect(lines, p.id).toHaveLength(6)
      expect(lines[0], p.id).toContain('Mikael')
      expect(lines.join(' '), p.id).not.toContain('[ton prénom]')
    }
  })

  it('ne lit pas les notes d’un plan comme le nom d’une personne', () => {
    const speaker = /^[A-ZÉÈÀÂÎÔÇ][\p{L} -]{1,24} : /u
    const known = new Set(['Alex', 'Cliente', 'Coordonnatrice', 'Examinatrice', 'Mikael', 'Serveur', 'Touriste'])
    const models = [...productionLessons, ...productionPrep].map((t) => t.model!.markdown)
    for (const line of models.flatMap((m) => spokenLines(parseMarkdown(m)))) {
      const name = line.match(speaker)?.[0].slice(0, -3)
      if (name) expect(known, line).toContain(name)
    }
  })

  it('ne donne pas les questions du débat dans le modèle', () => {
    for (const l of productionLessons) {
      for (const q of l.speaking?.followUps ?? []) expect(l.model?.markdown, `${l.id} : ${q}`).not.toContain(q)
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
