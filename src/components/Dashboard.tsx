import { useState } from 'react'
import { Link } from 'react-router-dom'
import { allLessons, modules } from '../modules'
import { MILESTONES, TOTAL_WEEKS, daysUntil, formatDate, phaseForWeek, weekNumber, weekPlan } from '../data/syllabus'
import { completionPercent, useProgress } from '../lib/progress'
import { ModuleCard } from './ModuleCard'
import { ProgressBar } from './ProgressBar'
import { WeekPlanView } from './WeekPlanView'
import { ProgressOverview } from './ProgressOverview'
import { ProgressSyncCard } from './ProgressSyncCard'

const GUIDE_LINKS = [
  { to: '/planning', icon: '🎧', label: 'Planning & Médias', text: 'Devoirs, audios et vidéos jour par jour' },
  { to: '/guides/etudiant', icon: '📱', label: 'Guide étudiant', text: 'Applications Android et immersion' },
  { to: '/guides/oral', icon: '🎤', label: 'Guide de l’oral', text: 'Fiches pour l’exposé B2' },
  { to: '/vocabulaire', icon: '📚', label: 'Vocabulaire', text: 'Toutes les banques de mots' },
  { to: '/syllabus', icon: '🗓️', label: 'Syllabus', text: 'Les 27 semaines du parcours' },
  { to: '/guides/professeur', icon: '👨‍🏫', label: 'Guide professeur', text: 'Déroulement des cours' },
  { to: '/guides/ta', icon: '🤖', label: 'Guide TA Gemini', text: 'Configurer l’assistant' },
  { to: '/grilles', icon: '📋', label: 'Grilles DELF', text: 'Production écrite et orale' },
]

export function Dashboard({ today = new Date() }: { today?: Date }) {
  const state = useProgress()
  const [showSync, setShowSync] = useState(false)
  const week = weekNumber(today)
  const currentWeek = Math.min(Math.max(week, 1), TOTAL_WEEKS)
  const phase = phaseForWeek(currentWeek)
  const overall = completionPercent(allLessons, state)
  const upcoming = MILESTONES.map((m) => ({ ...m, days: daysUntil(m.date, today) })).filter((m) => m.days >= 0)

  return (
    <div className="space-y-10">
      <section aria-labelledby="titre" className="rounded-2xl bg-gradient-to-br from-blue-900 to-blue-700 p-6 text-white shadow-md sm:p-8">
        <p className="font-semibold text-blue-100">{formatDate(today)}</p>
        <h1 id="titre" className="mt-1 text-3xl font-bold sm:text-4xl">
          Objectif B2
        </h1>
        <p className="mt-2 max-w-2xl text-lg text-blue-50">
          Le français est la clé qui ouvre la porte : médecine, conduite, travail, bénévolat. Chaque leçon te rapproche de Marianopolis
          et du programme Med-P.
        </p>
        <p className="mt-4 text-lg font-semibold">
          {week === 0
            ? `Le parcours commence le ${formatDate(weekPlan(1).start)}.`
            : week > TOTAL_WEEKS
              ? 'Parcours terminé — bravo !'
              : `Semaine ${week} sur ${TOTAL_WEEKS}${phase ? ` · Phase ${phase.id} : ${phase.title} (${phase.level})` : ''}`}
        </p>
        {upcoming.length > 0 && (
          <ul className="mt-4 grid gap-3 sm:grid-cols-3" aria-label="Prochaines échéances">
            {upcoming.map((m) => (
              <li key={m.label} className="rounded-xl bg-white/15 p-3">
                <p className="text-3xl font-bold">
                  {m.days} <span className="text-base font-semibold">jour{m.days > 1 ? 's' : ''}</span>
                </p>
                <p className="text-sm text-blue-50">{m.label}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <section aria-labelledby="semaine" className="card">
          <h2 id="semaine" className="sr-only">
            Cette semaine
          </h2>
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-600">Cette semaine</p>
          <WeekPlanView plan={weekPlan(currentWeek)} />
          <div className="mt-4 flex flex-wrap gap-4 pt-2 border-t border-slate-100">
            <Link
              to={`/planning?semaine=${currentWeek}`}
              className="inline-flex items-center gap-1.5 font-bold text-blue-900 hover:text-blue-700"
            >
              <span>🎧 Planning détaillé de la semaine (médias & devoirs)</span>
              <span aria-hidden="true">→</span>
            </Link>
            <Link to="/syllabus" className="font-semibold text-slate-600 hover:text-slate-900 underline text-sm">
              Voir tout le syllabus
            </Link>
          </div>
        </section>
        <section aria-labelledby="progression" className="card space-y-4">
          <h2 id="progression" className="text-lg font-bold">
            Ma progression
          </h2>
          <ProgressBar value={overall} label="Parcours complet" color="bg-green-700" />
          {modules
            .filter((m) => m.lessons.length > 0)
            .map((m) => (
              <ProgressBar key={m.id} value={completionPercent(m.lessons, state)} label={`Module ${m.number}`} color={m.accent} />
            ))}

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => setShowSync((v) => !v)}
              className="text-xs font-bold text-blue-900 underline hover:text-blue-700 text-left"
            >
              {showSync ? '▲ Masquer la synchronisation' : '📋 Envoyer ma progression au professeur →'}
            </button>
            <Link to="/progression" className="text-xs text-slate-600 hover:text-slate-900 underline">
              Voir le tableau de suivi complet
            </Link>
          </div>
        </section>
      </div>

      {showSync && (
        <ProgressSyncCard title="Transférer et synchroniser ma progression" />
      )}

      {state.mode === 'professeur' && <ProgressOverview compact />}

      <section aria-labelledby="modules">
        <h2 id="modules" className="text-2xl font-bold">
          Modules
        </h2>
        <ul className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((m) => (
            <ModuleCard key={m.id} module={m} />
          ))}
        </ul>
      </section>

      <section aria-labelledby="guides">
        <h2 id="guides" className="text-2xl font-bold">
          Guides et outils
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {GUIDE_LINKS.map((g) => (
            <li key={g.to}>
              <Link to={g.to} className="card flex h-full flex-col hover:border-blue-400 hover:bg-blue-50">
                <span className="text-lg font-bold">
                  <span aria-hidden="true">{g.icon} </span>
                  {g.label}
                </span>
                <span className="text-slate-700">{g.text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
