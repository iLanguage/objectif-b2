import { Link } from 'react-router-dom'
import { GuideLayout, GuideSection } from './GuideLayout'
import { CopyButton } from '../components/CopyButton'
import { generalSystemPrompt } from '../ta-prompts'
import { allLessons, mockExams } from '../modules'

export function GuideTA() {
  return (
    <GuideLayout
      title="Guide du TA : configurer Gemini"
      intro={
        <p>
          Gemini est l’assistant d’enseignement (TA) de l’élève, sur son téléphone Android ou son enceinte connectée. Chaque leçon du site
          fournit un prompt structuré — contexte, objectif, exercices, vocabulaire cible, critères de réussite — à coller dans Gemini.
        </p>
      }
    >
      <GuideSection id="gem" title="1. Créer un Gem « Objectif B2 » (une seule fois)">
        <ol className="list-decimal space-y-2 pl-6">
          <li>
            Sur un ordinateur, ouvre{' '}
            <a href="https://gemini.google.com" target="_blank" rel="noreferrer" className="text-blue-800 underline">
              gemini.google.com
              <span className="sr-only"> (s’ouvre dans un nouvel onglet)</span>
            </a>{' '}
            avec le compte Google de l’élève, puis « Gems » → « Nouveau Gem ».
          </li>
          <li>Nomme-le « Objectif B2 » et colle le prompt général ci-dessous dans les instructions.</li>
          <li>Le Gem apparaît ensuite dans l’application Gemini du téléphone : l’élève n’a plus qu’à coller le prompt de la leçon.</li>
        </ol>
        <p>
          Sans Gem, ce n’est pas grave : les prompts de leçon copiés depuis le mode TA contiennent déjà le prompt général.
        </p>
        <div>
          <CopyButton text={generalSystemPrompt} label="Copier le prompt général" />
        </div>
        <details>
          <summary className="cursor-pointer font-semibold text-blue-900">Voir le prompt général</summary>
          <pre className="mt-3 whitespace-pre-wrap rounded-lg bg-slate-50 p-4 font-sans text-sm">{generalSystemPrompt}</pre>
        </details>
      </GuideSection>

      <GuideSection id="seance" title="2. Une séance avec Gemini">
        <ol className="list-decimal space-y-2 pl-6">
          <li>Ouvre la leçon sur le site et choisis le mode « TA Gemini » en haut de la page.</li>
          <li>Touche « Copier le prompt », puis colle-le dans Gemini.</li>
          <li>
            Pour l’oral, touche l’icône <strong>Live</strong> : Gemini devient un interlocuteur vocal (client de la crêperie, examinateur
            du DELF, coordonnatrice des bénévoles…).
          </li>
          <li>À la fin, écris ou dis « bilan » : Gemini résume tes réussites, tes erreurs fréquentes et te donne un mini-défi.</li>
        </ol>
      </GuideSection>

      <GuideSection id="remediation" title="3. Améliorer un score faible">
        <p>
          Quand un quiz est sous 70 %, le prompt de la leçon inclut automatiquement les questions manquées et leurs bonnes réponses.
          Gemini explique la règle, propose trois nouveaux exercices par erreur, et dit à l’élève quand il est prêt à retenter le quiz.
        </p>
      </GuideSection>

      <GuideSection id="productions" title="4. Faire corriger une production">
        <p>
          Pour une production écrite, l’élève copie son texte (bouton « Copier mon texte ») et le colle après le prompt de la leçon :
          Gemini l’évalue avec les critères de la grille DELF B2. Cette note est indicative ; la note officielle du parcours est celle du
          professeur.
        </p>
      </GuideSection>

      <GuideSection id="prudence" title="5. Bonnes pratiques">
        <ul className="list-disc space-y-2 pl-6">
          <li>Gemini peut se tromper : en cas de doute sur une règle, vérifie dans la leçon ou demande au professeur.</li>
          <li>Ne partage pas d’informations personnelles sensibles (adresse, informations de santé) dans la conversation.</li>
          <li>Demande-lui de rester en français, même quand c’est difficile : c’est là qu’on progresse.</li>
        </ul>
      </GuideSection>

      <GuideSection id="liste" title="Tous les prompts">
        <ul className="grid gap-1 sm:grid-cols-2">
          {allLessons.map((l) => (
            <li key={l.id}>
              <Link to={`/lecon/${l.id}`} className="text-blue-800 underline">
                {l.id} — {l.title}
              </Link>
            </li>
          ))}
          {mockExams.map((e) => (
            <li key={e.id}>
              <Link to={`/examen/${e.id}`} className="text-blue-800 underline">
                {e.title} — {e.theme}
              </Link>
            </li>
          ))}
        </ul>
      </GuideSection>
    </GuideLayout>
  )
}
