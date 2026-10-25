import { Link } from 'react-router-dom'
import { GuideLayout, GuideSection } from './GuideLayout'
import { MARIANOPOLIS_MINIMUMS, MARIANOPOLIS_TOTAL } from '../lib/scoring'

export function GuideProfesseur() {
  return (
    <GuideLayout
      title="Guide du professeur"
      intro={
        <p>
          Vous conduisez les deux heures de cours hebdomadaires. Le site gère les quiz, le calendrier et la pratique autonome avec
          Gemini ; votre rôle est de travailler ce qu’une machine fait mal : la production écrite, la production orale et la motivation.
        </p>
      }
    >
      <GuideSection id="objectif" title="L’objectif">
        <p>
          DELF B2 avant le 1ᵉʳ mai 2027, avec les exigences de Marianopolis : compréhension des écrits et production écrite au moins{' '}
          {MARIANOPOLIS_MINIMUMS.CE}/25, compréhension de l’oral et production orale au moins {MARIANOPOLIS_MINIMUMS.CO}/25, total d’au
          moins {MARIANOPOLIS_TOTAL}/100. L’élève passera l’examen deux fois : une tentative diagnostique en février/mars, puis une
          seconde en avril.
        </p>
      </GuideSection>

      <GuideSection id="cours" title="Structure des deux cours de la semaine">
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>Cours 1 (lundi, 1 h)</strong> : 10 min de retour sur la semaine (podcasts écoutés, mots notés), 30 min sur le bloc de
            grammaire du Module 0 en cours, 20 min d’exercice guidé appliqué à un thème (médecine, crêperie, MUHC, SAAQ).
          </li>
          <li>
            <strong>Cours 2 (mercredi, 1 h)</strong> : une production — simulation orale chronométrée ou production écrite — puis
            correction avec la grille DELF.
          </li>
          <li>Entre les cours, l’élève fait les quiz et pratique avec Gemini ; vérifiez ses résultats dans le tableau de suivi.</li>
        </ul>
      </GuideSection>

      <GuideSection id="modes" title="Le mode Professeur">
        <ul className="list-disc space-y-2 pl-6">
          <li>Chaque leçon affiche vos notes pédagogiques, l’historique des quiz et les questions manquées.</li>
          <li>
            Pour les productions, remplissez la grille critère par critère et enregistrez : l’élève voit la note et votre commentaire en
            mode Élève.
          </li>
          <li>
            Le <Link to="/progression" className="text-blue-800 underline">tableau de suivi</Link> résume toutes les leçons et les
            examens blancs. La progression vit dans le navigateur de l’élève : demandez-lui d’exporter un fichier si vous corrigez sur
            un autre appareil, puis importez-le.
          </li>
        </ul>
      </GuideSection>

      <GuideSection id="correction" title="Corriger efficacement">
        <ul className="list-disc space-y-2 pl-6">
          <li>Soulignez deux forces et trois priorités, pas toutes les erreurs : un texte couvert de rouge décourage.</li>
          <li>Faites réécrire : la deuxième version d’un texte fait plus progresser que trois nouveaux textes.</li>
          <li>
            À l’oral, jouez l’examinateur exigeant : contredisez poliment pour obliger l’élève à nuancer (critère « réagir aux arguments
            d’autrui »).
          </li>
          <li>
            Utilisez les <Link to="/grilles" className="text-blue-800 underline">grilles DELF</Link> dès les premières productions, pour
            que l’élève intègre les critères.
          </li>
        </ul>
      </GuideSection>

      <GuideSection id="phases" title="Les phases et les ajustements">
        <ul className="list-disc space-y-2 pl-6">
          <li>Phases 1 et 2 (semaines 1–14) : priorité à la compréhension et au vocabulaire, productions courtes.</li>
          <li>Phase 3 (semaines 15–20) : argumentation, essais de 250 mots, exposés de 5 à 7 minutes.</li>
          <li>
            Phase 4 et corrections (semaines 21–27) : examens blancs. Après la tentative officielle 1, ciblez l’épreuve la plus faible —
            surtout CE et PE, qui demandent 13/25.
          </li>
          <li>Si un quiz reste sous 70 % après deux essais, reprenez la notion en classe avant d’avancer.</li>
        </ul>
      </GuideSection>
    </GuideLayout>
  )
}
