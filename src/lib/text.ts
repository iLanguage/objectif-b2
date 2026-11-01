/** Nom du fichier d'un enregistrement sauvegardé. Chrome enregistre en WebM, Safari en MP4. */
export function recordingFileName(label: string, mimeType: string): string {
  const name = label
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
  const extension = mimeType.includes('mp4') ? 'm4a' : mimeType.includes('ogg') ? 'ogg' : 'webm'
  return `${name || 'enregistrement'}.${extension}`
}

/** Insère `char` à la position du curseur d'un champ et renvoie la nouvelle valeur. */
export function insertAtCursor(el: HTMLInputElement | HTMLTextAreaElement | null, value: string, char: string): string {
  if (!el) return value + char
  const start = el.selectionStart ?? value.length
  const end = el.selectionEnd ?? value.length
  const next = value.slice(0, start) + char + value.slice(end)
  requestAnimationFrame(() => {
    el.focus()
    el.setSelectionRange(start + char.length, start + char.length)
  })
  return next
}
