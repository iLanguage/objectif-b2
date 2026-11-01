import type { ExamPrepTask, Lesson, ModelSection, WritingTask } from '../../types'

/**
 * Une tâche par semaine pour préparer les examens blancs, en alternant les
 * quatre épreuves. Les sujets évitent ceux des trois examens blancs, pour que
 * les documents restent inconnus le jour de la simulation.
 */

const PARAGRAPH_REWRITE = `
  # Avant
  Le cours est bon pour les élèves. Par exemple, pour les accidents.
  # Après
  **Tout d’abord,** ce cours serait très utile aux élèves, parce qu’il leur apprendrait à réagir vite. **Par exemple, un élève qui** sait arrêter un saignement peut aider un ami blessé en attendant l’ambulance.
  # Ma méthode
  * Je commence par un connecteur.
  * J’explique mon idée avec « parce que ».
  * Je remplace la phrase sans verbe par un exemple en phrase complète.
`

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

/** Une lettre courte sur le sujet de la semaine : le plan est complet, mais le texte reste à développer. */
const letterModel = (markdown: string): ModelSection => ({
  kind: 'model',
  title: 'Modèle : une lettre courte',
  description: 'Lis en écoutant. Cette lettre montre le plan, mais elle est trop courte : la tienne doit compter au moins 250 mots. Garde le plan, change les idées et les exemples, et développe chaque argument.',
  markdown,
})

const pe = (week: number, title: string, subject: string, model: ModelSection): ExamPrepTask => ({
  week,
  skill: 'PE',
  title,
  minutes: 60,
  instructions: [subject, 'Rédige ta lettre en 1 heure, sans dictionnaire au début, puis relis-la avec la liste de vérification.'],
  lessonId: '5.1',
  model,
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

const po = (week: number, title: string, question: string, markdown: string): ExamPrepTask => ({
  week,
  skill: 'PO',
  title,
  minutes: 15,
  instructions: [
    `Sujet : ${question}`,
    'Prépare un plan en 10 minutes, sans tout écrire. Parle 3 minutes, enregistre-toi et réécoute-toi. Ensuite, débats avec Gemini Live.',
  ],
  model: {
    kind: 'model',
    title: 'Modèle : un plan et un court exposé',
    description: 'Lis en écoutant. Ce modèle dure environ une minute. Prends le même plan, mais trouve tes idées et tes exemples : ton exposé dure 3 minutes.',
    markdown,
  },
  speaking: true,
})

const co = (week: number, title: string, topic: string, markdown: string): ExamPrepTask => ({
  week,
  skill: 'CO',
  title,
  minutes: 20,
  instructions: [
    `Écoute 5 minutes d’un balado sur ${topic}, sans lire de transcription.`,
    'Prends des notes : qui, quoi, combien, pourquoi. Écoute une deuxième fois, puis résume ce que tu as compris à Gemini en quatre phrases.',
  ],
  model: {
    kind: 'model',
    title: 'Modèle : des notes et un résumé',
    description: 'Lis en écoutant. Ce balado est un exemple inventé : le tien dira autre chose. Garde la même forme, quatre notes puis quatre phrases.',
    markdown,
  },
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
  pe(2, 'Réécrire ma lettre sur le bénévolat', 'Reprends ta lettre à la direction sur le bénévolat à l’hôpital. Elle compte environ 160 mots : développe-la jusqu’à 250 mots, avec un exemple précis pour chaque argument, une concession et une formule de politesse.', {
    kind: 'model',
    title: 'Modèle : développer un argument',
    description: 'Lis en écoutant. Voici comment passer d’une phrase générale à un paragraphe : on ajoute un exemple précis, puis une concession. Fais la même chose pour chaque argument de ta lettre.',
    markdown: `
      # Avant
      Deuxièmement, le bénévolat pourrait aider les élèves à développer des qualités importantes comme la patience.
      # Après, avec un exemple précis
      Deuxièmement, le bénévolat pourrait aider les élèves à développer des qualités importantes comme la patience. **Par exemple, un bénévole qui** tient compagnie à une patiente âgée doit l’écouter, parler doucement et prendre son temps. Il apprend ainsi une qualité essentielle pour un futur médecin.
      # Une concession à ajouter
      **Certes,** le bénévolat prend du temps, **mais** il apprend aussi aux élèves à mieux s’organiser.
      # La formule de fin
      **Je vous prie d’agréer, Monsieur le Directeur, l’expression de mes salutations distinguées.**
    `,
  }),
  ce(3, 'Lire : le manque de personnel infirmier', 'le manque de personnel infirmier'),
  po(4, 'Parler : conduire à 16 ans', 'Les jeunes de 16 ans devraient-ils pouvoir conduire ?', `
    # Mon plan (des notes, pas des phrases complètes)
    * **La question :** à 16 ans, est-on prêt à conduire ?
    * **Pour :** plus de liberté, surtout en région.
    * **Contre :** peu d’expérience.
    * **Ma position :** oui, mais avec des règles strictes.
    # Introduction
    **Aujourd’hui, je vais parler de** la conduite à 16 ans. **La question est la suivante :** à cet âge, est-on prêt à conduire ? **Je pense que** oui, mais avec des règles strictes.
    # Premier argument
    **D’abord,** le permis donne de la liberté. **Par exemple,** une élève qui habite à la campagne peut aller seule à l’école et au travail.
    # Deuxième argument
    **Par contre,** un jeune conducteur a peu d’expérience. **Par exemple,** la nuit ou sous la neige, il peut avoir peur et faire une erreur.
    # Conclusion
    **En conclusion,** je suis d’accord, mais les jeunes doivent suivre des règles strictes, comme zéro alcool au volant.
  `),
  co(5, 'Écouter : le cœur', 'le cœur', `
    # Mes notes
    * **Qui :** une cardiologue.
    * **Quoi :** comment fonctionne le cœur.
    * **Combien :** environ 100 000 battements par jour.
    * **Pourquoi :** le cœur envoie le sang dans tout le corps.
    # Mon résumé en quatre phrases
    Dans ce balado, une cardiologue explique comment fonctionne le cœur.
    Elle dit que le cœur bat environ 100 000 fois par jour.
    Il bat pour envoyer le sang dans tout le corps.
    À mon avis, le plus intéressant, c’est ce chiffre.
  `),
  pe(6, 'Lettre : des cours de premiers soins', 'Écris à la direction de ton école pour proposer un cours de premiers soins pour tous les élèves.', letterModel(`
    # Début
    Montréal, le 1er décembre 2026
    **Objet :** Proposition d’un cours de premiers soins
    Madame, Monsieur,
    # Ma position
    **Je vous écris concernant** un cours de premiers soins pour tous les élèves. **À mon avis, c’est une excellente occasion d’**apprendre des gestes utiles.
    # Premier argument
    **Tout d’abord,** ce cours pourrait sauver des vies. **Par exemple, un élève qui** connaît les bons gestes peut aider un ami qui fait un malaise au gymnase.
    # Deuxième argument
    **Ensuite,** ce cours donnerait confiance aux élèves. **Par exemple, une élève qui** sait arrêter un saignement reste calme quand quelqu’un se blesse.
    # Concession
    **Certes,** l’horaire est déjà chargé, **mais** un cours de deux heures par année suffirait.
    # Fin
    **Je vous prie d’agréer, Madame, Monsieur, l’expression de mes salutations distinguées.**
  `)),
  ce(7, 'Lire : le diabète chez les jeunes', 'le diabète chez les jeunes'),
  po(8, 'Parler : les calories au menu', 'Les restaurants devraient-ils afficher les calories sur leur menu ?', `
    # Mon plan (des notes, pas des phrases complètes)
    * **La question :** faut-il montrer les calories au menu ?
    * **Pour :** les clients choisissent mieux.
    * **Contre :** c’est difficile pour les petits restaurants.
    * **Ma position :** oui pour les grandes chaînes.
    # Introduction
    **Aujourd’hui, je vais parler des** calories au menu. **La question est la suivante :** les restaurants doivent-ils les montrer ? **Je pense que** oui, surtout dans les grandes chaînes.
    # Premier argument
    **D’abord,** les clients peuvent mieux choisir. **Par exemple,** une personne qui fait attention à sa santé voit vite le plat le plus léger.
    # Deuxième argument
    **Par contre,** c’est difficile pour un petit restaurant. **Par exemple,** si le chef change le menu chaque semaine, il doit calculer les calories chaque semaine.
    # Conclusion
    **En conclusion,** les grandes chaînes doivent montrer les calories, mais les petits restaurants doivent rester libres.
  `),
  co(9, 'Écouter : le cerveau', 'le cerveau', `
    # Mes notes
    * **Qui :** une chercheuse en neurosciences.
    * **Quoi :** le sommeil et la mémoire.
    * **Combien :** au moins huit heures de sommeil pour un ado.
    * **Pourquoi :** pendant le sommeil, le cerveau garde ce qu’on a appris.
    # Mon résumé en quatre phrases
    Dans ce balado, une chercheuse parle du sommeil et de la mémoire.
    Elle dit qu’un ado a besoin d’au moins huit heures de sommeil.
    Pendant le sommeil, le cerveau garde ce qu’on a appris.
    À mon avis, c’est une bonne raison de ne pas étudier toute la nuit.
  `),
  pe(10, 'Lettre : des pistes cyclables', 'Écris à ta Ville pour demander une piste cyclable sécuritaire près de ton école.', letterModel(`
    # Début
    Montréal, le 4 janvier 2027
    **Objet :** Demande d’une piste cyclable près de mon école
    Madame, Monsieur,
    # Ma position
    **Je vous écris concernant** la sécurité des élèves à vélo. **À mon avis,** une piste cyclable sécuritaire est nécessaire près de mon école.
    # Premier argument
    **Tout d’abord,** la rue est dangereuse. **Par exemple,** le matin, les voitures passent très près des élèves qui arrivent à vélo.
    # Deuxième argument
    **Ensuite,** une piste encouragerait les jeunes à bouger. **Par exemple, un élève qui** vient à l’école à vélo fait trente minutes de sport par jour.
    # Concession
    **Certes,** une piste coûte cher, **mais** la sécurité des jeunes est plus importante.
    # Fin
    **Je vous prie d’agréer, Madame, Monsieur, l’expression de mes salutations distinguées.**
  `)),
  ce(11, 'Lire : la vaccination', 'la vaccination'),
  po(12, 'Parler : le bénévolat à l’étranger', 'Le bénévolat à l’étranger est-il une bonne idée pour un futur médecin ?', `
    # Mon plan (des notes, pas des phrases complètes)
    * **La question :** partir à l’étranger aide-t-il un futur médecin ?
    * **Pour :** découvrir un autre système de santé.
    * **Contre :** un élève sans formation peut mal aider.
    * **Ma position :** oui, mais avec un organisme sérieux.
    # Introduction
    **Aujourd’hui, je vais parler du** bénévolat à l’étranger. **La question est la suivante :** est-ce une bonne expérience pour un futur médecin ? **Je pense que** oui, mais seulement avec un organisme sérieux.
    # Premier argument
    **D’abord,** on découvre un autre système de santé. **Par exemple,** une élève qui aide dans une petite clinique voit comment on soigne avec peu de matériel.
    # Deuxième argument
    **Par contre,** un élève n’a pas de formation médicale. **Par exemple,** il ne peut pas faire de soins, et il ne doit pas prendre la place d’un travailleur local.
    # Conclusion
    **En conclusion,** c’est une bonne idée si le jeune reste à sa place et s’il part avec un organisme sérieux.
  `),
  co(13, 'Écouter : les médicaments', 'les médicaments', `
    # Mes notes
    * **Qui :** une pharmacienne.
    * **Quoi :** comment utiliser les antibiotiques.
    * **Combien :** une ordonnance de sept jours, par exemple.
    * **Pourquoi :** les antibiotiques agissent sur les bactéries, pas sur les virus.
    # Mon résumé en quatre phrases
    Dans ce balado, une pharmacienne explique comment utiliser les antibiotiques.
    Elle dit qu’il faut suivre l’ordonnance, par exemple pendant sept jours.
    Les antibiotiques agissent sur les bactéries, mais pas sur les virus.
    À mon avis, beaucoup de gens ne savent pas ça.
  `),
  pe(14, 'Lettre : plus de médecins de famille', 'Écris au ministre de la Santé pour proposer une solution au manque de médecins de famille.', letterModel(`
    # Début
    Montréal, le 25 janvier 2027
    **Objet :** Une solution au manque de médecins de famille
    Monsieur le Ministre,
    # Ma position
    **Je vous écris concernant** le manque de médecins de famille au Québec. **À mon avis,** il faut donner plus de place aux infirmières praticiennes.
    # Premier argument
    **Tout d’abord,** les médecins auraient plus de temps. **Par exemple, un patient qui** a un problème simple peut voir une infirmière praticienne, et le médecin s’occupe des cas graves.
    # Deuxième argument
    **Ensuite,** les patients seraient mieux suivis. **Par exemple, une personne âgée qui** a du diabète peut voir la même infirmière chaque mois.
    # Concession
    **Certes,** il faudrait former plus d’infirmières, **mais** ce serait plus rapide que de former de nouveaux médecins.
    # Fin
    **Je vous prie d’agréer, Monsieur le Ministre, l’expression de mes salutations distinguées.**
  `)),
  ce(15, 'Lire : la chaleur et la santé', 'les effets de la chaleur sur la santé'),
  po(16, 'Parler : l’IA chez le médecin', 'L’intelligence artificielle peut-elle aider les médecins sans les remplacer ?', `
    # Mon plan (des notes, pas des phrases complètes)
    * **La question :** l’IA peut-elle aider sans remplacer le médecin ?
    * **Pour :** elle lit des images très vite.
    * **Contre :** elle ne comprend pas les émotions.
    * **Ma position :** elle aide, le médecin décide.
    # Introduction
    **Aujourd’hui, je vais parler de** l’intelligence artificielle à l’hôpital. **La question est la suivante :** peut-elle aider les médecins sans prendre leur place ? **Je pense que** oui.
    # Premier argument
    **D’abord,** l’IA travaille très vite. **Par exemple,** elle peut regarder des centaines de radiographies et montrer au médecin celles qui sont inquiétantes.
    # Deuxième argument
    **Par contre,** elle ne comprend pas les émotions. **Par exemple,** une patiente qui a peur a besoin d’une personne qui l’écoute et qui la rassure.
    # Conclusion
    **En conclusion,** l’IA est un bon outil, mais c’est le médecin qui doit décider.
  `),
  co(17, 'Écouter : la génétique', 'la génétique', `
    # Mes notes
    * **Qui :** une généticienne.
    * **Quoi :** comment l’ADN passe des parents aux enfants.
    * **Combien :** 23 paires de chromosomes.
    * **Pourquoi :** chaque parent donne la moitié de ses chromosomes.
    # Mon résumé en quatre phrases
    Dans ce balado, une généticienne explique comment l’ADN passe des parents aux enfants.
    Elle dit qu’une personne a 23 paires de chromosomes.
    Chaque parent donne la moitié de ses chromosomes à son enfant.
    À mon avis, c’est pour ça qu’on ressemble à ses deux parents.
  `),
  pe(18, 'Lettre : une salle pour les familles', 'Écris à la direction d’un hôpital pour proposer une salle de repos pour les familles des patients.', letterModel(`
    # Début
    Montréal, le 22 février 2027
    **Objet :** Proposition d’une salle de repos pour les familles
    Madame, Monsieur,
    # Ma position
    **Je vous écris concernant** les familles des patients. **À mon avis,** elles ont besoin d’une salle de repos à l’hôpital.
    # Premier argument
    **Tout d’abord,** les familles sont très fatiguées. **Par exemple, une mère qui** reste près de son enfant toute la nuit dort sur une chaise.
    # Deuxième argument
    **Ensuite,** une personne reposée aide mieux le patient. **Par exemple, un père qui** a bien dormi écoute mieux le médecin et comprend mieux ses conseils.
    # Concession
    **Certes,** l’hôpital a peu d’espace, **mais** une petite pièce avec deux fauteuils suffirait.
    # Fin
    **Je vous prie d’agréer, Madame, Monsieur, l’expression de mes salutations distinguées.**
  `)),
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
    model: {
      kind: 'model',
      title: 'Modèle : expliquer une erreur et réécrire un paragraphe',
      description: 'Lis en écoutant. Ces exemples sont inventés : ils ne viennent pas de ton examen. Fais la même chose pour tes erreurs et ton paragraphe.',
      markdown: `
        # Expliquer une erreur
        * **J’ai répondu :** Vrai.
        * **La bonne réponse est :** Faux.
        * **Pourquoi :** le texte dit « certains patients », pas « tous les patients ». J’ai mal lu un petit mot.
        ${PARAGRAPH_REWRITE}
      `,
    },
    examId: 'blanc-1',
  },
  { week: 22, title: 'Examen blanc 2', minutes: 200, instructions: ['Fais l’examen blanc 2 en conditions réelles, avec le chronomètre.'], examId: 'blanc-2' },
  {
    week: 23,
    title: 'Dernière révision avant la tentative 2',
    minutes: 45,
    instructions: ['Relis ta trousse de phrases et ton guide de l’oral.', 'Écris de mémoire ta formule d’ouverture, tes connecteurs et ta formule de fin.'],
    model: {
      kind: 'model',
      title: 'Modèle : ta trousse de phrases',
      description: 'Lis en écoutant, deux fois. Clique ensuite sur « Masquer la transcription », puis écris tout de mémoire.',
      markdown: `
        # Ma formule d’ouverture
        Madame, Monsieur,
        Je vous écris concernant…
        # Mes connecteurs
        * Tout d’abord,
        * Ensuite,
        * Par exemple,
        * Certes…, mais…
        * En conclusion,
        # Ma formule de fin
        Je vous prie d’agréer, Madame, Monsieur, l’expression de mes salutations distinguées.
      `,
    },
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
  pe(26, 'Mon épreuve la plus faible : la lettre', 'Choisis le sujet de lettre qui t’a donné le plus de difficulté cette année et réécris-la complètement.', {
    kind: 'model',
    title: 'Modèle : réécrire un paragraphe faible',
    description: 'Lis en écoutant. Voici un paragraphe faible, sa nouvelle version et la méthode. Fais la même chose pour chaque paragraphe de ta lettre.',
    markdown: PARAGRAPH_REWRITE,
  }),
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
