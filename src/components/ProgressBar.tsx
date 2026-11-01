interface ProgressBarProps {
  value: number
  label: string
  /** Classe Tailwind de la couleur de remplissage. */
  color?: string
}

export function ProgressBar({ value, label, color = 'bg-primary' }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)))
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm text-ink-soft">
        <span>{label}</span>
        <span aria-hidden="true">{clamped} %</span>
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={clamped}
        aria-valuetext={`${clamped} %`}
        className="h-3 w-full overflow-hidden rounded-full bg-track"
      >
        <div className={`h-full rounded-full ${color}`} style={{ width: `${clamped}%` }} />
      </div>
    </div>
  )
}
