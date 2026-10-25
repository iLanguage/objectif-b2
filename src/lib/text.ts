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
