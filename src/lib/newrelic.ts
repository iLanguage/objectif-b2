/**
 * Intégration légère avec le New Relic Browser Agent.
 *
 * Le snippet officiel (SPA loader v1.324.0, Session Replay, Distributed Tracing,
 * masquage de tous les champs) est collé tel quel dans le <head> de index.html.
 * Ces fonctions ajoutent seulement des événements métier ; elles ne font rien
 * quand l'agent n'est pas chargé (développement local, tests, bloqueur de pub).
 */

interface NewRelicAgent {
  addPageAction(name: string, attributes?: Record<string, string | number | boolean>): void
  setCustomAttribute(name: string, value: string | number | boolean | null): void
  setPageViewName?(name: string, host?: string): void
}

declare global {
  interface Window {
    newrelic?: NewRelicAgent
  }
}

export const NEW_RELIC_ACCOUNT_ID = '4464141'
export const NEW_RELIC_AGENT_ID = '1120304090'

function agent(): NewRelicAgent | undefined {
  return typeof window === 'undefined' ? undefined : window.newrelic
}

export function trackPageView(path: string) {
  agent()?.setPageViewName?.(path || '/')
}

export function trackMode(mode: string) {
  agent()?.setCustomAttribute('mode', mode)
}

export function trackQuizCompleted(lessonId: string, percent: number) {
  agent()?.addPageAction('quizCompleted', { lessonId, percent })
}

export function trackExamSection(examId: string, skill: string, score: number) {
  agent()?.addPageAction('examSectionSubmitted', { examId, skill, score })
}

export function trackPromptCopied(lessonId: string) {
  agent()?.addPageAction('taPromptCopied', { lessonId })
}
