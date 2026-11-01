import type { Lesson, Module, Persona } from '../../types'

// Avec les gérants : aucune consigne à comprendre, donc aucun risque si tout n'est pas clair.
const SMALL_TALK =
  'Ne parle pas du travail et ne me donne aucune consigne : c’est seulement une petite jasette. Mon niveau est A2 : utilise des phrases courtes et des mots simples. Je n’ai pas besoin de tout comprendre. Si je demande de répéter, reformule plus simplement.'

const HOMEWORK =
  'Choisis une personne par séance : copie son prompt, joue la scène avec Gemini Live, et pose tes 5 questions. Recommence avec une autre personne la fois suivante.'

function lesson(
  id: string,
  title: string,
  week: number,
  intro: string,
  personas: Persona[],
  teacherNotes: string[],
  extra: Lesson['sections'] = [],
): Lesson {
  return {
    id,
    moduleId: 'm7',
    title,
    skill: 'PO',
    week,
    untilWeek: week + 1,
    quizLabel: 'Jeu de rôle avec Gemini',
    homework: HOMEWORK,
    objectives: [
      'Te présenter dans ta propre voix, sans réciter',
      'Adapter ta présentation à la personne (tu ou vous, ton, sujets)',
      'Poser cinq questions pour faire parler l’autre',
    ],
    sections: [
      ...extra,
      {
        kind: 'text',
        title: 'Comment pratiquer',
        paragraphs: [
          intro,
          '**1.** Présente-toi comme tu le fais d’habitude. **2.** Avec Gemini, retravaille ta présentation pour qu’elle te ressemble : un ado anglophone arrivé au Québec il y a un an. **3.** Recommence, puis pose tes cinq questions et écoute les réponses.',
        ],
      },
      { kind: 'personas', title: 'Les personnes', personas },
    ],
    speaking: {
      id: `${id}-po`,
      title: 'Me présenter et faire parler l’autre',
      prepMinutes: 5,
      speakMinutes: 10,
      instructions: [
        'Choisis une personne dans la liste. Présente-toi en 30 secondes, sans lire, puis garde la conversation vivante avec tes cinq questions.',
      ],
      followUps: ['Ça fait longtemps que tu es au Québec ?', 'Pourquoi tu veux devenir médecin ?', 'Qu’est-ce que tu trouves le plus difficile en français ?'],
      checklist: [
        'Je me suis présenté sans lire.',
        'J’ai dit que je suis anglophone et arrivé au Québec il y a un an.',
        'J’ai choisi « tu » ou « vous » selon la personne.',
        'J’ai posé mes questions et écouté les réponses.',
        'J’ai réagi avec une expression du Module 6.',
      ],
    },
    teacherNotes,
  }
}

const creperie: Persona[] = [
  {
    id: 'plongeur',
    title: 'Le plongeur de la crêperie, 18 ans',
    about: 'Un collègue de 18 ans qui fait la plonge à la crêperie.',
    address: 'tu',
    modelIntro:
      'Salut ! Moi, c’est [ton prénom]. Je travaille au service. Je suis anglophone et je suis arrivé au Québec il y a un an, ça fait que si je cherche mes mots, c’est normal !',
    questions: [
      'Ça fait longtemps que tu travailles ici ?',
      'C’est quoi, le pire moment du service ?',
      'Tu étudies en plus de travailler ?',
      'Tu fais quoi quand tu ne travailles pas ?',
      'C’est quoi ta crêpe préférée ici ?',
    ],
  },
  {
    id: 'gerant-matin',
    title: 'Le gérant du matin, 35 ans',
    about: 'Un gérant de 35 ans, qui a l’horaire du matin à la crêperie. Vous jasez pendant une pause, sans parler du travail.',
    address: 'vous',
    guidance: SMALL_TALK,
    modelIntro:
      'Bonjour, je suis [ton prénom]. Je suis anglophone, je vis au Québec depuis un an, et je veux vraiment améliorer mon français. N’hésitez pas à me parler en français !',
    questions: [
      'Avez-vous passé une belle fin de semaine ?',
      'Avez-vous vu le match du Canadien ?',
      'Vous aimez le café ou le thé ?',
      'Quelle musique écoutez-vous ?',
      'Où aimeriez-vous aller en vacances ?',
    ],
  },
  {
    id: 'gerante-soir',
    title: 'La gérante du soir, 35 ans',
    about: 'Une gérante de 35 ans, qui a l’horaire du soir à la crêperie. Vous jasez pendant une pause, sans parler du travail.',
    address: 'vous',
    guidance: SMALL_TALK,
    modelIntro:
      'Bonsoir, je m’appelle [ton prénom]. Je suis anglophone et je suis arrivé au Québec il y a un an. Je pratique mon français ici, alors merci de votre patience !',
    questions: [
      'Avez-vous un animal à la maison ?',
      'Quelle série regardez-vous en ce moment ?',
      'Aimez-vous l’hiver à Montréal ?',
      'Quel est votre quartier préféré ?',
      'Qu’est-ce que vous aimez faire pendant votre temps libre ?',
    ],
  },
  {
    id: 'client-regulier',
    title: 'Le client régulier, 26 ans',
    about: 'Un client de 26 ans qui vient souvent manger à la crêperie.',
    address: 'vous',
    modelIntro:
      'Bonjour ! Je vous vois souvent, je suis [ton prénom]. Je suis nouveau ici et je pratique mon français : je suis anglophone et je vis au Québec depuis un an.',
    questions: [
      'Qu’est-ce qui vous fait revenir ici ?',
      'Vous prenez toujours la même chose ?',
      'Vous travaillez dans le quartier ?',
      'Vous connaissez d’autres bonnes adresses dans le Vieux-Montréal ?',
      'Qu’est-ce que vous me conseillez de découvrir à Montréal ?',
    ],
  },
]

const conduite: Persona[] = [
  {
    id: 'moniteur',
    title: 'Le moniteur de Tecniq, 35 ans',
    about: 'Un moniteur de conduite de 35 ans à l’école de conduite Tecniq.',
    address: 'vous',
    modelIntro:
      'Bonjour, je m’appelle [ton prénom]. Je suis anglophone et je vis au Québec depuis un an, alors si je ne comprends pas une consigne, je vais vous demander de répéter. Merci !',
    questions: [
      'Quelles sont les erreurs les plus fréquentes des nouveaux conducteurs ?',
      'Qu’est-ce qui est le plus difficile à Montréal ?',
      'Comment vous préparez-vous pour conduire l’hiver ?',
      'Pourquoi êtes-vous devenu moniteur ?',
      'Que me conseillez-vous pour réussir l’examen pratique ?',
    ],
  },
  {
    id: 'camarade-conduite',
    title: 'Le camarade de la salle d’attente, 18 ans',
    about: 'Un jeune de 18 ans qui suit le même cours et attend dans la salle d’attente de Tecniq.',
    address: 'tu',
    modelIntro:
      'Salut, moi c’est [ton prénom]. T’es rendu où dans le cours ? Moi, je commence. Je suis anglophone, je suis arrivé ici il y a un an, ça fait que le vocabulaire de la route, c’est tout un défi !',
    questions: [
      'T’es rendu à quelle étape du cours ?',
      'Ton moniteur, il est comment ?',
      'C’était comment, l’examen théorique ?',
      'Tu vas à quelle école ?',
      'Tu vas faire quoi avec ton permis ?',
    ],
  },
]

const hopital: Persona[] = [
  {
    id: 'administratrice-45',
    title: 'L’administratrice de 45 ans',
    about: 'Une administratrice d’hôpital de 45 ans qui fait passer une entrevue pour le programme de bénévolat des Fêtes.',
    address: 'vous',
    modelIntro:
      'Bonjour, Madame. Je m’appelle [ton prénom]. Je suis un élève anglophone, je suis arrivé au Québec il y a un an, et je veux devenir médecin ici. Le bénévolat des Fêtes est pour moi une façon d’aider les patients et de pratiquer mon français avec eux.',
    questions: [
      'Quelles sont les tâches des bénévoles pendant les Fêtes ?',
      'Qu’est-ce qui est le plus difficile pour un nouveau bénévole ?',
      'Quelles qualités recherchez-vous ?',
      'Comment les patients vivent-ils cette période à l’hôpital ?',
      'Comment puis-je me préparer avant mon premier horaire ?',
    ],
  },
  {
    id: 'administratrice-55',
    title: 'L’administratrice de 55 ans',
    about: 'Une administratrice d’hôpital de 55 ans, plus formelle et expérimentée, qui fait passer une entrevue pour le programme de bénévolat des Fêtes.',
    address: 'vous',
    modelIntro:
      'Bonjour, Madame, et merci de me recevoir. Je m’appelle [ton prénom]. Je vis au Québec depuis un an, et même si le français n’est pas ma langue maternelle, je tiens à m’en servir avec les patients et avec l’équipe.',
    questions: [
      'Depuis combien de temps travaillez-vous à l’hôpital ?',
      'Quel souvenir de bénévole vous a le plus marquée ?',
      'Comment le travail des bénévoles aide-t-il les équipes soignantes ?',
      'Que doit-on faire si un patient veut seulement parler ?',
      'Quels conseils donneriez-vous à un jeune qui veut devenir médecin ?',
    ],
  },
]

const famille: Persona[] = [
  {
    id: 'parente-65',
    title: 'La parente de 65 ans, à la retraite',
    about:
      'Une parente de 65 ans, à la retraite, qui a des pertes de mémoire et aime qu’on l’aide à pratiquer la conversation et à raconter ses histoires. Elle perd parfois le fil ou répète une histoire.',
    address: 'tu',
    modelIntro:
      'Bonjour ! C’est [ton prénom]. Je suis venu jaser avec toi. Mon français n’est pas parfait, tu sais, je suis au Québec depuis un an seulement. Tu vas m’aider, et moi, je vais t’écouter raconter tes histoires.',
    questions: [
      'Où as-tu grandi ?',
      'C’était comment, ton premier emploi ?',
      'Comment tu as rencontré ton mari ou tes meilleures amies ?',
      'Quelle chanson te rappelle de bons souvenirs ?',
      'Qu’est-ce que tu cuisinais pour les grandes occasions ?',
    ],
  },
  {
    id: 'parente-85',
    title: 'La parente de 85 ans',
    about:
      'Une parente de 85 ans qui se remet de fractures aux mains. Elle veut poser des questions sur ta vie, ton école et ta famille.',
    address: 'tu',
    modelIntro:
      'Bonjour ! C’est [ton prénom]. Je suis content de te voir. Comment vont tes mains ? Tu peux me poser toutes tes questions : ça me fait pratiquer mon français.',
    questions: [
      'Comment vont tes mains aujourd’hui ?',
      'Qu’est-ce que tu as le plus hâte de refaire ?',
      'C’était comment, l’école quand tu avais mon âge ?',
      'Quel conseil tu donnerais à un jeune de seize ans ?',
      'Qu’est-ce qui a le plus changé au Québec dans ta vie ?',
    ],
  },
  {
    id: 'cousine',
    title: 'La cousine de 25 ans',
    about: 'Une cousine de 25 ans qui vit à Montréal et travaille pour la Ville de Montréal sur du matériel de marketing pour l’immersion linguistique.',
    address: 'tu',
    modelIntro:
      'Salut, c’est [ton prénom] ! Ça fait un an que je suis au Québec et j’essaie de ne plus cacher mon accent. Toi qui travailles sur l’immersion, tu vas pouvoir me dire ce que tu en penses !',
    questions: [
      'C’est quoi, ton travail à la Ville, concrètement ?',
      'Qu’est-ce qui fonctionne vraiment pour apprendre une langue ?',
      'Tu vois quoi comme erreurs dans les campagnes d’immersion ?',
      'Quel quartier de Montréal me conseilles-tu pour pratiquer mon français ?',
      'As-tu déjà eu honte de ton accent dans une autre langue ?',
    ],
  },
]

const cercle: Persona[] = [
  {
    id: 'joggeur',
    title: 'Le joggeur du groupe, 22 ans',
    about: 'Un membre de 22 ans du groupe de jogging, étudiant en génie biomédical à l’Université de Montréal.',
    address: 'tu',
    modelIntro:
      'Salut, moi c’est [ton prénom]. C’est ma première fois avec le groupe. Je suis anglophone, je suis arrivé ici il y a un an, ça fait que je cours et je pratique mon français en même temps !',
    questions: [
      'Ça fait longtemps que tu cours avec le groupe ?',
      'Tu étudies quoi à l’UdeM ?',
      'C’est quoi, le génie biomédical, concrètement ?',
      'Tu as un parcours préféré à Montréal ?',
      'Comment tu fais pour tout concilier ?',
    ],
  },
  {
    id: 'technicien',
    title: 'Le technicien de laboratoire, 40 ans',
    about:
      'Un ami de la famille de 40 ans, technicien au laboratoire de chimie de l’Université de Montréal, là où tu as fait ton camp d’été de Folie technique.',
    address: 'vous',
    modelIntro:
      'Bonjour ! Je ne sais pas si vous vous souvenez de moi : je suis [ton prénom], j’ai fait le camp de Folie technique. Depuis, mon français a bien avancé, même si je suis au Québec depuis un an seulement.',
    questions: [
      'En quoi consiste votre travail au laboratoire ?',
      'Quelle expérience aimez-vous le plus préparer ?',
      'Comment êtes-vous arrivé à la chimie ?',
      'Quelles habiletés sont les plus utiles en laboratoire ?',
      'Quel cours devrais-je prendre au cégep pour me préparer à la médecine ?',
    ],
  },
  {
    id: 'infirmiere-nord',
    title: 'L’infirmière dans le Nord, 45 ans',
    about:
      'Une amie de la famille de 45 ans, infirmière. Elle a travaillé dans le système privé et travaille maintenant dans le système public, dans un village du Nord accessible seulement par train.',
    address: 'vous',
    modelIntro:
      'Bonjour ! Je suis [ton prénom]. Je veux devenir médecin ici, au Québec, et je sais que ça veut dire soigner les gens en français. Je suis anglophone et je vis ici depuis un an, alors je pratique dès que je peux.',
    questions: [
      'Pourquoi avez-vous quitté le privé pour le public ?',
      'À quoi ressemble une journée dans votre village ?',
      'Comment faites-vous quand un patient a besoin d’un spécialiste ?',
      'Qu’est-ce que le travail dans le Nord vous a appris ?',
      'Quels conseils donneriez-vous à un futur médecin ?',
    ],
  },
]

export const m7: Module = {
  id: 'm7',
  number: 7,
  slug: 'm7-conversation',
  title: 'Conversation : me présenter',
  subtitle: 'Faire connaissance au travail, à la conduite et à l’hôpital',
  weeks: [1, 27],
  taHomework: true,
  immersion:
    'À la crêperie, à l’école de conduite et à l’hôpital, tout commence par se présenter et faire la conversation. Ici, tu pratiques avec Gemini en vrai contexte, et tu trouves ta propre voix : celle d’un ado anglophone arrivé au Québec il y a un an.',
  sources: [],
  accent: 'bg-module-7',
  lessons: [
    lesson(
      '7.1',
      'À la crêperie',
      1,
      'Tu croises ces personnes au travail : un plongeur de ton âge, deux gérants et un client régulier. Remarque comment tu passes du « tu » au « vous ». Avec les gérants, tu ne parles pas du travail : c’est une petite jasette, et ce n’est pas grave si tu ne comprends pas tout. Si tu décroches, utilise tes phrases de la leçon 6.0.',
      creperie,
      [
        'L’élève est gêné par son accent : valoriser d’abord ce qui passe bien et ne corriger que ce qui nuit à la compréhension.',
        'Avec les gérants, la conversation reste hors travail : l’élève est A2, et une conversation sans enjeu lui permet de prendre confiance.',
        'Ne pas chercher à le faire passer pour un Français ou un Québécois : le but est qu’il soit à l’aise dans sa propre voix.',
      ],
      [
        {
          kind: 'text',
          title: 'Ton accent fait partie de ton histoire',
          paragraphs: [
            'Tu préfères peut-être l’accent de France à celui du Québec, et ça te gêne d’entendre le tien. C’est très courant, et c’est normal. Mais personne ne te demande de parler comme un Français ou comme un Québécois.',
            'Ton objectif, c’est d’être **compris** et d’être **à l’aise**. Un patient se souviendra de ton effort pour lui parler dans sa langue, pas de tes voyelles. Quand tu dis « je suis arrivé il y a un an », ton accent devient une preuve de ton travail, et même une bonne façon de lancer la conversation.',
          ],
        },
      ],
    ),
    lesson(
      '7.2',
      'À l’école de conduite',
      2,
      'Avec ton moniteur, tu dois comprendre des consignes et oser les faire répéter. Avec le jeune de la salle d’attente, c’est de la jasette : profites-en pour essayer tes expressions.',
      conduite,
      [
        'Entraîner la phrase « Pouvez-vous répéter, s’il vous plaît ? » : demander de répéter est une compétence, pas un échec.',
        'Réutiliser le vocabulaire du Module 4 dans la conversation.',
      ],
    ),
    lesson(
      '7.3',
      'À l’hôpital',
      3,
      'Ces deux administratrices te reçoivent en entrevue pour le programme de bénévolat des Fêtes. Elles veulent voir que tu tiens à parler français avec les patients et l’équipe : ton parcours d’un an au Québec est un atout, dis-le !',
      hopital,
      [
        'Faire le lien avec l’entrevue simulée de la leçon 3.3.',
        'Vérifier l’usage constant du « vous » et l’absence d’expressions familières du Module 6.',
      ],
    ),
    lesson(
      '7.4',
      'En famille',
      4,
      'Avec ta famille, le but n’est pas de bien parler : c’est d’écouter, de relancer et de passer un bon moment. Avec ta parente de 65 ans, garde ta patience : si elle répète une histoire ou se trompe, ne la corrige pas, écoute-la comme si c’était la première fois.',
      famille,
      [
        'Ces échanges sont aussi une préparation à la relation avec les patients : écoute, patience, respect.',
        'Si l’élève pratique avec une vraie parente, le laisser choisir les sujets avec elle.',
      ],
    ),
    lesson(
      '7.5',
      'Mon cercle',
      5,
      'Ces personnes ont un métier ou des études qui t’intéressent. Pose tes questions, puis laisse-les parler : ce sont des contacts précieux pour ton parcours en médecine.',
      cercle,
      [
        'L’infirmière et le technicien sont de vraies occasions d’en apprendre sur les métiers de la santé et de la science.',
        'Réutiliser le débat privé/public de la leçon 1.8.',
      ],
    ),
  ],
}
