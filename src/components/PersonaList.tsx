import type { Persona } from '../types'
import { parseMarkdown, spokenLines } from '../lib/markdown'
import { personaModel } from '../modules/m7-conversation'
import { buildPersonaPrompt } from '../ta-prompts'
import { AudioPlayer } from './AudioPlayer'
import { CopyButton } from './CopyButton'
import { Markdown } from './Markdown'
import { trackPromptCopied } from '../lib/newrelic'

/** Personnes du Module 7 : présentation modèle à lire et à écouter, cinq questions et prompt de jeu de rôle. */
export function PersonaList({ title, personas }: { title: string; personas: Persona[] }) {
  return (
    <section className="space-y-4">
      <h3 className="text-xl font-bold">{title}</h3>
      <ul className="space-y-4">
        {personas.map((p) => {
          const model = personaModel(p)
          return (
            <li key={p.id} className="card space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-lg font-bold">{p.title}</h4>
                <span className="rounded-full bg-surface-strong px-3 py-0.5 text-sm font-semibold">
                  On se dit « {p.address} »
                </span>
              </div>
              <p className="text-ink-soft">{p.about}</p>
              <AudioPlayer
                bare
                title={p.title}
                paragraphs={spokenLines(parseMarkdown(model))}
                transcriptOpen
                written={(current) => <Markdown text={model} active={current} />}
              />
              <CopyButton
                text={buildPersonaPrompt(p)}
                label="Copier le prompt de jeu de rôle"
                onCopied={() => trackPromptCopied(p.id)}
              />
            </li>
          )
        })}
      </ul>
    </section>
  )
}
