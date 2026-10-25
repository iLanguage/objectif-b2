/** Hachage simple et stable d'une chaîne (FNV-1a). */
function hash(seed: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

/**
 * Renvoie un ordre mélangé des indices 0..n-1, toujours le même pour une même
 * graine : l'ordre des options ne change pas d'un affichage à l'autre, mais la
 * bonne réponse n'est pas toujours à la même position.
 */
export function seededOrder(n: number, seed: string): number[] {
  const order = Array.from({ length: n }, (_, i) => i)
  let state = hash(seed) || 1
  for (let i = n - 1; i > 0; i--) {
    state ^= state << 13
    state ^= state >>> 17
    state ^= state << 5
    const j = (state >>> 0) % (i + 1)
    ;[order[i], order[j]] = [order[j], order[i]]
  }
  return order
}
