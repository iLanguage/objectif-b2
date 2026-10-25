import { useSearchParams, Link } from 'react-router-dom'
import { GuideLayout } from '../guides/GuideLayout'
import {
  ALL_WEEKLY_MATERIALS,
  getWeekMaterials,
  type DailyScheduleItem,
} from '../data/weeklyMaterials'
import {
  TOTAL_WEEKS,
  formatDate,
  phaseForWeek,
  weekNumber,
  weekStart,
} from '../data/syllabus'
import { allLessons } from '../modules'
import { lessonStatus, useProgress } from '../lib/progress'
import { STATUS_LABELS } from '../components/labels'
import { SkillBadge } from '../components/SkillBadge'

const CONTEXT_STYLES: Record<
  DailyScheduleItem['where'],
  { badge: string; icon: string }
> = {
  Trajet: { badge: 'bg-sky-100 text-sky-900 border-sky-300', icon: '🚇' },
  Maison: { badge: 'bg-indigo-100 text-indigo-900 border-indigo-300', icon: '🏠' },
  Divertissement: { badge: 'bg-amber-100 text-amber-900 border-amber-300', icon: '📺' },
  'Cours + Pratique': { badge: 'bg-emerald-100 text-emerald-900 border-emerald-300', icon: '👨‍🏫' },
  'Cours + Production': { badge: 'bg-rose-100 text-rose-900 border-rose-300', icon: '🎓' },
}

const CATEGORY_ICONS: Record<string, string> = {
  podcast: '🎧',
  music: '🎵',
  video: '📺',
  app: '📱',
  simulation: '⏱️',
  reading: '📖',
  tool: '🛠️',
}

export function WeeklySchedulePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const today = new Date()
  const currentCalculatedWeek = weekNumber(today)
  const defaultWeek = Math.min(Math.max(currentCalculatedWeek, 1), TOTAL_WEEKS)

  const requestedWeek = Number(searchParams.get('semaine'))
  const selectedWeek =
    !isNaN(requestedWeek) && requestedWeek >= 1 && requestedWeek <= TOTAL_WEEKS
      ? requestedWeek
      : defaultWeek

  const plan = getWeekMaterials(selectedWeek)
  const start = weekStart(selectedWeek)
  const end = new Date(start.getTime() + 6 * 24 * 60 * 60 * 1000)
  const phase = phaseForWeek(selectedWeek)

  const progressState = useProgress()

  function setWeek(w: number) {
    setSearchParams({ semaine: String(w) })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Leçons associées à cette semaine
  const weekLessons = allLessons.filter(
    (l) => selectedWeek >= l.week && selectedWeek <= (l.untilWeek ?? l.week),
  )

  return (
    <GuideLayout
      title="Planning hebdomadaire : Devoirs & Médias quotidiens"
      intro={
        <p>
          Retrouve pour chaque semaine le programme jour par jour : les devoirs à faire,
          les épisodes de podcasts à écouter en bus/métro, les listes de musique québécoise,
          les séries sur ICI TOU.TV et les simulations avec Gemini TA.
        </p>
      }
    >
      {/* Barre de navigation entre semaines */}
      <section aria-labelledby="week-nav-title" className="card space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="week-nav-title" className="text-xl font-bold">
            Choisir une semaine
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="btn-secondary text-sm disabled:opacity-40"
              disabled={selectedWeek <= 1}
              onClick={() => setWeek(selectedWeek - 1)}
              aria-label="Semaine précédente"
            >
              ← Précédente
            </button>
            <button
              type="button"
              className="btn-secondary text-sm"
              onClick={() => setWeek(defaultWeek)}
            >
              Aujourd’hui (Semaine {defaultWeek})
            </button>
            <button
              type="button"
              className="btn-secondary text-sm disabled:opacity-40"
              disabled={selectedWeek >= TOTAL_WEEKS}
              onClick={() => setWeek(selectedWeek + 1)}
              aria-label="Semaine suivante"
            >
              Suivante →
            </button>
          </div>
        </div>

        {/* Sélecteur compact sous forme de pastilles */}
        <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Semaines du parcours">
          {ALL_WEEKLY_MATERIALS.map((m) => {
            const isSelected = m.week === selectedWeek
            const isCurrent = m.week === currentCalculatedWeek
            return (
              <button
                key={m.week}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setWeek(m.week)}
                className={`min-h-10 min-w-10 rounded-lg px-2.5 py-1 text-sm font-semibold transition ${
                  isSelected
                    ? 'bg-blue-800 text-white shadow'
                    : isCurrent
                      ? 'border-2 border-blue-600 bg-blue-50 text-blue-950 hover:bg-blue-100'
                      : 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                S{m.week}
                {isCurrent && <span className="sr-only"> (semaine en cours)</span>}
              </button>
            )
          })}
        </div>
      </section>

      {/* Carte résumé de la semaine */}
      <section
        aria-labelledby="week-overview-title"
        className="card border-l-8 border-l-blue-700 bg-gradient-to-r from-blue-50/50 to-white"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="week-overview-title" className="text-2xl font-bold text-blue-950">
            Semaine {selectedWeek} · du {formatDate(start)} au {formatDate(end)}
          </h2>
          {phase && (
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-900">
              Phase {phase.id} ({phase.level}) : {phase.title}
            </span>
          )}
        </div>

        <div className="mt-3 space-y-2">
          <p className="text-base font-semibold text-slate-900">
            🎯 Objectif de la semaine : <span className="font-normal">{plan.focus}</span>
          </p>
          <p className="text-sm text-slate-700">
            📝 <strong>Sommaire des devoirs :</strong> {plan.homeworkSummary}
          </p>
        </div>

        {/* Leçons au programme */}
        {weekLessons.length > 0 && (
          <div className="mt-4 border-t border-slate-200 pt-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Leçons au programme cette semaine :
            </h3>
            <ul className="mt-2 flex flex-wrap gap-2">
              {weekLessons.map((l) => {
                const status = STATUS_LABELS[lessonStatus(l, progressState.lessons[l.id])]
                return (
                  <li key={l.id}>
                    <Link
                      to={`/lecon/${l.id}`}
                      className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-2.5 py-1 text-sm font-semibold text-blue-900 shadow-sm hover:bg-blue-50"
                    >
                      <span aria-hidden="true">{status.icon}</span>
                      <span>
                        {l.id} — {l.title}
                      </span>
                      <SkillBadge skill={l.skill} />
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </section>

      {/* Déroulement jour par jour */}
      <section aria-labelledby="daily-schedule-title" className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 id="daily-schedule-title" className="text-2xl font-bold">
            Programme jour par jour
          </h2>
          <span className="text-sm text-slate-500">
            7 jours · Écoute, pratique et cours
          </span>
        </div>

        <div className="grid gap-6">
          {plan.days.map((item) => {
            const style = CONTEXT_STYLES[item.where]
            const categoryIcon = CATEGORY_ICONS[item.media.category] ?? '🔗'
            const isExternal = item.media.url.startsWith('http')

            return (
              <article
                key={item.day}
                className="card border border-slate-200 p-5 shadow-sm transition hover:shadow-md"
              >
                {/* En-tête du jour */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black text-slate-900">{item.day}</span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-bold ${style.badge}`}
                    >
                      <span>{style.icon}</span>
                      <span>{item.where}</span>
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-slate-600">
                    ⏱️ {item.minutes} minutes
                  </span>
                </div>

                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                  {/* Colonne gauche : Activité et Devoir */}
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                      <p className="mt-1 text-sm text-slate-700">{item.taskDescription}</p>
                    </div>

                    <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                        📋 Devoir / Tâche active :
                      </h4>
                      <p className="mt-1 text-sm font-medium text-slate-900">
                        {item.homework}
                      </p>
                    </div>

                    {item.lessonId && (
                      <div className="pt-1">
                        <Link
                          to={`/lecon/${item.lessonId}`}
                          className="btn-primary inline-flex items-center gap-1.5 text-sm"
                        >
                          Accéder à la leçon {item.lessonId} →
                        </Link>
                      </div>
                    )}

                    {item.taInstructions && (
                      <p className="text-xs text-indigo-900 bg-indigo-50 p-2 rounded border border-indigo-200">
                        🤖 <strong>Astuce Gemini TA :</strong> {item.taInstructions}
                      </p>
                    )}
                  </div>

                  {/* Colonne droite : Média audio / vidéo / outil */}
                  <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50/40 via-white to-slate-50 p-4 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-blue-900">
                        <span>{categoryIcon}</span>
                        <span>{item.media.categoryLabel}</span>
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {item.media.platform}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 text-base">
                        {item.media.title}
                      </h4>
                      {item.media.tip && (
                        <p className="mt-1 text-xs text-slate-600 italic">
                          💡 {item.media.tip}
                        </p>
                      )}
                    </div>

                    <div className="pt-2">
                      {isExternal ? (
                        <a
                          href={item.media.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-blue-800 px-4 py-2 text-sm font-bold text-white shadow transition hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                        >
                          <span>{item.media.actionLabel}</span>
                          <span aria-hidden="true">↗</span>
                          <span className="sr-only"> (s’ouvre dans un nouvel onglet)</span>
                        </a>
                      ) : (
                        <Link
                          to={item.media.url.replace('#', '')}
                          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-blue-800 px-4 py-2 text-sm font-bold text-white shadow transition hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                        >
                          <span>{item.media.actionLabel}</span>
                          <span aria-hidden="true">→</span>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      {/* Liens de bas de page */}
      <section className="card bg-slate-50 text-center space-y-2">
        <p className="font-semibold text-slate-800">
          Envie d'avoir une vision d'ensemble sur les 27 semaines du parcours ?
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/syllabus" className="btn-secondary text-sm">
            Voir le syllabus complet
          </Link>
          <Link to="/guides/etudiant" className="btn-secondary text-sm">
            Consulter le guide des applications
          </Link>
          <Link to="/vocabulaire" className="btn-secondary text-sm">
            Banque de vocabulaire
          </Link>
        </div>
      </section>
    </GuideLayout>
  )
}
