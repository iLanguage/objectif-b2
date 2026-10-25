import { useSyncExternalStore } from 'react'
import type { Answer, DelfSkill, Lesson, Mode } from '../types'
import { PASSING_PERCENT, type QuizResult } from './scoring'

/**
 * Progression de l'élève, conservée dans le localStorage du navigateur.
 * Le localStorage est propre à chaque appareil : le professeur peut demander
 * à l'élève d'exporter sa progression (fichier JSON) pour la consulter.
 */

export const STORAGE_KEY = 'objectif-b2:progress:v1'

export interface QuizAttempt {
  percent: number
  points: number
  max: number
  missed: string[]
  date: string
}

/** Notes attribuées critère par critère avec une grille DELF. */
export type Grades = Record<string, number>

export interface WorkProgress {
  attempts: QuizAttempt[]
  /** Brouillon de production écrite. */
  writing?: { text: string; updatedAt: string }
  /** Éléments de la liste d'auto-vérification cochés par l'élève. */
  checked?: string[]
  grades?: Partial<Record<'PE' | 'PO', Grades>>
  teacherComment?: string
  /** Leçon marquée comme terminée (productions sans quiz). */
  done?: boolean
}

export interface ExamProgress {
  answers: Record<string, Answer>
  submitted: Partial<Record<DelfSkill, boolean>>
  writing?: { text: string; updatedAt: string }
  checked?: Partial<Record<'PE' | 'PO', string[]>>
  grades?: Partial<Record<'PE' | 'PO', Grades>>
}

export interface ProgressState {
  version: 1
  mode: Mode
  lessons: Record<string, WorkProgress>
  exams: Record<string, ExamProgress>
}

const EMPTY: ProgressState = { version: 1, mode: 'eleve', lessons: {}, exams: {} }

// --- Stockage ---------------------------------------------------------------

let memoryRaw: string | null = null
let cachedRaw: string | null | undefined
let cachedState: ProgressState = EMPTY
const listeners = new Set<() => void>()

function readRaw(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return memoryRaw
  }
}

function writeRaw(raw: string) {
  memoryRaw = raw
  try {
    localStorage.setItem(STORAGE_KEY, raw)
  } catch {
    // Navigation privée ou stockage bloqué : la progression reste en mémoire.
  }
}

function parse(raw: string | null): ProgressState {
  if (!raw) return EMPTY
  try {
    const data = JSON.parse(raw) as Partial<ProgressState>
    if (data.version !== 1) return EMPTY
    return {
      version: 1,
      mode: data.mode === 'professeur' || data.mode === 'ta' ? data.mode : 'eleve',
      lessons: data.lessons ?? {},
      exams: data.exams ?? {},
    }
  } catch {
    return EMPTY
  }
}

export function getProgress(): ProgressState {
  const raw = readRaw()
  if (raw !== cachedRaw) {
    cachedRaw = raw
    cachedState = parse(raw)
  }
  return cachedState
}

function commit(next: ProgressState) {
  writeRaw(JSON.stringify(next))
  listeners.forEach((l) => l())
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) listener()
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', onStorage)
  }
}

export function useProgress(): ProgressState {
  return useSyncExternalStore(subscribe, getProgress, getProgress)
}

export function useMode(): Mode {
  return useProgress().mode
}

// --- Mises à jour -----------------------------------------------------------

function updateLesson(id: string, change: (p: WorkProgress) => WorkProgress) {
  const state = getProgress()
  const current = state.lessons[id] ?? { attempts: [] }
  commit({ ...state, lessons: { ...state.lessons, [id]: change(current) } })
}

function updateExam(id: string, change: (p: ExamProgress) => ExamProgress) {
  const state = getProgress()
  const current = state.exams[id] ?? { answers: {}, submitted: {} }
  commit({ ...state, exams: { ...state.exams, [id]: change(current) } })
}

export function setMode(mode: Mode) {
  commit({ ...getProgress(), mode })
}

export function recordQuizAttempt(lessonId: string, result: QuizResult, date = new Date()) {
  updateLesson(lessonId, (p) => ({
    ...p,
    attempts: [...p.attempts, { ...result, date: date.toISOString() }],
  }))
}

export function saveLessonWriting(lessonId: string, text: string) {
  updateLesson(lessonId, (p) => ({ ...p, writing: { text, updatedAt: new Date().toISOString() } }))
}

export function setLessonChecked(lessonId: string, checked: string[]) {
  updateLesson(lessonId, (p) => ({ ...p, checked }))
}

export function saveLessonGrades(lessonId: string, skill: 'PE' | 'PO', grades: Grades) {
  updateLesson(lessonId, (p) => ({ ...p, grades: { ...p.grades, [skill]: grades } }))
}

export function setTeacherComment(lessonId: string, teacherComment: string) {
  updateLesson(lessonId, (p) => ({ ...p, teacherComment }))
}

export function setLessonDone(lessonId: string, done: boolean) {
  updateLesson(lessonId, (p) => ({ ...p, done }))
}

export function saveExamAnswer(examId: string, questionId: string, answer: Answer) {
  updateExam(examId, (p) => ({ ...p, answers: { ...p.answers, [questionId]: answer } }))
}

export function submitExamSection(examId: string, skill: DelfSkill) {
  updateExam(examId, (p) => ({ ...p, submitted: { ...p.submitted, [skill]: true } }))
}

export function saveExamWriting(examId: string, text: string) {
  updateExam(examId, (p) => ({ ...p, writing: { text, updatedAt: new Date().toISOString() } }))
}

export function setExamChecked(examId: string, skill: 'PE' | 'PO', items: string[]) {
  updateExam(examId, (p) => ({ ...p, checked: { ...p.checked, [skill]: items } }))
}

export function saveExamGrades(examId: string, skill: 'PE' | 'PO', grades: Grades) {
  updateExam(examId, (p) => ({ ...p, grades: { ...p.grades, [skill]: grades } }))
}

export function resetExam(examId: string) {
  const state = getProgress()
  const exams = { ...state.exams }
  delete exams[examId]
  commit({ ...state, exams })
}

// --- Lecture ----------------------------------------------------------------

export function bestAttempt(p: WorkProgress | undefined): QuizAttempt | undefined {
  if (!p || p.attempts.length === 0) return undefined
  return p.attempts.reduce((best, a) => (a.percent > best.percent ? a : best))
}

export function lastAttempt(p: WorkProgress | undefined): QuizAttempt | undefined {
  return p?.attempts.at(-1)
}

export type LessonStatus = 'a-faire' | 'en-cours' | 'terminee'

export function lessonStatus(lesson: Lesson, p: WorkProgress | undefined): LessonStatus {
  if (!p) return 'a-faire'
  if (lesson.quiz && lesson.quiz.length > 0) {
    const best = bestAttempt(p)
    if (best && best.percent >= PASSING_PERCENT) return 'terminee'
    return best || p.writing ? 'en-cours' : 'a-faire'
  }
  if (p.done || (p.grades && Object.keys(p.grades).length > 0)) return 'terminee'
  return p.writing || (p.checked && p.checked.length > 0) ? 'en-cours' : 'a-faire'
}

/** Pourcentage de leçons terminées dans une liste. */
export function completionPercent(lessons: Lesson[], state: ProgressState): number {
  if (lessons.length === 0) return 0
  const done = lessons.filter((l) => lessonStatus(l, state.lessons[l.id]) === 'terminee').length
  return Math.round((done / lessons.length) * 100)
}

// --- Export / import ----------------------------------------------------------

export function exportProgress(compact = false): string {
  const payload = { ...getProgress(), exportedAt: new Date().toISOString() }
  return compact ? JSON.stringify(payload) : JSON.stringify(payload, null, 2)
}

/** Remplace la progression par celle d'un texte/fichier exporté. Renvoie false si le contenu est invalide. */
export function importProgress(input: string): boolean {
  if (!input || typeof input !== 'string') return false
  let clean = input.trim()
  if (clean.startsWith('```')) {
    clean = clean.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()
  }
  try {
    const data = JSON.parse(clean) as Partial<ProgressState>
    if (!data || typeof data !== 'object') return false
    if (data.version !== 1) return false
    if (
      (data.lessons !== undefined && typeof data.lessons !== 'object') ||
      (data.exams !== undefined && typeof data.exams !== 'object')
    ) {
      return false
    }
  } catch {
    return false
  }
  const parsed = parse(clean)
  commit({ ...parsed, mode: getProgress().mode })
  return true
}

export function resetProgress() {
  commit({ ...EMPTY, mode: getProgress().mode })
}
