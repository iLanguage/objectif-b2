import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { Timer } from './Timer'

describe('Timer', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('décompte, se met en pause et prévient à la fin', () => {
    const onExpire = vi.fn()
    render(<Timer minutes={2} label="Préparation" onExpire={onExpire} />)
    const timer = screen.getByRole('timer')
    expect(timer).toHaveTextContent('02:00')

    fireEvent.click(screen.getByRole('button', { name: 'Démarrer' }))
    act(() => vi.advanceTimersByTime(5000))
    expect(timer).toHaveTextContent('01:55')

    fireEvent.click(screen.getByRole('button', { name: 'Pause' }))
    act(() => vi.advanceTimersByTime(5000))
    expect(timer).toHaveTextContent('01:55')

    fireEvent.click(screen.getByRole('button', { name: 'Reprendre' }))
    for (let i = 0; i < 115; i++) act(() => vi.advanceTimersByTime(1000))
    expect(timer).toHaveTextContent('00:00')
    expect(onExpire).toHaveBeenCalledTimes(1)
    expect(screen.getByText('Préparation : le temps est écoulé.')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Réinitialiser' }))
    expect(timer).toHaveTextContent('02:00')
  })
})
