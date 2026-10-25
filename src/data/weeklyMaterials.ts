import type { WeekPlan } from './syllabus'
import { weekPlan } from './syllabus'

export interface DailyScheduleItem {
  day: 'Lundi' | 'Mardi' | 'Mercredi' | 'Jeudi' | 'Vendredi' | 'Samedi' | 'Dimanche'
  where: 'Trajet' | 'Maison' | 'Divertissement' | 'Cours + Pratique' | 'Cours + Production'
  minutes: number
  title: string
  taskDescription: string
  homework: string
  media: {
    title: string
    category: 'podcast' | 'music' | 'video' | 'app' | 'simulation' | 'reading' | 'tool'
    categoryLabel: string
    platform: string
    url: string
    actionLabel: string
    tip?: string
  }
  lessonId?: string
  taInstructions?: string
}

export interface WeekMaterialsPlan {
  week: number
  title: string
  focus: string
  homeworkSummary: string
  days: DailyScheduleItem[]
}

/** Liens de référence partagés */
export const MEDIA_SOURCES = {
  mauril: {
    name: 'Mauril (CBC / Radio-Canada)',
    url: 'https://mauril.ca/fr/',
    action: 'Ouvrir Mauril',
  },
  moteurDeRecherche: {
    name: 'Moteur de recherche — Radio-Canada OHdio',
    url: 'https://ici.radio-canada.ca/ohdio/premiere/emissions/6056/moteur-de-recherche',
    action: 'Écouter sur OHdio',
  },
  anneesLumiere: {
    name: 'Les années lumière — Radio-Canada OHdio',
    url: 'https://ici.radio-canada.ca/ohdio/premiere/emissions/52/les-annees-lumiere',
    action: 'Écouter sur OHdio',
  },
  caSexplique: {
    name: 'Ça s’explique (balado) — Radio-Canada',
    url: 'https://ici.radio-canada.ca/ohdio/balados/7391/ca-sexplique-balado-alexis-de-lance',
    action: 'Écouter sur OHdio',
  },
  rcInfoSante: {
    name: 'Radio-Canada Info — Dossiers Santé',
    url: 'https://ici.radio-canada.ca/info',
    action: 'Lire / écouter sur Radio-Canada',
  },
  youtubeMusic: {
    name: 'YouTube Music — Pop & Indie Québécois',
    url: 'https://music.youtube.com/search?q=musique+quebecoise',
    action: 'Ouvrir YouTube Music',
  },
  iciTouTv: {
    name: 'ICI TOU.TV — Séries & Documentaires',
    url: 'https://ici.tou.tv/',
    action: 'Regarder sur ICI TOU.TV',
  },
  saaqSimulator: {
    name: 'Test de connaissances — SAAQ',
    url: 'https://testdeconnaissances.saaq.gouv.qc.ca/',
    action: 'Faire un test SAAQ',
  },
  muhcVolunteering: {
    name: 'CUSM / MUHC — Programme de bénévolat',
    url: 'https://muhc.ca/volunteering',
    action: 'Visiter le site CUSM',
  },
  mcgillMedAdmissions: {
    name: 'McGill — Admissions en médecine (Med-P)',
    url: 'https://www.mcgill.ca/medadmissions/',
    action: 'Consulter McGill Med-P',
  },
  bagatelle: {
    name: 'Crêperie Maison Bagatelle (Vieux-Montréal)',
    url: 'https://creperiemaisonbagatelle.shop/',
    action: 'Consulter la carte & le site',
  },
  vitrineLinguistique: {
    name: 'Vitrine linguistique (OQLF)',
    url: 'https://vitrinelinguistique.oqlf.gouv.qc.ca/',
    action: 'Consulter la Vitrine OQLF',
  },
  leConjugueur: {
    name: 'Le Conjugueur',
    url: 'https://leconjugueur.lefigaro.fr/',
    action: 'Vérifier une conjugaison',
  },
}

/**
 * Génère le programme quotidien et les médias pour chacune des 27 semaines.
 */
function buildWeekMaterials(week: number): WeekMaterialsPlan {
  const plan: WeekPlan = weekPlan(week)
  const lessonIds = [...plan.foundations, ...plan.lessons].map((l) => l.id)
  const exam = plan.exams[0]

  // Focus thématique par semaine
  let focus = 'Consolidation et immersion quotidienne'
  if (week === 1) {
    focus = 'Oral médical (Télémédecine), accueil client en crêperie et révision des temps du passé'
  } else if (week === 2) {
    focus = 'Vocabulaire des professions médicales au Québec et immersion balado santé'
  } else if (week === 3) {
    focus = 'Pénurie de médecins (compréhension orale Radio-Canada) et vocabulaire gastronomique'
  } else if (week === 4) {
    focus = 'Vocabulaire hospitalier du CUSM et orientation dans les services de santé'
  } else if (week === 5) {
    focus = 'Subjonctif présent, infirmières praticiennes (IPS) et premiers panneaux SAAQ'
  } else if (week >= 7 && week <= 10) {
    focus = 'Cardiologie, règles de circulation SAAQ et préparation de candidature bénévole CUSM'
  } else if (week >= 11 && week <= 14) {
    focus = 'Connecteurs logiques, règlements routiers et lettre de motivation pour Med-P McGill'
  } else if (week >= 15 && week <= 19) {
    focus = 'Argumentation complexe, simulations orales B2 et éthique médicale'
  } else if (week === 20) {
    focus = 'Examen blanc 1 complet (Santé & Technologie) sous conditions réelles chronométrées'
  } else if (week === 22) {
    focus = 'Examen blanc 2 complet (Société & Travail) avec auto-évaluation'
  } else if (week === 24) {
    focus = 'Examen blanc 3 complet (Simulation globale)'
  } else if (week >= 25) {
    focus = 'Ajustements ciblés sur les faiblesses avant la 2e tentative DELF et la date limite'
  }

  // Podcasts ciblés selon la semaine
  const podcast =
    week % 3 === 1
      ? {
          title: 'Moteur de recherche — Épisode Santé / Société',
          platform: MEDIA_SOURCES.moteurDeRecherche.name,
          url: MEDIA_SOURCES.moteurDeRecherche.url,
          actionLabel: MEDIA_SOURCES.moteurDeRecherche.action,
          tip: 'Écoute 20 minutes pendant le trajet. Repère les mots-clés sans faire de pause.',
        }
      : week % 3 === 2
        ? {
            title: 'Les années lumière — Balado scientifique',
            platform: MEDIA_SOURCES.anneesLumiere.name,
            url: MEDIA_SOURCES.anneesLumiere.url,
            actionLabel: MEDIA_SOURCES.anneesLumiere.action,
            tip: 'Concentre-toi sur les questions posées par le journaliste et la structure des réponses.',
          }
        : {
            title: 'Ça s’explique — Enjeu québécois de santé',
            platform: MEDIA_SOURCES.caSexplique.name,
            url: MEDIA_SOURCES.caSexplique.url,
            actionLabel: MEDIA_SOURCES.caSexplique.action,
            tip: 'Format court de 15 minutes idéal pour le bus : résume mentalement la thèse principale.',
          }

  // Suggestions YouTube Music par semaine
  const musicQueries = [
    'Charlotte Cardin français',
    'Les Cowboys Fringants',
    'Hubert Lenoir',
    'Karkwa',
    'Les Louanges',
    'Ariane Moffatt',
    'Klô Pelgag',
    'Jean Leloup',
    'FouKi rap québécois',
    'Cœur de pirate',
  ]
  const musicArtist = musicQueries[(week - 1) % musicQueries.length]

  // Leçon principale du samedi (quiz) et dimanche (oral/écrit)
  const satLesson = plan.foundations[0] ?? plan.lessons[0]
  const sunLesson = plan.lessons.find((l) => l.skill === 'PO' || l.skill === 'PE') ?? plan.lessons[0] ?? satLesson

  const days: DailyScheduleItem[] = [
    {
      day: 'Lundi',
      where: 'Trajet',
      minutes: 30,
      title: 'Compréhension orale : Balado Radio-Canada',
      taskDescription: 'Écoute active dans le métro/bus. Développe ton oreille au débit naturel québécois.',
      homework: 'Note 3 mots ou expressions nouvelles dans ton historique Google Traduction.',
      media: {
        category: 'podcast',
        categoryLabel: 'Balado Radio-Canada',
        ...podcast,
      },
    },
    {
      day: 'Mardi',
      where: 'Trajet',
      minutes: 30,
      title: 'Immersion musicale passive : YouTube Music',
      taskDescription: `Découvre la musique francophone avec les paroles synchronisées sur YouTube Music (${musicArtist}).`,
      homework: 'Active les paroles, lis en écoutant et repère deux tournures familières ou poétiques.',
      media: {
        category: 'music',
        categoryLabel: 'YouTube Music',
        title: `Musique québécoise · Sélection : ${musicArtist}`,
        platform: 'YouTube Music',
        url: `https://music.youtube.com/search?q=${encodeURIComponent(musicArtist)}`,
        actionLabel: 'Écouter sur YouTube Music',
        tip: 'Chante les refrains dans ta tête pour habituer ta mâchoire à la prosodie française.',
      },
    },
    {
      day: 'Mercredi',
      where: 'Maison',
      minutes: 30,
      title: 'Pratique interactive & révision avec Gemini TA',
      taskDescription: 'Séance de conversation ou renforcement de vocabulaire avec ton assistant Gemini.',
      homework: 'Colle le prompt TA de la semaine dans Gemini et réponds à 5 questions en français sans hésiter.',
      media: {
        category: 'app',
        categoryLabel: 'Assistant Gemini',
        title: 'Gemini (Application Android ou Enceinte)',
        platform: 'Google Gemini',
        url: 'https://gemini.google.com',
        actionLabel: 'Ouvrir Gemini Web / App',
        tip: 'Si possible, active le mode vocal (Live) pour pratiquer ta fluidité orale.',
      },
      lessonId: satLesson?.id,
      taInstructions: 'Ouvre la leçon sur le site, passe en mode TA Gemini et copie le prompt prêt à l’emploi.',
    },
    {
      day: 'Jeudi',
      where: 'Trajet',
      minutes: 30,
      title: 'Défis de compréhension : Mauril (Radio-Canada)',
      taskDescription: 'Entraînement officiel conçu par CBC/Radio-Canada avec des extraits télévisés et radiophoniques canadiens.',
      homework: 'Complète au moins 2 défis d’écoute (niveau intermédiaire ou avancé) sur l’application Mauril.',
      media: {
        category: 'app',
        categoryLabel: 'Application Mauril',
        title: 'Mauril — Apprendre le français avec Radio-Canada',
        platform: MEDIA_SOURCES.mauril.name,
        url: MEDIA_SOURCES.mauril.url,
        actionLabel: MEDIA_SOURCES.mauril.action,
        tip: 'Réponds aux questions de compréhension immédiatement après l’extrait vidéo.',
      },
    },
    {
      day: 'Vendredi',
      where: 'Divertissement',
      minutes: 45,
      title: 'Divertissement francophone : ICI TOU.TV ou Anime VF',
      taskDescription: 'Détente en français le soir : regarde un épisode d’une série québécoise sur ICI TOU.TV ou un anime en VF.',
      homework: 'Regarde 30 à 45 minutes sans sous-titres anglais (sous-titres en français autorisés si nécessaire).',
      media: {
        category: 'video',
        categoryLabel: 'Vidéo & Séries',
        title: 'ICI TOU.TV (Séries québécoises) ou Anime VF',
        platform: MEDIA_SOURCES.iciTouTv.name,
        url: 'https://www.crunchyroll.com/fr/news/guides/2022/3/4/crunchyroll-vf-anime',
        actionLabel: MEDIA_SOURCES.iciTouTv.action,
        tip: 'Recommandation : une série médicale québécoise comme Stat ou un documentaire santé, ou une série que tu connaais bien sur https://www.crunchyroll.com/fr/news/guides/2022/3/4/crunchyroll-vf-anime',
      },
    },
    {
      day: 'Samedi',
      where: 'Cours + Pratique',
      minutes: 90,
      title: 'Cours 1 (1 h avec le professeur) + Quiz du site',
      taskDescription: 'Retour sur les acquis de la semaine avec ton enseignant, étude de grammaire et passage aux quiz interactifs.',
      homework: satLesson ? `Complète le quiz de la leçon ${satLesson.id} (${satLesson.title}) et vise au moins 70 %.` : 'Révise les quiz sous 70 %.',
      media: {
        category: 'tool',
        categoryLabel: 'Plateforme Objectif B2',
        title: satLesson ? `Leçon ${satLesson.id} — ${satLesson.title}` : 'Tableau de bord',
        platform: 'Objectif B2',
        url: satLesson ? `#/lecon/${satLesson.id}` : '#/',
        actionLabel: satLesson ? `Ouvrir la leçon ${satLesson.id}` : 'Aller au tableau de bord',
        tip: 'Prends ton temps sur les questions de justification et regarde les explications détaillées.',
      },
      lessonId: satLesson?.id,
    },
    {
      day: 'Dimanche',
      where: 'Cours + Production',
      minutes: 90,
      title: exam ? `Examen blanc ${exam.number} — Simulation DELF` : 'Cours 2 (1 h avec le professeur) + Production B2',
      taskDescription: exam
        ? `Passation chronométrée de l’examen blanc ${exam.number} (${exam.theme}).`
        : 'Séance axée sur l’expression : simulation d’exposé oral ou rédaction guidée avec évaluation sur grille DELF.',
      homework: exam
        ? `Termine l’épreuve de production écrite de l’examen blanc ${exam.number} (≥ 250 mots).`
        : sunLesson?.speaking
          ? `Prépare l’oral de la leçon ${sunLesson.id} : 20 min de notes, monologue de 5-7 min devant le prof.`
          : sunLesson?.writing
            ? `Rédige le devoir écrit de la leçon ${sunLesson.id} (${sunLesson.writing.minWords} mots).`
            : 'Révise les mots de vocabulaire enregistrés dans ton historique Google Traduction.',
      media: {
        category: exam ? 'simulation' : 'reading',
        categoryLabel: exam ? 'Examen blanc DELF' : 'Production DELF B2',
        title: exam ? `${exam.title} (${exam.theme})` : sunLesson ? `Leçon ${sunLesson.id} — ${sunLesson.title}` : 'Grilles DELF B2',
        platform: 'Objectif B2',
        url: exam ? `#/examen/${exam.id}` : sunLesson ? `#/lecon/${sunLesson.id}` : '#/grilles',
        actionLabel: exam ? `Lancer l’examen ${exam.number}` : sunLesson ? `Ouvrir la leçon ${sunLesson.id}` : 'Voir les grilles',
        tip: exam
          ? 'Respecte scrupuleusement les chronomètres de chaque section pour t’habituer au rythme de l’examen.'
          : 'Consulte la grille d’évaluation officielle pour vérifier chaque critère avant de soumettre.',
      },
      lessonId: exam ? undefined : sunLesson?.id,
    },
  ]

  const homeworkSummary = exam
    ? `Semaine d'examen blanc (${exam.title}) : fais la simulation chronométrée le dimanche et travaille tes révisions en semaine.`
    : lessonIds.length > 0
      ? `Leçons au programme : ${lessonIds.join(', ')}. Effectue les quiz, le vocabulaire associé et la production orale/écrite de fin de semaine.`
      : 'Semaine de révision et consolidation : retravaille les quiz sous 70 % avec Gemini TA et intensifie l’immersion audio.'

  return {
    week,
    title: `Semaine ${week}`,
    focus,
    homeworkSummary,
    days,
  }
}

/** Programme complet pour les 27 semaines */
export const ALL_WEEKLY_MATERIALS: WeekMaterialsPlan[] = Array.from({ length: 27 }, (_, i) => buildWeekMaterials(i + 1))

export function getWeekMaterials(week: number): WeekMaterialsPlan {
  const clamped = Math.min(Math.max(week, 1), 27)
  return ALL_WEEKLY_MATERIALS[clamped - 1]
}
