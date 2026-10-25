import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { WeeklySchedulePage } from './WeeklySchedulePage'
import { ALL_WEEKLY_MATERIALS, getWeekMaterials } from '../data/weeklyMaterials'

describe('données des médias et devoirs hebdomadaires', () => {
  it('contient les 27 semaines du parcours', () => {
    expect(ALL_WEEKLY_MATERIALS).toHaveLength(27)
  })

  it('fournit 7 jours d’activités avec médias et devoirs pour chaque semaine', () => {
    for (const week of ALL_WEEKLY_MATERIALS) {
      expect(week.days).toHaveLength(7)
      expect(week.focus).toBeTruthy()
      expect(week.homeworkSummary).toBeTruthy()

      for (const day of week.days) {
        expect(day.title).toBeTruthy()
        expect(day.taskDescription).toBeTruthy()
        expect(day.homework).toBeTruthy()
        expect(day.media.title).toBeTruthy()
        expect(day.media.url).toBeTruthy()
        expect(day.media.actionLabel).toBeTruthy()
      }
    }
  })

  it('borne correctement les semaines en dehors de [1, 27]', () => {
    expect(getWeekMaterials(0).week).toBe(1)
    expect(getWeekMaterials(100).week).toBe(27)
  })
})

describe('WeeklySchedulePage', () => {
  it('affiche le planning de la semaine 1 avec les devoirs et médias', () => {
    render(
      <MemoryRouter initialEntries={['/planning?semaine=1']}>
        <WeeklySchedulePage />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { level: 1, name: /Planning hebdomadaire/ })).toBeInTheDocument()
    expect(screen.getByText(/Semaine 1 ·/)).toBeInTheDocument()

    // Jours de la semaine
    expect(screen.getByText('Lundi')).toBeInTheDocument()
    expect(screen.getByText('Mardi')).toBeInTheDocument()
    expect(screen.getByText('Mercredi')).toBeInTheDocument()
    expect(screen.getByText('Jeudi')).toBeInTheDocument()
    expect(screen.getByText('Vendredi')).toBeInTheDocument()
    expect(screen.getByText('Samedi')).toBeInTheDocument()
    expect(screen.getByText('Dimanche')).toBeInTheDocument()

    // Médias et devoirs
    expect(screen.getAllByText(/Balado Radio-Canada/).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/YouTube Music/).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Mauril/).length).toBeGreaterThan(0)
  })

  it('permet de changer de semaine via les boutons', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/planning?semaine=1']}>
        <WeeklySchedulePage />
      </MemoryRouter>,
    )

    const nextBtn = screen.getByRole('button', { name: 'Semaine suivante' })
    await user.click(nextBtn)

    expect(screen.getByText(/Semaine 2 ·/)).toBeInTheDocument()
  })
})
