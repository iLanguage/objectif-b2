import { describe, expect, it } from 'vitest'
import { MILESTONES, TOTAL_WEEKS, allWeeks, daysUntil, phaseForWeek, weekNumber, weekPlan } from './syllabus'

describe('syllabus', () => {
  it('numérote les semaines à partir du 26 octobre 2026', () => {
    expect(weekNumber(new Date(2026, 9, 25))).toBe(0)
    expect(weekNumber(new Date(2026, 9, 26))).toBe(1)
    expect(weekNumber(new Date(2026, 10, 1))).toBe(1)
    expect(weekNumber(new Date(2026, 10, 2))).toBe(2)
    expect(weekNumber(new Date(2027, 3, 26))).toBe(27)
    expect(weekNumber(new Date(2027, 5, 1))).toBe(TOTAL_WEEKS + 1)
  })

  it('associe chaque semaine à une phase', () => {
    for (let w = 1; w <= TOTAL_WEEKS; w++) expect(phaseForWeek(w)).toBeDefined()
    expect(phaseForWeek(1)?.level).toBe('A2 → B1')
    expect(phaseForWeek(22)?.id).toBe(4)
  })

  it('place les échéances dans le calendrier', () => {
    const weeksWithMilestones = allWeeks().filter((w) => w.milestones.length > 0)
    expect(weeksWithMilestones.flatMap((w) => w.milestones)).toHaveLength(MILESTONES.length)
  })

  it('propose un bloc de fondations et des leçons thématiques', () => {
    const plan1 = weekPlan(1)
    expect(plan1.foundations.map((l) => l.id)).toEqual(['0.A'])
    expect(plan1.lessons.map((l) => l.id)).toEqual(expect.arrayContaining(['1.0', '2.1']))

    const plan = weekPlan(5)
    expect(plan.foundations.map((l) => l.id)).toEqual(['0.B'])
    expect(plan.lessons.map((l) => l.id)).toEqual(expect.arrayContaining(['1.3', '4.1']))
  })

  it('compte les jours avant une échéance', () => {
    expect(daysUntil('2027-05-01', new Date(2027, 3, 30))).toBe(1)
  })
})
