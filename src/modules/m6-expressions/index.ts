import type { Lesson, LessonSection, Module, PhraseDrill } from '../../types'

const EPISODE_URL =
  'https://ici.radio-canada.ca/ohdio/premiere/emissions/moteur-de-recherche/episodes/1237075/lundi-26-oct-2026-la-calvitie-chez-les-animaux-et-lorigine-de-la-craque-de-fesses/transcription'

const SOURCE: LessonSection = {
  kind: 'resources',
  title: 'L’épisode d’où viennent ces expressions',
  links: [
    {
      label: 'Moteur de recherche — lundi 26 octobre 2026',
      url: EPISODE_URL,
      description: 'Écoute l’épisode et repère ces expressions dans leur vrai contexte.',
    },
  ],
}

const METHOD: LessonSection = {
  kind: 'text',
  title: 'Comment pratiquer',
  paragraphs: [
    '**Fais 3 expressions par jour, à voix haute.** L’exercice se déroule tout seul : tu entends la phrase trois fois (une fois à vitesse normale, deux fois plus lentement), puis tu construis l’expression en commençant par la fin.',
    'Pour chaque morceau : tu essaies de le dire, tu écoutes le modèle, puis tu répètes. Commencer par la fin garde l’intonation naturelle, parce que la phrase finit toujours sur un morceau que tu connais déjà.',
    '**Enregistre-toi.** Après l’exercice, enregistre la phrase, réécoute ta voix, puis compare-la au modèle. Cherche une seule chose à améliorer et recommence.',
    '**Les voix sont synthétiques.** Elles donnent le rythme et les sons, mais écoute aussi l’épisode pour entendre de vraies personnes.',
  ],
}

const RECOMMENCER = 'Fais 3 expressions par jour avec l’exercice guidé, puis passe en mode TA, copie le prompt et réutilise-les avec Gemini Live.'

export const m6Drills: Record<string, PhraseDrill[]> = {
  relancer: [
    {
      id: 'mettons-que',
      phrase: 'Mettons que',
      context: 'Mettons que t’as pas le temps de finir ton rapport, tu fais quoi ?',
      buildUp: ['que', 'ons que', 'mettons que'],
      register: 'familier',
      meaning: 'Pour imaginer une situation, comme « supposons que ».',
      en: 'let’s say',
    },
    {
      id: 'ce-sera-ca-le-theme',
      phrase: 'Ce sera ça le thème de',
      context: 'Ce sera ça le thème de l’émission ce soir.',
      buildUp: ['de', 'thème de', 'le thème de', 'ça le thème de', 'ce sera ça le thème de'],
      register: 'courant',
      meaning: 'Pour annoncer le sujet dont on va parler.',
      en: 'that will be the theme of',
    },
    {
      id: 'bref-en-fait',
      phrase: 'Bref. En fait,',
      context: 'Bref. En fait, c’est une recherche qui vient d’être publiée par une équipe du MIT.',
      buildUp: ['fait', 'en fait', 'bref, en fait'],
      register: 'courant',
      meaning: 'Pour couper court et revenir à l’essentiel.',
      en: 'anyway, actually',
    },
    {
      id: 'y-arriver-plus-tard',
      phrase: 'On va y arriver un peu plus tard',
      context: 'On va y arriver un peu plus tard.',
      buildUp: ['tard', 'plus tard', 'un peu plus tard', 'y arriver un peu plus tard', 'on va y arriver un peu plus tard'],
      register: 'courant',
      meaning: 'Pour dire qu’on parlera de ce point ensuite.',
      en: 'we’ll get to that a bit later',
    },
    {
      id: 'voir-dailleurs',
      phrase: 'on va le voir d’ailleurs',
      context: 'On va le voir d’ailleurs qu’il y a des techniques pour ça.',
      buildUp: ['d’ailleurs', 'voir d’ailleurs', 'le voir d’ailleurs', 'on va le voir d’ailleurs'],
      register: 'courant',
      meaning: 'Pour annoncer un exemple qui vient bientôt.',
      en: 'as we’ll see, by the way',
    },
    {
      id: 'pour-voir-les-reponses',
      phrase: 'pour voir les réponses à ces questions-là',
      context: 'Allez sur le site de l’émission pour voir les réponses à ces questions-là.',
      buildUp: ['questions-là', 'à ces questions-là', 'les réponses à ces questions-là', 'pour voir les réponses à ces questions-là'],
      register: 'courant',
      meaning: 'Pour renvoyer quelqu’un vers une information.',
      en: 'to see the answers to those questions',
    },
  ],
  quotidien: [
    {
      id: 'choses-qui-pognent',
      phrase: 'des choses qui pognent',
      context: 'On parle des choses qui pognent sur les réseaux sociaux.',
      buildUp: ['pognent', 'qui pognent', 'choses qui pognent', 'des choses qui pognent'],
      register: 'familier',
      meaning: 'Des choses qui ont du succès, qui deviennent populaires.',
      en: 'things that catch on',
    },
    {
      id: 'cette-affaire-la',
      phrase: 'cette affaire-là',
      context: 'C’est fait en papier de riz, cette affaire-là.',
      buildUp: ['là', 'affaire-là', 'cette affaire-là'],
      register: 'familier',
      meaning: 'Pour parler d’un objet sans le nommer, comme « ce truc-là ».',
      en: 'that thing',
    },
    {
      id: 'aller-vers-ca',
      phrase: 'bien, ils vont aller un peu vers ça',
      context: 'Quand ils choisissent les colorants, bien, ils vont aller un peu vers ça.',
      buildUp: ['ça', 'vers ça', 'un peu vers ça', 'aller un peu vers ça', 'bien, ils vont aller un peu vers ça'],
      register: 'familier',
      meaning: '« Bien » lance la suite de la phrase, comme « eh bien » : à l’oral, on entend souvent « ben ».',
      en: 'well, they’ll lean that way',
    },
    {
      id: 'des-fois',
      phrase: 'Des fois, vous allez voir',
      context: 'Des fois, vous allez voir un chiffre qui est la dose.',
      buildUp: ['voir', 'allez voir', 'vous allez voir', 'des fois, vous allez voir'],
      register: 'familier',
      meaning: 'Pour dire « parfois ». À l’écrit, on préfère « parfois ».',
      en: 'sometimes you’ll see',
    },
    {
      id: 'si-jamais',
      phrase: 'Donc, si jamais',
      context: 'Donc, si jamais on l’échappe à l’autre bout, on peut la récupérer.',
      buildUp: ['jamais', 'si jamais', 'donc, si jamais'],
      register: 'courant',
      meaning: 'Pour envisager un cas possible, comme « au cas où ».',
      en: 'so if ever, in case',
    },
    {
      id: 'bien-evidemment',
      phrase: 'bien évidemment',
      context: 'Puis ce muscle, bien évidemment, on le retrouve au niveau de chacune de nos fesses.',
      buildUp: ['ment', 'évidemment', 'bien évidemment'],
      register: 'courant',
      meaning: 'Pour dire que quelque chose va de soi.',
      en: 'obviously, of course',
    },
  ],
  expliquer: [
    {
      id: 'on-etait-capable-de',
      phrase: 'On était capable de',
      context: 'Ça fonctionne. On était capable de suivre cette pilule-là.',
      buildUp: ['de', 'capable de', 'était capable de', 'on était capable de'],
      register: 'courant',
      meaning: 'Pour dire ce qu’on réussissait à faire.',
      en: 'we were able to',
    },
    {
      id: 'ca-depend-vraiment',
      phrase: 'Ça dépend vraiment des caractéristiques du',
      context: 'Ça dépend vraiment des caractéristiques du principe actif.',
      buildUp: ['du', 'caractéristiques du', 'des caractéristiques du', 'vraiment des caractéristiques du', 'ça dépend vraiment des caractéristiques du'],
      register: 'courant',
      meaning: 'Pour nuancer une réponse : le résultat varie selon quelque chose.',
      en: 'it really depends on the characteristics of',
    },
    {
      id: 'science-derriere',
      phrase: 'il y a vraiment une science derrière',
      context: 'Donc, il y a vraiment une science derrière les enrobages.',
      buildUp: ['derrière', 'science derrière', 'une science derrière', 'il y a vraiment une science derrière'],
      register: 'courant',
      meaning: 'Modèle à réutiliser : « il y a vraiment une ___ derrière ___ ».',
      en: 'there’s really a science behind',
    },
    {
      id: 'des-outils-pour-ca',
      phrase: 'c’est des outils aussi pour ça',
      context: 'Donc, c’est des outils aussi pour ça.',
      buildUp: ['ça', 'pour ça', 'aussi pour ça', 'des outils aussi pour ça', 'c’est des outils aussi pour ça'],
      register: 'familier',
      meaning: 'Pour dire à quoi sert quelque chose. À l’écrit : « ce sont des outils ».',
      en: 'those are tools for that too',
    },
    {
      id: 'sassurer',
      phrase: 'on doit vraiment s’assurer',
      context: 'Puis là, il y a des risques d’erreur. Donc, on doit vraiment s’assurer qu’on est capable d’identifier les médicaments.',
      buildUp: ['assurer', 's’assurer', 'vraiment s’assurer', 'on doit vraiment s’assurer'],
      register: 'courant',
      meaning: 'Pour insister sur une précaution, très utile à l’hôpital.',
      en: 'we really have to make sure',
    },
    {
      id: 'nom-mechappe',
      phrase: 'dont le nom m’échappe',
      context: 'On le mélange avec des poudres, comme du lactose ou d’autres poudres dont le nom m’échappe.',
      buildUp: ['échappe', 'm’échappe', 'le nom m’échappe', 'dont le nom m’échappe'],
      register: 'courant',
      meaning: 'Pour avouer qu’on a oublié un mot, très pratique quand un mot te manque.',
      en: 'whose name escapes me',
    },
  ],
  reagir: [
    {
      id: 'assez-impressionnant',
      phrase: 'C’est quand même assez impressionnant',
      context: 'C’est quand même assez impressionnant.',
      buildUp: ['nant', 'impressionnant', 'assez impressionnant', 'quand même assez impressionnant', 'c’est quand même assez impressionnant'],
      register: 'courant',
      meaning: 'Pour montrer qu’on est surpris et admiratif.',
      en: 'that’s pretty impressive',
    },
    {
      id: 'vraiment-fascinant',
      phrase: 'C’est vraiment fascinant',
      context: 'C’est vraiment fascinant.',
      buildUp: ['nant', 'fascinant', 'vraiment fascinant', 'c’est vraiment fascinant'],
      register: 'courant',
      meaning: 'Pour montrer un intérêt sincère.',
      en: 'that’s really fascinating',
    },
    {
      id: 'il-parait',
      phrase: 'ça doit être quand même assez spécial',
      context: 'Il paraît, ça doit être quand même assez spécial de voir la manière dont on comprime tout ça.',
      buildUp: ['spécial', 'assez spécial', 'quand même assez spécial', 'ça doit être quand même assez spécial'],
      register: 'courant',
      meaning: 'Pour imaginer une expérience et inviter l’autre à en parler.',
      en: 'that must be pretty special',
    },
    {
      id: 'jen-suis-sur',
      phrase: 'j’en suis sûr',
      context: 'Mais là, on en a une qui, j’en suis sûr, tout le monde s’est déjà posé.',
      buildUp: ['sûr', 'suis sûr', 'j’en suis sûr'],
      register: 'courant',
      meaning: 'Pour affirmer quelque chose avec confiance. La phrase est orale : à l’écrit, on dirait « que tout le monde s’est déjà posée ».',
      en: 'I’m sure of it',
    },
    {
      id: 'tres-difficile-de-penser',
      phrase: 'Bref, c’est très difficile de penser qu’on est capable de',
      context: 'Bref, c’est très difficile de penser qu’on est capable de le faire.',
      buildUp: ['de', 'capable de', 'qu’on est capable de', 'difficile de penser qu’on est capable de', 'bref, c’est très difficile de penser qu’on est capable de'],
      register: 'courant',
      meaning: 'Pour exprimer un doute, sans fermer la discussion.',
      en: 'anyway, it’s very hard to think we could',
    },
  ],
}

function lesson(
  id: string,
  title: string,
  week: number,
  drillsKey: string,
  objectives: string[],
  quiz: Lesson['quiz'],
  teacherNotes: string[],
): Lesson {
  return {
    id,
    moduleId: 'm6',
    title,
    skill: 'PO',
    week,
    untilWeek: week + 1,
    quizLabel: 'Sens et registre',
    homework: RECOMMENCER,
    objectives,
    sections: [METHOD, { kind: 'drills', title: 'Les expressions', drills: m6Drills[drillsKey] }, SOURCE],
    quiz,
    teacherNotes,
  }
}

export const m6: Module = {
  id: 'm6',
  number: 6,
  slug: 'm6-expressions',
  title: 'Expressions de mes pairs',
  subtitle: 'Parler comme les gens que tu veux rejoindre',
  weeks: [1, 27],
  taHomework: true,
  immersion:
    'Tu veux soigner des patients au Québec, et tu y vis depuis un an seulement. Les jeunes qui visent Marianopolis et le bénévolat à McGill parlent avec des expressions bien à eux : en les écoutant et en les reprenant, tu montres ton engagement à échanger en français avec les patients et ton équipe. Ces expressions serviront aussi dans tes exposés et tes simulations orales.',
  sources: [{ label: 'Radio-Canada OHdio — Moteur de recherche', url: 'https://ici.radio-canada.ca/ohdio/premiere/emissions/moteur-de-recherche' }],
  accent: 'bg-module-6',
  lessons: [
    lesson(
      '6.1',
      'Annoncer, relancer, résumer',
      1,
      'relancer',
      [
        'Comprendre et répéter six expressions qui organisent ce qu’on dit',
        'Reconnaître le registre de chaque expression',
        'Réutiliser ces expressions dans une conversation avec Gemini',
      ],
      [
        {
          id: '6.1-q1',
          type: 'matching',
          prompt: 'Associe chaque expression à son usage.',
          pairs: [
            { left: 'Mettons que', right: 'Imaginer une situation' },
            { left: 'Ce sera ça le thème de', right: 'Annoncer le sujet' },
            { left: 'On va y arriver un peu plus tard', right: 'Reporter un point' },
            { left: 'Bref. En fait,', right: 'Revenir à l’essentiel' },
          ],
        },
        {
          id: '6.1-q2',
          type: 'mcq',
          prompt: 'Tu passes ton oral du DELF. Quelle expression évites-tu ?',
          options: ['Mettons que', 'On va y arriver un peu plus tard', 'Bref. En fait,', 'on va le voir d’ailleurs'],
          answer: 0,
          explanation: '« Mettons que » est familier. À l’examen, dis plutôt « dissons que ».',
        },
        {
          id: '6.1-q3',
          type: 'fill',
          text: '___ que t’as pas le temps de finir ton rapport, tu fais quoi ?',
          answers: [['Mettons']],
        },
        {
          id: '6.1-q4',
          type: 'mcq',
          prompt: 'Une collègue te pose une question à laquelle tu répondras après. Que dis-tu ?',
          options: ['On va y arriver un peu plus tard.', 'Bref, c’est fini.', 'Mettons que non.', 'Ce sera ça le thème.'],
          answer: 0,
        },
      ],
      [
        'Vérifier que l’élève respecte la mélodie de la phrase plutôt que chaque son pris isolément.',
        '« Mettons que » est l’exemple modèle : il ne vient pas de l’épisode du 26 octobre.',
      ],
    ),
    lesson(
      '6.2',
      'Parler du quotidien',
      2,
      'quotidien',
      [
        'Comprendre six expressions fréquentes à l’oral québécois',
        'Savoir lesquelles garder pour tes collègues et tes amis',
        'Trouver l’équivalent courant d’une expression familière',
      ],
      [
        {
          id: '6.2-q1',
          type: 'matching',
          prompt: 'Associe chaque expression à son équivalent.',
          pairs: [
            { left: 'des choses qui pognent', right: 'des choses populaires' },
            { left: 'cette affaire-là', right: 'cet objet' },
            { left: 'des fois', right: 'parfois' },
            { left: 'si jamais', right: 'au cas où' },
          ],
        },
        {
          id: '6.2-q2',
          type: 'mcq',
          prompt: 'À qui dis-tu « des choses qui pognent » ?',
          options: ['À ton collègue de la crêperie', 'À l’examinateur du DELF', 'Dans ta lettre à McGill', 'À l’administratrice de l’hôpital'],
          answer: 0,
          explanation: 'C’est une expression familière : parfaite entre collègues, à éviter dans une situation formelle.',
        },
        {
          id: '6.2-q3',
          type: 'fill',
          text: 'Puis ce muscle, bien ___, on le retrouve au niveau de chacune de nos fesses.',
          answers: [['évidemment']],
        },
        {
          id: '6.2-q4',
          type: 'mcq',
          prompt: 'À l’oral, comment entend-on souvent le « bien » de « bien, ils vont aller un peu vers ça » ?',
          options: ['ben', 'bon', 'bain', 'banc'],
          answer: 0,
        },
      ],
      [
        'Le but n’est pas de remplacer le français courant : l’élève apprend à choisir selon la personne devant lui.',
        'Demander quand il a entendu ces expressions à la crêperie ou à l’école de conduite.',
      ],
    ),
    lesson(
      '6.3',
      'Expliquer comme en science',
      3,
      'expliquer',
      [
        'Comprendre six tournures pour expliquer un phénomène',
        'Nuancer une réponse avec « ça dépend vraiment »',
        'Réutiliser ces tournures dans un exposé',
      ],
      [
        {
          id: '6.3-q1',
          type: 'matching',
          prompt: 'Associe chaque expression à son usage.',
          pairs: [
            { left: 'Ça dépend vraiment de', right: 'Nuancer une réponse' },
            { left: 'on doit vraiment s’assurer', right: 'Insister sur une précaution' },
            { left: 'dont le nom m’échappe', right: 'Avouer un oubli' },
            { left: 'On était capable de', right: 'Dire ce qu’on réussissait à faire' },
          ],
        },
        {
          id: '6.3-q2',
          type: 'fill',
          text: 'Donc, il y a vraiment une science ___ les enrobages.',
          answers: [['derrière']],
        },
        {
          id: '6.3-q3',
          type: 'mcq',
          prompt: 'Pendant ton oral, un mot te manque. Quelle expression te sauve ?',
          options: ['dont le nom m’échappe', 'cette affaire-là', 'des choses qui pognent', 'mettons que'],
          answer: 0,
          explanation: 'Elle est courante, et elle te permet de continuer sans passer à l’anglais.',
        },
        {
          id: '6.3-q4',
          type: 'mcq',
          prompt: 'À l’écrit, comment dirais-tu « c’est des outils » ?',
          options: ['ce sont des outils', 'c’est un outils', 'ça sont des outils', 'il est des outils'],
          answer: 0,
        },
      ],
      [
        'Ces tournures se réutilisent directement dans les exposés du Module 1 : proposer d’en placer deux par exposé.',
        '« Il y a vraiment une ___ derrière ___ » est un modèle : faire produire d’autres phrases sur la médecine.',
      ],
    ),
    lesson(
      '6.4',
      'Réagir et montrer son intérêt',
      4,
      'reagir',
      [
        'Réagir de façon naturelle à ce qu’une personne raconte',
        'Montrer un intérêt sincère dans une conversation',
        'Exprimer un doute sans fermer la discussion',
      ],
      [
        {
          id: '6.4-q1',
          type: 'mcq',
          prompt: 'Une infirmière te raconte son travail dans un village du Nord. Que réponds-tu ?',
          options: ['Ça doit être quand même assez spécial !', 'Mettons que non.', 'Cette affaire-là.', 'On va y arriver un peu plus tard.'],
          answer: 0,
        },
        {
          id: '6.4-q2',
          type: 'fill',
          text: 'C’est quand même assez ___.',
          answers: [['impressionnant']],
        },
        {
          id: '6.4-q3',
          type: 'matching',
          prompt: 'Associe chaque expression à ce qu’elle exprime.',
          pairs: [
            { left: 'C’est vraiment fascinant', right: 'L’intérêt' },
            { left: 'j’en suis sûr', right: 'La certitude' },
            { left: 'c’est très difficile de penser que', right: 'Le doute' },
          ],
        },
      ],
      [
        'Ces réactions préparent le Module 7 : elles encouragent l’autre personne à continuer de parler.',
        'Travailler l’intonation : une réaction dite d’une voix plate paraît ironique.',
      ],
    ),
  ],
}

/** Expressions utilisables à l'oral du DELF et à l'hôpital (registre courant). */
export const oralPhrases: PhraseDrill[] = Object.values(m6Drills)
  .flat()
  .filter((d) => d.register === 'courant')

export function lessonDrills(lessonToRead: Lesson): PhraseDrill[] {
  return lessonToRead.sections.flatMap((s) => (s.kind === 'drills' ? s.drills : []))
}
