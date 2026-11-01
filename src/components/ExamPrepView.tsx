import { Link, useParams } from 'react-router-dom'
import { getExam, getLesson, getPrepTask, prepTaskKey } from '../modules'
import { saveLessonGrades, saveLessonWriting, setLessonChecked, setLessonDone, useProgress } from '../lib/progress'
import { buildExamPrepPrompt } from '../ta-prompts'
import { GRILLES, grilleTotal } from '../data/grilles-delf'
import { GrilleForm } from '../quiz/GrilleForm'
import { WritingPrompt } from '../quiz/WritingPrompt'
import { RichText } from './RichText'
import { SkillBadge } from './SkillBadge'
import { TaPanel } from './TaPanel'
import { Timer } from './Timer'
import { VoiceRecorder } from './VoiceRecorder'
import { NotFound } from './NotFound'

const SPEAKING_SECONDS = 4 * 60

/** Page d'une tâche hebdomadaire de préparation au DELF. */
export function ExamPrepView() {
  const { week = '' } = useParams()
  const task = getPrepTask(Number(week))
  const state = useProgress()
  if (!task) return <NotFound />

  const key = prepTaskKey(task.week)
  const progress = state.lessons[key]
  const lesson = task.lessonId ? getLesson(task.lessonId) : undefined
  const exam = task.examId ? getExam(task.examId) : undefined
  const grades = progress?.grades?.PE

  return (
    <article className="space-y-8" key={key}>
      <nav aria-label="Fil d’Ariane" className="text-sm">
        <Link to="/" className="underline">
          Tableau de bord
        </Link>{' '}
        ›{' '}
        <Link to="/module/m5" className="underline">
          Module 5
        </Link>{' '}
        › <span aria-current="page">Semaine {task.week}</span>
      </nav>

      <header>
        <p className="font-semibold text-ink-muted">
          Préparation au DELF · Semaine {task.week} · {task.minutes} min
        </p>
        <h1 className="mt-1 text-3xl font-bold leading-tight">{task.title}</h1>
        {task.skill && (
          <div className="mt-3">
            <SkillBadge skill={task.skill} />
          </div>
        )}
      </header>

      <section aria-labelledby="consigne" className="card">
        <h2 id="consigne" className="text-xl font-bold">
          {task.writing ? 'Pour t’aider' : 'Ta tâche'}
        </h2>
        {/* La consigne d'une lettre est déjà affichée au-dessus de la zone de rédaction. */}
        {!task.writing && (
          <div className="prose-lesson mt-2">
            {task.instructions.map((p) => (
              <p key={p}>
                <RichText text={p} />
              </p>
            ))}
          </div>
        )}
        <div className="mt-4 flex flex-wrap gap-3">
          {exam && (
            <Link to={`/examen/${exam.id}`} className="btn-primary">
              Ouvrir {exam.title.toLowerCase()}
            </Link>
          )}
          {lesson && (
            <Link to={`/lecon/${lesson.id}`} className={task.writing ? 'btn-secondary' : 'btn-primary'}>
              Leçon {lesson.id} : {lesson.title}
            </Link>
          )}
          {task.link && (
            <a href={task.link.url} target="_blank" rel="noreferrer" className="btn-secondary">
              {task.link.label}
              <span className="sr-only"> (s’ouvre dans un nouvel onglet)</span>
            </a>
          )}
        </div>
      </section>

      {!exam && <Timer minutes={task.minutes} label="Temps" />}

      {task.writing && (
        <WritingPrompt
          task={task.writing}
          text={progress?.writing?.text ?? ''}
          onTextChange={(t) => saveLessonWriting(key, t)}
          checked={progress?.checked ?? []}
          onCheckedChange={(c) => setLessonChecked(key, c)}
        />
      )}

      {task.writing &&
        (state.mode === 'professeur' ? (
          <GrilleForm grille={GRILLES.PE} grades={grades} onSave={(g) => saveLessonGrades(key, 'PE', g)} />
        ) : (
          grades && (
            <GrilleForm
              grille={GRILLES.PE}
              grades={grades}
              readOnly
              title={`Note du professeur : ${grilleTotal(GRILLES.PE, grades)} / 25`}
            />
          )
        ))}

      {task.speaking && (
        <section aria-labelledby="oral" className="card">
          <h2 id="oral" className="mb-3 text-xl font-bold">
            Enregistre ton exposé
          </h2>
          <VoiceRecorder label={task.title} maxSeconds={SPEAKING_SECONDS} />
        </section>
      )}

      <TaPanel prompt={buildExamPrepPrompt(task)} trackingId={key} />

      <label className="flex min-h-11 cursor-pointer items-center gap-3 font-semibold">
        <input
          type="checkbox"
          className="h-5 w-5 accent-primary"
          checked={progress?.done ?? false}
          onChange={(e) => setLessonDone(key, e.target.checked)}
        />
        J’ai terminé cette tâche
      </label>
    </article>
  )
}
