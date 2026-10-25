import { describe, expect, it } from 'vitest'
import type { AutoQuestion } from '../types'
import { evaluateDelf, feedbackFor, normalizeAnswer, scoreQuestion, scoreQuiz, to25, wordCount } from './scoring'

const mcq: AutoQuestion = { id: 'm', type: 'mcq', prompt: '?', options: ['a', 'b', 'c'], answer: 1 }
const fill: AutoQuestion = { id: 'f', type: 'fill', text: 'Je ___ et tu ___.', answers: [['suis arrivé', 'suis arrivée'], ['pleuvait']] }
const matching: AutoQuestion = {
  id: 'p',
  type: 'matching',
  prompt: '?',
  pairs: [
    { left: 'x', right: '1' },
    { left: 'y', right: '2' },
  ],
}

describe('normalizeAnswer', () => {
  it('ignore la casse, les espaces, les apostrophes typographiques et la ponctuation finale', () => {
    expect(normalizeAnswer('  Suis   Arrivé. ')).toBe('suis arrivé')
    expect(normalizeAnswer('j’ai')).toBe("j'ai")
    expect(normalizeAnswer("j ' ai")).toBe("j'ai")
  })

  it('garde les accents significatifs', () => {
    expect(normalizeAnswer('a')).not.toBe(normalizeAnswer('à'))
  })
})

describe('scoreQuestion', () => {
  it('note un QCM', () => {
    expect(scoreQuestion(mcq, 1)).toBe(1)
    expect(scoreQuestion(mcq, 0)).toBe(0)
    expect(scoreQuestion(mcq, undefined)).toBe(0)
  })

  it('donne un crédit partiel aux textes à trous', () => {
    expect(scoreQuestion(fill, ['Suis arrivée', 'pleuvait'])).toBe(1)
    expect(scoreQuestion(fill, ['suis arrivé', 'a plu'])).toBe(0.5)
    expect(scoreQuestion(fill, ['', ''])).toBe(0)
  })

  it('donne un crédit partiel à l’appariement', () => {
    expect(scoreQuestion(matching, { x: '1', y: '2' })).toBe(1)
    expect(scoreQuestion(matching, { x: '1', y: '1' })).toBe(0.5)
    expect(scoreQuestion(matching, [])).toBe(0)
  })
})

describe('scoreQuiz', () => {
  it('calcule le pourcentage et liste les questions manquées', () => {
    const result = scoreQuiz([mcq, fill, matching], { m: 1, f: ['suis arrivé', 'x'], p: { x: '1', y: '2' } })
    expect(result.points).toBe(2.5)
    expect(result.max).toBe(3)
    expect(result.percent).toBe(83)
    expect(result.missed).toEqual(['f'])
  })

  it('gère un quiz vide', () => {
    expect(scoreQuiz([], {}).percent).toBe(0)
  })
})

describe('to25', () => {
  it('arrondit au demi-point', () => {
    expect(to25(12, 12)).toBe(25)
    expect(to25(7, 12)).toBe(14.5)
    expect(to25(0, 0)).toBe(0)
  })
})

describe('evaluateDelf', () => {
  it('valide un examen qui respecte les exigences de Marianopolis', () => {
    const e = evaluateDelf({ CO: 15, CE: 18, PE: 17, PO: 18 })
    expect(e.total).toBe(68)
    expect(e.passedDelf).toBe(true)
    expect(e.passedMarianopolis).toBe(true)
    expect(e.issues).toEqual([])
  })

  it('élimine une épreuve sous 5/25', () => {
    const e = evaluateDelf({ CO: 4, CE: 20, PE: 20, PO: 20 })
    expect(e.passedDelf).toBe(false)
    expect(e.issues[0]).toContain('éliminatoire')
  })

  it('réussit le DELF sans atteindre les minimums de Marianopolis', () => {
    const e = evaluateDelf({ CO: 20, CE: 12, PE: 20, PO: 20 })
    expect(e.passedDelf).toBe(true)
    expect(e.passedMarianopolis).toBe(false)
    expect(e.issues.join(' ')).toContain('13/25')
  })

  it('exige un total de 67/100', () => {
    const e = evaluateDelf({ CO: 13, CE: 14, PE: 14, PO: 13 })
    expect(e.total).toBe(54)
    expect(e.passedDelf).toBe(true)
    expect(e.passedMarianopolis).toBe(false)
  })

  it('signale un examen incomplet', () => {
    const e = evaluateDelf({ CO: 20 })
    expect(e.complete).toBe(false)
    expect(e.passedDelf).toBe(false)
  })
})

describe('wordCount', () => {
  it('compte les mots comme au DELF', () => {
    expect(wordCount("L'hôpital est grand, c'est-à-dire immense !")).toBe(5)
    expect(wordCount('   ')).toBe(0)
    expect(wordCount('Bonjour — Madame')).toBe(2)
  })
})

describe('feedbackFor', () => {
  it('adapte le message au score', () => {
    expect(feedbackFor(90).label).toBe('Excellent')
    expect(feedbackFor(70).label).toBe('Réussi')
    expect(feedbackFor(55).label).toBe('Presque')
    expect(feedbackFor(10).label).toBe('À retravailler')
  })
})
