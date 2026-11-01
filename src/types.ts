/** Les quatre épreuves du DELF B2. */
export type DelfSkill = 'CO' | 'CE' | 'PE' | 'PO'

/** Compétence travaillée par une leçon (les quatre épreuves + vocabulaire/grammaire). */
export type LessonSkill = DelfSkill | 'vocabulaire' | 'grammaire'

export type Mode = 'eleve' | 'professeur' | 'ta'

// ---------------------------------------------------------------------------
// Questions de quiz
// ---------------------------------------------------------------------------

interface QuestionBase {
  id: string
  /** Explication affichée après la correction. */
  explanation?: string
}

export interface MultipleChoiceQuestion extends QuestionBase {
  type: 'mcq'
  prompt: string
  options: string[]
  /** Index de la bonne réponse dans `options`. */
  answer: number
  /**
   * Illustration facultative : des émojis, ou « sign:<id> » pour un panneau
   * routier dessiné par le composant RoadSign.
   */
  visual?: string
  /** Description de l'illustration pour les lecteurs d'écran (sans donner la réponse). */
  visualAlt?: string
}

export interface FillInBlankQuestion extends QuestionBase {
  type: 'fill'
  /** Phrase avec un ou plusieurs trous marqués « ___ ». */
  text: string
  /** Pour chaque trou, la liste des réponses acceptées. */
  answers: string[][]
  hint?: string
}

export interface MatchingQuestion extends QuestionBase {
  type: 'matching'
  prompt: string
  pairs: { left: string; right: string }[]
}

/** Questions corrigées automatiquement. */
export type AutoQuestion = MultipleChoiceQuestion | FillInBlankQuestion | MatchingQuestion

/** Réponse de l'élève : index (QCM), liste de mots (trous) ou associations (appariement). */
export type Answer = number | string[] | Record<string, string>

// ---------------------------------------------------------------------------
// Productions (écrite / orale) évaluées avec les grilles DELF
// ---------------------------------------------------------------------------

export interface WritingTask {
  id: string
  title: string
  /** Consigne, en un ou plusieurs paragraphes. */
  instructions: string[]
  minWords: number
  /** Type de texte attendu (lettre formelle, article, essai…). */
  genre: string
  checklist: string[]
}

export interface SpeakingTask {
  id: string
  title: string
  /** Document déclencheur ou mise en situation. */
  instructions: string[]
  prepMinutes: number
  speakMinutes: number
  /** Questions que le professeur (ou Gemini) peut poser pendant le débat. */
  followUps: string[]
  checklist: string[]
}

// ---------------------------------------------------------------------------
// Contenu des leçons
// ---------------------------------------------------------------------------

/** Registre d'une expression : où on peut l'utiliser. */
export type PhraseRegister = 'familier' | 'courant'

/** Expression entendue chez les pairs, travaillée à l'oreille puis par construction arrière. */
export interface PhraseDrill {
  id: string
  /** Expression cible. */
  phrase: string
  /** Courte phrase en contexte, écoutée trois fois. */
  context: string
  /** Morceaux à répéter, du dernier son à l'expression complète (« que », « ons que », « mettons que »). */
  buildUp: string[]
  register: PhraseRegister
  /** Sens, expliqué en français simple. */
  meaning: string
  en: string
}

/** Personne à qui se présenter (Module 7). */
export interface Persona {
  id: string
  title: string
  /** Qui est cette personne, pour le jeu de rôle. */
  about: string
  address: 'tu' | 'vous'
  /** Consigne de jeu de rôle pour Gemini, propre à cette personne. */
  guidance?: string
  /** Exemple de présentation dans ta propre voix. */
  modelIntro: string
  /** Cinq questions pour faire parler la personne. */
  questions: string[]
}

export type LessonSection =
  | { kind: 'text'; title?: string; paragraphs: string[] }
  | { kind: 'vocab'; title?: string; items: { fr: string; en?: string; note?: string }[] }
  | { kind: 'grammar'; title: string; rule: string[]; examples: string[] }
  | { kind: 'reading'; title: string; source?: string; paragraphs: string[] }
  | { kind: 'audio'; title: string; description?: string; transcript: string[] }
  | {
      /** Modèle écrit et parlé. Toute tâche de production passe par ici : l'élève lit et écoute avant de parler. */
      kind: 'model'
      title: string
      description?: string
      /** Le modèle, en Markdown. Les titres s'affichent mais ne sont pas lus. */
      markdown: string
      /** Texte replié au départ, pour un long modèle déjà vu plus haut dans la leçon. */
      collapsed?: boolean
      /** La tâche « À toi », en Markdown, affichée sous le modèle. */
      task?: string
      /** Durée de l'enregistrement proposé sous la tâche, en secondes. */
      recordSeconds?: number
    }
  | { kind: 'tip'; text: string }
  | { kind: 'resources'; title?: string; links: { label: string; url: string; description?: string }[] }
  | { kind: 'drills'; title: string; drills: PhraseDrill[] }
  | { kind: 'personas'; title: string; personas: Persona[] }

/** Modèle écrit et parlé. */
export type ModelSection = Extract<LessonSection, { kind: 'model' }>

export interface Lesson {
  /** Identifiant affiché, ex. « 1.2 » ou « 0.A ». */
  id: string
  moduleId: string
  title: string
  skill: LessonSkill
  /** Semaine suggérée dans le syllabus (1 = semaine du 26 octobre 2026). */
  week: number
  /** Dernière semaine, pour les blocs qui s'étalent sur plusieurs semaines (Module 0). */
  untilWeek?: number
  /** Format du quiz, tel qu'annoncé dans le plan. */
  quizLabel: string
  objectives: string[]
  sections: LessonSection[]
  quiz?: AutoQuestion[]
  /** Modèle affiché juste avant la production, après le quiz, pour ne pas donner ses réponses. */
  model?: ModelSection
  writing?: WritingTask
  speaking?: SpeakingTask
  /** Devoir à faire avec le TA, en parallèle des leçons du cours. */
  homework?: string
  /** Notes pédagogiques pour le professeur. */
  teacherNotes: string[]
}

export interface Module {
  id: string
  /** Numéro d'affichage, ex. 1 pour « Module 1 ». */
  number: number
  slug: string
  title: string
  subtitle: string
  weeks: [number, number]
  immersion: string
  sources: { label: string; url?: string }[]
  /** Couleur d'accent (classe Tailwind) pour la carte du tableau de bord. */
  accent: string
  lessons: Lesson[]
}

// ---------------------------------------------------------------------------
// Examens blancs
// ---------------------------------------------------------------------------

export interface ExamDocument {
  title: string
  /** Pour l'écoute : texte lu par la synthèse vocale. Pour la lecture : le texte. */
  paragraphs: string[]
  source?: string
  questions: AutoQuestion[]
}

/** Tâche hebdomadaire de préparation aux examens blancs (Module 5). */
export interface ExamPrepTask {
  week: number
  /** Épreuve travaillée ; absente pour les bilans et les examens complets. */
  skill?: DelfSkill
  title: string
  minutes: number
  instructions: string[]
  /** Modèle à lire et à écouter avant de lancer le chronomètre. */
  model?: ModelSection
  /** Production écrite à rédiger sur la page de la tâche. */
  writing?: WritingTask
  /** Production orale à enregistrer sur la page de la tâche. */
  speaking?: boolean
  lessonId?: string
  examId?: string
  link?: { label: string; url: string }
}

export interface MockExam {
  id: string
  number: number
  title: string
  theme: string
  week: number
  co: { minutes: number; documents: ExamDocument[] }
  ce: { minutes: number; documents: ExamDocument[] }
  pe: { minutes: number; task: WritingTask }
  po: { prepMinutes: number; task: SpeakingTask }
}
