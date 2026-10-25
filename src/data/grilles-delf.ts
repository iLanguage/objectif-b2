/**
 * Grilles d'évaluation DELF B2 — production écrite et production orale.
 *
 * Reprises des grilles de France Éducation international (épreuves notées sur 25,
 * par paliers de 0,5 point). Avant un examen officiel, comparer avec la version
 * la plus récente publiée sur france-education-international.fr.
 */

export interface Criterion {
  id: string
  label: string
  max: number
  /** Ce que l'examinateur vérifie, en langage simple. */
  descriptor: string
}

export interface CriteriaGroup {
  title: string
  criteria: Criterion[]
}

export interface Grille {
  skill: 'PE' | 'PO'
  title: string
  groups: CriteriaGroup[]
}

export const GRILLE_PE: Grille = {
  skill: 'PE',
  title: 'Production écrite — DELF B2',
  groups: [
    {
      title: 'Réalisation de la tâche',
      criteria: [
        {
          id: 'consigne',
          label: 'Respect de la consigne',
          max: 2,
          descriptor: 'Respecte la situation, le type de texte demandé et la longueur minimale (250 mots).',
        },
        {
          id: 'sociolinguistique',
          label: 'Correction sociolinguistique',
          max: 2,
          descriptor: 'Adapte le registre (formules de politesse, vouvoiement) au destinataire et à la situation.',
        },
        {
          id: 'faits',
          label: 'Capacité à présenter des faits',
          max: 4,
          descriptor: 'Décrit des faits, des événements ou des expériences de façon claire et détaillée.',
        },
        {
          id: 'argumenter',
          label: 'Capacité à argumenter une prise de position',
          max: 4,
          descriptor: 'Défend une opinion avec des arguments développés, des exemples et des nuances.',
        },
        {
          id: 'coherence',
          label: 'Cohérence et cohésion',
          max: 3,
          descriptor: 'Texte organisé en paragraphes, articulé par des connecteurs variés (cependant, par conséquent…).',
        },
      ],
    },
    {
      title: 'Compétence lexicale / orthographe lexicale',
      criteria: [
        {
          id: 'lexique-etendue',
          label: 'Étendue du vocabulaire',
          max: 2,
          descriptor: 'Vocabulaire assez large pour varier les formulations et éviter les répétitions.',
        },
        {
          id: 'lexique-maitrise',
          label: 'Maîtrise du vocabulaire',
          max: 2,
          descriptor: 'Mots justes ; les confusions ne gênent pas la communication.',
        },
        {
          id: 'orthographe',
          label: "Maîtrise de l'orthographe",
          max: 1,
          descriptor: 'Orthographe lexicale et ponctuation globalement correctes.',
        },
      ],
    },
    {
      title: 'Compétence grammaticale / orthographe grammaticale',
      criteria: [
        {
          id: 'phrases',
          label: 'Degré d’élaboration des phrases',
          max: 2,
          descriptor: 'Phrases complexes (relatives, subordonnées) et variées.',
        },
        {
          id: 'morphosyntaxe',
          label: 'Choix des formes',
          max: 3,
          descriptor: 'Bon contrôle des temps, des accords et des modes (subjonctif, conditionnel).',
        },
      ],
    },
  ],
}

export const GRILLE_PO: Grille = {
  skill: 'PO',
  title: 'Production orale — DELF B2',
  groups: [
    {
      title: 'Première partie — Monologue suivi (exposé)',
      criteria: [
        {
          id: 'theme',
          label: 'Dégager le thème et introduire le débat',
          max: 1,
          descriptor: 'Présente le document et formule une problématique claire.',
        },
        {
          id: 'point-de-vue',
          label: 'Présenter un point de vue argumenté',
          max: 4,
          descriptor: 'Met en évidence des éléments significatifs et des exemples pertinents.',
        },
        {
          id: 'relations',
          label: 'Marquer les relations entre les idées',
          max: 2,
          descriptor: 'Plan annoncé et suivi ; connecteurs logiques clairs.',
        },
      ],
    },
    {
      title: 'Deuxième partie — Exercice en interaction (débat)',
      criteria: [
        {
          id: 'nuancer',
          label: 'Confirmer et nuancer ses idées',
          max: 3,
          descriptor: 'Précise, reformule et nuance sa position quand l’examinateur la questionne.',
        },
        {
          id: 'reagir',
          label: 'Réagir aux arguments d’autrui',
          max: 4,
          descriptor: 'Répond aux objections et défend sa position avec des arguments.',
        },
      ],
    },
    {
      title: 'Pour l’ensemble de l’épreuve',
      criteria: [
        {
          id: 'lexique',
          label: 'Lexique (étendue et maîtrise)',
          max: 4,
          descriptor: 'Vocabulaire varié et précis sur le thème ; peu d’hésitations lexicales.',
        },
        {
          id: 'morphosyntaxe',
          label: 'Morphosyntaxe',
          max: 4,
          descriptor: 'Bon contrôle grammatical ; les erreurs ne mènent pas à des malentendus.',
        },
        {
          id: 'phonologie',
          label: 'Maîtrise du système phonologique',
          max: 3,
          descriptor: 'Prononciation et intonation claires et naturelles.',
        },
      ],
    },
  ],
}

export const GRILLES = { PE: GRILLE_PE, PO: GRILLE_PO }

export function grilleMax(grille: Grille): number {
  return grille.groups.flatMap((g) => g.criteria).reduce((sum, c) => sum + c.max, 0)
}

/** Total d'une grille remplie (les critères non notés comptent pour 0). */
export function grilleTotal(grille: Grille, grades: Record<string, number> | undefined): number {
  if (!grades) return 0
  return grille.groups.flatMap((g) => g.criteria).reduce((sum, c) => sum + Math.min(grades[c.id] ?? 0, c.max), 0)
}

/** Vrai quand chaque critère de la grille a reçu une note. */
export function grilleComplete(grille: Grille, grades: Record<string, number> | undefined): boolean {
  if (!grades) return false
  return grille.groups.flatMap((g) => g.criteria).every((c) => grades[c.id] !== undefined)
}
