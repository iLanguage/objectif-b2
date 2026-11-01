import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen } from '@testing-library/react'
import type { PhraseDrill } from '../types'
import { PhraseDrillPlayer } from './PhraseDrillPlayer'

const drill: PhraseDrill = {
  id: 'mettons-que',
  phrase: 'Mettons que',
  context: 'Mettons que ça arrive.',
  buildUp: ['que', 'mettons que'],
  register: 'familier',
  meaning: 'Pour imaginer une situation.',
  en: 'let’s say',
}

const spoken: { text: string; rate: number; voice: unknown }[] = []
const cancel = vi.fn()
const voice = { name: 'Amélie', lang: 'fr-CA' }
let voices: (typeof voice)[] = []
let onVoicesChanged: (() => void) | undefined

class FakeUtterance {
  rate = 1
  lang = ''
  voice: unknown = null
  onend?: () => void
  onerror?: () => void
  constructor(public text: string) {}
}

async function advance(ms: number) {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(ms)
  })
}

describe('PhraseDrillPlayer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    spoken.length = 0
    cancel.mockClear()
    vi.stubGlobal('SpeechSynthesisUtterance', FakeUtterance)
    voices = [voice]
    Object.defineProperty(window, 'speechSynthesis', {
      configurable: true,
      value: {
        cancel,
        getVoices: () => voices,
        addEventListener: (_: string, listener: () => void) => {
          onVoicesChanged = listener
        },
        removeEventListener: () => {},
        // Fin de lecture quasi immédiate.
        speak: (u: FakeUtterance) => {
          spoken.push({ text: u.text, rate: u.rate, voice: u.voice })
          window.setTimeout(() => u.onend?.(), 10)
        },
      },
    })
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
    delete (window as { speechSynthesis?: unknown }).speechSynthesis
  })

  it('enchaîne les trois écoutes et la construction, puis marque l’expression', async () => {
    const onPractised = vi.fn()
    render(<PhraseDrillPlayer drill={drill} practised={false} onPractisedChange={onPractised} />)
    fireEvent.click(screen.getByRole('button', { name: /Commencer/ }))
    await advance(60_000)

    expect(spoken.map((s) => s.text)).toEqual([drill.context, drill.context, drill.context, 'que', 'mettons que'])
    expect(spoken.map((s) => s.rate)).toEqual([0.95, 0.7, 0.7, 0.95, 0.95])
    expect(onPractised).toHaveBeenCalledWith(true)
  })

  it('attend les voix du navigateur : la première écoute a la même voix que les suivantes', async () => {
    voices = []
    render(<PhraseDrillPlayer drill={drill} practised={false} onPractisedChange={() => {}} />)
    fireEvent.click(screen.getByRole('button', { name: /Commencer/ }))
    await advance(1)
    expect(spoken).toHaveLength(0)

    voices = [voice]
    await act(async () => onVoicesChanged?.())
    await advance(60_000)
    expect(spoken.map((s) => s.voice)).toEqual(Array(5).fill(voice))
  })

  it('montre la consigne en cours et s’arrête à la demande', async () => {
    const onPractised = vi.fn()
    render(<PhraseDrillPlayer drill={drill} practised={false} onPractisedChange={onPractised} />)
    fireEvent.click(screen.getByRole('button', { name: /Commencer/ }))
    await advance(1)
    expect(screen.getByText('Écoute 1 sur 3 — vitesse normale')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Arrêter/ }))
    expect(cancel).toHaveBeenCalled()
    await advance(60_000)
    expect(spoken).toHaveLength(1)
    expect(onPractised).not.toHaveBeenCalled()
  })

  it('arrête la voix quand on quitte la page', async () => {
    const { unmount } = render(<PhraseDrillPlayer drill={drill} practised={false} onPractisedChange={() => {}} />)
    fireEvent.click(screen.getByRole('button', { name: /Commencer/ }))
    await advance(1)
    // Le rendu de l'étape en cours ne doit pas faire perdre le lien avec l'exercice.
    unmount()
    expect(cancel).toHaveBeenCalled()
    await advance(60_000)
    expect(spoken).toHaveLength(1)
  })

  it('n’autorise qu’un exercice à la fois', async () => {
    render(
      <>
        <PhraseDrillPlayer drill={drill} practised={false} onPractisedChange={() => {}} />
        <PhraseDrillPlayer drill={{ ...drill, id: 'autre', phrase: 'Autre', context: 'Autre phrase.' }} practised={false} onPractisedChange={() => {}} />
      </>,
    )
    const [first, second] = screen.getAllByRole('button', { name: /Commencer/ })
    fireEvent.click(first)
    await advance(1)
    fireEvent.click(second)
    await advance(60_000)
    expect(spoken.map((s) => s.text).filter((t) => t === drill.context)).toHaveLength(1)
    expect(spoken.map((s) => s.text).filter((t) => t === 'Autre phrase.')).toHaveLength(3)
  })

  it('renvoie vers Gemini sans synthèse vocale', () => {
    delete (window as { speechSynthesis?: unknown }).speechSynthesis
    render(<PhraseDrillPlayer drill={drill} practised={false} onPractisedChange={() => {}} />)
    expect(screen.getByText(/Fais cet exercice avec Gemini/)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Commencer/ })).not.toBeInTheDocument()
  })
})
