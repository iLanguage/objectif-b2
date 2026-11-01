import { describe, expect, it } from 'vitest'
import type { PhraseDrill } from '../types'
import { NORMAL_RATE, SLOW_RATE, drillSteps, speakingPause } from './drill'

const drill: PhraseDrill = {
  id: 'mettons-que',
  phrase: 'Mettons que',
  context: 'Mettons que t’as pas le temps de finir ton rapport, tu fais quoi ?',
  buildUp: ['que', 'ons que', 'mettons que'],
  register: 'familier',
  meaning: 'Pour imaginer une situation.',
  en: 'let’s say',
}

describe('drillSteps', () => {
  const steps = drillSteps(drill)

  it('fait écouter la phrase trois fois : normale, puis deux fois plus lente', () => {
    expect(steps.slice(0, 3).map((s) => [s.text, s.rate])).toEqual([
      [drill.context, NORMAL_RATE],
      [drill.context, SLOW_RATE],
      [drill.context, SLOW_RATE],
    ])
  })

  it('construit à partir de la fin : essai, modèle, puis répétition', () => {
    const build = steps.slice(3)
    expect(build.map((s) => s.text)).toEqual(['que', 'que', 'que', 'ons que', 'ons que', 'ons que', 'mettons que', 'mettons que', 'mettons que'])
    expect(build.slice(0, 3).map((s) => s.label)).toEqual(['À toi : essaie de le dire', 'Écoute le modèle', 'Répète'])
    expect(build.slice(0, 3).map((s) => s.rate)).toEqual([undefined, NORMAL_RATE, undefined])
  })

  it('laisse plus de temps pour les morceaux longs', () => {
    expect(speakingPause('mettons que')).toBeGreaterThan(speakingPause('que'))
  })
})
