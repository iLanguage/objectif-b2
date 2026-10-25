import { GuideLayout } from '../guides/GuideLayout'
import { GRILLES, grilleMax, type Grille } from '../data/grilles-delf'
import { MARIANOPOLIS_MINIMUMS, MARIANOPOLIS_TOTAL, SKILL_LABELS } from '../lib/scoring'

function GrilleTable({ grille }: { grille: Grille }) {
  return (
    <section aria-labelledby={`grille-${grille.skill}`} className="card overflow-x-auto">
      <h2 id={`grille-${grille.skill}`} className="text-2xl font-bold">
        {grille.title} <span className="font-normal text-slate-600">(/{grilleMax(grille)})</span>
      </h2>
      {grille.groups.map((g) => (
        <table key={g.title} className="mt-4 w-full min-w-[32rem] text-left">
          <caption className="text-left font-semibold text-slate-800">{g.title}</caption>
          <thead>
            <tr className="border-b border-slate-300 text-sm text-slate-600">
              <th scope="col" className="py-2 pr-3">Critère</th>
              <th scope="col" className="py-2 pr-3">Ce qu’on évalue</th>
              <th scope="col" className="py-2">Points</th>
            </tr>
          </thead>
          <tbody>
            {g.criteria.map((c) => (
              <tr key={c.id} className="border-b border-slate-100 align-top">
                <th scope="row" className="py-2 pr-3 font-semibold">
                  {c.label}
                </th>
                <td className="py-2 pr-3">{c.descriptor}</td>
                <td className="py-2">0 à {c.max.toLocaleString('fr-CA')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ))}
    </section>
  )
}

export function GrillesPage() {
  return (
    <GuideLayout
      title="Grilles d’évaluation DELF B2"
      intro={
        <>
          <p>
            Les productions sont notées sur 25 par paliers de 0,5 point. En mode Professeur, ces grilles apparaissent sous chaque
            production écrite ou orale et la note est enregistrée dans la progression de l’élève.
          </p>
          <p className="mt-2 text-base">
            Source : grilles de France Éducation international. Vérifiez la version la plus récente avant l’examen officiel.
          </p>
        </>
      }
    >
      <section aria-labelledby="seuils" className="card">
        <h2 id="seuils" className="text-2xl font-bold">
          Seuils à atteindre
        </h2>
        <ul className="mt-2 list-disc space-y-1 pl-6">
          {(Object.keys(MARIANOPOLIS_MINIMUMS) as (keyof typeof MARIANOPOLIS_MINIMUMS)[]).map((s) => (
            <li key={s}>
              {SKILL_LABELS[s]} : au moins <strong>{MARIANOPOLIS_MINIMUMS[s]}/25</strong>
            </li>
          ))}
          <li>
            Total : au moins <strong>{MARIANOPOLIS_TOTAL}/100</strong>. Une note sous 5/25 dans une épreuve est éliminatoire.
          </li>
        </ul>
      </section>
      <GrilleTable grille={GRILLES.PE} />
      <GrilleTable grille={GRILLES.PO} />
    </GuideLayout>
  )
}
