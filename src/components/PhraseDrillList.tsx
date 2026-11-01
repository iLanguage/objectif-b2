import type { PhraseDrill } from '../types'
import { getProgress, setLessonChecked, useProgress } from '../lib/progress'
import { PhraseDrillPlayer } from './PhraseDrillPlayer'
import { REGISTER_LABELS } from './labels'

export function PhraseDrillList({ title, drills, lessonId }: { title: string; drills: PhraseDrill[]; lessonId: string }) {
  const state = useProgress()
  const checked = state.lessons[lessonId]?.checked ?? []
  const done = drills.filter((d) => checked.includes(d.id)).length
  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-xl font-bold">{title}</h3>
        <p role="status" className="font-semibold text-ink-muted">
          {done} sur {drills.length} pratiquées
        </p>
      </div>
      <dl className="text-sm text-ink-soft">
        {Object.values(REGISTER_LABELS).map((r) => (
          <div key={r.label} className="flex gap-2">
            <dt className="font-semibold">{r.label} :</dt>
            <dd>{r.use}</dd>
          </div>
        ))}
      </dl>
      <ol className="space-y-4">
        {drills.map((drill) => (
          <PhraseDrillPlayer
            key={drill.id}
            drill={drill}
            practised={checked.includes(drill.id)}
            onPractisedChange={(practised) => {
              // Lu au moment du clic : un exercice peut se terminer après un autre changement.
              const current = getProgress().lessons[lessonId]?.checked ?? []
              setLessonChecked(lessonId, practised ? [...new Set([...current, drill.id])] : current.filter((c) => c !== drill.id))
            }}
          />
        ))}
      </ol>
    </section>
  )
}
