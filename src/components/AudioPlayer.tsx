import { useEffect, useRef, useState, type ReactNode } from 'react'
import { RichText } from './RichText'
import { frenchVoices } from '../lib/speech'

interface AudioPlayerProps {
  title: string
  paragraphs: string[]
  description?: string
  /** En examen, la transcription reste cachée jusqu'à la correction. */
  transcriptLocked?: boolean
  /** La transcription est visible dès l'ouverture (modèles à lire et à écouter). */
  transcriptOpen?: boolean
  /** Remplace la transcription par défaut ; reçoit la ligne lue en ce moment. */
  written?: (current: number | null) => ReactNode
  children?: ReactNode
}

const SPEAKER = /^([A-ZÉÈÀÂÎÔÇ][\p{L} -]{1,24}) : /u

function splitSpeaker(line: string): { speaker?: string; text: string } {
  const m = line.match(SPEAKER)
  return m ? { speaker: m[1], text: line.slice(m[0].length) } : { text: line }
}

/**
 * Lecteur « audio » basé sur la synthèse vocale du navigateur (voix fr-CA si
 * disponible). Les dialogues « Nom : texte » alternent les voix et les hauteurs.
 */
export function AudioPlayer({ title, paragraphs, description, transcriptLocked = false, transcriptOpen = false, written, children }: AudioPlayerProps) {
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window
  const [state, setState] = useState<'idle' | 'playing' | 'paused'>('idle')
  const [current, setCurrent] = useState<number | null>(null)
  const [rate, setRate] = useState(0.95)
  const [plays, setPlays] = useState(0)
  const [showTranscript, setShowTranscript] = useState(transcriptOpen)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const cancelled = useRef(false)

  useEffect(() => {
    if (!supported) return
    const load = () => setVoices(frenchVoices())
    load()
    window.speechSynthesis.addEventListener('voiceschanged', load)
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', load)
      window.speechSynthesis.cancel()
    }
  }, [supported])

  const play = () => {
    if (!supported) return
    const synth = window.speechSynthesis
    if (state === 'paused') {
      synth.resume()
      setState('playing')
      return
    }
    synth.cancel()
    cancelled.current = false
    const speakers: string[] = []
    paragraphs.forEach((line, i) => {
      const { speaker, text } = splitSpeaker(line)
      // Le gras et l'italique de la transcription ne se lisent pas à voix haute.
      const utterance = new SpeechSynthesisUtterance(text.replace(/\*/g, ''))
      utterance.lang = voices[0]?.lang ?? 'fr-CA'
      utterance.rate = rate
      if (speaker) {
        if (!speakers.includes(speaker)) speakers.push(speaker)
        const index = speakers.indexOf(speaker)
        utterance.voice = voices[index % Math.max(voices.length, 1)] ?? null
        utterance.pitch = index % 2 === 0 ? 1 : 0.8
      } else if (voices[0]) {
        utterance.voice = voices[0]
      }
      utterance.onstart = () => setCurrent(i)
      if (i === paragraphs.length - 1) {
        utterance.onend = () => {
          if (cancelled.current) return
          setState('idle')
          setCurrent(null)
        }
      }
      synth.speak(utterance)
    })
    setPlays((p) => p + 1)
    setState('playing')
  }

  const pause = () => {
    window.speechSynthesis.pause()
    setState('paused')
  }

  const stop = () => {
    cancelled.current = true
    window.speechSynthesis.cancel()
    setState('idle')
    setCurrent(null)
  }

  const canShowTranscript = !transcriptLocked
  return (
    <section className="card" aria-label={`Document audio : ${title}`}>
      <h3 className="text-lg font-bold">🎧 {title}</h3>
      {description && <p className="mt-1 text-ink-soft">{description}</p>}

      {supported ? (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {state === 'playing' ? (
            <button type="button" className="btn-primary" onClick={pause}>
              ⏸ Pause
            </button>
          ) : (
            <button type="button" className="btn-primary" onClick={play}>
              ▶ {state === 'paused' ? 'Reprendre' : plays > 0 ? 'Réécouter' : 'Écouter'}
            </button>
          )}
          <button type="button" className="btn-secondary" onClick={stop} disabled={state === 'idle'}>
            ⏹ Arrêter
          </button>
          <label className="flex items-center gap-2 text-ink-soft">
            Vitesse
            <select
              className="field py-1"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              disabled={state !== 'idle'}
            >
              <option value={0.8}>Lente</option>
              <option value={0.95}>Normale</option>
              <option value={1.1}>Rapide</option>
            </select>
          </label>
          <span className="text-sm text-ink-muted">
            Écoutes : {plays}
            {transcriptLocked && ' (2 au maximum, comme au DELF)'}
          </span>
        </div>
      ) : (
        <p className="mt-3 rounded-md bg-warning-soft p-3 text-warning-ink">
          Ton navigateur ne propose pas de synthèse vocale. Demande à ton professeur ou à Gemini de te lire le document, ou lis la
          transcription.
        </p>
      )}
      {supported && voices.length === 0 && (
        <p className="mt-2 text-sm text-ink-muted">
          Aucune voix française détectée : installe une voix « Français (Canada) » dans les réglages de synthèse vocale de ton appareil
          pour un meilleur accent.
        </p>
      )}

      {(canShowTranscript || !supported) && (
        <div className="mt-4">
          <button
            type="button"
            className="btn-secondary"
            aria-expanded={showTranscript}
            onClick={() => setShowTranscript((s) => !s)}
          >
            {showTranscript ? 'Masquer la transcription' : 'Afficher la transcription'}
          </button>
          {showTranscript && (
            <div className="prose-lesson mt-3 rounded-lg bg-surface-muted p-4 leading-relaxed">
              {written
                ? written(current)
                : paragraphs.map((p, i) => (
                    <p key={i} className={current === i ? 'rounded bg-highlight' : undefined}>
                      <RichText text={p} />
                    </p>
                  ))}
            </div>
          )}
        </div>
      )}
      {transcriptLocked && supported && (
        <p className="mt-3 text-sm text-ink-muted">La transcription sera disponible après la correction.</p>
      )}
      {children}
    </section>
  )
}
