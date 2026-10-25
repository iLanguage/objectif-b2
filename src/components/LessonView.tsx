import { Link, useParams } from 'react-router-dom'
import { getLesson, getModule, lessonNeighbours } from '../modules'
import {
  bestAttempt,
  lessonStatus,
  recordQuizAttempt,
  saveLessonWriting,
  setLessonChecked,
  setLessonDone,
  setMode,
  useProgress,
} from '../lib/progress'
import { trackQuizCompleted } from '../lib/newrelic'
import { buildLessonPrompt, remediationBlock } from '../ta-prompts'
import { GRILLES, grilleTotal } from '../data/grilles-delf'
import { QuizEngine } from '../quiz/QuizEngine'
import { WritingPrompt } from '../quiz/WritingPrompt'
import { SpeakingPrompt } from '../quiz/SpeakingPrompt'
import { GrilleForm } from '../quiz/GrilleForm'
import { SectionView } from './SectionView'
import { SkillBadge } from './SkillBadge'
import { TaPanel } from './TaPanel'
import { TeacherPanel } from './TeacherPanel'
import { STATUS_LABELS } from './labels'
import { NotFound } from './NotFound'

export function LessonView() {
  const { lessonId = '' } = useParams()
  const lesson = getLesson(lessonId)
  const state = useProgress()
  if (!lesson) return <NotFound />

  const mod = getModule(lesson.moduleId)
  const progress = state.lessons[lesson.id]
  const mode = state.mode
  const status = STATUS_LABELS[lessonStatus(lesson, progress)]
  const best = bestAttempt(progress)
  const { previous, next } = lessonNeighbours(lesson)
  const prompt = buildLessonPrompt(lesson, progress)
  const hasRemediation = remediationBlock(lesson, progress) !== undefined
  const productionSkills = [...(lesson.writing ? (['PE'] as const) : []), ...(lesson.speaking ? (['PO'] as const) : [])]

  return (
    <article className="space-y-8">
      <nav aria-label="Fil d’Ariane" className="text-sm">
        <ol className="flex flex-wrap gap-1 text-slate-700">
          <li>
            <Link to="/" className="underline">
              Tableau de bord
            </Link>{' '}
            ›
          </li>
          {mod && (
            <li>
              <Link to={`/module/${mod.id}`} className="underline">
                Module {mod.number}
              </Link>{' '}
              ›
            </li>
          )}
          <li aria-current="page">Leçon {lesson.id}</li>
        </ol>
      </nav>

      <header>
        <p className="font-semibold text-slate-600">
          Leçon {lesson.id} · Semaine {lesson.week}
          {lesson.untilWeek ? ` à ${lesson.untilWeek}` : ''}
        </p>
        <h1 className="mt-1 text-3xl font-bold leading-tight">{lesson.title}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <SkillBadge skill={lesson.skill} />
          <span className="text-slate-700">Évaluation : {lesson.quizLabel}</span>
          <span className={`font-semibold ${status.className}`}>
            <span aria-hidden="true">{status.icon} </span>
            {status.label}
            {best && ` · meilleur score ${best.percent} %`}
          </span>
        </div>
      </header>

      {mode === 'ta' && <TaPanel prompt={prompt} trackingId={lesson.id} remediation={hasRemediation} />}

      <section aria-labelledby="objectifs" className="card">
        <h2 id="objectifs" className="text-xl font-bold">
          🎯 Objectifs
        </h2>
        <ul className="mt-2 list-disc space-y-1 pl-6">
          {lesson.objectives.map((o) => (
            <li key={o}>{o}</li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="contenu" className="space-y-4">
        <h2 id="contenu" className="text-2xl font-bold">
          Contenu
        </h2>
        {lesson.sections.map((s, i) => (
          <SectionView key={i} section={s} />
        ))}
      </section>

      {lesson.quiz && lesson.quiz.length > 0 && (
        <section aria-labelledby="quiz" className="space-y-4">
          <h2 id="quiz" className="text-2xl font-bold">
            ✏️ Quiz — {lesson.quizLabel}
          </h2>
          <QuizEngine
            key={lesson.id}
            title={`Quiz de la leçon ${lesson.id}`}
            questions={lesson.quiz}
            allowRetry
            bestPercent={best?.percent}
            onSubmit={(result) => {
              recordQuizAttempt(lesson.id, result)
              trackQuizCompleted(lesson.id, result.percent)
            }}
          />
        </section>
      )}

      {lesson.writing && (
        <section aria-labelledby="ecrit" className="space-y-4">
          <h2 id="ecrit" className="text-2xl font-bold">
            📝 Production écrite
          </h2>
          <WritingPrompt
            task={lesson.writing}
            text={progress?.writing?.text ?? ''}
            onTextChange={(t) => saveLessonWriting(lesson.id, t)}
            checked={progress?.checked ?? []}
            onCheckedChange={(c) => setLessonChecked(lesson.id, c)}
          />
        </section>
      )}

      {lesson.speaking && (
        <section aria-labelledby="oral" className="space-y-4">
          <h2 id="oral" className="text-2xl font-bold">
            🎤 Production orale
          </h2>
          <SpeakingPrompt
            task={lesson.speaking}
            checked={progress?.checked ?? []}
            onCheckedChange={(c) => setLessonChecked(lesson.id, c)}
            revealFollowUps={mode !== 'eleve'}
          />
        </section>
      )}

      {mode === 'eleve' && (
        <>
          {productionSkills.map((skill) =>
            progress?.grades?.[skill] ? (
              <GrilleForm
                key={skill}
                grille={GRILLES[skill]}
                grades={progress.grades[skill]}
                readOnly
                title={`Note du professeur : ${grilleTotal(GRILLES[skill], progress.grades[skill])} / 25`}
              />
            ) : null,
          )}
          {progress?.teacherComment && (
            <aside className="card border-emerald-300" aria-label="Commentaire du professeur">
              <h2 className="font-bold">💬 Commentaire du professeur</h2>
              <p className="mt-1 whitespace-pre-wrap">{progress.teacherComment}</p>
            </aside>
          )}
          <aside className="rounded-xl border border-indigo-200 bg-indigo-50 p-4" aria-label="Pratiquer avec Gemini">
            <p>
              <span aria-hidden="true">🤖 </span>
              Envie de pratiquer davantage ? Le mode TA te donne un prompt prêt à coller dans Gemini
              {hasRemediation ? ', avec les questions que tu as manquées.' : '.'}
            </p>
            <button type="button" className="btn-secondary mt-3" onClick={() => setMode('ta')}>
              Passer en mode TA
            </button>
          </aside>
        </>
      )}

      {!lesson.quiz && (
        <div className="flex items-center gap-3">
          <label className="flex min-h-11 cursor-pointer items-center gap-3 font-semibold">
            <input
              type="checkbox"
              className="h-5 w-5 accent-blue-800"
              checked={progress?.done ?? false}
              onChange={(e) => setLessonDone(lesson.id, e.target.checked)}
            />
            J’ai terminé cette leçon
          </label>
        </div>
      )}

      {mode === 'professeur' && <TeacherPanel key={lesson.id} lesson={lesson} progress={progress} />}

      <nav aria-label="Leçons voisines" className="flex flex-wrap justify-between gap-3 border-t border-slate-200 pt-6">
        {previous ? (
          <Link to={`/lecon/${previous.id}`} className="btn-secondary">
            ← {previous.id} {previous.title}
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link to={`/lecon/${next.id}`} className="btn-primary">
            {next.id} {next.title} →
          </Link>
        )}
      </nav>
    </article>
  )
}
