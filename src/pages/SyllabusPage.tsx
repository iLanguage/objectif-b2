import { GuideLayout } from '../guides/GuideLayout'
import { MILESTONES, PHASES, TYPICAL_WEEK, allWeeks, formatDate, weekNumber } from '../data/syllabus'
import { WeekPlanView } from '../components/WeekPlanView'

function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const rest = minutes % 60
  return `${Math.floor(minutes / 60)} h${rest ? ` ${rest}` : ''}`
}

export function SyllabusPage({ today = new Date() }: { today?: Date }) {
  const current = weekNumber(today)
  return (
    <GuideLayout
      title="Syllabus : 27 semaines, de A2 à B2"
      intro={
        <p>
          Chaque semaine combine 3 à 4 thèmes en parallèle : un bloc de grammaire du Module 0 en fil conducteur, des leçons thématiques et
          de l’immersion autonome. On ne reste jamais bloqué sur un seul sujet.
        </p>
      }
    >
      <section aria-labelledby="phases" className="card overflow-x-auto">
        <h2 id="phases" className="text-2xl font-bold">
          Les phases
        </h2>
        <table className="mt-3 w-full min-w-[36rem] text-left">
          <caption className="sr-only">Phases du parcours</caption>
          <thead>
            <tr className="border-b border-slate-300 text-sm text-slate-600">
              <th scope="col" className="py-2 pr-3">Phase</th>
              <th scope="col" className="py-2 pr-3">Semaines</th>
              <th scope="col" className="py-2 pr-3">Niveau</th>
              <th scope="col" className="py-2">Priorités</th>
            </tr>
          </thead>
          <tbody>
            {PHASES.map((p) => (
              <tr key={p.id} className="border-b border-slate-100 align-top">
                <th scope="row" className="py-2 pr-3 font-semibold">
                  {p.id}. {p.title}
                </th>
                <td className="py-2 pr-3">
                  {p.weeks[0]}–{p.weeks[1]}
                </td>
                <td className="py-2 pr-3">{p.level}</td>
                <td className="py-2">{p.focus}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h3 className="mt-6 font-bold">Échéances</h3>
        <ul className="mt-1 list-disc pl-6">
          {MILESTONES.map((m) => (
            <li key={m.label}>
              {m.label} : {formatDate(new Date(`${m.date}T12:00:00`))}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="semaine-type" className="card overflow-x-auto">
        <h2 id="semaine-type" className="text-2xl font-bold">
          Une semaine type (Phase 2)
        </h2>
        <table className="mt-3 w-full min-w-[40rem] text-left">
          <caption className="sr-only">Exemple de semaine type</caption>
          <thead>
            <tr className="border-b border-slate-300 text-sm text-slate-600">
              <th scope="col" className="py-2 pr-3">Jour</th>
              <th scope="col" className="py-2 pr-3">Durée</th>
              <th scope="col" className="py-2 pr-3">Activité</th>
              <th scope="col" className="py-2 pr-3">Thème</th>
              <th scope="col" className="py-2">Mode</th>
            </tr>
          </thead>
          <tbody>
            {TYPICAL_WEEK.map((d) => (
              <tr key={d.day} className="border-b border-slate-100">
                <th scope="row" className="py-2 pr-3 font-semibold">
                  {d.day} <span className="font-normal text-slate-600">({d.where.toLowerCase()})</span>
                </th>
                <td className="py-2 pr-3">{formatMinutes(d.minutes)}</td>
                <td className="py-2 pr-3">{d.activity}</td>
                <td className="py-2 pr-3">{d.theme}</td>
                <td className="py-2">{d.mode}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section aria-labelledby="calendrier" className="space-y-3">
        <h2 id="calendrier" className="text-2xl font-bold">
          Semaine par semaine
        </h2>
        <ol className="grid gap-4 md:grid-cols-2">
          {allWeeks().map((plan) => (
            <li
              key={plan.week}
              className={`card ${plan.week === current ? 'border-2 border-blue-700' : ''}`}
              aria-current={plan.week === current ? 'date' : undefined}
            >
              <WeekPlanView plan={plan} />
            </li>
          ))}
        </ol>
      </section>
    </GuideLayout>
  )
}
