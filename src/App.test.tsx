import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { AppRoutes } from './App'
import { allLessons, examPrepTasks, mockExams } from './modules'
import { ModeToggle } from './components/ModeToggle'
import { getProgress } from './lib/progress'

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <ModeToggle />
      <AppRoutes />
    </MemoryRouter>,
  )
}

describe('pages', () => {
  const paths = [
    '/',
    '/planning',
    '/syllabus',
    '/vocabulaire',
    '/grilles',
    '/progression',
    '/guides/etudiant',
    '/guides/professeur',
    '/guides/ta',
    '/guides/oral',
    '/module/m0',
    '/module/m5',
    ...allLessons.map((l) => `/lecon/${l.id}`),
    ...examPrepTasks.map((t) => `/preparation/${t.week}`),
    ...mockExams.map((e) => `/examen/${e.id}`),
  ]

  it.each(paths)('affiche %s avec un titre principal', (path) => {
    renderAt(path)
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
  })

  it('affiche une page introuvable pour une semaine inconnue', () => {
    renderAt('/preparation/99')
    expect(screen.getByRole('heading', { level: 1, name: 'Page introuvable' })).toBeInTheDocument()
  })

  it('affiche une page introuvable', () => {
    renderAt('/nimporte-quoi')
    expect(screen.getByRole('heading', { level: 1, name: 'Page introuvable' })).toBeInTheDocument()
  })
})

describe('tâche hebdomadaire', () => {
  it('enregistre le brouillon par semaine et marque la tâche terminée', async () => {
    const user = userEvent.setup()
    renderAt('/preparation/2')
    expect(screen.getByRole('heading', { level: 1, name: 'Réécrire ma lettre sur le bénévolat' })).toBeInTheDocument()
    await user.type(screen.getByRole('textbox', { name: 'Ton texte' }), 'Monsieur')
    await user.click(screen.getByRole('checkbox', { name: 'J’ai terminé cette tâche' }))

    const week2 = getProgress().lessons['prep-2']
    expect(week2.writing?.text).toBe('Monsieur')
    expect(week2.done).toBe(true)
    expect(getProgress().lessons['prep-6']).toBeUndefined()
  })

  it('montre l’enregistreur pour l’oral et l’examen pour les semaines de simulation', () => {
    const { unmount } = renderAt('/preparation/20')
    expect(screen.getByRole('link', { name: /Ouvrir examen blanc 1/ })).toBeInTheDocument()
    unmount()
    renderAt('/preparation/3')
    expect(screen.getByRole('heading', { name: 'Enregistre ton exposé' })).toBeInTheDocument()
    expect(screen.getByText('avec ton professeur')).toBeInTheDocument()
  })

  it('liste les tâches et les examens sur la page du Module 5', () => {
    renderAt('/module/m5')
    expect(screen.getByRole('heading', { name: 'Une tâche par semaine' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /5\.1 — Ma trousse de phrases/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Examen blanc 3 — Simulation/ })).toBeInTheDocument()
  })
})

describe('modes', () => {
  it('montre le prompt Gemini en mode TA et l’espace professeur en mode Professeur', async () => {
    const user = userEvent.setup()
    renderAt('/lecon/1.2')
    expect(screen.queryByRole('heading', { name: /Pratiquer avec Gemini/ })).not.toBeInTheDocument()

    await user.click(screen.getByRole('radio', { name: /TA Gemini/ }))
    expect(screen.getByRole('heading', { name: /Pratiquer avec Gemini/ })).toBeInTheDocument()
    expect(screen.getAllByText(/pénurie, médecin de famille, urgences/).length).toBeGreaterThan(0)

    await user.click(screen.getByRole('radio', { name: /Professeur/ }))
    expect(screen.getByRole('heading', { name: /Espace professeur/ })).toBeInTheDocument()
  })

  it('ajoute les questions manquées au prompt TA après un quiz raté', async () => {
    const user = userEvent.setup()
    renderAt('/lecon/1.4')
    await user.click(screen.getByRole('button', { name: 'Vérifier mes réponses' }))
    await user.click(screen.getByRole('radio', { name: /TA Gemini/ }))
    expect(screen.getByText(/Mon dernier score au quiz de cette leçon est de 0 %/)).toBeInTheDocument()
  })
})
