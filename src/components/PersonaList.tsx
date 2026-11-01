import type { Persona } from '../types'
import { buildPersonaPrompt } from '../ta-prompts'
import { CopyButton } from './CopyButton'
import { trackPromptCopied } from '../lib/newrelic'

/** Personnes du Module 7 : présentation modèle, cinq questions et prompt de jeu de rôle. */
export function PersonaList({ title, personas }: { title: string; personas: Persona[] }) {
  return (
    <section className="space-y-4">
      <h3 className="text-xl font-bold">{title}</h3>
      <ul className="space-y-4">
        {personas.map((p) => (
          <li key={p.id} className="card space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-lg font-bold">{p.title}</h4>
              <span className="rounded-full bg-surface-strong px-3 py-0.5 text-sm font-semibold">
                On se dit « {p.address} »
              </span>
            </div>
            <p className="text-ink-soft">{p.about}</p>
            <div>
              <p className="font-semibold">Exemple dans ta propre voix (à adapter) :</p>
              <p className="mt-1 rounded-lg bg-surface-muted p-3" lang="fr">
                {p.modelIntro}
              </p>
            </div>
            <div>
              <p className="font-semibold">Cinq questions pour faire parler cette personne :</p>
              <ol className="mt-1 list-decimal space-y-1 pl-6" lang="fr">
                {p.questions.map((q) => (
                  <li key={q}>{q}</li>
                ))}
              </ol>
            </div>
            <CopyButton
              text={buildPersonaPrompt(p)}
              label="Copier le prompt de jeu de rôle"
              onCopied={() => trackPromptCopied(p.id)}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}
