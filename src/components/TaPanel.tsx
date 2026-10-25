import { CopyButton } from './CopyButton'
import { trackPromptCopied } from '../lib/newrelic'

interface TaPanelProps {
  prompt: string
  trackingId: string
  /** Vrai quand le prompt contient le bloc de remédiation (score faible). */
  remediation?: boolean
}

/** Prompt Gemini à copier, avec le mode d'emploi. */
export function TaPanel({ prompt, trackingId, remediation = false }: TaPanelProps) {
  return (
    <section className="rounded-xl border-2 border-indigo-300 bg-indigo-50 p-5" aria-labelledby={`ta-${trackingId}`}>
      <h2 id={`ta-${trackingId}`} className="text-xl font-bold text-indigo-950">
        🤖 Pratiquer avec Gemini
      </h2>
      <ol className="mt-2 list-decimal space-y-1 pl-6 text-indigo-950">
        <li>Copie le prompt ci-dessous.</li>
        <li>Ouvre l’application Gemini sur ton téléphone (ou ton Gem « Objectif B2 »).</li>
        <li>Colle le prompt et envoie-le. Pour l’oral, touche l’icône Live et parle !</li>
        <li>Quand tu as fini, écris « bilan » pour recevoir ton évaluation.</li>
      </ol>
      {remediation && (
        <p className="mt-3 rounded-md bg-amber-100 p-3 text-amber-950">
          Ce prompt inclut les questions que tu as manquées à ton dernier quiz : Gemini va te proposer des exercices ciblés.
        </p>
      )}
      <div className="mt-4">
        <CopyButton text={prompt} onCopied={() => trackPromptCopied(trackingId)} />
      </div>
      <details className="mt-4">
        <summary className="cursor-pointer font-semibold text-indigo-900">Voir le prompt complet</summary>
        <pre className="mt-3 max-h-[32rem] overflow-auto whitespace-pre-wrap rounded-lg bg-white p-4 font-sans text-sm leading-relaxed text-slate-900">
          {prompt}
        </pre>
      </details>
    </section>
  )
}
