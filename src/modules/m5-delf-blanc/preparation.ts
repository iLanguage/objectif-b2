import type { ExamPrepTask, Lesson, WritingTask } from '../../types'

/**
 * Une tâche par semaine pour préparer les examens blancs, en alternant les
 * quatre épreuves. Les sujets évitent ceux des trois examens blancs, pour que
 * les documents restent inconnus le jour de la simulation.
 */

const LETTER_CHECKLIST = [
  'J’ai mis le lieu, la date, l’objet et « Madame, Monsieur, ».',
  'Ma position est claire dès le premier paragraphe.',
  'J’ai au moins deux arguments, chacun avec un exemple en phrase complète.',
  'J’ai ajouté une concession (« Certes…, mais… »).',
  'J’ai terminé par une formule de politesse complète.',
  'Mon texte a au moins 250 mots.',
]

function writing(week: number, title: string, subject: string): WritingTask {
  return {
    id: `prep-${week}-pe`,
    title,
    genre: 'Lettre formelle',
    minWords: 250,
    instructions: [subject, 'Réutilise les phrases de ta trousse (leçon 5.1). Note d’abord tes idées, même simples, puis développe chaque argument avec un exemple. Rédige en 1 heure, puis relis avec la liste de vérification.'],
    checklist: LETTER_CHECKLIST,
  }
}

const pe = (week: number, title: string, subject: string): ExamPrepTask => ({
  week,
  skill: 'PE',
  title,
  minutes: 60,
  instructions: [subject, 'Rédige ta lettre en 1 heure, sans dictionnaire au début, puis relis-la avec la liste de vérification.'],
  lessonId: '5.1',
  writing: writing(week, title, subject),
})

const ce = (week: number, title: string, topic: string): ExamPrepTask => ({
  week,
  skill: 'CE',
  title,
  minutes: 30,
  instructions: [
    `Lis un article de Radio-Canada sur ${topic}.`,
    'Note l’idée principale, deux arguments ou faits importants, et cinq mots nouveaux. Ensuite, colle l’article dans Gemini : il te pose des questions comme au DELF.',
  ],
  lessonId: '0.F',
  link: { label: 'Chercher sur Radio-Canada', url: 'https://ici.radio-canada.ca/info' },
})

const po = (week: number, title: string, question: string): ExamPrepTask => ({
  week,
  skill: 'PO',
  title,
  minutes: 15,
  instructions: [
    `Sujet : ${question}`,
    'Prépare un plan en 10 minutes, sans tout écrire. Parle 3 minutes, enregistre-toi et réécoute-toi. Ensuite, débats avec Gemini Live.',
  ],
  speaking: true,
})

const co = (week: number, title: string, topic: string): ExamPrepTask => ({
  week,
  skill: 'CO',
  title,
  minutes: 20,
  instructions: [
    `Écoute 5 minutes d’un balado sur ${topic}, sans lire de transcription.`,
    'Prends des notes : qui, quoi, combien, pourquoi. Écoute une deuxième fois, puis résume ce que tu as compris à Gemini en quatre phrases.',
  ],
  lessonId: '0.F',
  link: { label: 'Ouvrir Moteur de recherche', url: 'https://ici.radio-canada.ca/ohdio/premiere/emissions/moteur-de-recherche' },
})

export const examPrepTasks: ExamPrepTask[] = [
  {
    week: 1,
    skill: 'PE',
    title: 'Ta trousse de phrases pour la lettre formelle',
    minutes: 45,
    instructions: [
      'Fais la leçon 5.1 : elle transforme ton devoir sur le bénévolat en phrases à réutiliser.',
      'Apprends la formule d’ouverture et la formule de fin, puis réussis le quiz.',
    ],
    lessonId: '5.1',
  },
  pe(2, 'Réécrire ma lettre sur le bénévolat', 'Reprends ta lettre à la direction sur le bénévolat à l’hôpital. Elle compte environ 160 mots : développe-la jusqu’à 250 mots, avec un exemple précis pour chaque argument, une concession et une formule de politesse.'),
  ce(3, 'Lire : le manque de personnel infirmier', 'le manque de personnel infirmier'),
  po(4, 'Parler : conduire à 16 ans', 'Les jeunes de 16 ans devraient-ils pouvoir conduire ?'),
  co(5, 'Écouter : le cœur', 'le cœur'),
  pe(6, 'Lettre : des cours de premiers soins', 'Écris à la direction de ton école pour proposer un cours de premiers soins pour tous les élèves.'),
  ce(7, 'Lire : le diabète chez les jeunes', 'le diabète chez les jeunes'),
  po(8, 'Parler : les calories au menu', 'Les restaurants devraient-ils afficher les calories sur leur menu ?'),
  co(9, 'Écouter : le cerveau', 'le cerveau'),
  pe(10, 'Lettre : des pistes cyclables', 'Écris à ta Ville pour demander une piste cyclable sécuritaire près de ton école.'),
  ce(11, 'Lire : la vaccination', 'la vaccination'),
  po(12, 'Parler : le bénévolat à l’étranger', 'Le bénévolat à l’étranger est-il une bonne idée pour un futur médecin ?'),
  co(13, 'Écouter : les médicaments', 'les médicaments'),
  pe(14, 'Lettre : plus de médecins de famille', 'Écris au ministre de la Santé pour proposer une solution au manque de médecins de famille.'),
  ce(15, 'Lire : la chaleur et la santé', 'les effets de la chaleur sur la santé'),
  po(16, 'Parler : l’IA chez le médecin', 'L’intelligence artificielle peut-elle aider les médecins sans les remplacer ?'),
  co(17, 'Écouter : la génétique', 'la génétique'),
  pe(18, 'Lettre : une salle pour les familles', 'Écris à la direction d’un hôpital pour proposer une salle de repos pour les familles des patients.'),
  {
    week: 19,
    title: 'Bilan de la tentative 1',
    minutes: 30,
    instructions: [
      'Juste après ta première tentative au DELF, note ce qui a été difficile dans chaque épreuve, pendant que c’est frais.',
      'Montre ta liste à ton professeur : elle décidera de tes priorités pour la suite.',
    ],
  },
  { week: 20, title: 'Examen blanc 1', minutes: 200, instructions: ['Fais l’examen blanc 1 en conditions réelles, avec le chronomètre.'], examId: 'blanc-1' },
  {
    week: 21,
    title: 'Corriger mes erreurs de l’examen blanc 1',
    minutes: 45,
    instructions: ['Relis tes erreurs dans l’examen blanc 1. Pour chaque erreur, explique pourquoi la bonne réponse est la bonne.', 'Réécris le paragraphe le plus faible de ta production écrite.'],
    examId: 'blanc-1',
  },
  { week: 22, title: 'Examen blanc 2', minutes: 200, instructions: ['Fais l’examen blanc 2 en conditions réelles, avec le chronomètre.'], examId: 'blanc-2' },
  {
    week: 23,
    title: 'Dernière révision avant la tentative 2',
    minutes: 45,
    instructions: ['Relis ta trousse de phrases et ton guide de l’oral.', 'Écris de mémoire ta formule d’ouverture, tes connecteurs et ta formule de fin.'],
    lessonId: '5.1',
  },
  { week: 24, title: 'Examen blanc 3', minutes: 200, instructions: ['Fais l’examen blanc 3, la simulation complète, en conditions réelles.'], examId: 'blanc-3' },
  {
    week: 25,
    title: 'Mon épreuve la plus faible : compréhension',
    minutes: 45,
    instructions: ['Regarde ta note la plus basse en compréhension. Refais une leçon de lecture ou d’écoute, puis demande à Gemini trois exercices du même type.'],
    lessonId: '0.F',
  },
  pe(26, 'Mon épreuve la plus faible : la lettre', 'Choisis le sujet de lettre qui t’a donné le plus de difficulté cette année et réécris-la complètement.'),
  {
    week: 27,
    title: 'Bilan final',
    minutes: 30,
    instructions: ['Compare ta première lettre à ta dernière : compte les mots et les connecteurs.', 'Note trois progrès dont tu es fier.'],
  },
]

export const prepTaskKey = (week: number) => `prep-${week}`

export function getPrepTask(week: number): ExamPrepTask | undefined {
  return examPrepTasks.find((t) => t.week === week)
}

/** Leçon 5.1 : la trousse de phrases, construite à partir du devoir de l'élève. */
export const lesson51: Lesson = {
  id: '5.1',
  moduleId: 'm5',
  title: 'Ma trousse de phrases pour la lettre formelle',
  skill: 'PE',
  week: 1,
  untilWeek: 2,
  quizLabel: 'Phrases et corrections',
  homework: 'Apprends ta trousse de phrases et réussis le quiz. Avec Gemini, transforme tes idées en phrases sans faire traduire tout ton texte.',
  objectives: [
    'Réutiliser des phrases toutes faites pour une lettre formelle',
    'Éviter les anglicismes les plus fréquents',
    'Développer tes idées pour atteindre 250 mots',
  ],
  sections: [
    {
      kind: 'text',
      title: 'Ce que ta lettre fait déjà bien',
      paragraphs: [
        'Ta lettre sur le bénévolat a un vrai plan : une position claire, deux arguments et une conclusion. Tes connecteurs sont bons, et c’est exactement ce que veulent les correcteurs du DELF.',
        '**Trois choses à ajouter la prochaine fois :**',
        '**1. La longueur.** Ta lettre compte 127 mots en anglais et environ 160 en français. Le DELF en demande au moins 250. Il ne faut pas plus d’idées : il faut développer chaque idée avec un exemple précis.',
        '**2. La formule de fin.** Une lettre formelle se termine toujours par une formule de politesse. C’est un point facile à gagner.',
        '**3. Des phrases complètes.** « Par exemple, en passant du temps avec les patients. » n’a pas de verbe conjugué. Écris plutôt : « Par exemple, un bénévole qui passe du temps avec les patients apprend à les écouter. »',
      ],
    },
    {
      kind: 'vocab',
      title: 'Ta trousse : de l’anglais au français',
      items: [
        { en: 'Dear Director,', fr: 'Monsieur le Directeur, / Madame la Directrice,' },
        { en: 'I am writing regarding…', fr: 'Je vous écris concernant… / Je me permets de vous écrire au sujet de…' },
        { en: 'In my opinion,', fr: 'À mon avis, / Selon moi,' },
        { en: 'Firstly,', fr: 'Premièrement, / Tout d’abord,' },
        { en: 'Secondly,', fr: 'Deuxièmement, / Ensuite,' },
        { en: 'For instance,', fr: 'Par exemple, / À titre d’exemple,' },
        { en: 'In conclusion,', fr: 'En conclusion, / Pour conclure,' },
        { en: 'Not only… but also', fr: 'Non seulement… mais aussi…' },
        { en: 'Admittedly…, but…', fr: 'Certes…, mais…', note: 'Pour ajouter une concession.' },
        { en: 'Yours sincerely,', fr: 'Je vous prie d’agréer, Monsieur le Directeur, l’expression de mes salutations distinguées.', note: 'Formule de fin : à apprendre par cœur.' },
      ],
    },
    {
      kind: 'vocab',
      title: 'Des modèles à compléter',
      items: [
        { fr: 'Je vous écris concernant ___.', note: 'Le sujet de ta lettre.' },
        { fr: 'À mon avis, c’est une excellente occasion de ___.', note: 'Ta position.' },
        { fr: 'Le ___ permettrait aux élèves de ___.', note: 'Premier argument.' },
        { fr: 'Le ___ pourrait aider les élèves à ___.', note: 'Deuxième argument.' },
        { fr: 'Par exemple, un élève qui ___ apprend à ___.', note: 'Un exemple en phrase complète.' },
        { fr: 'Certes, ___, mais ___.', note: 'Reconnaître l’autre point de vue.' },
        { fr: 'Non seulement ___, mais aussi ___.', note: 'Ta conclusion.' },
      ],
    },
    {
      kind: 'text',
      title: 'Les anglicismes à éviter',
      paragraphs: [
        '**appliquer au programme** (to apply) → **présenter une demande d’admission au programme**',
        '**une opportunité** (an opportunity) → **une occasion**',
        '**les procédures de base** (basic procedures) → **les gestes de base**',
      ],
    },
    {
      kind: 'reading',
      title: 'Ta lettre, corrigée',
      source: 'Ton texte, avec les corrections. Il compte environ 180 mots : à toi de le développer jusqu’à 250 en semaine 2.',
      paragraphs: [
        'Monsieur le Directeur,',
        'Je vous écris concernant la proposition exigeant que tous les élèves qui présentent une demande d’admission au programme de sciences fassent du bénévolat dans un hôpital. À mon avis, c’est une excellente occasion pour les élèves d’acquérir de l’expérience pratique et de mieux comprendre le domaine de la santé.',
        'Premièrement, le bénévolat à l’hôpital donnerait aux élèves de l’expérience pratique. C’est là qu’ils pourraient apprendre comment se font les gestes de base et à quoi ressemble la relation entre le patient et le médecin.',
        'Deuxièmement, le bénévolat pourrait aider les élèves à développer des qualités importantes comme la responsabilité, l’empathie, le travail d’équipe et la patience. Par exemple, un bénévole qui passe du temps avec les patients ou qui aide le personnel apprend à être patient et à travailler en équipe.',
        'En conclusion, le bénévolat à l’hôpital aiderait non seulement les élèves à acquérir de l’expérience pratique et à développer des qualités importantes, mais il leur donnerait aussi une idée des exigences d’un emploi dans le domaine médical.',
        'Je vous prie d’agréer, Monsieur le Directeur, l’expression de mes salutations distinguées.',
      ],
    },
  ],
  quiz: [
    {
      id: '5.1-q1',
      type: 'matching',
      prompt: 'Associe chaque expression anglaise à sa version française.',
      pairs: [
        { left: 'I am writing regarding', right: 'Je vous écris concernant' },
        { left: 'In my opinion', right: 'À mon avis' },
        { left: 'Firstly', right: 'Tout d’abord' },
        { left: 'In conclusion', right: 'Pour conclure' },
      ],
    },
    {
      id: '5.1-q2',
      type: 'mcq',
      prompt: 'Quelle phrase évite l’anglicisme ?',
      options: [
        'Les élèves qui appliquent au programme',
        'Les élèves qui présentent une demande d’admission au programme',
        'Les élèves qui font application au programme',
        'Les élèves qui demandent une application au programme',
      ],
      answer: 1,
    },
    {
      id: '5.1-q3',
      type: 'mcq',
      prompt: 'Quelle phrase est complète ?',
      options: [
        'Par exemple, en aidant le personnel.',
        'Par exemple, passer du temps avec les patients.',
        'Par exemple, un bénévole qui aide le personnel apprend à travailler en équipe.',
        'Par exemple, avec certaines tâches.',
      ],
      answer: 2,
      explanation: 'Une phrase complète a un sujet et un verbe conjugué : « un bénévole… apprend ».',
    },
    {
      id: '5.1-q4',
      type: 'fill',
      text: 'À mon avis, c’est une excellente ___ pour les élèves.',
      answers: [['occasion']],
      explanation: 'En français soigné, on préfère « une occasion » à « une opportunité ».',
    },
    {
      id: '5.1-q5',
      type: 'fill',
      text: 'Le bénévolat aiderait ___ seulement les élèves, mais il donnerait ___ une idée du métier.',
      answers: [['non'], ['aussi']],
    },
    {
      id: '5.1-q6',
      type: 'mcq',
      prompt: 'Comment termines-tu une lettre formelle ?',
      options: [
        'Merci et à bientôt !',
        'Je vous prie d’agréer, Monsieur le Directeur, l’expression de mes salutations distinguées.',
        'Salutations, et bonne journée.',
        'En conclusion, merci.',
      ],
      answer: 1,
    },
    {
      id: '5.1-q7',
      type: 'mcq',
      prompt: 'Ta lettre compte 160 mots. Que fais-tu pour atteindre 250 mots ?',
      options: [
        'J’ajoute beaucoup de nouvelles idées.',
        'Je répète mes arguments.',
        'Je développe chaque argument avec un exemple précis.',
        'Je laisse ma lettre à 160 mots.',
      ],
      answer: 2,
    },
  ],
  teacherNotes: [
    'Point de départ : le devoir sur le bénévolat, écrit en anglais (127 mots) et traduit (environ 160 mots). L’objectif est de 250 mots.',
    'Le plan est bon : ne pas le refaire. Travailler le développement des arguments, la formule de fin et les phrases sans verbe.',
    'À partir de maintenant, faire passer l’élève de la traduction d’un texte entier à l’assemblage de phrases connues.',
  ],
}
