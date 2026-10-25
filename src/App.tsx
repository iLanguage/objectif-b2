import { useEffect, useRef, type ReactNode, type RefObject } from 'react'
import { HashRouter, Link, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import { ModeToggle } from './components/ModeToggle'
import { MODES } from './components/labels'
import { Dashboard } from './components/Dashboard'
import { ModuleView } from './components/ModuleView'
import { LessonView } from './components/LessonView'
import { ExamView } from './components/ExamView'
import { ProgressOverview } from './components/ProgressOverview'
import { NotFound } from './components/NotFound'
import { GuideEtudiant } from './guides/GuideEtudiant'
import { GuideProfesseur } from './guides/GuideProfesseur'
import { GuideTA } from './guides/GuideTA'
import { GuideOral } from './guides/GuideOral'
import { GrillesPage } from './pages/GrillesPage'
import { VocabularyPage } from './pages/VocabularyPage'
import { SyllabusPage } from './pages/SyllabusPage'
import { WeeklySchedulePage } from './pages/WeeklySchedulePage'
import { useMode } from './lib/progress'
import { trackPageView } from './lib/newrelic'

const NAV = [
  { to: '/', label: 'Tableau de bord', end: true },
  { to: '/planning', label: 'Planning & Médias' },
  { to: '/syllabus', label: 'Syllabus' },
  { to: '/vocabulaire', label: 'Vocabulaire' },
  { to: '/guides/etudiant', label: 'Guide étudiant' },
]

/**
 * À chaque changement de page : remonter en haut, déplacer le focus sur le
 * contenu principal (lecteurs d'écran) et mettre à jour le titre de l'onglet.
 */
function RouteEffects({ main }: { main: RefObject<HTMLElement | null> }) {
  const { pathname } = useLocation()
  const first = useRef(true)
  useEffect(() => {
    trackPageView(pathname)
    const heading = main.current?.querySelector('h1')?.textContent
    document.title = heading && pathname !== '/' ? `${heading} · Objectif B2` : 'Objectif B2'
    if (first.current) {
      first.current = false
      return
    }
    window.scrollTo(0, 0)
    main.current?.focus({ preventScroll: true })
  }, [pathname, main])
  return null
}

function ModeBanner() {
  const mode = useMode()
  if (mode === 'eleve') return null
  const info = MODES.find((m) => m.id === mode)
  return (
    <div className={`${mode === 'professeur' ? 'bg-emerald-100 text-emerald-950' : 'bg-indigo-100 text-indigo-950'} px-4 py-2 text-center`}>
      <p>
        <span aria-hidden="true">{info?.icon} </span>
        Mode {info?.label} — {info?.description}.
      </p>
    </div>
  )
}

function Layout({ children }: { children: ReactNode }) {
  const main = useRef<HTMLElement>(null)
  return (
    <div className="flex min-h-screen flex-col">
      <button
        type="button"
        className="sr-only z-50 rounded bg-white px-4 py-2 font-semibold text-blue-900 focus:not-sr-only focus:fixed focus:left-2 focus:top-2"
        onClick={() => main.current?.focus()}
      >
        Aller au contenu principal
      </button>
      <header className="bg-blue-900 text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between">
          <Link to="/" className="text-2xl font-bold tracking-tight">
            Objectif B2 <span className="text-base font-normal text-blue-200">· Français pour la médecine</span>
          </Link>
          <ModeToggle />
        </div>
        <nav aria-label="Navigation principale" className="border-t border-blue-800">
          <ul className="mx-auto flex max-w-6xl flex-wrap gap-x-1 px-2">
            {NAV.map((n) => (
              <li key={n.to}>
                <NavLink
                  to={n.to}
                  end={n.end}
                  className={({ isActive }) =>
                    `inline-flex min-h-11 items-center px-3 font-semibold ${isActive ? 'border-b-4 border-white' : 'text-blue-100 hover:text-white'}`
                  }
                >
                  {n.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <ModeBanner />
      <main ref={main} tabIndex={-1} className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 focus:outline-none">
        {children}
      </main>
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-slate-600">
          <p>
            Objectif B2 — préparation au DELF B2 par l’immersion. Les documents d’entraînement sont rédigés pour ce cours ; les liens
            mènent vers les sources authentiques (Radio-Canada, SAAQ, CUSM, McGill).
          </p>
          <p className="mt-1">La progression est enregistrée uniquement dans ce navigateur.</p>
        </div>
      </footer>
      <RouteEffects main={main} />
    </div>
  )
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/module/:moduleId" element={<ModuleView />} />
      <Route path="/lecon/:lessonId" element={<LessonView />} />
      <Route path="/examen/:examId" element={<ExamView />} />
      <Route path="/progression" element={<ProgressOverview />} />
      <Route path="/planning" element={<WeeklySchedulePage />} />
      <Route path="/syllabus" element={<SyllabusPage />} />
      <Route path="/vocabulaire" element={<VocabularyPage />} />
      <Route path="/grilles" element={<GrillesPage />} />
      <Route path="/guides/etudiant" element={<GuideEtudiant />} />
      <Route path="/guides/professeur" element={<GuideProfesseur />} />
      <Route path="/guides/ta" element={<GuideTA />} />
      <Route path="/guides/oral" element={<GuideOral />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default function App() {
  return (
    <HashRouter>
      <Layout>
        <AppRoutes />
      </Layout>
    </HashRouter>
  )
}
