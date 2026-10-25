import { useEffect, useRef, useState } from 'react'

interface TimerProps {
  minutes: number
  label: string
  /** Appelé une fois quand le temps est écoulé. */
  onExpire?: () => void
}

function format(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

/**
 * Chronomètre DELF. Les annonces pour lecteur d'écran sont limitées aux
 * moments clés (démarrage, 5 min, 1 min, fin) pour ne pas interrompre l'élève.
 */
export function Timer({ minutes, label, onExpire }: TimerProps) {
  const total = minutes * 60
  const [remaining, setRemaining] = useState(total)
  const [running, setRunning] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  const expired = useRef(false)

  useEffect(() => {
    if (!running) return
    const id = window.setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000)
    return () => window.clearInterval(id)
  }, [running])

  useEffect(() => {
    if (!running) return
    if (remaining === 300 && total > 300) setAnnouncement(`${label} : il reste 5 minutes.`)
    else if (remaining === 60 && total > 60) setAnnouncement(`${label} : il reste 1 minute.`)
    else if (remaining === 0 && !expired.current) {
      expired.current = true
      setRunning(false)
      setAnnouncement(`${label} : le temps est écoulé.`)
      onExpire?.()
    }
  }, [remaining, running, total, label, onExpire])

  const start = () => {
    if (remaining === 0) return
    setRunning(true)
    setAnnouncement(`${label} : chronomètre démarré, ${minutes} minutes.`)
  }
  const reset = () => {
    setRunning(false)
    setRemaining(total)
    expired.current = false
    setAnnouncement('')
  }

  const low = remaining <= 60
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-300 bg-white px-4 py-3">
      <span className="font-medium text-slate-700">{label}</span>
      <span
        role="timer"
        aria-label={`${label} : temps restant`}
        className={`font-mono text-2xl font-bold tabular-nums ${low ? 'text-red-700' : 'text-slate-900'}`}
      >
        {format(remaining)}
      </span>
      <div className="flex gap-2">
        {running ? (
          <button type="button" onClick={() => setRunning(false)} className="btn-secondary">
            Pause
          </button>
        ) : (
          <button type="button" onClick={start} disabled={remaining === 0} className="btn-primary">
            {remaining === total ? 'Démarrer' : 'Reprendre'}
          </button>
        )}
        <button type="button" onClick={reset} className="btn-secondary">
          Réinitialiser
        </button>
      </div>
      <p className="sr-only" aria-live="assertive">
        {announcement}
      </p>
    </div>
  )
}
