import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { claimAudio } from '../lib/audioFocus'
import { MAX_RECORDING_SECONDS, VoiceRecorder } from './VoiceRecorder'

const trackStop = vi.fn()
const stream = { getTracks: () => [{ stop: trackStop }] }
const getUserMedia = vi.fn()
const createObjectURL = vi.fn()
const revokeObjectURL = vi.fn()
const plays: FakeAudio[] = []
let recorders: FakeRecorder[] = []
let emptyRecording = false

class FakeRecorder {
  state = 'inactive'
  mimeType = 'audio/webm'
  ondataavailable?: (e: { data: Blob }) => void
  onstop?: () => void
  constructor() {
    recorders.push(this)
  }
  start() {
    this.state = 'recording'
  }
  stop() {
    this.state = 'inactive'
    if (!emptyRecording) this.ondataavailable?.({ data: new Blob(['voix']) })
    this.onstop?.()
  }
}

class FakeAudio {
  onended?: () => void
  pause = vi.fn()
  play = vi.fn(() => Promise.resolve())
  constructor(public src: string) {
    plays.push(this)
  }
}

const flush = () => act(async () => {})
const click = (name: RegExp) => fireEvent.click(screen.getByRole('button', { name }))

async function recordOnce() {
  click(/Enregistrer ma voix|Recommencer/)
  await flush()
  click(/Arrêter l’enregistrement/)
  await flush()
}

describe('VoiceRecorder', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    recorders = []
    plays.length = 0
    emptyRecording = false
    vi.clearAllMocks()
    let n = 0
    createObjectURL.mockImplementation(() => `blob:voix-${++n}`)
    getUserMedia.mockResolvedValue(stream)
    vi.stubGlobal('MediaRecorder', FakeRecorder)
    vi.stubGlobal('Audio', FakeAudio)
    Object.defineProperty(navigator, 'mediaDevices', { configurable: true, value: { getUserMedia } })
    Object.assign(URL, { createObjectURL, revokeObjectURL })
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
    delete (navigator as { mediaDevices?: unknown }).mediaDevices
  })

  it('enregistre, libère le micro, puis réécoute au clic', async () => {
    render(<VoiceRecorder label="Mettons que" />)
    expect(screen.queryByRole('button', { name: /Réécouter/ })).not.toBeInTheDocument()

    click(/Enregistrer ma voix/)
    await flush()
    expect(getUserMedia).toHaveBeenCalledWith({ audio: true })
    expect(screen.getByText(/Enregistrement… 0:00/)).toBeInTheDocument()

    click(/Arrêter l’enregistrement/)
    await flush()
    expect(trackStop).toHaveBeenCalled()

    click(/Réécouter ma voix/)
    expect(plays[0].src).toBe('blob:voix-1')
    expect(plays[0].play).toHaveBeenCalled()

    act(() => plays[0].onended?.())
    expect(screen.getByRole('button', { name: /Réécouter ma voix/ })).toBeInTheDocument()
  })

  it('peut réécouter plusieurs fois, et arrêter la lecture', async () => {
    render(<VoiceRecorder label="Mettons que" />)
    await recordOnce()
    click(/Réécouter/)
    click(/Arrêter la lecture/)
    expect(plays[0].pause).toHaveBeenCalled()
    click(/Réécouter/)
    expect(plays).toHaveLength(2)
  })

  it('remplace l’enregistrement précédent sans fuite de mémoire', async () => {
    render(<VoiceRecorder label="Mettons que" />)
    await recordOnce()
    await recordOnce()
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:voix-1')
    click(/Réécouter/)
    expect(plays[0].src).toBe('blob:voix-2')
  })

  it('garde l’ancien enregistrement si le nouveau échoue', async () => {
    render(<VoiceRecorder label="Mettons que" />)
    await recordOnce()
    getUserMedia.mockRejectedValueOnce(new DOMException('non', 'NotAllowedError'))
    click(/Recommencer/)
    await flush()
    expect(screen.getByRole('alert')).toHaveTextContent('Le micro est bloqué')
    expect(revokeObjectURL).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: /Réécouter/ })).toBeInTheDocument()
  })

  it('explique les autres erreurs de micro', async () => {
    render(<VoiceRecorder label="Mettons que" />)
    getUserMedia.mockRejectedValueOnce(new DOMException('rien', 'NotFoundError'))
    click(/Enregistrer ma voix/)
    await flush()
    expect(screen.getByRole('alert')).toHaveTextContent('Aucun micro')

    emptyRecording = true
    await recordOnce()
    expect(screen.getByRole('alert')).toHaveTextContent('vide')
    expect(screen.queryByRole('button', { name: /Réécouter/ })).not.toBeInTheDocument()
  })

  it('s’arrête seul après la durée maximale', async () => {
    render(<VoiceRecorder label="Mettons que" />)
    click(/Enregistrer ma voix/)
    await flush()
    act(() => vi.advanceTimersByTime(5000))
    expect(screen.getByText(/0:05/)).toBeInTheDocument()
    act(() => vi.advanceTimersByTime(MAX_RECORDING_SECONDS * 1000))
    expect(recorders[0].state).toBe('inactive')
    expect(trackStop).toHaveBeenCalled()
    expect(screen.getByRole('button', { name: /Réécouter/ })).toBeInTheDocument()
  })

  it('libère le micro et la mémoire quand on quitte la page', async () => {
    const { unmount } = render(<VoiceRecorder label="Mettons que" />)
    await recordOnce()
    click(/Recommencer/)
    await flush()
    unmount()
    expect(recorders[1].state).toBe('inactive')
    expect(trackStop).toHaveBeenCalledTimes(2)
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:voix-1')
    expect(createObjectURL).toHaveBeenCalledTimes(1)
  })

  it('libère le micro si on quitte pendant la demande d’autorisation', async () => {
    let grant: (s: unknown) => void = () => {}
    getUserMedia.mockReturnValueOnce(new Promise((resolve) => (grant = resolve)))
    const { unmount } = render(<VoiceRecorder label="Mettons que" />)
    click(/Enregistrer ma voix/)
    unmount()
    await act(async () => grant(stream))
    expect(trackStop).toHaveBeenCalled()
    expect(recorders).toHaveLength(0)
  })

  it('n’enregistre qu’une voix à la fois, et un autre son arrête l’enregistrement', async () => {
    render(
      <>
        <VoiceRecorder label="Une" />
        <VoiceRecorder label="Deux" />
      </>,
    )
    const [first, second] = screen.getAllByRole('button', { name: /Enregistrer ma voix/ })
    fireEvent.click(first)
    await flush()
    fireEvent.click(second)
    await flush()
    expect(recorders[0].state).toBe('inactive')
    expect(recorders[1].state).toBe('recording')

    act(() => claimAudio(() => {}))
    expect(recorders[1].state).toBe('inactive')
  })

  it('prévient quand le navigateur ne peut pas enregistrer', () => {
    vi.stubGlobal('MediaRecorder', undefined)
    render(<VoiceRecorder label="Mettons que" />)
    expect(screen.getByText(/ne permet pas d’enregistrer/)).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
