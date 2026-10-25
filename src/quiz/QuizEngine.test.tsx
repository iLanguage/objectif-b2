import { describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { AutoQuestion } from '../types'
import { QuizEngine } from './QuizEngine'

const questions: AutoQuestion[] = [
  {
    id: 'q1',
    type: 'mcq',
    prompt: 'Quelle est la plus grande artère ?',
    options: ['La veine cave', 'L’aorte', 'La carotide', 'Le ventricule'],
    answer: 1,
    explanation: 'L’aorte part du ventricule gauche.',
  },
  { id: 'q2', type: 'fill', text: 'Il faut que tu ___ (faire) tes devoirs.', answers: [['fasses']] },
  {
    id: 'q3',
    type: 'matching',
    prompt: 'Associe.',
    pairs: [
      { left: 'pédiatre', right: 'enfants' },
      { left: 'cardiologue', right: 'cœur' },
    ],
  },
]

describe('QuizEngine', () => {
  it('corrige un quiz réussi et affiche le score', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<QuizEngine questions={questions} onSubmit={onSubmit} />)

    await user.click(screen.getByRole('radio', { name: 'L’aorte' }))
    await user.type(screen.getByRole('textbox', { name: 'Trou 1 sur 1' }), 'Fasses')
    await user.selectOptions(screen.getByRole('combobox', { name: 'pédiatre' }), 'enfants')
    await user.selectOptions(screen.getByRole('combobox', { name: 'cardiologue' }), 'cœur')
    await user.click(screen.getByRole('button', { name: 'Vérifier mes réponses' }))

    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ percent: 100, missed: [] }))
    expect(screen.getByRole('status')).toHaveTextContent('100 %')
    expect(screen.getByText('L’aorte part du ventricule gauche.')).toBeInTheDocument()
  })

  it('montre les bonnes réponses après une erreur et permet de recommencer', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<QuizEngine questions={questions} onSubmit={onSubmit} allowRetry />)

    expect(screen.getByText('3 questions sans réponse')).toBeInTheDocument()
    await user.click(screen.getByRole('radio', { name: 'La carotide' }))
    await user.type(screen.getByRole('textbox', { name: 'Trou 1 sur 1' }), 'fais')
    await user.click(screen.getByRole('button', { name: 'Vérifier mes réponses' }))

    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ percent: 0, missed: ['q1', 'q2', 'q3'] }))
    expect(screen.getByText(/✓ Bonne réponse/)).toBeInTheDocument()
    expect(screen.getByText('fasses')).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: /La carotide/ })).toBeDisabled()

    await user.click(screen.getByRole('button', { name: 'Recommencer le quiz' }))
    expect(screen.getByRole('radio', { name: 'La carotide' })).not.toBeChecked()
    expect(screen.getByRole('radio', { name: 'La carotide' })).toBeEnabled()
  })

  it('insère les lettres accentuées dans le trou actif', async () => {
    const user = userEvent.setup()
    render(<QuizEngine questions={[questions[1]]} />)
    const input = screen.getByRole('textbox', { name: 'Trou 1 sur 1' })
    await user.type(input, 'fass')
    await user.click(screen.getByRole('button', { name: 'Insérer é' }))
    expect(input).toHaveValue('fassé')
  })

  it('reprend des réponses enregistrées et notifie chaque changement', async () => {
    const user = userEvent.setup()
    const onAnswerChange = vi.fn()
    render(<QuizEngine questions={[questions[0]]} initialAnswers={{ q1: 2 }} onAnswerChange={onAnswerChange} />)
    expect(screen.getByRole('radio', { name: 'La carotide' })).toBeChecked()
    await user.click(screen.getByRole('radio', { name: 'L’aorte' }))
    expect(onAnswerChange).toHaveBeenCalledWith('q1', 1)
  })

  it('regroupe les questions par document en gardant la numérotation', () => {
    render(
      <QuizEngine
        groups={[
          { id: 'a', header: <h3>Document A</h3>, questions: [questions[0]] },
          { id: 'b', header: <h3>Document B</h3>, questions: [questions[2]] },
        ]}
      />,
    )
    expect(screen.getByRole('heading', { name: 'Document A' })).toBeInTheDocument()
    const group = screen.getByRole('group', { name: /2\.\s*Associe/ })
    expect(within(group).getAllByRole('combobox')).toHaveLength(2)
  })
})
