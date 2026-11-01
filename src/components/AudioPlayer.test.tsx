import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { stopAudio } from '../lib/audioFocus'
import { AudioPlayer } from './AudioPlayer'

const spoken: { text: string }[] = []
const cancel = vi.fn()

class FakeUtterance {
  rate = 1
  pitch = 1
  lang = ''
  voice: unknown = null
  onstart?: () => void
  onend?: () => void
  constructor(public text: string) {}
}

const player = (title: string) => within(screen.getByRole('region', { name: `Document audio : ${title}` }))

describe('AudioPlayer', () => {
  beforeEach(() => {
    spoken.length = 0
    cancel.mockClear()
    vi.stubGlobal('SpeechSynthesisUtterance', FakeUtterance)
    Object.defineProperty(window, 'speechSynthesis', {
      configurable: true,
      value: {
        speak: (u: { text: string }) => spoken.push(u),
        cancel,
        pause: vi.fn(),
        resume: vi.fn(),
        getVoices: () => [],
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      },
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('ne lit pas le gras à voix haute', () => {
    render(<AudioPlayer title="A" paragraphs={['**Par exemple,** une bosse.']} />)
    fireEvent.click(player('A').getByRole('button', { name: /Écouter/ }))
    expect(spoken.map((u) => u.text)).toEqual(['Par exemple, une bosse.'])
  })

  it('arrête le premier lecteur quand un autre démarre', () => {
    render(
      <>
        <AudioPlayer title="A" paragraphs={['Un.']} />
        <AudioPlayer title="B" paragraphs={['Deux.']} />
      </>,
    )
    fireEvent.click(player('A').getByRole('button', { name: /Écouter/ }))
    expect(player('A').getByRole('button', { name: /Pause/ })).toBeInTheDocument()

    fireEvent.click(player('B').getByRole('button', { name: /Écouter/ }))
    expect(player('A').queryByRole('button', { name: /Pause/ })).not.toBeInTheDocument()
    expect(player('B').getByRole('button', { name: /Pause/ })).toBeInTheDocument()
  })

  it('s’arrête quand un enregistrement prend la main', () => {
    render(<AudioPlayer title="A" paragraphs={['Un.']} />)
    fireEvent.click(player('A').getByRole('button', { name: /Écouter/ }))

    act(() => stopAudio())
    expect(player('A').queryByRole('button', { name: /Pause/ })).not.toBeInTheDocument()
  })
})
