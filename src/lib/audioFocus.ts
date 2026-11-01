/**
 * Un seul son à la fois sur la page (exercice, enregistrement ou réécoute) :
 * sinon, le micro enregistrerait la voix du site. Prendre la main arrête
 * ce qui était en cours.
 */
let stopCurrent: (() => void) | null = null

export function claimAudio(stop: () => void) {
  if (stopCurrent !== stop) stopCurrent?.()
  stopCurrent = stop
}

export function releaseAudio(stop: () => void) {
  if (stopCurrent === stop) stopCurrent = null
}

export function ownsAudio(stop: () => void): boolean {
  return stopCurrent === stop
}

export function stopAudio() {
  stopCurrent?.()
}
