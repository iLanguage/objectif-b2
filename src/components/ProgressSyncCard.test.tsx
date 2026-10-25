import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProgressSyncCard } from './ProgressSyncCard'
import { getProgress, recordQuizAttempt, resetProgress } from '../lib/progress'

describe('ProgressSyncCard', () => {
  it('affiche le bouton de copie et les options de transfert', () => {
    render(<ProgressSyncCard />)
    expect(screen.getByRole('button', { name: /Copier ma progression/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Charger la progression/ })).toBeInTheDocument()
  })

  it('permet de coller et charger la progression d’un élève', async () => {
    const user = userEvent.setup()
    resetProgress()

    // Créer une progression fictive
    recordQuizAttempt('1.1', { percent: 90, points: 9, max: 10, missed: [] })
    const stateJson = JSON.stringify(getProgress())

    // Réinitialiser
    resetProgress()
    expect(getProgress().lessons['1.1']).toBeUndefined()

    render(<ProgressSyncCard />)

    const textarea = screen.getByLabelText(/Coller le texte de progression/i)
    await user.click(textarea)
    await user.paste(stateJson)

    const loadBtn = screen.getByRole('button', { name: /Charger la progression/i })
    await user.click(loadBtn)

    expect(screen.getByText(/Progression importée avec succès/)).toBeInTheDocument()
    expect(getProgress().lessons['1.1'].attempts[0].percent).toBe(90)
  })

  it('affiche une erreur explicite si le texte collé est invalide', async () => {
    const user = userEvent.setup()
    render(<ProgressSyncCard />)

    const textarea = screen.getByLabelText(/Coller le texte de progression/i)
    await user.click(textarea)
    await user.paste('texte corrompu n’importe quoi')

    const loadBtn = screen.getByRole('button', { name: /Charger la progression/i })
    await user.click(loadBtn)

    expect(screen.getByText(/Texte invalide/)).toBeInTheDocument()
  })
})
