import type { Lesson, MockExam, Module } from '../types'
import { m0 } from './m0-fondations'
import { m1 } from './m1-medecine'
import { m2 } from './m2-creperie'
import { m3 } from './m3-muhc'
import { m4 } from './m4-saaq'
import { m5, mockExams } from './m5-delf-blanc'

export const modules: Module[] = [m0, m1, m2, m3, m4, m5]
export { mockExams }

export const allLessons: Lesson[] = modules.flatMap((m) => m.lessons)

export function getModule(id: string): Module | undefined {
  return modules.find((m) => m.id === id || m.slug === id)
}

export function getLesson(id: string): Lesson | undefined {
  return allLessons.find((l) => l.id === id)
}

export function getExam(id: string): MockExam | undefined {
  return mockExams.find((e) => e.id === id)
}

/** Leçon précédente et suivante dans l'ordre du module. */
export function lessonNeighbours(lesson: Lesson): { previous?: Lesson; next?: Lesson } {
  const lessons = getModule(lesson.moduleId)?.lessons ?? []
  const i = lessons.findIndex((l) => l.id === lesson.id)
  return { previous: lessons[i - 1], next: lessons[i + 1] }
}
