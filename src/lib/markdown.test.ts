import { describe, expect, it } from 'vitest'
import { parseMarkdown, spokenLines } from './markdown'

describe('parseMarkdown', () => {
  const text = `
    # I. Introduction

    * **Thèse :** Je pense que non.
    - Deuxième puce
    Une phrase.
  `

  it('reconnaît les titres, les puces et les paragraphes', () => {
    expect(parseMarkdown(text)).toEqual([
      { type: 'heading', text: 'I. Introduction' },
      { type: 'bullet', text: '**Thèse :** Je pense que non.' },
      { type: 'bullet', text: 'Deuxième puce' },
      { type: 'paragraph', text: 'Une phrase.' },
    ])
  })

  it('ne confond pas le gras en début de ligne avec une puce', () => {
    expect(parseMarkdown('**Avis final :** Oui.')).toEqual([{ type: 'paragraph', text: '**Avis final :** Oui.' }])
  })

  it('ne lit pas les titres à voix haute', () => {
    expect(spokenLines(parseMarkdown(text))).toEqual(['**Thèse :** Je pense que non.', 'Deuxième puce', 'Une phrase.'])
  })
})
