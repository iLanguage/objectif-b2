import type { ReactNode } from 'react'
import { parseMarkdown, type MarkdownBlock } from '../lib/markdown'
import { RichText } from './RichText'

interface MarkdownProps {
  text: string
  /** Ligne lue en ce moment, comptée sans les titres. */
  active?: number | null
}

/** Affiche un texte Markdown simple. Les titres sont des h4, sous le h3 de la section. */
export function Markdown({ text, active = null }: MarkdownProps) {
  const highlight = (spoken: number) => (active === spoken ? 'rounded bg-highlight' : undefined)
  const nodes: ReactNode[] = []
  let bullets: { block: MarkdownBlock; spoken: number }[] = []
  let spoken = 0

  const flushBullets = (key: number) => {
    if (bullets.length === 0) return
    nodes.push(
      <ul key={`ul-${key}`} className="mt-2 list-disc space-y-2 pl-6">
        {bullets.map((b) => (
          <li key={b.spoken} className={highlight(b.spoken)}>
            <RichText text={b.block.text} />
          </li>
        ))}
      </ul>,
    )
    bullets = []
  }

  parseMarkdown(text).forEach((block, i) => {
    if (block.type === 'bullet') {
      bullets.push({ block, spoken: spoken++ })
      return
    }
    flushBullets(i)
    if (block.type === 'heading') {
      nodes.push(
        <h4 key={i} className="mt-4 text-lg font-bold first:mt-0">
          <RichText text={block.text} />
        </h4>,
      )
    } else {
      nodes.push(
        <p key={i} className={`mt-2 first:mt-0 ${highlight(spoken) ?? ''}`}>
          <RichText text={block.text} />
        </p>,
      )
      spoken += 1
    }
  })
  flushBullets(-1)

  return (
    <div className="leading-relaxed" lang="fr">
      {nodes}
    </div>
  )
}
