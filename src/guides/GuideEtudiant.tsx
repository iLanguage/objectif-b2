import { GuideLayout, GuideSection } from './GuideLayout'

const APPS = [
  { app: 'Google Gemini', usage: 'TA — pratiquer la conversation, le vocabulaire, les exercices', why: 'Assistant principal du cours' },
  { app: 'Radio-Canada OHdio', usage: 'Podcasts authentiques en français québécois', why: 'Compréhension orale pendant le trajet' },
  { app: 'ICI TOU.TV', usage: 'Séries, documentaires, émissions en français', why: 'Immersion par le divertissement' },
  { app: 'Crunchyroll (sous-titres FR)', usage: 'Anime avec sous-titres français', why: 'Motivation + écoute naturelle' },
  { app: 'YouTube (langue → FR)', usage: 'Contenu francophone, vulgarisation scientifique', why: 'Immersion libre' },
  { app: 'Linguee (pas Google Traduction)', usage: 'Dictionnaire contextuel anglais ↔ français', why: 'Comprendre en contexte, pas traduire' },
  { app: 'Le Conjugueur', usage: 'Conjugaison rapide', why: 'Référence de grammaire' },
  { app: 'Google Keep', usage: 'Carnet de vocabulaire personnel', why: 'Noter les mots nouveaux du quotidien' },
  { app: 'TalkBack (Android)', usage: 'Lecteur d’écran en français', why: 'Écouter le cours tout en lisant' },
  { app: 'Spotify (listes FR)', usage: 'Musique francophone québécoise et internationale', why: 'Immersion musicale passive' },
]

export function GuideEtudiant() {
  return (
    <GuideLayout
      title="Guide étudiant : applications et immersion"
      intro={
        <p>
          L’idée : transformer ton environnement numérique en environnement francophone. Tu ne traduis pas tout : tu développes ton
          intuition. Chaque podcast écouté, chaque conversation avec un client est une victoire concrète vers la médecine.
        </p>
      }
    >
      <GuideSection id="principes" title="Les 4 principes de l’immersion">
        <ol className="list-decimal space-y-2 pl-6">
          <li>
            <strong>Mets ton téléphone en français</strong> : Paramètres → Système → Langues et saisie → Langues → ajoute « Français
            (Canada) » et place-le en premier. Notifications, menus et Gemini te parleront en français.
          </li>
          <li>
            <strong>Écoute avant de lire</strong> : ne lis pas la traduction. Devine le sens par le contexte, puis vérifie.
          </li>
          <li>
            <strong>20 minutes minimum par jour</strong> : podcast, musique ou série en français — le trajet en métro ou en autobus suffit.
          </li>
          <li>
            <strong>3 mots nouveaux par jour</strong> dans Google Keep. Le week-end, colle ta liste dans Gemini pour les réviser (page
            Vocabulaire).
          </li>
        </ol>
      </GuideSection>

      <GuideSection id="apps" title="Applications recommandées (Android)">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[36rem] text-left">
            <caption className="sr-only">Applications recommandées, leur usage et pourquoi</caption>
            <thead>
              <tr className="border-b border-slate-300 text-sm text-slate-600">
                <th scope="col" className="py-2 pr-3">Application</th>
                <th scope="col" className="py-2 pr-3">Usage</th>
                <th scope="col" className="py-2">Pourquoi</th>
              </tr>
            </thead>
            <tbody>
              {APPS.map((a) => (
                <tr key={a.app} className="border-b border-slate-100">
                  <th scope="row" className="py-2 pr-3 font-semibold">
                    {a.app}
                  </th>
                  <td className="py-2 pr-3">{a.usage}</td>
                  <td className="py-2">{a.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GuideSection>

      <GuideSection id="semaine" title="Ta semaine type">
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>En classe (2 × 1 h)</strong> : grammaire, productions écrites et simulations orales avec ton professeur.
          </li>
          <li>
            <strong>Trajets</strong> : Radio-Canada OHdio (Moteur de recherche, Les années lumière), musique, anime en VF.
          </li>
          <li>
            <strong>Jeudi soir (30 min)</strong> : vocabulaire avec Gemini — ouvre la leçon, passe en mode TA et copie le prompt.
          </li>
          <li>
            <strong>Week-end (3 h)</strong> : quiz du site, production écrite, et à partir de la semaine 20, examens blancs.
          </li>
        </ul>
      </GuideSection>

      <GuideSection id="site" title="Bien utiliser ce site">
        <ul className="list-disc space-y-2 pl-6">
          <li>Le tableau de bord t’indique les leçons de la semaine. Un quiz est réussi à 70 %.</li>
          <li>
            Sous 70 % ? Passe en <strong>mode TA</strong> : le prompt Gemini contient automatiquement les questions que tu as manquées.
          </li>
          <li>Les documents audio sont lus par la voix française de ton appareil. Écoute d’abord sans la transcription.</li>
          <li>
            Ta progression est enregistrée sur ton appareil. Avant de changer de téléphone ou d’ordinateur, exporte-la (mode Professeur
            → Suivi).
          </li>
          <li>Avec TalkBack, le site se navigue par titres : glisse vers le haut puis vers le bas pour choisir « Titres ».</li>
        </ul>
      </GuideSection>
    </GuideLayout>
  )
}
