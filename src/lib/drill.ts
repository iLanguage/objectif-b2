import type { PhraseDrill } from '../types'

export const NORMAL_RATE = 0.95
export const SLOW_RATE = 0.7

export interface DrillStep {
  /** Consigne affichée pendant l'étape. */
  label: string
  text: string
  /** Lue à voix haute à cette vitesse ; sinon, pause pendant que l'élève parle. */
  rate?: number
}

/** Temps laissé à l'élève pour dire un morceau à voix haute. */
export function speakingPause(text: string): number {
  return 1800 + text.length * 80
}

/**
 * Déroulement d'un exercice : la phrase en contexte trois fois (vitesse normale,
 * puis deux fois plus lentement), puis la construction arrière. Pour chaque
 * morceau, l'élève essaie, entend le modèle et répète.
 */
export function drillSteps(drill: PhraseDrill): DrillStep[] {
  return [
    { label: 'Écoute 1 sur 3 — vitesse normale', text: drill.context, rate: NORMAL_RATE },
    { label: 'Écoute 2 sur 3 — plus lentement', text: drill.context, rate: SLOW_RATE },
    { label: 'Écoute 3 sur 3 — plus lentement', text: drill.context, rate: SLOW_RATE },
    ...drill.buildUp.flatMap((chunk): DrillStep[] => [
      { label: 'À toi : essaie de le dire', text: chunk },
      { label: 'Écoute le modèle', text: chunk, rate: NORMAL_RATE },
      { label: 'Répète', text: chunk },
    ]),
  ]
}
