import { describe, expect, it } from 'vitest'
import { getLesson } from '../modules'
import {
  STORAGE_KEY,
  bestAttempt,
  exportProgress,
  getProgress,
  importProgress,
  lessonStatus,
  recordQuizAttempt,
  resetProgress,
  saveExamAnswer,
  saveLessonGrades,
  saveLessonWriting,
  setLessonDone,
  setMode,
  submitExamSection,
} from './progress'

const result = (percent: number) => ({ percent, points: percent / 10, max: 10, missed: percent < 100 ? ['q1'] : [] })

describe('progress', () => {
  it('démarre vide en mode élève', () => {
    const state = getProgress()
    expect(state.mode).toBe('eleve')
    expect(state.lessons).toEqual({})
  })

  it('enregistre les tentatives dans le localStorage', () => {
    recordQuizAttempt('1.1', result(60))
    recordQuizAttempt('1.1', result(90))
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!)
    expect(saved.lessons['1.1'].attempts).toHaveLength(2)
    expect(bestAttempt(getProgress().lessons['1.1'])?.percent).toBe(90)
  })

  it('calcule le statut d’une leçon avec quiz', () => {
    const lesson = getLesson('1.1')!
    expect(lessonStatus(lesson, undefined)).toBe('a-faire')
    recordQuizAttempt('1.1', result(50))
    expect(lessonStatus(lesson, getProgress().lessons['1.1'])).toBe('en-cours')
    recordQuizAttempt('1.1', result(70))
    expect(lessonStatus(lesson, getProgress().lessons['1.1'])).toBe('terminee')
  })

  it('calcule le statut d’une leçon de production sans quiz', () => {
    const lesson = getLesson('1.5')!
    saveLessonWriting('1.5', 'Madame, Monsieur,')
    expect(lessonStatus(lesson, getProgress().lessons['1.5'])).toBe('en-cours')
    saveLessonGrades('1.5', 'PE', { consigne: 2 })
    expect(lessonStatus(lesson, getProgress().lessons['1.5'])).toBe('terminee')
    setLessonDone('1.6', true)
    expect(lessonStatus(getLesson('1.6')!, getProgress().lessons['1.6'])).toBe('terminee')
  })

  it('garde le mode choisi', () => {
    setMode('ta')
    expect(getProgress().mode).toBe('ta')
  })

  it('enregistre les réponses d’examen', () => {
    saveExamAnswer('blanc-1', 'b1-co1-q1', 1)
    submitExamSection('blanc-1', 'CO')
    const exam = getProgress().exams['blanc-1']
    expect(exam.answers['b1-co1-q1']).toBe(1)
    expect(exam.submitted.CO).toBe(true)
  })

  it('exporte et réimporte la progression', () => {
    recordQuizAttempt('2.1', result(80))
    const json = exportProgress()
    resetProgress()
    expect(getProgress().lessons['2.1']).toBeUndefined()
    expect(importProgress(json)).toBe(true)
    expect(getProgress().lessons['2.1'].attempts[0].percent).toBe(80)
  })

  it('refuse un fichier invalide sans rien modifier', () => {
    recordQuizAttempt('2.2', result(80))
    expect(importProgress('pas du json')).toBe(false)
    expect(importProgress(JSON.stringify({ version: 2 }))).toBe(false)
    expect(getProgress().lessons['2.2']).toBeDefined()
  })

  it('ignore des données corrompues dans le localStorage', () => {
    localStorage.setItem(STORAGE_KEY, '{oups')
    expect(getProgress().lessons).toEqual({})
  })
})
