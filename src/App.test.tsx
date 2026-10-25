import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { AppRoutes } from './App'
import { allLessons, mockExams } from './modules'
import { ModeToggle } from './components/ModeToggle'

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
    ...mockExams.map((e) => `/examen/${e.id}`),
  ]

  it.each(paths)('affiche %s avec un titre principal', (path) => {
    renderAt(path)
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
  })

  it('affiche une page introuvable', () => {
    renderAt('/nimporte-quoi')
    expect(screen.getByRole('heading', { level: 1, name: 'Page introuvable' })).toBeInTheDocument()
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
