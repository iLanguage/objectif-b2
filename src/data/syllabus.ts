import type { Lesson, MockExam } from '../types'
import { allLessons, mockExams } from '../modules'

/**
 * Calendrier du parcours A2 → B2 : 27 semaines, du lundi 26 octobre 2026
 * au 1er mai 2027 (date limite de Marianopolis).
 */

export const START_DATE = '2026-10-26'
export const TOTAL_WEEKS = 27

export interface Milestone {
  date: string
  label: string
  kind: 'exam' | 'deadline'
}

export const MILESTONES: Milestone[] = [
  { date: '2027-03-01', label: 'DELF B2 — Tentative 1 (diagnostic)', kind: 'exam' },
  { date: '2027-04-01', label: 'DELF B2 — Tentative 2', kind: 'exam' },
  { date: '2027-05-01', label: 'Date limite Marianopolis', kind: 'deadline' },
]

export interface Phase {
  id: number
  title: string
  level: string
  weeks: [number, number]
  focus: string
}

export const PHASES: Phase[] = [
  { id: 1, title: 'Fondations + introduction des thèmes', level: 'A2 → B1', weeks: [1, 6], focus: 'Temps de base, vocabulaire des quatre thèmes, routines d’immersion.' },
  { id: 2, title: 'Immersion thématique intensive', level: 'B1', weeks: [7, 14], focus: 'Subjonctif et connecteurs ; premières productions écrites et orales.' },
  { id: 3, title: 'Production + argumentation', level: 'B1 → B2', weeks: [15, 20], focus: 'Exposés, essais argumentatifs, registres de langue.' },
  { id: 4, title: 'Simulation B2', level: 'B2', weeks: [21, 24], focus: 'Examens blancs chronométrés et ajustements.' },
  { id: 5, title: 'Corrections ciblées', level: 'B2', weeks: [25, 27], focus: 'Retravailler les épreuves faibles avant la tentative 2 et la date limite.' },
]

const DAY = 24 * 60 * 60 * 1000

function parseDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function weekStart(week: number): Date {
  const start = parseDate(START_DATE)
  return new Date(start.getFullYear(), start.getMonth(), start.getDate() + (week - 1) * 7)
}

/** Nombre de jours entre deux dates locales, sans erreur aux changements d'heure. */
function dayDiff(from: Date, to: Date): number {
  const a = new Date(from.getFullYear(), from.getMonth(), from.getDate())
  const b = new Date(to.getFullYear(), to.getMonth(), to.getDate())
  return Math.round((b.getTime() - a.getTime()) / DAY)
}

/** Numéro de semaine (1 à 27) pour une date ; 0 avant le début, 28 après la fin. */
export function weekNumber(date: Date): number {
  const diff = dayDiff(parseDate(START_DATE), date)
  if (diff < 0) return 0
  return Math.min(Math.floor(diff / 7) + 1, TOTAL_WEEKS + 1)
}

export function phaseForWeek(week: number): Phase | undefined {
  return PHASES.find((p) => week >= p.weeks[0] && week <= p.weeks[1])
}

export function daysUntil(iso: string, from: Date): number {
  return dayDiff(from, parseDate(iso))
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('fr-CA', { day: 'numeric', month: 'long', year: 'numeric' })
}

export interface WeekPlan {
  week: number
  start: Date
  phase?: Phase
  /** Bloc de grammaire (Module 0) en cours cette semaine. */
  foundations: Lesson[]
  /** Nouvelles leçons thématiques de la semaine (Modules 1 à 4). */
  lessons: Lesson[]
  exams: MockExam[]
  milestones: Milestone[]
}

export function weekPlan(week: number): WeekPlan {
  const start = weekStart(week)
  const end = weekStart(week + 1)
  const inWeek = (l: Lesson) => week >= l.week && week <= (l.untilWeek ?? l.week)
  return {
    week,
    start,
    phase: phaseForWeek(week),
    foundations: allLessons.filter((l) => l.moduleId === 'm0' && inWeek(l)),
    lessons: allLessons.filter((l) => l.moduleId !== 'm0' && inWeek(l)),
    exams: mockExams.filter((e) => e.week === week),
    milestones: MILESTONES.filter((m) => {
      const d = parseDate(m.date)
      return d >= start && d < end
    }),
  }
}

export function allWeeks(): WeekPlan[] {
  return Array.from({ length: TOTAL_WEEKS }, (_, i) => weekPlan(i + 1))
}

/** Semaine type, telle que décrite dans le plan pédagogique (cours samedi et dimanche). */
export const TYPICAL_WEEK = [
  { day: 'Lundi', where: 'Trajet', minutes: 30, activity: 'Mauril (défis d’écoute) & Radio-Canada OHdio', theme: 'Compréhension orale', mode: 'Immersion autonome' },
  { day: 'Mardi', where: 'Trajet', minutes: 30, activity: 'YouTube Music (artistes francophones / québécois)', theme: 'Immersion passive', mode: 'Autonome' },
  { day: 'Mercredi', where: 'Maison', minutes: 30, activity: 'Pratique de conversation et vocabulaire avec Gemini TA', theme: 'Pratique guidée', mode: 'TA Gemini' },
  { day: 'Jeudi', where: 'Trajet', minutes: 30, activity: 'Mauril ou reportage santé / société', theme: 'Médecine & Société', mode: 'Immersion autonome' },
  { day: 'Vendredi', where: 'Divertissement', minutes: 45, activity: 'Émission ICI TOU.TV ou anime en VF', theme: 'Immersion libre', mode: 'Autonome' },
  { day: 'Samedi', where: 'Cours 1 + Pratique', minutes: 90, activity: 'Cours 1 (1 h avec le professeur) + Quiz interactifs et vocabulaire (30 min)', theme: 'Fondations + Thèmes (Crêperie / Médecine)', mode: 'Professeur + TA' },
  { day: 'Dimanche', where: 'Cours 2 + Production', minutes: 90, activity: 'Cours 2 (1 h avec le professeur : oral ou écrit) + Devoir et examens blancs (30 min)', theme: 'Production DELF B2', mode: 'Professeur + TA' },
]
