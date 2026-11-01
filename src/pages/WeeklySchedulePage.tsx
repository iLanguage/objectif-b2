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
  Trajet: { badge: 'bg-tag-sky text-tag-sky-ink border-tag-sky-line', icon: '🚇' },
  Maison: { badge: 'bg-tag-indigo text-tag-indigo-ink border-tag-indigo-line', icon: '🏠' },
  Divertissement: { badge: 'bg-tag-amber text-tag-amber-ink border-tag-amber-line', icon: '📺' },
  'Cours + Pratique': { badge: 'bg-tag-emerald text-tag-emerald-ink border-tag-emerald-line', icon: '👨‍🏫' },
  'Cours + Production': { badge: 'bg-tag-rose text-tag-rose-ink border-tag-rose-line', icon: '🎓' },
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

  // Leçons du cours pour cette semaine (les devoirs TA ont leur propre encadré)
  const weekLessons = allLessons.filter(
    (l) =>
      selectedWeek >= l.week &&
      selectedWeek <= (l.untilWeek ?? l.week) &&
      !plan.taHomework.some((t) => t.lessonId === l.id),
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
                    ? 'bg-primary text-on-solid shadow'
                    : isCurrent
                      ? 'border-2 border-info-line bg-info-soft text-info-ink hover:bg-info-tint'
                      : 'border border-line bg-surface-muted text-ink-soft hover:bg-surface-sunken'
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
        className="card border-l-8 border-l-info-line bg-gradient-to-r from-info-soft/50 to-surface"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="week-overview-title" className="text-2xl font-bold text-info-ink">
            Semaine {selectedWeek} · du {formatDate(start)} au {formatDate(end)}
          </h2>
          {phase && (
            <span className="rounded-full bg-info-tint px-3 py-1 text-xs font-bold text-info-ink">
              Phase {phase.id} ({phase.level}) : {phase.title}
            </span>
          )}
        </div>

        <div className="mt-3 space-y-2">
          <p className="text-base font-semibold text-ink">
            🎯 Objectif de la semaine : <span className="font-normal">{plan.focus}</span>
          </p>
          <p className="text-sm text-ink-soft">
            📝 <strong>Sommaire des devoirs :</strong> {plan.homeworkSummary}
          </p>
        </div>

        {/* Leçons au programme */}
        {weekLessons.length > 0 && (
          <div className="mt-4 border-t border-line pt-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink-muted">
              Leçons au programme cette semaine :
            </h3>
            <ul className="mt-2 flex flex-wrap gap-2">
              {weekLessons.map((l) => {
                const status = STATUS_LABELS[lessonStatus(l, progressState.lessons[l.id])]
                return (
                  <li key={l.id}>
                    <Link
                      to={`/lecon/${l.id}`}
                      className="inline-flex items-center gap-1.5 rounded-md border border-line-strong bg-surface px-2.5 py-1 text-sm font-semibold text-link shadow-sm hover:bg-info-soft"
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

      {plan.taHomework.length > 0 && (
        <section aria-labelledby="ta-homework-title" className="rounded-xl border-2 border-ta-line bg-ta-soft p-5">
          <h2 id="ta-homework-title" className="text-xl font-bold text-ta-ink">
            🤖 Devoirs avec ton TA cette semaine
          </h2>
          <ul className="mt-3 space-y-3">
            {plan.taHomework.map((t) => (
              <li key={t.lessonId}>
                <Link to={`/lecon/${t.lessonId}`} className="font-semibold text-link underline">
                  {t.lessonId} — {t.title}
                </Link>
                <p className="text-ink-soft">{t.homework}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Déroulement jour par jour */}
      <section aria-labelledby="daily-schedule-title" className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 id="daily-schedule-title" className="text-2xl font-bold">
            Programme jour par jour
          </h2>
          <span className="text-sm text-ink-muted">
            7 jours · Écoute, pratique et cours
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {plan.days.map((item) => {
            const style = CONTEXT_STYLES[item.where]
            const categoryIcon = CATEGORY_ICONS[item.media.category] ?? '🔗'
            const isExternal = item.media.url.startsWith('http')

            return (
              <article
                key={item.day}
                className="card min-w-0 border border-line p-5 shadow-sm transition wrap-anywhere hover:shadow-md"
              >
                {/* En-tête du jour */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line-subtle pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black text-ink">{item.day}</span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-bold ${style.badge}`}
                    >
                      <span>{style.icon}</span>
                      <span>{item.where}</span>
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-ink-muted">
                    ⏱️ {item.minutes} minutes
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
                  {/* Colonne gauche : Activité et Devoir */}
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-lg font-bold text-ink">{item.title}</h3>
                      <p className="mt-1 text-sm text-ink-soft">{item.taskDescription}</p>
                    </div>

                    <div className="rounded-lg bg-surface-muted p-3 border border-line">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                        📋 Devoir / Tâche active :
                      </h4>
                      <p className="mt-1 text-sm font-medium text-ink">
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
                      <p className="text-xs text-ta-ink bg-ta-soft p-2 rounded border border-ta-line-soft">
                        🤖 <strong>Astuce Gemini TA :</strong> {item.taInstructions}
                      </p>
                    )}
                  </div>

                  {/* Colonne droite : Média audio / vidéo / outil */}
                  <div className="rounded-xl border border-info-line-soft bg-gradient-to-br from-info-soft/40 via-surface to-surface-muted p-4 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-link">
                        <span>{categoryIcon}</span>
                        <span>{item.media.categoryLabel}</span>
                      </span>
                      <span className="text-xs text-ink-muted font-medium">
                        {item.media.platform}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-ink text-base">
                        {item.media.title}
                      </h4>
                      {item.media.tip && (
                        <p className="mt-1 text-xs text-ink-muted italic">
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
                          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-on-solid shadow transition hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2"
                        >
                          <span>{item.media.actionLabel}</span>
                          <span aria-hidden="true">↗</span>
                          <span className="sr-only"> (s’ouvre dans un nouvel onglet)</span>
                        </a>
                      ) : (
                        <Link
                          to={item.media.url.replace('#', '')}
                          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-on-solid shadow transition hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2"
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
      <section className="card bg-surface-muted text-center space-y-2">
        <p className="font-semibold text-ink">
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
