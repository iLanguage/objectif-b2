import { GuideLayout, GuideSection } from './GuideLayout'

const FICHES: { id: string; title: string; items: string[] }[] = [
  {
    id: 'deroulement',
    title: 'Fiche 1 — Le déroulement de l’épreuve',
    items: [
      'Tu tires un court document (article, opinion) qui soulève un problème de société.',
      '30 minutes de préparation : tu ne peux pas rédiger tout ton exposé, seulement des notes.',
      '20 minutes de passage : un exposé de 5 à 7 minutes (monologue), puis un débat avec l’examinateur.',
      'L’examinateur ne cherche pas la « bonne » opinion : il évalue ta capacité à argumenter et à nuancer.',
    ],
  },
  {
    id: 'preparation',
    title: 'Fiche 2 — Utiliser les 30 minutes de préparation',
    items: [
      '5 min : lis le document deux fois et souligne le thème et les mots-clés.',
      '5 min : formule une problématique sous forme de question (« Faut-il… ? », « Dans quelle mesure… ? »).',
      '15 min : trouve 2 ou 3 arguments, chacun avec un exemple concret (ton expérience, le Québec, l’actualité).',
      '5 min : écris ton introduction et ta conclusion en entier — ce sont les phrases que tu diras sans hésiter.',
    ],
  },
  {
    id: 'structure',
    title: 'Fiche 3 — La structure de l’exposé',
    items: [
      'Introduction : « Le document que j’ai choisi, extrait de…, traite de… » + problématique + annonce du plan.',
      'Partie 1 : « Tout d’abord, … Par exemple, … »',
      'Partie 2 : « Cependant, … En effet, … »',
      'Partie 3 (facultative) : « Enfin, … »',
      'Conclusion : « Pour conclure, je pense que… » + une ouverture (« Et si… ? »).',
    ],
  },
  {
    id: 'expressions',
    title: 'Fiche 4 — Expressions qui rapportent des points',
    items: [
      'Donner son opinion : à mon avis, selon moi, je suis convaincu(e) que, il me semble que…',
      'Nuancer : dans une certaine mesure, il faut toutefois reconnaître que, c’est vrai en partie, mais…',
      'Concéder : certes…, mais… ; bien que + subjonctif ; il est indéniable que…',
      'Illustrer : prenons l’exemple de…, c’est le cas notamment de…, comme le montre…',
      'Conclure : en somme, tout bien considéré, pour toutes ces raisons…',
    ],
  },
  {
    id: 'debat',
    title: 'Fiche 5 — Réussir le débat',
    items: [
      'Gagner du temps poliment : « C’est une question intéressante… Laissez-moi réfléchir. »',
      'Reformuler la question pour vérifier : « Si je comprends bien, vous voulez dire que… ? »',
      'Réfuter sans agresser : « Je comprends votre point de vue, mais je ne suis pas tout à fait d’accord, car… »',
      'Ne change pas complètement d’avis : précise et nuance ta position.',
      'Si tu ne connais pas un mot, contourne-le : « la chose qui sert à… », « une personne qui… ».',
    ],
  },
  {
    id: 'erreurs',
    title: 'Fiche 6 — Les erreurs à éviter',
    items: [
      'Lire ses notes : regarde l’examinateur, tes notes ne sont qu’un aide-mémoire.',
      'Résumer le document au lieu de donner son opinion.',
      'Parler moins de 5 minutes : entraîne-toi avec le chronomètre du site.',
      'Passer à l’anglais : même un mot. Utilise une périphrase.',
      'Oublier le vouvoiement avec l’examinateur.',
    ],
  },
]

export function GuideOral() {
  return (
    <GuideLayout
      title="Guide de l’oral : structurer un exposé B2"
      intro={
        <p>
          La production orale dure 20 minutes, après 30 minutes de préparation. Ces six fiches résument la méthode ; entraîne-toi avec les
          leçons 1.6, 2.6, 3.3, 4.4 et les examens blancs, devant ton professeur ou avec Gemini Live.
        </p>
      }
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {FICHES.map((f) => (
          <GuideSection key={f.id} id={f.id} title={f.title}>
            <ul className="list-disc space-y-2 pl-6">
              {f.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </GuideSection>
        ))}
      </div>
    </GuideLayout>
  )
}
