import { useEffect, useRef, useState } from 'react'
import { claimAudio, ownsAudio, releaseAudio } from '../lib/audioFocus'
import { speechSupported } from '../lib/speech'

export const MAX_RECORDING_SECONDS = 30

type Status = 'idle' | 'requesting' | 'recording' | 'playing'

function recordingSupported(): boolean {
  return typeof MediaRecorder !== 'undefined' && Boolean(navigator.mediaDevices?.getUserMedia)
}

function micError(error: unknown): string {
  const name = (error as { name?: string } | null)?.name
  if (name === 'NotAllowedError' || name === 'SecurityError') {
    return 'Le micro est bloqué. Autorise-le pour ce site dans les réglages du navigateur, puis réessaie.'
  }
  if (name === 'NotFoundError') return 'Aucun micro trouvé sur cet appareil.'
  return 'L’enregistrement n’a pas fonctionné. Réessaie.'
}

function formatSeconds(seconds: number): string {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
}

/**
 * Enregistre la voix de l'élève et la fait réécouter. L'enregistrement reste en
 * mémoire : il n'est ni envoyé ni conservé, et disparaît quand on quitte la page.
 */
export function VoiceRecorder({ label, maxSeconds = MAX_RECORDING_SECONDS }: { label: string; maxSeconds?: number }) {
  const [status, setStatus] = useState<Status>('idle')
  const [url, setUrl] = useState<string | null>(null)
  const [seconds, setSeconds] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const session = useRef(0)
  const mounted = useRef(false)
  const urlRef = useRef<string | null>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const timers = useRef<number[]>([])

  const clearTimers = () => {
    timers.current.forEach((id) => window.clearTimeout(id))
    timers.current = []
  }

  const releaseMic = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
  }

  // Fonction stable : c'est elle qui détient l'audio de la page.
  const stopRef = useRef(() => {
    session.current += 1
    clearTimers()
    if (recorderRef.current?.state === 'recording') {
      recorderRef.current.stop()
    } else {
      releaseMic()
      setStatus('idle')
    }
    audioRef.current?.pause()
    audioRef.current = null
    releaseAudio(stopRef.current)
  })
  const stop = stopRef.current

  useEffect(() => {
    mounted.current = true
    const stopOnUnmount = stopRef.current
    return () => {
      mounted.current = false
      if (ownsAudio(stopOnUnmount)) stopOnUnmount()
      releaseMic()
      if (urlRef.current) URL.revokeObjectURL(urlRef.current)
      urlRef.current = null
    }
  }, [])

  const record = async () => {
    claimAudio(stop)
    if (speechSupported()) window.speechSynthesis.cancel()
    setError(null)
    setStatus('requesting')
    const current = ++session.current

    let stream: MediaStream
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    } catch (e) {
      if (current !== session.current) return
      setError(micError(e))
      setStatus('idle')
      releaseAudio(stop)
      return
    }
    // Annulé ou page quittée pendant la demande d'autorisation.
    if (current !== session.current) {
      stream.getTracks().forEach((track) => track.stop())
      return
    }

    streamRef.current = stream
    const chunks: Blob[] = []
    const recorder = new MediaRecorder(stream)
    recorderRef.current = recorder
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data)
    }
    recorder.onstop = () => {
      clearTimers()
      releaseMic()
      recorderRef.current = null
      if (!mounted.current) return
      if (chunks.length > 0) {
        if (urlRef.current) URL.revokeObjectURL(urlRef.current)
        urlRef.current = URL.createObjectURL(new Blob(chunks, { type: recorder.mimeType }))
        setUrl(urlRef.current)
      } else {
        setError('L’enregistrement est vide. Réessaie.')
      }
      setStatus('idle')
    }
    recorder.start()
    setSeconds(0)
    setStatus('recording')
    timers.current.push(
      window.setInterval(() => setSeconds((s) => s + 1), 1000),
      window.setTimeout(stop, maxSeconds * 1000),
    )
  }

  const replay = () => {
    if (!url) return
    claimAudio(stop)
    if (speechSupported()) window.speechSynthesis.cancel()
    const audio = new Audio(url)
    audioRef.current = audio
    audio.onended = () => {
      audioRef.current = null
      setStatus('idle')
      releaseAudio(stop)
    }
    setStatus('playing')
    audio.play().catch(() => {
      setError('La réécoute n’a pas fonctionné. Réessaie.')
      setStatus('idle')
      releaseAudio(stop)
    })
  }

  if (!recordingSupported()) {
    return <p className="text-sm text-ink-muted">Ton navigateur ne permet pas d’enregistrer ta voix ici.</p>
  }

  const recording = status === 'recording'
  const playing = status === 'playing'
  return (
    <div role="group" aria-label={`Enregistrer ma voix : ${label}`} className="space-y-2">
      <p className="text-sm font-semibold text-ink-muted">Enregistre-toi, puis compare ta voix au modèle :</p>
      <div className="flex flex-wrap items-center gap-2">
        {recording ? (
          <button type="button" className="btn-primary" onClick={stop}>
            ⏹ Arrêter l’enregistrement
          </button>
        ) : (
          <button type="button" className="btn-secondary" disabled={status === 'requesting'} onClick={() => void record()}>
            🎙 {url ? 'Recommencer' : 'Enregistrer ma voix'}
          </button>
        )}
        {url &&
          !recording &&
          (playing ? (
            <button type="button" className="btn-primary" onClick={stop}>
              ⏹ Arrêter la lecture
            </button>
          ) : (
            <button type="button" className="btn-primary" disabled={status === 'requesting'} onClick={replay}>
              ▶ Réécouter ma voix
            </button>
          ))}
        {status === 'requesting' && <span className="text-ink-muted">Autorise le micro si ton navigateur te le demande…</span>}
        {recording && (
          <span className="font-semibold text-danger-ink">
            <span aria-hidden="true">● </span>
            Enregistrement… {formatSeconds(seconds)} / {formatSeconds(maxSeconds)}
          </span>
        )}
      </div>
      {error && (
        <p role="alert" className="rounded-md bg-danger-soft p-2 text-danger-ink">
          {error}
        </p>
      )}
      <p className="text-sm text-ink-muted">Ton enregistrement reste sur cet appareil et disparaît quand tu quittes la page.</p>
    </div>
  )
}
