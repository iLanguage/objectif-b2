import type { Module } from '../../types'
import PLAN from './plan-telemedecine.md?raw'
import MONOLOGUE from './monologue-telemedecine.md?raw'

const DEBAT_EN_DIRECT = `
  ## Montrer que tu comprends, puis dire non
  Évaluateur : Les jeunes préfèrent la vidéo. Dans dix ans, tout le monde saura utiliser la technologie. Votre argument ne tient plus.
  Mikael : **Vous avez raison sur un point :** les jeunes sont à l’aise avec la technologie. Mais même si tout le monde sait l’utiliser, le médecin ne pourra toujours pas palper la peau du patient.
  ## Ajouter, puis jouer l’avocat du diable
  Évaluateur : Et pour une simple rougeur ? La vidéo fait gagner du temps.
  Mikael : **Je suis d’accord, et j’ajouterais que** le patient n’a pas besoin de manquer l’école ou le travail. **On pourrait me dire que** la vidéo suffit donc toujours. **C’est vrai, mais** si le médecin doit revoir le patient en personne, on perd le temps gagné.
  ## Revenir à ta position
  Évaluateur : Donc, pour vous, il faut garder les cliniques ?
  Mikael : **Je reviens à mon idée principale :** la télémédecine doit compléter plutôt que remplacer les consultations en personne. **Et vous, que feriez-vous si** vous ne saviez pas utiliser un ordinateur ?
`

export const m1: Module = {
  id: 'm1',
  number: 1,
  slug: 'm1-medecine',
  title: 'Radio-Canada : Médecine & Système de santé',
  subtitle: 'Cardiologie, pénurie de médecins, Med-P',
  weeks: [1, 22],
  immersion:
    'Écouter et lire l’actualité de la santé au Québec, comme un futur médecin. Chaque leçon te rapproche de ta candidature Med-P — en français.',
  sources: [
    { label: 'Radio-Canada OHdio — Moteur de recherche', url: 'https://ici.radio-canada.ca/ohdio/premiere/emissions/6056/moteur-de-recherche' },
    { label: 'Radio-Canada OHdio — Les années lumière', url: 'https://ici.radio-canada.ca/ohdio/premiere/emissions/52/les-annees-lumiere' },
    { label: 'Radio-Canada Info — Santé', url: 'https://ici.radio-canada.ca/sante' },
    { label: 'McGill — Admissions en médecine (Med-P)', url: 'https://www.mcgill.ca/medadmissions/' },
  ],
  accent: 'bg-module-1',
  lessons: [
    // -----------------------------------------------------------------------
    {
      id: '1.0',
      moduleId: 'm1',
      title: 'Section 4 : Production orale — La télémédecine',
      skill: 'PO',
      week: 1,
      quizLabel: 'Simulation orale B2',
      objectives: [
        'Dégager la problématique d’un énoncé médical controversé',
        'Formuler une opinion claire (pour, contre ou nuancée) et la défendre avec des arguments logiques (monologue de 5 à 7 minutes)',
        'Défendre sa position lors d’un débat de 10 minutes avec l’évaluateur en répondant aux objections',
        'Construire le débat en cinq morceaux : le plan, les exemples, les phrases pour relier, les questions, convaincre en direct',
      ],
      sections: [
        {
          kind: 'reading',
          title: 'Énoncé déclencheur',
          source: 'Format officiel DELF B2 — Épreuve de production orale (Section 4).',
          paragraphs: [
            '« La télémédecine (les consultations médicales par vidéo) devrait remplacer les consultations en personne pour tous les problèmes de santé mineurs. »',
          ],
        },
        {
          kind: 'text',
          title: 'Format standard : 20 min de préparation, monologue de 5 à 7 min, débat de 10 min',
          paragraphs: [
            '**Préparation (20 min)** : Mikael dégage la problématique, prend des notes synthétiques et structure son plan (ne pas rédiger de texte continu).',
            '**Monologue (5 à 7 min)** : Présentation fluide et structurée (problématique, prise de position claire, au moins deux arguments logiques avec exemples concrets, conclusion nuancée).',
            '**Débat (10 min)** : Échange contradictoire avec l’évaluateur (professeur ou Gemini TA en mode vocal). Défendre sa position avec calme, conviction et nuance.',
          ],
        },
        {
          kind: 'text',
          title: 'Ton débat, morceau par morceau',
          paragraphs: [
            'À ta dernière pratique, tu as fait ce débat en anglais, et tes arguments étaient bons : une opinion claire, des exemples et une conclusion. **Tu n’as pas besoin de nouvelles idées.** Aujourd’hui, on met **tes idées** en français, morceau par morceau.',
            '**Les cinq morceaux :** 1. le plan · 2. les exemples · 3. les phrases pour relier tes idées · 4. répondre aux questions · 5. convaincre en direct.',
            '**Partie A, la démonstration :** ton professeur fait le travail avec tes idées, et tu lis et tu écoutes. **Partie B, à toi :** tu refais chaque morceau à voix haute.',
            '**Tu ne pars jamais de zéro.** Avant chaque défi, tu lis le modèle et tu l’écoutes. Ensuite seulement, c’est à toi.',
          ],
        },
        {
          kind: 'model',
          title: 'Partie A · Morceau 1 : Le plan',
          description: 'Plan d’exposé pour la production orale B2. Lis-le en l’écoutant : chaque ligne devient une partie de ton monologue. Pendant ta préparation, tu écris ce genre de notes, pas des phrases complètes.',
          markdown: PLAN,
        },
        {
          kind: 'tip',
          text: 'Ta question en anglais, « Should it completely replace? », est déjà une problématique : « La télémédecine devrait-elle remplacer complètement les consultations en personne ? » Plus tard, tu pourras dire : « Dans quelle mesure la télémédecine peut-elle améliorer l’accès aux soins sans compromettre la qualité du diagnostic ? »',
        },
        {
          kind: 'model',
          title: 'Partie A · Morceau 2 : Un exemple pour chaque point',
          description: 'La règle : une idée, un exemple, un lien avec ta position. L’exemple est une histoire courte, en phrases complètes.',
          markdown: `
            # Praticité et gain de temps
            Par exemple, j’ai un petit problème de peau, comme une rougeur. Je la montre à la caméra, le médecin voit le problème et il me donne un conseil. C’est un cas où la vidéo fonctionne.
            # Accessibilité
            Par exemple, une personne âgée qui ne conduit pas doit prendre les transports en commun pour aller à la clinique. Un étudiant doit manquer un cours. Avec la vidéo, ils restent à la maison.
            # Absence d’examen physique
            Par exemple, j’ai une bosse sur la peau. À la caméra, le médecin la voit, mais il ne peut pas la palper. Il ne sait pas si c’est une inflammation, du pus ou du liquide.
            # Fracture numérique et équité
            Par exemple, une personne âgée doit remplir son dossier médical en ligne. C’est compliqué pour elle. Elle doit demander de l’aide ou trouver une autre solution.
          `,
        },
        {
          kind: 'vocab',
          title: 'Les mots de tes exemples',
          items: [
            { fr: 'se déplacer', en: 'to travel, to get somewhere' },
            { fr: 'la salle d’attente', en: 'waiting room' },
            { fr: 'de chez soi', en: 'from your own home' },
            { fr: 'plus pratique', en: 'more convenient', note: 'Tes mots.' },
            { fr: 'plus accessible / moins accessible', en: 'more / less accessible' },
            { fr: 'les personnes âgées', en: 'older people' },
            { fr: 'les transports en commun', en: 'public transit' },
            { fr: 'une rougeur', en: 'a red patch on the skin' },
            { fr: 'une bosse', en: 'a bump' },
            { fr: 'toucher / sentir la texture', en: 'to touch / to feel the texture' },
            { fr: 'enflammé(e)', en: 'inflamed' },
            { fr: 'du pus / du liquide', en: 'pus / fluid', note: 'Le « s » de « pus » ne se prononce pas.' },
            { fr: 'le diagnostic et le traitement', en: 'diagnosis and treatment' },
            { fr: 'être à l’aise avec la technologie', en: 'to be comfortable with technology' },
            { fr: 'se connecter au rendez-vous', en: 'to join the appointment' },
            { fr: 'remplir son dossier médical en ligne', en: 'to fill out your medical file online' },
            { fr: 'compliqué(e)', en: 'complicated', note: 'C’est compliqué. La technologie est compliquée. Après « c’est », on garde le masculin.' },
            { fr: 'compléter, pas remplacer', en: 'to complement, not replace' },
            { fr: 'bondé(e)', en: 'packed, overcrowded' },
            { fr: 'tributaire de', en: 'dependent on', note: 'Une personne tributaire des transports en commun.' },
            { fr: 'une affection cutanée', en: 'a skin condition' },
            { fr: 'un suivi rapide', en: 'a quick follow-up' },
            { fr: 'palper', en: 'to feel with the hands, during an exam' },
            { fr: 'la praticité', en: 'convenience' },
            { fr: 'les compétences numériques', en: 'digital skills' },
            { fr: 'l’équité', en: 'fairness, equity' },
            { fr: 'au détriment de', en: 'at the expense of' },
            { fr: 'une avancée majeure', en: 'a major step forward' },
            { fr: 'bien que + subjonctif', en: 'although', note: 'Bien que la télémédecine soit… Apprends-le comme un bloc.' },
          ],
        },
        {
          kind: 'vocab',
          title: 'Vocabulaire utile pour le débat',
          items: [
            { fr: 'la télémédecine / la téléconsultation', en: 'telemedicine / virtual consultation' },
            { fr: 'une consultation en personne (en présentiel)', en: 'in-person appointment' },
            { fr: 'un problème de santé mineur', en: 'minor health issue' },
            { fr: 'la fracture numérique', en: 'digital divide' },
            { fr: 'l’examen clinique / la palpation', en: 'physical / clinical exam, palpation' },
            { fr: 'désengorger les urgences et les cliniques', en: 'relieve clinic and ER congestion' },
            { fr: 'le dossier médical électronique', en: 'electronic medical record' },
            { fr: 'la relation thérapeutique', en: 'doctor-patient relationship' },
          ],
        },
        {
          kind: 'vocab',
          title: 'Partie A · Morceau 3 : Les phrases pour relier tes idées',
          items: [
            { fr: 'Aujourd’hui, on se demande si…', en: 'Today, the question is whether…', note: 'Introduire le sujet.' },
            { fr: 'Je vais expliquer pourquoi.', en: 'I will get into why.', note: 'Introduire. Tes mots.' },
            { fr: 'Pour commencer,', en: 'To begin with,', note: 'Passer à une idée. Tes mots.' },
            { fr: 'De plus,', en: 'Furthermore,', note: 'Passer à une idée. Tes mots.' },
            { fr: 'Par contre,', en: 'However,', note: 'Changer de direction. Attention : « par exemple » veut dire « for example », jamais « however ».' },
            { fr: 'Cela dit,', en: 'That being said,', note: 'Passer des avantages aux problèmes.' },
            { fr: 'Par exemple,', en: 'For example,', note: 'Développer une idée.' },
            { fr: 'Prenons l’exemple de…', en: 'Let’s take the example of…', note: 'Développer une idée.' },
            { fr: 'Ce que je veux dire, c’est que…', en: 'What I mean is…', note: 'Préciser ta pensée.' },
            { fr: 'Je parle surtout de…', en: 'I’m mainly talking about…', note: 'Préciser ta pensée.' },
            { fr: 'Autrement dit,', en: 'In other words,', note: 'Réexpliquer plus simplement.' },
            { fr: 'Je vais le dire autrement.', en: 'Let me say it another way.', note: 'Réexpliquer. Très utile quand tu perds un mot.' },
            { fr: 'En conclusion,', en: 'In conclusion,', note: 'Conclure. Tes mots.' },
            { fr: 'C’est pourquoi je pense que…', en: 'That’s why I think that…', note: 'Conclure.' },
            { fr: 'Je suis convaincu que…', en: 'I’m convinced that…', note: 'Convaincre.' },
            { fr: 'C’est important parce que…', en: 'This matters because…', note: 'Convaincre.' },
          ],
        },
        {
          kind: 'model',
          title: 'Partie A : Le monologue assemblé',
          description: 'Le plan, les exemples et les phrases, tout ensemble. Lis en écoutant : les phrases pour relier sont en gras. Ne l’apprends pas par cœur : prends les morceaux. À ton rythme, ce texte dure environ 5 minutes.',
          markdown: MONOLOGUE,
        },
        {
          kind: 'text',
          title: 'Partie A · Morceau 4 : Répondre à une question en quatre gestes',
          paragraphs: [
            '**1. Reformuler.** Tu redis la question avec tes mots. Ça prouve que tu as compris, et ça te donne du temps pour réfléchir.',
            '**2. Clarifier.** Si tu n’es pas sûr, tu poses une question avant de répondre.',
            '**3. Répondre.** Une phrase simple, puis un exemple.',
            '**4. Prendre position.** Tu dis si tu es d’accord, pas d’accord, ou d’accord en partie, et tu reviens à ton idée principale.',
          ],
        },
        {
          kind: 'vocab',
          title: 'Les phrases pour les quatre gestes',
          items: [
            { fr: 'C’est une bonne question. Laissez-moi réfléchir.', en: 'That’s a good question. Let me think.', note: 'Gagner du temps.' },
            { fr: 'Si je comprends bien, vous voulez dire que… ?', en: 'If I understand correctly, you mean that…?', note: '1. Reformuler.' },
            { fr: 'Vous me demandez si…', en: 'You’re asking me whether…', note: '1. Reformuler.' },
            { fr: 'Qu’est-ce que vous voulez dire par… ?', en: 'What do you mean by…?', note: '2. Clarifier.' },
            { fr: 'Vous parlez de… ou de… ?', en: 'Are you talking about… or…?', note: '2. Clarifier.' },
            { fr: 'Je dirais que…', en: 'I would say that…', note: '3. Répondre.' },
            { fr: 'Je suis d’accord avec vous.', en: 'I agree with you.', note: '4. Prendre position.' },
            { fr: 'Je suis d’accord en partie.', en: 'I partly agree.', note: '4. Prendre position.' },
            { fr: 'Je ne suis pas d’accord, parce que…', en: 'I disagree, because…', note: '4. Prendre position.' },
          ],
        },
        {
          kind: 'model',
          title: 'Partie A : Deux questions, quatre gestes',
          description: 'Lis en écoutant. Tu dis « vous » à l’évaluateur, jamais « tu ».',
          markdown: `
            # Première question
            Évaluateur : Si le problème est vraiment mineur, pourquoi se déplacer ? La vidéo suffit, non ?
            ## Geste 1 : reformuler
            Mikael : **Si je comprends bien, vous voulez dire que** pour un petit problème, on n’a jamais besoin de voir le médecin en personne ?
            Évaluateur : Oui, exactement.
            ## Geste 2 : clarifier
            Mikael : **Qu’est-ce que vous voulez dire par** « mineur » ? Un problème de peau, par exemple ?
            Évaluateur : Oui, par exemple.
            ## Gestes 3 et 4 : répondre, puis prendre position
            Mikael : **Je dirais que** ça dépend du problème. Pour une rougeur, la vidéo suffit souvent, parce que le médecin voit le problème. Par contre, pour une bosse, il doit la palper. **Je suis d’accord en partie,** mais on ne sait pas toujours si un problème est mineur avant l’examen. C’est pourquoi le patient doit garder le choix.
            # Deuxième question
            Évaluateur : Vous dites que la télémédecine aide les personnes âgées, mais aussi qu’elle leur cause des problèmes. Ce n’est pas une contradiction ?
            ## Gagner du temps, puis reformuler
            Mikael : **C’est une bonne question. Laissez-moi réfléchir. Vous me demandez** comment les deux peuvent être vrais.
            ## Répondre et prendre position
            Mikael : **Je ne suis pas d’accord, parce que** les personnes âgées ne sont pas toutes pareilles. Pour une personne à l’aise avec la technologie, la vidéo est plus simple. Pour une autre, c’est compliqué. **Autrement dit,** chacun a des besoins différents. C’est justement pour ça qu’il faut les deux options.
          `,
        },
        {
          kind: 'vocab',
          title: 'Partie A · Morceau 5 : Convaincre en direct',
          items: [
            { fr: 'Je comprends votre point de vue, mais…', en: 'I understand your point of view, but…', note: 'Montrer que tu comprends, puis dire non.' },
            { fr: 'Vous avez raison sur un point : …', en: 'You’re right about one thing: …', note: 'Montrer que tu comprends, puis dire non.' },
            { fr: 'Je suis d’accord, et j’ajouterais que…', en: 'I agree, and I would add that…', note: 'Ajouter à l’idée de l’autre.' },
            { fr: 'On pourrait me dire que… C’est vrai, mais…', en: 'Someone could tell me that… That’s true, but…', note: 'Jouer l’avocat du diable : tu donnes l’argument contraire, puis tu y réponds.' },
            { fr: 'Imaginons une personne qui…', en: 'Let’s imagine a person who…', note: 'Prendre un cas concret.' },
            { fr: 'Et vous, que feriez-vous si… ?', en: 'And you, what would you do if…?', note: 'Renvoyer la question.' },
            { fr: 'Je reviens à mon idée principale : …', en: 'I’ll come back to my main idea: …', note: 'Ne pas te perdre. Tu nuances, mais tu ne changes pas d’avis.' },
          ],
        },
        {
          kind: 'model',
          title: 'Partie A : Le débat en direct',
          description: 'Lis en écoutant. Regarde comment Mikael montre qu’il comprend, ajoute une idée, joue l’avocat du diable, puis revient à sa position.',
          markdown: DEBAT_EN_DIRECT,
        },
        {
          kind: 'drills',
          title: 'Partie B · Étape 1 : Six phrases pour ton monologue',
          drills: [
            {
              id: 'debat-expliquer-pourquoi',
              phrase: 'Je vais expliquer pourquoi',
              context: 'Je pense qu’elle ne devrait pas remplacer totalement les soins en personne. Je vais expliquer pourquoi.',
              buildUp: ['pourquoi', 'expliquer pourquoi', 'je vais expliquer pourquoi'],
              register: 'courant',
              meaning: 'Pour annoncer que tu vas défendre ton opinion.',
              en: 'I will get into why',
            },
            {
              id: 'debat-completer-remplacer',
              phrase: 'La télémédecine doit compléter plutôt que remplacer les consultations en personne',
              context: 'La télémédecine doit compléter plutôt que remplacer les consultations en personne.',
              buildUp: [
                'en personne',
                'les consultations en personne',
                'remplacer les consultations en personne',
                'plutôt que remplacer les consultations en personne',
                'compléter plutôt que remplacer les consultations en personne',
                'la télémédecine doit compléter plutôt que remplacer les consultations en personne',
              ],
              register: 'courant',
              meaning: 'Ta position en une phrase. Si tu oublies tout le reste, garde celle-ci.',
              en: 'telemedicine should complement rather than replace in-person visits',
            },
            {
              id: 'debat-par-contre',
              phrase: 'Par contre, les médecins ne peuvent pas examiner physiquement le patient',
              context: 'Par contre, les médecins ne peuvent pas examiner physiquement le patient.',
              buildUp: [
                'le patient',
                'physiquement le patient',
                'examiner physiquement le patient',
                'ne peuvent pas examiner physiquement le patient',
                'les médecins ne peuvent pas examiner physiquement le patient',
                'par contre, les médecins ne peuvent pas examiner physiquement le patient',
              ],
              register: 'courant',
              meaning: 'Pour passer des avantages aux limites.',
              en: 'however, doctors cannot physically examine the patient',
            },
            {
              id: 'debat-autrement-dit',
              phrase: 'Autrement dit',
              context: 'Autrement dit, le diagnostic est délicat à distance.',
              buildUp: ['dit', 'ment dit', 'autrement dit'],
              register: 'courant',
              meaning: 'Pour réexpliquer ton idée plus simplement.',
              en: 'in other words',
            },
            {
              id: 'debat-ce-que-je-veux-dire',
              phrase: 'Ce que je veux dire, c’est que',
              context: 'Ce que je veux dire, c’est que tout le monde n’a pas le même accès.',
              buildUp: ['c’est que', 'veux dire, c’est que', 'ce que je veux dire, c’est que'],
              register: 'courant',
              meaning: 'Pour préciser ta pensée quand l’autre n’a pas bien compris.',
              en: 'what I mean is',
            },
            {
              id: 'debat-au-detriment',
              phrase: 'La praticité ne doit pas se faire au détriment de l’équité',
              context: 'Bien que la télémédecine soit une avancée majeure, la praticité ne doit pas se faire au détriment de l’équité.',
              buildUp: [
                'de l’équité',
                'au détriment de l’équité',
                'se faire au détriment de l’équité',
                'ne doit pas se faire au détriment de l’équité',
                'la praticité ne doit pas se faire au détriment de l’équité',
              ],
              register: 'courant',
              meaning: 'L’idée de ta conclusion : ce qui est pratique ne doit pas passer avant ce qui est juste.',
              en: 'convenience must not come at the expense of fairness',
            },
          ],
        },
        {
          kind: 'model',
          title: 'Partie B · Défi 1 : Ton plan en une minute',
          description: 'Lis et écoute le modèle deux fois.',
          markdown: `
            Le sujet, c’est la télémédecine. La question est : devrait-elle remplacer complètement les consultations en personne pour les problèmes de santé mineurs ?
            Je pense qu’elle ne devrait pas remplacer totalement les soins en personne. Je vais expliquer pourquoi.
            Pour commencer, je vais parler des avantages : le gain de temps et l’accessibilité.
            Par contre, il y a des limites : l’absence d’examen physique et la fracture numérique.
            En conclusion, la télémédecine doit compléter plutôt que remplacer les consultations en personne.
          `,
          task: 'Dis ton plan en une minute. Tu peux regarder le modèle. Enregistre-toi : à la fin du cours, tu vas comparer.',
          recordSeconds: 90,
        },
        {
          kind: 'model',
          title: 'Partie B · Défi 2 : Une idée, un exemple, un lien',
          description: 'Lis et écoute : voici un point du plan, développé en trois temps.',
          markdown: `
            ## L’idée
            Par contre, les médecins ne peuvent pas examiner physiquement le patient.
            ## L’exemple
            Par exemple, j’ai une bosse sur la peau. À la caméra, le médecin la voit, mais il ne peut pas la palper.
            ## Le lien avec ta position
            Autrement dit, le diagnostic est délicat à distance.
          `,
          task: `
            Fais la même chose avec l’accessibilité :
            * **L’idée :** La télémédecine est plus accessible.
            * **L’exemple :** Prenons l’exemple d’une personne âgée qui ___.
            * **Le lien :** Autrement dit, ___.
          `,
          recordSeconds: 45,
        },
        {
          kind: 'model',
          title: 'Partie B · Défi 3 : Les phrases, une par une',
          description: 'Lis et écoute le modèle complet. Tu fais ensuite les mêmes phrases, avec des trous.',
          markdown: `
            * La technologie progresse rapidement et transforme les soins de santé.
            * Je pense qu’elle ne devrait pas remplacer totalement les soins en personne. Je vais expliquer pourquoi.
            * Pour commencer, la télémédecine est pratique. Par exemple, j’ai une rougeur et je la montre à la caméra.
            * De plus, elle est accessible. Prenons l’exemple d’une personne âgée qui ne conduit pas.
            * Par contre, les médecins ne peuvent pas examiner physiquement le patient. Par exemple, ils ne peuvent pas palper une bosse.
            * De plus, tout le monde n’a pas le même accès aux technologies. Autrement dit, c’est compliqué pour certaines personnes.
            * En conclusion, la télémédecine doit compléter plutôt que remplacer les consultations en personne.
          `,
          task: `
            Complète à voix haute, une phrase à la fois :
            * La technologie ___.
            * Je pense qu’elle ___. Je vais expliquer pourquoi.
            * Pour commencer, la télémédecine est ___. Par exemple, ___.
            * De plus, elle est ___. Prenons l’exemple de ___.
            * Par contre, les médecins ___. Par exemple, ___.
            * De plus, tout le monde ___. Autrement dit, ___.
            * En conclusion, la télémédecine doit ___.
          `,
        },
        {
          kind: 'model',
          title: 'Partie B · Défi 4 : Tout assembler',
          description: 'Écoute encore le monologue complet. Affiche le texte si tu veux le lire en même temps.',
          markdown: MONOLOGUE,
          collapsed: true,
          task: 'Fais le monologue au complet, avec le plan du morceau 1 sous les yeux. Pas grave si ce n’est pas parfait ou si tu hésites : continue jusqu’à la fin.',
        },
        {
          kind: 'drills',
          title: 'Partie B · Étape 2 : Six phrases pour le débat',
          drills: [
            {
              id: 'debat-si-je-comprends-bien',
              phrase: 'Si je comprends bien, vous voulez dire que',
              context: 'Si je comprends bien, vous voulez dire que la vidéo suffit pour un petit problème ?',
              buildUp: ['dire que', 'vous voulez dire que', 'comprends bien, vous voulez dire que', 'si je comprends bien, vous voulez dire que'],
              register: 'courant',
              meaning: 'Pour redire la question avec tes mots et prouver que tu as compris.',
              en: 'if I understand correctly, you mean that',
            },
            {
              id: 'debat-voulez-dire-par',
              phrase: 'Qu’est-ce que vous voulez dire par',
              context: 'Qu’est-ce que vous voulez dire par « mineur » ?',
              buildUp: ['dire par', 'vous voulez dire par', 'qu’est-ce que vous voulez dire par'],
              register: 'courant',
              meaning: 'Pour demander le sens d’un mot avant de répondre.',
              en: 'what do you mean by',
            },
            {
              id: 'debat-point-de-vue',
              phrase: 'Je comprends votre point de vue, mais',
              context: 'Je comprends votre point de vue, mais je ne suis pas d’accord.',
              buildUp: ['de vue, mais', 'votre point de vue, mais', 'je comprends votre point de vue, mais'],
              register: 'courant',
              meaning: 'Pour montrer que tu as écouté avant de dire non.',
              en: 'I understand your point of view, but',
            },
            {
              id: 'debat-accord-partie',
              phrase: 'Je suis d’accord en partie',
              context: 'Je suis d’accord en partie, mais pas pour tous les problèmes.',
              buildUp: ['en partie', 'd’accord en partie', 'je suis d’accord en partie'],
              register: 'courant',
              meaning: 'Pour nuancer : une partie de l’idée est bonne, l’autre non.',
              en: 'I partly agree',
            },
            {
              id: 'debat-ajouterais',
              phrase: 'Je suis d’accord, et j’ajouterais que',
              context: 'Je suis d’accord, et j’ajouterais que le patient doit garder le choix.',
              buildUp: ['que', 'j’ajouterais que', 'et j’ajouterais que', 'je suis d’accord, et j’ajouterais que'],
              register: 'courant',
              meaning: 'Pour ajouter à l’idée de l’autre et ramener le débat vers ta position.',
              en: 'I agree, and I would add that',
            },
            {
              id: 'debat-on-pourrait-me-dire',
              phrase: 'On pourrait me dire que',
              context: 'On pourrait me dire que la vidéo fait gagner du temps.',
              buildUp: ['dire que', 'me dire que', 'pourrait me dire que', 'on pourrait me dire que'],
              register: 'courant',
              meaning: 'Pour jouer l’avocat du diable : tu donnes l’argument contraire, puis tu y réponds.',
              en: 'someone could tell me that',
            },
          ],
        },
        {
          kind: 'model',
          title: 'Partie B · Défi 5 : Reformuler seulement',
          description: 'Lis et écoute : Mikael ne répond pas encore. Il redit seulement la question.',
          markdown: `
            Évaluateur : La vidéo, c’est plus rapide, non ?
            Mikael : **Si je comprends bien, vous voulez dire que** la vidéo fait gagner du temps ?
            Évaluateur : Les personnes âgées peuvent demander de l’aide, non ?
            Mikael : **Si je comprends bien, vous voulez dire que** leur famille peut les aider ?
          `,
          task: 'Ton professeur te pose une question. Tu ne réponds pas : tu la redis avec « Si je comprends bien, vous voulez dire que… ». Faites-le trois fois.',
        },
        {
          kind: 'model',
          title: 'Partie B · Défi 6 : Les quatre gestes',
          description: 'Lis et écoute les quatre gestes sur une nouvelle question.',
          markdown: `
            Évaluateur : Les cliniques sont déjà pleines. Pourquoi ne pas tout faire par vidéo ?
            ## Geste 1 : reformuler
            Mikael : **Si je comprends bien, vous voulez dire que** la vidéo pourrait aider les cliniques ?
            Évaluateur : Oui.
            ## Geste 2 : clarifier
            Mikael : **Qu’est-ce que vous voulez dire par** « tout » ? Même les examens physiques ?
            Évaluateur : Non, seulement les problèmes mineurs.
            ## Geste 3 : répondre
            Mikael : **Je dirais que** la vidéo peut aider pour un suivi rapide. Par exemple, un patient peut poser une question sans se déplacer.
            ## Geste 4 : prendre position
            Mikael : **Je suis d’accord en partie,** mais la télémédecine doit compléter plutôt que remplacer les consultations en personne.
          `,
          task: 'Ton professeur te pose une question que tu n’as pas vue. Tu reformules, tu clarifies, tu réponds, puis tu prends position. Garde le modèle sous les yeux.',
        },
        {
          kind: 'model',
          title: 'Partie B · Défi 7 : Dire non poliment',
          description: 'Lis et écoute : Mikael commence toujours par montrer qu’il a compris.',
          markdown: `
            Évaluateur : Un médecin peut tout voir avec une bonne caméra.
            Mikael : **Je comprends votre point de vue, mais** une caméra ne permet pas de palper la peau.
            Évaluateur : Tout le monde a un téléphone aujourd’hui.
            Mikael : **Vous avez raison sur un point :** beaucoup de gens ont un téléphone. Mais tout le monde n’a pas les compétences numériques requises.
          `,
          task: 'Ton professeur dit quelque chose de contraire à ta position. Tu commences toujours par « Je comprends votre point de vue, mais… » ou « Vous avez raison sur un point : … ».',
        },
        {
          kind: 'model',
          title: 'Partie B · Défi 8 : Changer de côté',
          description: 'Lis et écoute : Mikael donne l’argument contraire, puis il y répond lui-même.',
          markdown: `
            **On pourrait me dire que** la télémédecine fait gagner du temps. **C’est vrai, mais** si le médecin doit revoir le patient en personne, on perd le temps gagné.
            **On pourrait me dire que** tout le monde a un téléphone. **C’est vrai, mais** remplir un dossier médical en ligne peut quand même être compliqué.
          `,
          task: `
            Fais la même chose avec un autre argument :
            * On pourrait me dire que ___.
            * C’est vrai, mais ___.
          `,
          recordSeconds: 45,
        },
        {
          kind: 'model',
          title: 'Partie B · Défi 9 : Le mini-débat',
          description: 'Écoute encore le débat en direct. Affiche le texte si tu veux le lire en même temps.',
          markdown: DEBAT_EN_DIRECT,
          collapsed: true,
          task: 'Trois minutes avec ton professeur. Tu peux garder tes phrases sous les yeux. Quand tu te perds : « Je reviens à mon idée principale : … »',
        },
        {
          kind: 'text',
          title: 'Bilan : ce que tu sais faire maintenant',
          paragraphs: [
            '**Réécoute ton enregistrement du défi 1,** puis refais ton plan en une minute, cette fois sans regarder le modèle. Note une chose qui est plus facile qu’au début du cours.',
            '**Tu connais la structure :** introduction, avantages, problèmes, conclusion. **Pour chaque question :** reformuler, clarifier, répondre, prendre position.',
            '**Cette semaine :** fais 3 phrases par jour avec les exercices guidés, puis écoute le monologue une fois. Passe en mode TA pour pratiquer les morceaux avec Gemini. Quand tu es prêt, fais la simulation complète ci-dessous avec le chronomètre.',
          ],
        },
      ],
      speaking: {
        id: '1.0-po',
        title: 'Production orale : La télémédecine',
        prepMinutes: 20,
        speakMinutes: 17,
        instructions: [
          'Format standard : 20 minutes de préparation, suivies d’un monologue de 5 à 7 minutes et d’un débat de 10 minutes avec l’évaluateur.',
          'Instructions d’évaluation : Mikael prépare une présentation orale basée sur un court énoncé, puis répond à des questions.',
          'Énoncé : « La télémédecine (les consultations médicales par vidéo) devrait remplacer les consultations en personne pour tous les problèmes de santé mineurs. »',
          'Exigences du monologue : Dégager la problématique de l’énoncé, formuler une opinion claire (pour, contre, ou nuancée), et la défendre avec des arguments logiques.',
          'Exigences du débat : Posez des questions exigeant que Mikael défende sa position.',
        ],
        followUps: [
          'Quelles sont les limites de cette technologie pour les patients qui ne possèdent pas les compétences informatiques requises ?',
          'Comment le médecin peut-il s’assurer qu’un problème en apparence mineur ne cache pas une affection plus grave sans examen physique ?',
          'La télémédecine ne risque-t-elle pas de déshumaniser la relation de soin, particulièrement pour les aînés ?',
          'Pensez-vous que les cliniques virtuelles privées menacent l’universalité du réseau de santé québécois ?',
          'Si vous étiez médecin, dans quelles situations refuseriez-vous catégoriquement une téléconsultation ?',
        ],
        checklist: [
          'J’ai dégagé la problématique centrale de l’énoncé dès mon introduction.',
          'J’ai formulé une prise de position claire (pour, contre ou nuancée).',
          'J’ai soutenu mon propos avec au moins deux arguments logiques accompagnés d’exemples concrets.',
          'Mon monologue a duré entre 5 et 7 minutes sans interruption.',
          'Pendant le débat de 10 minutes, j’ai défendu ma position avec sang-froid et nuance.',
          'J’ai employé des connecteurs variés (certes, néanmoins, par conséquent, en outre).',
          'J’ai reformulé au moins une question avant d’y répondre.',
          'J’ai montré que je comprenais l’autre point de vue avant de dire que je n’étais pas d’accord.',
        ],
      },
      teacherNotes: [
        'Plan du cours (60 min) : 25 min, Partie A : vous faites la démonstration, Mikael lit et écoute · 15 min, phrases du monologue et défis 1 à 4 · 15 min, phrases du débat et défis 5 à 9 · 5 min, bilan : il compare sa minute du défi 1 à une nouvelle minute, sans le modèle. La simulation complète de 37 min ne tient pas dans ce cours : elle vient après, avec Gemini ou dimanche prochain.',
        'Règle pour Mikael (A2) : jamais de production sans modèle. Chaque défi montre un modèle écrit et parlé juste avant la tâche. S’il bloque, revenez au modèle plutôt que de lui demander d’improviser.',
        'Le plan du morceau 1 est votre plan (plan-telemedecine.md), et le monologue le suit (monologue-telemedecine.md). Ces deux fichiers Markdown se modifient directement.',
        'La langue du plan dépasse le niveau A2 : bondées, tributaires, au détriment de, bien que + subjonctif. Traitez-les comme des blocs à répéter, pas comme de la grammaire à expliquer.',
        'Ajouts à ses notes : « une rougeur » pour l’exemple qui fonctionne en vidéo, « perdre une demi-journée » pour « just ask for advice », et « une personne âgée qui ne conduit pas ». Remplacez-les par ses propres exemples s’il en a de meilleurs.',
        'Dans les notes, « However = Par exemple » est une confusion à corriger : however = par contre.',
        'Point faible à exploiter : il présente les personnes âgées à la fois comme un avantage et comme un problème. L’audio « Deux questions, quatre gestes » lui montre comment transformer cette objection en argument pour les deux options.',
        'Les questions de la simulation restent cachées dans la démonstration : utilisez-les pour les défis 6 et 7. Pendant les défis, corrigez au plus deux erreurs à la fois, et seulement après sa réponse.',
        'Instructions d’évaluation : Mikael prépare une présentation orale basée sur un court énoncé, puis répond à des questions.',
        'Format standard : 20 minutes de préparation, suivies d’un monologue de 5 à 7 minutes et d’un débat de 10 minutes avec l’évaluateur.',
        'Exigences du monologue : Dégager la problématique de l’énoncé, formuler une opinion claire (pour, contre, ou nuancée), et la défendre avec des arguments logiques.',
        'Exigences du débat : Posez des questions exigeant que Mikael défende sa position (ex. : « Quelles sont les limites de cette technologie pour les patients qui ne possèdent pas les compétences informatiques requises ? »).',
        'Évaluer avec la grille officielle DELF B2 de production orale (notée sur 25).',
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: '1.1',
      moduleId: 'm1',
      title: 'Vocabulaire des professions médicales',
      skill: 'vocabulaire',
      week: 2,
      quizLabel: 'QCM + appariement',
      objectives: [
        'Nommer les principales professions de la santé au Québec',
        'Décrire le rôle de chaque professionnel en une phrase',
        'Comprendre les sigles du réseau : CLSC, GMF, IPS, CHSLD',
      ],
      sections: [
        {
          kind: 'text',
          title: 'Qui fait quoi à l’hôpital ?',
          paragraphs: [
            'Au Québec, le **médecin de famille** (ou omnipraticien) suit ses patients sur le long terme. Il travaille souvent dans un **GMF** (groupe de médecine de famille) ou un **CLSC** (centre local de services communautaires).',
            'Le **médecin spécialiste** (cardiologue, pédiatre, chirurgien…) intervient sur un problème précis, en général à la demande du médecin de famille.',
            'L’**infirmière praticienne spécialisée** (IPS) peut diagnostiquer et traiter certaines maladies courantes. Avec l’**infirmière** et l’**infirmière auxiliaire**, elles forment la plus grande équipe du réseau.',
            'Autour d’eux : le **pharmacien**, le **physiothérapeute**, l’**inhalothérapeute** (qui s’occupe de la respiration), le **préposé aux bénéficiaires** et l’**ambulancier paramédic**.',
          ],
        },
        {
          kind: 'vocab',
          title: 'Vocabulaire clé',
          items: [
            { fr: 'le médecin de famille / l’omnipraticien', en: 'family doctor / GP' },
            { fr: 'le / la cardiologue', en: 'cardiologist' },
            { fr: 'le / la pédiatre', en: 'pediatrician' },
            { fr: 'le chirurgien / la chirurgienne', en: 'surgeon' },
            { fr: 'l’infirmière praticienne spécialisée (IPS)', en: 'nurse practitioner' },
            { fr: 'le / la pharmacien(ne)', en: 'pharmacist' },
            { fr: 'l’inhalothérapeute', en: 'respiratory therapist' },
            { fr: 'le préposé aux bénéficiaires', en: 'orderly / patient-care attendant' },
            { fr: 'l’ambulancier paramédic', en: 'paramedic' },
            { fr: 'le / la résident(e)', en: 'medical resident' },
            { fr: 'l’externe', en: 'medical student in clinical rotation', note: 'Faux ami : pas « externe » au sens anglais !' },
            { fr: 'une ordonnance', en: 'a prescription', note: 'On ne dit pas « une prescription » pour le papier.' },
          ],
        },
        {
          kind: 'tip',
          text: 'Astuce : au Québec, on dit « une infirmière » même au masculin pour la profession (« un infirmier » existe aussi). Le mot « docteur » s’utilise surtout pour s’adresser à quelqu’un : « Bonjour, docteure Tremblay. »',
        },
      ],
      quiz: [
        {
          id: '1.1-q1',
          type: 'matching',
          prompt: 'Associe chaque professionnel à son rôle.',
          pairs: [
            { left: 'cardiologue', right: 'soigne les maladies du cœur' },
            { left: 'pédiatre', right: 'soigne les enfants' },
            { left: 'inhalothérapeute', right: 'aide les patients à respirer' },
            { left: 'pharmacien', right: 'prépare et explique les médicaments' },
          ],
        },
        {
          id: '1.1-q2',
          type: 'mcq',
          prompt: 'Que signifie « GMF » ?',
          options: [
            'Grand ministère de la France',
            'Groupe de médecine de famille',
            'Garde médicale fédérale',
            'Gestion des médicaments et formulaires',
          ],
          answer: 1,
        },
        {
          id: '1.1-q3',
          type: 'mcq',
          prompt: 'Quel document le médecin te donne-t-il pour obtenir un médicament à la pharmacie ?',
          options: ['une recette', 'une ordonnance', 'une facture', 'un permis'],
          answer: 1,
        },
        {
          id: '1.1-q4',
          type: 'mcq',
          prompt: 'Qui transporte un patient à l’hôpital en cas d’urgence ?',
          options: ['le préposé aux bénéficiaires', 'le pharmacien', 'l’ambulancier paramédic', 'le pédiatre'],
          answer: 2,
        },
        {
          id: '1.1-q5',
          type: 'mcq',
          prompt: 'Une IPS est :',
          options: [
            'une infirmière qui peut diagnostiquer et traiter certaines maladies',
            'une secrétaire médicale',
            'une étudiante en médecine',
            'une ambulancière',
          ],
          answer: 0,
        },
        {
          id: '1.1-q6',
          type: 'fill',
          text: 'Le médecin qui opère les patients est le ___.',
          answers: [['chirurgien', 'chirurgienne']],
        },
        {
          id: '1.1-q7',
          type: 'mcq',
          prompt: 'Un « externe » en médecine, c’est :',
          options: [
            'un médecin qui travaille hors de l’hôpital',
            'un étudiant en médecine en stage clinique',
            'un patient qui n’est pas hospitalisé',
            'un médecin étranger',
          ],
          answer: 1,
          explanation: 'Faux ami : en anglais on dirait « clerk » ou « medical student ». Un « intern » se dit plutôt « résident ».',
        },
      ],
      teacherNotes: [
        'Commencer par demander à l’élève quelle spécialité l’intéresse : réutiliser ce vocabulaire tout au long du module.',
        'Attention aux faux amis : externe / intern, prescription / ordonnance, médecine / médicament.',
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: '1.2',
      moduleId: 'm1',
      title: 'Écoute : reportage sur la pénurie de médecins',
      skill: 'CO',
      week: 3,
      quizLabel: 'QCM audio',
      objectives: [
        'Comprendre les informations principales d’un reportage radio',
        'Repérer les chiffres, les causes et les solutions proposées',
        'Réutiliser le vocabulaire : pénurie, médecin de famille, urgences, première ligne, CLSC',
      ],
      sections: [
        {
          kind: 'vocab',
          title: 'Avant d’écouter',
          items: [
            { fr: 'une pénurie', en: 'a shortage' },
            { fr: 'les soins de première ligne', en: 'primary care' },
            { fr: 'les urgences (débordent)', en: 'the ER (is overflowing)' },
            { fr: 'une liste d’attente', en: 'a waiting list' },
            { fr: 'prendre sa retraite', en: 'to retire' },
            { fr: 'un rendez-vous', en: 'an appointment' },
          ],
        },
        {
          kind: 'audio',
          title: 'Reportage : « Trouver un médecin de famille, mission impossible ? »',
          description:
            'Document d’entraînement rédigé pour ce cours, dans le style d’un reportage radio. Écoute-le deux fois avant de lire la transcription.',
          transcript: [
            'Bonjour et bienvenue à notre chronique santé. Ce matin, nous parlons d’un problème que beaucoup de familles québécoises connaissent bien : la difficulté de trouver un médecin de famille.',
            'Au Québec, des centaines de milliers de personnes sont inscrites sur la liste d’attente du guichet d’accès à un médecin de famille. Certaines attendent depuis plus de deux ans.',
            'Pourquoi cette pénurie ? D’abord, parce que beaucoup de médecins prennent leur retraite. Ensuite, parce que la population vieillit et a besoin de plus de soins. Enfin, de nombreux jeunes médecins choisissent une spécialité plutôt que la médecine familiale.',
            'Résultat : sans médecin de famille, beaucoup de patients vont directement aux urgences, même pour un simple mal de gorge. Les urgences débordent, et l’attente peut dépasser dix heures.',
            'Nous avons rencontré Julie, infirmière dans un CLSC de Montréal. « Les gens ont peur de ne pas être soignés. Pourtant, il existe d’autres solutions : les infirmières praticiennes, les pharmaciens, la ligne Info-Santé 811. »',
            'Le gouvernement promet de former plus de médecins de famille et de donner plus de responsabilités aux autres professionnels de la santé. Mais pour Julie, il faut surtout renforcer les soins de première ligne, c’est-à-dire les soins de proximité, près des gens.',
          ],
        },
        {
          kind: 'resources',
          title: 'Pour aller plus loin (contenu authentique)',
          links: [
            {
              label: 'Radio-Canada OHdio',
              url: 'https://ici.radio-canada.ca/ohdio',
              description: 'Cherche « médecin de famille » ou « urgences » et écoute un vrai reportage pendant ton trajet.',
            },
          ],
        },
      ],
      quiz: [
        {
          id: '1.2-q1',
          type: 'mcq',
          prompt: 'Quel est le sujet principal du reportage ?',
          options: [
            'La construction d’un nouvel hôpital',
            'La difficulté de trouver un médecin de famille',
            'Le salaire des infirmières',
            'Les vaccins contre la grippe',
          ],
          answer: 1,
        },
        {
          id: '1.2-q2',
          type: 'mcq',
          prompt: 'Depuis combien de temps certaines personnes attendent-elles ?',
          options: ['Deux semaines', 'Six mois', 'Plus de deux ans', 'Dix ans'],
          answer: 2,
        },
        {
          id: '1.2-q3',
          type: 'mcq',
          prompt: 'Laquelle de ces causes n’est PAS mentionnée ?',
          options: [
            'Les médecins prennent leur retraite',
            'La population vieillit',
            'Les jeunes médecins choisissent une spécialité',
            'Les médecins partent travailler aux États-Unis',
          ],
          answer: 3,
        },
        {
          id: '1.2-q4',
          type: 'mcq',
          prompt: 'Selon le reportage, que font beaucoup de patients sans médecin de famille ?',
          options: [
            'Ils restent à la maison',
            'Ils vont directement aux urgences',
            'Ils vont en Ontario',
            'Ils appellent leur député',
          ],
          answer: 1,
        },
        {
          id: '1.2-q5',
          type: 'mcq',
          prompt: 'Qui est Julie ?',
          options: [
            'Une patiente en attente',
            'Une ministre de la Santé',
            'Une infirmière dans un CLSC',
            'Une médecin à la retraite',
          ],
          answer: 2,
        },
        {
          id: '1.2-q6',
          type: 'mcq',
          prompt: 'Quelle solution Julie juge-t-elle la plus importante ?',
          options: [
            'Construire plus d’urgences',
            'Renforcer les soins de première ligne',
            'Augmenter le prix des consultations',
            'Fermer les CLSC',
          ],
          answer: 1,
        },
        {
          id: '1.2-q7',
          type: 'fill',
          text: 'Le numéro de la ligne Info-Santé est le ___.',
          answers: [['811', '8-1-1']],
        },
      ],
      teacherNotes: [
        'Faire écouter une première fois sans support, puis une deuxième fois avec les questions.',
        'Questions d’opinion à l’oral après le quiz : As-tu un médecin de famille ? Que penses-tu des urgences ?',
        'Si possible, compléter avec un vrai extrait de Radio-Canada OHdio sur le même sujet (3–4 min).',
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: '1.3',
      moduleId: 'm1',
      title: 'Lecture : les infirmières praticiennes spécialisées (IPS)',
      skill: 'CE',
      week: 5,
      quizLabel: 'Compréhension écrite style DELF',
      objectives: [
        'Comprendre un article informatif sur l’organisation des soins',
        'Distinguer les faits et les opinions',
        'Répondre à des questions Vrai/Faux avec justification',
      ],
      sections: [
        {
          kind: 'reading',
          title: 'Les IPS, un nouveau visage de la première ligne',
          source: 'Texte d’entraînement rédigé pour ce cours, dans le style d’un article de presse.',
          paragraphs: [
            'Dans une clinique de quartier de Laval, Sophie reçoit son premier patient de la journée à 8 h. Elle écoute ses symptômes, l’examine, pose un diagnostic et lui remet une ordonnance. Sophie n’est pas médecin : elle est infirmière praticienne spécialisée, ou IPS.',
            'Depuis une modification de la loi en 2020, les IPS du Québec peuvent diagnostiquer certaines maladies courantes, comme le diabète, l’hypertension ou l’asthme, sans attendre la confirmation d’un médecin. Elles peuvent aussi prescrire des examens et des médicaments, et assurer le suivi de patients atteints de maladies chroniques.',
            'Pour devenir IPS, il faut d’abord être infirmière, puis suivre une maîtrise universitaire et un long stage clinique. « C’est une formation exigeante, mais elle nous permet de prendre en charge les patients du début à la fin », explique Sophie.',
            'Pour le gouvernement, les IPS représentent une réponse concrète à la pénurie de médecins de famille. Certaines cliniques dirigées par des IPS accueillent même des patients qui n’ont pas de médecin.',
            'Toutefois, tout le monde n’est pas convaincu. Certains médecins craignent que les patients complexes ne reçoivent pas toujours les soins dont ils ont besoin. D’autres estiment au contraire que la collaboration entre médecins et IPS améliore la qualité des soins, puisque chacun se concentre sur ce qu’il fait le mieux.',
            'Une chose est sûre : le nombre d’IPS augmente chaque année, et leur rôle risque de devenir central dans le système de santé de demain.',
          ],
        },
        {
          kind: 'tip',
          text: 'Méthode DELF : lis d’abord les questions, puis cherche dans le texte les mots-clés ou leurs synonymes. Les réponses suivent l’ordre des paragraphes.',
        },
      ],
      quiz: [
        {
          id: '1.3-q1',
          type: 'mcq',
          prompt: 'Quel est le métier de Sophie ?',
          options: ['Médecin de famille', 'Pharmacienne', 'Infirmière praticienne spécialisée', 'Journaliste'],
          answer: 2,
        },
        {
          id: '1.3-q2',
          type: 'mcq',
          prompt: 'Vrai ou faux : depuis 2020, les IPS peuvent diagnostiquer certaines maladies sans confirmation d’un médecin.',
          options: ['Vrai', 'Faux'],
          answer: 0,
          explanation: 'Justification : « les IPS du Québec peuvent diagnostiquer certaines maladies courantes… sans attendre la confirmation d’un médecin ».',
        },
        {
          id: '1.3-q3',
          type: 'mcq',
          prompt: 'Quelle formation faut-il pour devenir IPS ?',
          options: [
            'Un diplôme d’études secondaires',
            'Être infirmière, puis faire une maîtrise et un stage clinique',
            'Le doctorat en médecine',
            'Une formation en ligne de six mois',
          ],
          answer: 1,
        },
        {
          id: '1.3-q4',
          type: 'mcq',
          prompt: 'Pour le gouvernement, les IPS sont…',
          options: [
            'un danger pour les patients',
            'une réponse à la pénurie de médecins de famille',
            'trop coûteuses',
            'une solution temporaire',
          ],
          answer: 1,
        },
        {
          id: '1.3-q5',
          type: 'mcq',
          prompt: 'Que craignent certains médecins ?',
          options: [
            'Que les IPS gagnent plus qu’eux',
            'Que les patients complexes ne reçoivent pas toujours les soins nécessaires',
            'Que les cliniques ferment',
            'Que les IPS quittent le Québec',
          ],
          answer: 1,
        },
        {
          id: '1.3-q6',
          type: 'mcq',
          prompt: 'Dans le 5ᵉ paragraphe, le mot « Toutefois » introduit…',
          options: ['une conséquence', 'une opposition', 'un exemple', 'une conclusion'],
          answer: 1,
        },
        {
          id: '1.3-q7',
          type: 'mcq',
          prompt: 'Quelle phrase résume le mieux la conclusion de l’article ?',
          options: [
            'Les IPS vont bientôt disparaître.',
            'Les IPS vont remplacer tous les médecins.',
            'Le rôle des IPS va probablement devenir de plus en plus important.',
            'Personne ne connaît les IPS.',
          ],
          answer: 2,
        },
        {
          id: '1.3-q8',
          type: 'mcq',
          prompt: 'Parmi ces phrases du texte, laquelle est une OPINION et non un fait ?',
          options: [
            'Le nombre d’IPS augmente chaque année.',
            'Pour devenir IPS, il faut suivre une maîtrise.',
            'La collaboration entre médecins et IPS améliore la qualité des soins.',
            'Sophie reçoit son premier patient à 8 h.',
          ],
          answer: 2,
          explanation: 'C’est ce qu’« estiment » certains médecins : une opinion, pas un fait vérifié.',
        },
      ],
      teacherNotes: [
        'Faire justifier oralement chaque réponse Vrai/Faux par une citation du texte, comme au DELF.',
        'Discussion : Est-ce qu’une IPS pourrait être ton premier contact avec le système de santé ? Pourquoi ?',
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: '1.4',
      moduleId: 'm1',
      title: 'Terminologie cardiaque de base',
      skill: 'vocabulaire',
      week: 7,
      quizLabel: 'Quiz médical',
      objectives: [
        'Nommer les parties du cœur et du système circulatoire',
        'Décrire des symptômes cardiaques simples',
        'Comprendre les examens courants (ECG, tension artérielle)',
      ],
      sections: [
        {
          kind: 'text',
          title: 'Le cœur, une pompe à quatre chambres',
          paragraphs: [
            'Le **cœur** est un muscle qui pompe le sang dans tout le corps. Il a quatre cavités : deux **oreillettes** en haut et deux **ventricules** en bas.',
            'Le sang pauvre en oxygène arrive par les **veines** dans l’oreillette droite, passe dans le ventricule droit, puis part vers les **poumons**. Le sang riche en oxygène revient dans l’oreillette gauche, passe dans le ventricule gauche et repart dans tout le corps par l’**aorte**, la plus grande **artère**.',
            'Les **valves** s’ouvrent et se ferment pour que le sang circule dans un seul sens. C’est leur fermeture qui produit le bruit « boum-boum » que l’on entend avec un **stéthoscope**.',
          ],
        },
        {
          kind: 'vocab',
          title: 'Vocabulaire du cardiologue',
          items: [
            { fr: 'le cœur', en: 'heart' },
            { fr: 'l’oreillette (f.) / le ventricule', en: 'atrium / ventricle' },
            { fr: 'l’artère (f.) / la veine', en: 'artery / vein' },
            { fr: 'l’aorte (f.)', en: 'aorta' },
            { fr: 'la valve', en: 'valve' },
            { fr: 'le pouls', en: 'pulse', note: 'Le « s » ne se prononce pas.' },
            { fr: 'la fréquence cardiaque', en: 'heart rate' },
            { fr: 'la tension (pression) artérielle', en: 'blood pressure' },
            { fr: 'l’infarctus / la crise cardiaque', en: 'heart attack' },
            { fr: 'l’AVC (accident vasculaire cérébral)', en: 'stroke' },
            { fr: 'l’électrocardiogramme (ECG)', en: 'electrocardiogram (ECG/EKG)' },
            { fr: 'une douleur thoracique', en: 'chest pain' },
            { fr: 'être essoufflé', en: 'to be short of breath' },
          ],
        },
        {
          kind: 'tip',
          text: 'Expressions courantes : « avoir le cœur sur la main » (être généreux), « avoir un coup de cœur » (adorer quelque chose), « de bon cœur » (volontiers).',
        },
      ],
      quiz: [
        {
          id: '1.4-q1',
          type: 'mcq',
          prompt: 'Combien de cavités le cœur a-t-il ?',
          options: ['Deux', 'Trois', 'Quatre', 'Six'],
          answer: 2,
        },
        {
          id: '1.4-q2',
          type: 'mcq',
          prompt: 'Quelle est la plus grande artère du corps ?',
          options: ['La veine cave', 'L’aorte', 'La carotide', 'Le ventricule'],
          answer: 1,
        },
        {
          id: '1.4-q3',
          type: 'matching',
          prompt: 'Associe chaque terme à sa définition.',
          pairs: [
            { left: 'le pouls', right: 'les battements que l’on sent au poignet' },
            { left: 'l’ECG', right: 'l’examen qui enregistre l’activité électrique du cœur' },
            { left: 'l’infarctus', right: 'la crise cardiaque' },
            { left: 'les valves', right: 'elles font circuler le sang dans un seul sens' },
          ],
        },
        {
          id: '1.4-q4',
          type: 'mcq',
          prompt: 'Où va le sang qui sort du ventricule droit ?',
          options: ['Vers le cerveau', 'Vers les poumons', 'Vers les jambes', 'Vers l’aorte'],
          answer: 1,
        },
        {
          id: '1.4-q5',
          type: 'fill',
          text: 'Le médecin écoute le cœur avec un ___.',
          answers: [['stéthoscope']],
        },
        {
          id: '1.4-q6',
          type: 'mcq',
          prompt: 'Un patient dit : « J’ai mal à la poitrine et je suis essoufflé. » Il décrit…',
          options: [
            'une douleur thoracique et un manque de souffle',
            'un mal de tête et de la fièvre',
            'une douleur au dos',
            'une allergie',
          ],
          answer: 0,
        },
        {
          id: '1.4-q7',
          type: 'mcq',
          prompt: 'Que veut dire « avoir le cœur sur la main » ?',
          options: ['Être malade', 'Être généreux', 'Être amoureux', 'Être nerveux'],
          answer: 1,
        },
      ],
      teacherNotes: [
        'Utiliser un schéma du cœur (manuel de biologie) et faire décrire le trajet du sang à voix haute.',
        'Lien avec la biologie au secondaire : l’élève connaît déjà les concepts en anglais, il doit seulement les « transférer ».',
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: '1.5',
      moduleId: 'm1',
      title: 'Production écrite : lettre de motivation Med-P',
      skill: 'PE',
      week: 12,
      quizLabel: 'Grille B2',
      objectives: [
        'Rédiger une lettre formelle de 250 mots ou plus',
        'Présenter son parcours et ses motivations de façon convaincante',
        'Utiliser le registre soutenu et les formules de politesse',
      ],
      sections: [
        {
          kind: 'text',
          title: 'La structure d’une lettre formelle',
          paragraphs: [
            '**En-tête** : tes coordonnées, la date (« Montréal, le 15 janvier 2027 »), le destinataire et l’objet (« Objet : Candidature au programme Med-P »).',
            '**Formule d’appel** : « Madame, Monsieur, » (jamais « Cher ami »).',
            '**Introduction** : qui tu es et pourquoi tu écris.',
            '**Développement** (2–3 paragraphes) : ton parcours (études, bénévolat, emploi), tes qualités illustrées par des exemples, ta motivation pour la médecine.',
            '**Conclusion** : ta disponibilité pour une entrevue et la formule finale : « Je vous prie d’agréer, Madame, Monsieur, l’expression de mes salutations distinguées. »',
          ],
        },
        {
          kind: 'vocab',
          title: 'Expressions utiles',
          items: [
            { fr: 'Je me permets de vous écrire afin de…', en: 'I am writing to…' },
            { fr: 'Passionné(e) par les sciences depuis mon enfance, …' },
            { fr: 'Mon expérience de bénévole m’a permis de…' },
            { fr: 'Je suis convaincu(e) que…' },
            { fr: 'Je souhaiterais contribuer à…' },
            { fr: 'Je reste à votre disposition pour une entrevue.' },
          ],
        },
      ],
      writing: {
        id: '1.5-pe',
        title: 'Lettre de motivation',
        genre: 'Lettre formelle',
        minWords: 250,
        instructions: [
          'Tu es élève au cégep et tu présentes ta candidature au programme préparatoire à la médecine (Med-P) de l’Université McGill.',
          'Rédige une lettre de motivation adressée au comité d’admission. Présente ton parcours, tes expériences (bénévolat, emploi, études) et explique pourquoi tu veux devenir médecin au Québec. Montre aussi pourquoi le français est important pour soigner les patients québécois.',
        ],
        checklist: [
          'J’ai mis la date, l’objet et une formule d’appel formelle.',
          'J’ai au moins trois paragraphes avec des idées différentes.',
          'J’ai donné des exemples concrets de mes expériences.',
          'J’ai utilisé au moins quatre connecteurs (de plus, cependant, par conséquent…).',
          'J’ai utilisé au moins un subjonctif et un conditionnel.',
          'J’ai terminé par une formule de politesse complète.',
          'Mon texte a au moins 250 mots.',
        ],
      },
      teacherNotes: [
        'Corriger avec la grille PE : souligner deux forces et trois priorités, pas toutes les erreurs.',
        'Faire réécrire la lettre une seconde fois après la correction : c’est la réécriture qui fait progresser.',
        'Cette lettre est réutilisable pour la vraie candidature de bénévole au MUHC (leçon 3.2).',
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: '1.6',
      moduleId: 'm1',
      title: 'Oral : « Quel avenir pour la médecine familiale au Québec ? »',
      skill: 'PO',
      week: 15,
      quizLabel: 'Grille exposé',
      objectives: [
        'Présenter une problématique à partir d’un court document',
        'Défendre un point de vue en 2 ou 3 arguments organisés',
        'Répondre aux objections pendant le débat',
      ],
      sections: [
        {
          kind: 'reading',
          title: 'Document déclencheur',
          source: 'Texte d’entraînement rédigé pour ce cours.',
          paragraphs: [
            'De moins en moins d’étudiants en médecine choisissent la médecine familiale. Ils lui préfèrent les spécialités, jugées plus prestigieuses et parfois mieux rémunérées. Pendant ce temps, des centaines de milliers de Québécois n’ont pas de médecin de famille. Certains proposent d’obliger les jeunes médecins à pratiquer quelques années en médecine familiale, en particulier dans les régions éloignées. D’autres préfèrent miser sur le travail d’équipe avec les infirmières praticiennes et les pharmaciens.',
          ],
        },
        {
          kind: 'text',
          title: 'Structure de l’exposé (5 à 7 minutes)',
          paragraphs: [
            '**Introduction** : présente le document en une phrase, puis pose la problématique (« Faut-il obliger les jeunes médecins à pratiquer en médecine familiale ? »). Annonce ton plan.',
            '**Partie 1** : premier argument + exemple.',
            '**Partie 2** : deuxième argument (ou argument opposé) + exemple.',
            '**Conclusion** : ta position nuancée, et une ouverture (« Et si la solution était aussi… »).',
          ],
        },
      ],
      speaking: {
        id: '1.6-po',
        title: 'Exposé et débat',
        prepMinutes: 30,
        speakMinutes: 20,
        instructions: [
          'Lis le document déclencheur. Dégage le problème qu’il soulève et présente ton opinion de façon argumentée.',
          'Ton exposé dure de 5 à 7 minutes. Ensuite, l’examinateur (ton professeur ou Gemini) débat avec toi pendant 10 à 13 minutes.',
        ],
        followUps: [
          'Obliger les médecins à travailler en région, n’est-ce pas une atteinte à leur liberté ?',
          'Les infirmières praticiennes peuvent-elles vraiment remplacer un médecin de famille ?',
          'Toi, choisirais-tu la médecine familiale ou une spécialité ? Pourquoi ?',
          'Le problème ne vient-il pas plutôt du nombre de places dans les facultés de médecine ?',
        ],
        checklist: [
          'J’ai présenté le document et formulé une problématique.',
          'J’ai annoncé mon plan.',
          'J’ai donné au moins deux arguments avec des exemples.',
          'J’ai utilisé des connecteurs pour passer d’une idée à l’autre.',
          'J’ai conclu avec une position nuancée.',
          'Pendant le débat, j’ai défendu mon point de vue avec « Je comprends votre point de vue, mais… ».',
        ],
      },
      teacherNotes: [
        'Chronométrer la préparation (30 min) et l’exposé : l’élève doit apprendre à parler 5 minutes sans lire.',
        'Pendant le débat, jouer l’avocat du diable : contredire poliment pour forcer l’élève à nuancer.',
        'Évaluer avec la grille PO et donner une note sur 25.',
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: '1.7',
      moduleId: 'm1',
      title: 'Écoute : podcast sur l’intelligence artificielle en médecine',
      skill: 'CO',
      week: 18,
      quizLabel: 'QCM + vrai/faux',
      objectives: [
        'Comprendre une discussion entre deux interlocuteurs',
        'Identifier les avantages et les risques présentés',
        'Distinguer l’opinion de chaque intervenant',
      ],
      sections: [
        {
          kind: 'vocab',
          title: 'Avant d’écouter',
          items: [
            { fr: 'l’intelligence artificielle (IA)', en: 'artificial intelligence (AI)' },
            { fr: 'un algorithme', en: 'an algorithm' },
            { fr: 'une radiographie / une image médicale', en: 'an X-ray / a medical image' },
            { fr: 'dépister une maladie', en: 'to screen for a disease' },
            { fr: 'la confidentialité des données', en: 'data privacy' },
            { fr: 'un outil d’aide à la décision', en: 'a decision-support tool' },
          ],
        },
        {
          kind: 'audio',
          title: 'Podcast : « Le médecin de demain aura-t-il un assistant numérique ? »',
          description: 'Document d’entraînement rédigé pour ce cours : une animatrice reçoit une chercheuse en santé numérique.',
          transcript: [
            'Animatrice : Bonjour à toutes et à tous. Aujourd’hui, nous parlons d’intelligence artificielle à l’hôpital. Mon invitée est chercheuse en santé numérique. Bonjour !',
            'Chercheuse : Bonjour, merci de m’accueillir.',
            'Animatrice : Concrètement, à quoi sert l’IA dans un hôpital aujourd’hui ?',
            'Chercheuse : Elle sert surtout à analyser des images médicales. Par exemple, un algorithme peut examiner des milliers de radiographies des poumons et signaler celles qui présentent une anomalie. Le radiologiste vérifie ensuite. On gagne du temps, et on peut dépister certaines maladies plus tôt.',
            'Animatrice : Donc, l’IA remplace le médecin ?',
            'Chercheuse : Non, pas du tout. C’est un outil d’aide à la décision. La machine propose, mais c’est le médecin qui décide et qui parle au patient. L’empathie, l’écoute, l’explication d’un diagnostic difficile : ça, aucun algorithme ne peut le faire.',
            'Animatrice : Il y a aussi des inquiétudes, non ?',
            'Chercheuse : Oui, et elles sont légitimes. D’abord, la confidentialité des données : ces systèmes ont besoin de beaucoup d’informations sur les patients. Ensuite, les biais : si un algorithme a appris surtout avec des données de patients d’un seul groupe, il peut se tromper plus souvent avec les autres.',
            'Animatrice : Que conseilleriez-vous à un jeune qui veut devenir médecin ?',
            'Chercheuse : D’apprendre à utiliser ces outils avec un esprit critique. Le médecin de demain devra comprendre la technologie, mais surtout rester profondément humain.',
          ],
        },
      ],
      quiz: [
        {
          id: '1.7-q1',
          type: 'mcq',
          prompt: 'Quelle est la profession de l’invitée ?',
          options: ['Radiologiste', 'Chercheuse en santé numérique', 'Ministre de la Santé', 'Informaticienne dans une banque'],
          answer: 1,
        },
        {
          id: '1.7-q2',
          type: 'mcq',
          prompt: 'Selon l’invitée, à quoi sert surtout l’IA à l’hôpital aujourd’hui ?',
          options: [
            'À opérer les patients',
            'À analyser des images médicales',
            'À remplacer les infirmières',
            'À prendre les rendez-vous',
          ],
          answer: 1,
        },
        {
          id: '1.7-q3',
          type: 'mcq',
          prompt: 'Vrai ou faux : selon l’invitée, l’IA va bientôt remplacer les médecins.',
          options: ['Vrai', 'Faux'],
          answer: 1,
          explanation: 'Elle dit : « Non, pas du tout. C’est un outil d’aide à la décision. »',
        },
        {
          id: '1.7-q4',
          type: 'mcq',
          prompt: 'Vrai ou faux : c’est le médecin qui prend la décision finale.',
          options: ['Vrai', 'Faux'],
          answer: 0,
          explanation: '« La machine propose, mais c’est le médecin qui décide. »',
        },
        {
          id: '1.7-q5',
          type: 'mcq',
          prompt: 'Quelles sont les deux inquiétudes mentionnées ?',
          options: [
            'Le prix et la vitesse',
            'La confidentialité des données et les biais',
            'Le bruit et la chaleur des machines',
            'Le manque d’électricité et les pannes',
          ],
          answer: 1,
        },
        {
          id: '1.7-q6',
          type: 'mcq',
          prompt: 'Qu’est-ce qu’un « biais », d’après l’exemple donné ?',
          options: [
            'Une panne d’ordinateur',
            'Un algorithme qui se trompe plus souvent avec certains groupes de patients',
            'Un médecin qui refuse la technologie',
            'Un virus informatique',
          ],
          answer: 1,
        },
        {
          id: '1.7-q7',
          type: 'mcq',
          prompt: 'Quel conseil l’invitée donne-t-elle aux futurs médecins ?',
          options: [
            'Apprendre la programmation à temps plein',
            'Éviter la technologie',
            'Utiliser ces outils avec un esprit critique et rester humain',
            'Devenir chercheur plutôt que médecin',
          ],
          answer: 2,
        },
      ],
      teacherNotes: [
        'Le sujet IA + médecine est un thème fréquent au DELF B2 : préparer une liste d’arguments pour/contre réutilisable à l’oral.',
        'Prolongement : l’élève écoute un épisode des « Années lumière » sur la santé numérique et le résume en 5 phrases.',
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: '1.8',
      moduleId: 'm1',
      title: 'Lecture : médecine privée ou publique ?',
      skill: 'CE',
      week: 21,
      quizLabel: 'Analyse d’argumentation',
      objectives: [
        'Identifier la thèse et les arguments d’un texte argumentatif',
        'Repérer les procédés de l’argumentation (exemple, concession, réfutation)',
        'Comprendre le point de vue de l’auteur',
      ],
      sections: [
        {
          kind: 'reading',
          title: 'Tribune : « Le privé n’est pas la solution miracle »',
          source: 'Texte d’entraînement rédigé pour ce cours, dans le style d’une lettre d’opinion.',
          paragraphs: [
            'Chaque fois que les urgences débordent, la même idée revient : il faudrait laisser plus de place à la médecine privée. Les patients qui le peuvent paieraient pour être soignés plus vite, ce qui libérerait le système public pour les autres. L’idée est séduisante. Elle est pourtant, à mon avis, une fausse bonne idée.',
            'Certes, les cliniques privées offrent souvent des délais plus courts. Il serait malhonnête de le nier : pour une personne qui attend une opération depuis des mois, payer peut sembler la seule option raisonnable.',
            'Mais d’où viennent les médecins des cliniques privées ? Ils ne tombent pas du ciel : ce sont, pour la plupart, des médecins formés dans nos universités publiques, avec l’argent public, qui quittent le réseau public. Chaque heure qu’ils passent au privé est une heure de moins pour les patients du public. Le privé ne crée donc pas de nouveaux soins ; il les déplace vers ceux qui peuvent payer.',
            'De plus, un système à deux vitesses menace un principe auquel les Québécois tiennent : l’accès aux soins selon les besoins, et non selon le portefeuille. Un adolescent d’une famille modeste devrait avoir les mêmes chances d’être soigné rapidement qu’un adolescent d’une famille aisée.',
            'Plutôt que de développer le privé, renforçons ce qui fonctionne : les équipes de première ligne, le rôle élargi des infirmières praticiennes et des pharmaciens, et une meilleure organisation des blocs opératoires. Ces solutions sont moins spectaculaires, mais elles profitent à tout le monde.',
          ],
        },
      ],
      quiz: [
        {
          id: '1.8-q1',
          type: 'mcq',
          prompt: 'Quelle est la thèse de l’auteur ?',
          options: [
            'Il faut développer la médecine privée.',
            'La médecine privée n’est pas une bonne solution aux problèmes du système de santé.',
            'Les urgences fonctionnent bien.',
            'Les médecins devraient être mieux payés.',
          ],
          answer: 1,
        },
        {
          id: '1.8-q2',
          type: 'mcq',
          prompt: 'Dans le 2ᵉ paragraphe, que fait l’auteur avec « Certes… » ?',
          options: [
            'Il donne un exemple',
            'Il reconnaît un avantage du point de vue opposé (concession)',
            'Il conclut son texte',
            'Il change de sujet',
          ],
          answer: 1,
        },
        {
          id: '1.8-q3',
          type: 'mcq',
          prompt: 'Selon l’auteur, pourquoi le privé « ne crée pas de nouveaux soins » ?',
          options: [
            'Parce que les cliniques privées sont trop petites',
            'Parce que les médecins du privé viennent du réseau public',
            'Parce que les patients n’aiment pas le privé',
            'Parce que le privé est interdit',
          ],
          answer: 1,
        },
        {
          id: '1.8-q4',
          type: 'mcq',
          prompt: 'Que signifie l’expression « un système à deux vitesses » ?',
          options: [
            'Un système où l’on soigne plus vite ceux qui peuvent payer',
            'Un système avec deux hôpitaux par ville',
            'Un système très rapide',
            'Un système qui change deux fois par an',
          ],
          answer: 0,
        },
        {
          id: '1.8-q5',
          type: 'mcq',
          prompt: '« Ils ne tombent pas du ciel » signifie que les médecins…',
          options: [
            'viennent de l’étranger',
            'ont une origine précise : ils sont formés dans le système public',
            'sont très chanceux',
            'travaillent en avion',
          ],
          answer: 1,
        },
        {
          id: '1.8-q6',
          type: 'mcq',
          prompt: 'Quel principe l’auteur défend-il dans le 4ᵉ paragraphe ?',
          options: [
            'La liberté des médecins',
            'L’accès aux soins selon les besoins et non selon l’argent',
            'La baisse des impôts',
            'La construction de nouveaux hôpitaux',
          ],
          answer: 1,
        },
        {
          id: '1.8-q7',
          type: 'mcq',
          prompt: 'Quelles solutions l’auteur propose-t-il en conclusion ?',
          options: [
            'Fermer les cliniques privées',
            'Renforcer la première ligne et mieux organiser les blocs opératoires',
            'Importer des médecins',
            'Faire payer tous les patients',
          ],
          answer: 1,
        },
        {
          id: '1.8-q8',
          type: 'matching',
          prompt: 'Associe chaque passage au procédé argumentatif utilisé.',
          pairs: [
            { left: '« Certes, les cliniques privées offrent des délais plus courts. »', right: 'Concession' },
            { left: '« Mais d’où viennent les médecins des cliniques privées ? »', right: 'Question rhétorique' },
            { left: '« Un adolescent d’une famille modeste devrait avoir les mêmes chances… »', right: 'Exemple' },
            { left: '« Plutôt que de développer le privé, renforçons… »', right: 'Proposition de solution' },
          ],
        },
      ],
      teacherNotes: [
        'Ce texte modèle sert aussi pour la production écrite : faire repérer la structure thèse → concession → réfutation → solution.',
        'Débat en classe : l’élève défend la position inverse de l’auteur pendant 3 minutes.',
      ],
    },
  ],
}
