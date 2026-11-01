export type MarkdownBlock = { type: 'heading' | 'bullet' | 'paragraph'; text: string }

/** Découpe un texte Markdown simple : titres (#), puces (* ou -) et une ligne par paragraphe. */
export function parseMarkdown(markdown: string): MarkdownBlock[] {
  return markdown
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line): MarkdownBlock => {
      const heading = line.match(/^#+\s+(.*)$/)
      if (heading) return { type: 'heading', text: heading[1] }
      const bullet = line.match(/^[*-]\s+(.*)$/)
      if (bullet) return { type: 'bullet', text: bullet[1] }
      return { type: 'paragraph', text: line }
    })
}

/** Lignes lues à voix haute : les titres organisent la page, ils ne se disent pas. */
export function spokenLines(blocks: MarkdownBlock[]): string[] {
  return blocks.filter((b) => b.type !== 'heading').map((b) => b.text)
}
