/** Synthèse vocale du navigateur : voix françaises et lecture avec promesse. */

export function speechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

export function frenchVoices(): SpeechSynthesisVoice[] {
  const voices = window.speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().startsWith('fr'))
  // Priorité au français canadien, puis aux voix « naturelles » plutôt qu'aux voix
  // fantaisie nommées « Nom (Langue) » (Grandma, Rocko… sur macOS).
  const rank = (v: SpeechSynthesisVoice) => (v.lang === 'fr-CA' ? 0 : 2) + (v.name.includes('(') ? 1 : 0)
  return voices.sort((a, b) => rank(a) - rank(b))
}

/** Les navigateurs chargent les voix après coup : la première liste peut être vide. */
function voicesReady(): Promise<void> {
  const synth = window.speechSynthesis
  if (synth.getVoices().length > 0) return Promise.resolve()
  return new Promise((resolve) => {
    const done = () => {
      window.clearTimeout(timeout)
      synth.removeEventListener('voiceschanged', done)
      resolve()
    }
    const timeout = window.setTimeout(done, 1000)
    synth.addEventListener('voiceschanged', done)
  })
}

/**
 * Lit un texte et se résout à la fin de la lecture. Certains navigateurs mobiles
 * n'envoient pas toujours `onend` : un délai de secours évite de bloquer l'exercice.
 */
export async function speak(text: string, rate: number): Promise<void> {
  await voicesReady()
  return new Promise((resolve) => {
    const utterance = new SpeechSynthesisUtterance(text)
    const voice = frenchVoices()[0]
    utterance.lang = voice?.lang ?? 'fr-CA'
    if (voice) utterance.voice = voice
    utterance.rate = rate
    const fallback = window.setTimeout(resolve, (text.length * 120) / rate + 4000)
    const done = () => {
      window.clearTimeout(fallback)
      resolve()
    }
    utterance.onend = done
    utterance.onerror = done
    window.speechSynthesis.speak(utterance)
  })
}
