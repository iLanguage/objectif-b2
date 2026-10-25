import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import type { ExamDocument, MockExam } from '../types'
import { getExam } from '../modules'
import {
  resetExam,
  saveExamAnswer,
  saveExamGrades,
  saveExamWriting,
  setExamChecked,
  submitExamSection,
  useProgress,
  type ExamProgress,
} from '../lib/progress'
import { examScores, sectionQuestions } from '../lib/exam'
import { scoreQuiz, to25, SKILL_LABELS } from '../lib/scoring'
import { trackExamSection } from '../lib/newrelic'
import { buildExamPrompt } from '../ta-prompts'
import { GRILLES, grilleTotal } from '../data/grilles-delf'
import { QuizEngine } from '../quiz/QuizEngine'
import { WritingPrompt } from '../quiz/WritingPrompt'
import { SpeakingPrompt } from '../quiz/SpeakingPrompt'
import { GrilleForm } from '../quiz/GrilleForm'
import { DelfScoreDisplay } from '../quiz/ScoreDisplay'
import { AudioPlayer } from './AudioPlayer'
import { RichText } from './RichText'
import { Timer } from './Timer'
import { TaPanel } from './TaPanel'
import { NotFound } from './NotFound'

function ReadingDocument({ doc }: { doc: ExamDocument }) {
  return (
    <section className="card">
      <h3 className="text-xl font-bold">{doc.title}</h3>
      {doc.source && <p className="mt-1 text-sm italic text-slate-600">{doc.source}</p>}
      <article className="prose-lesson mt-4 border-l-4 border-slate-300 pl-4 text-lg leading-relaxed" lang="fr">
        {doc.paragraphs.map((p, i) => (
          <p key={i}>
            <RichText text={p} />
          </p>
        ))}
      </article>
    </section>
  )
}

function ComprehensionSection({
  exam,
  skill,
  progress,
  resetKey,
}: {
  exam: MockExam
  skill: 'CO' | 'CE'
  progress: ExamProgress | undefined
  resetKey: number
}) {
  const section = skill === 'CO' ? exam.co : exam.ce
  const submitted = progress?.submitted[skill] ?? false
  const questions = sectionQuestions(exam, skill)
  const result = scoreQuiz(questions, progress?.answers ?? {})
  const id = skill.toLowerCase()
  return (
    <section id={id} tabIndex={-1} aria-labelledby={`${id}-titre`} className="scroll-mt-24 space-y-4">
      <h2 id={`${id}-titre`} className="text-2xl font-bold">
        {skill === 'CO' ? '🎧' : '📖'} {SKILL_LABELS[skill]} <span className="font-normal text-slate-600">· {section.minutes} min · /25</span>
      </h2>
      {!submitted && <Timer minutes={section.minutes} label={SKILL_LABELS[skill]} />}
      {skill === 'CO' && !submitted && (
        <p className="text-slate-700">
          Lis les questions d’un document avant de l’écouter. Comme au DELF, écoute chaque document deux fois au maximum.
        </p>
      )}
      <QuizEngine
        key={`${exam.id}-${skill}-${resetKey}`}
        title={SKILL_LABELS[skill]}
        groups={section.documents.map((doc, i) => ({
          id: `${skill}-${i}`,
          header:
            skill === 'CO' ? (
              <AudioPlayer title={doc.title} paragraphs={doc.paragraphs} transcriptLocked={!submitted} />
            ) : (
              <ReadingDocument doc={doc} />
            ),
          questions: doc.questions,
        }))}
        initialAnswers={progress?.answers}
        initialSubmitted={submitted}
        hideScore
        onAnswerChange={(qid, answer) => saveExamAnswer(exam.id, qid, answer)}
        onSubmit={(r) => {
          submitExamSection(exam.id, skill)
          trackExamSection(exam.id, skill, to25(r.points, r.max))
        }}
      />
      {submitted && (
        <p role="status" className="rounded-xl border-2 border-blue-700 bg-blue-50 p-4 text-xl font-bold">
          {SKILL_LABELS[skill]} : {to25(result.points, result.max)} / 25
          <span className="ml-2 text-base font-normal">
            ({result.points.toLocaleString('fr-CA')} point{result.points > 1 ? 's' : ''} sur {result.max})
          </span>
        </p>
      )}
    </section>
  )
}

export function ExamView() {
  const { examId = '' } = useParams()
  const exam = getExam(examId)
  const state = useProgress()
  const [resetKey, setResetKey] = useState(0)
  if (!exam) return <NotFound />

  const progress = state.exams[exam.id]
  const mode = state.mode
  const scores = examScores(exam, progress)

  const productionGrade = (skill: 'PE' | 'PO') => {
    const grades = progress?.grades?.[skill]
    if (mode === 'professeur') {
      return (
        <GrilleForm
          key={`${skill}-${resetKey}`}
          grille={GRILLES[skill]}
          grades={grades}
          onSave={(g) => saveExamGrades(exam.id, skill, g)}
          title={`Noter : ${GRILLES[skill].title}`}
        />
      )
    }
    if (grades) {
      return (
        <GrilleForm
          grille={GRILLES[skill]}
          grades={grades}
          readOnly
          title={`Note du professeur : ${grilleTotal(GRILLES[skill], grades)} / 25`}
        />
      )
    }
    return (
      <p className="rounded-lg bg-slate-100 p-4">
        Cette épreuve est notée par ton professeur avec la grille DELF (mode Professeur). En attendant, fais-la évaluer par Gemini en
        mode TA.
      </p>
    )
  }

  return (
    <div className="space-y-10">
      <nav aria-label="Fil d’Ariane" className="text-sm">
        <Link to="/" className="underline">
          Tableau de bord
        </Link>{' '}
        ›{' '}
        <Link to="/module/m5" className="underline">
          Module 5
        </Link>{' '}
        › <span aria-current="page">{exam.title}</span>
      </nav>

      <header>
        <p className="font-semibold text-slate-600">Module 5 · Semaine {exam.week}</p>
        <h1 className="mt-1 text-3xl font-bold">
          {exam.title} — {exam.theme}
        </h1>
        <p className="mt-2 max-w-3xl text-slate-700">
          Quatre épreuves notées sur 25. Fais-les dans l’ordre, en conditions réelles : chronomètre démarré, pas de dictionnaire, téléphone
          en mode avion. Tes réponses sont enregistrées au fur et à mesure.
        </p>
        <nav aria-label="Épreuves de l’examen" className="mt-4">
          <ul className="flex flex-wrap gap-2">
            {[
              ['#co', 'Oral (CO)'],
              ['#ce', 'Écrits (CE)'],
              ['#pe', 'Production écrite'],
              ['#po', 'Production orale'],
              ['#bilan', 'Bilan'],
            ].map(([href, label]) => (
              <li key={href}>
                <a href={href} className="btn-secondary" onClick={(e) => {
                  // Avec HashRouter, on fait défiler sans changer de route.
                  e.preventDefault()
                  const target = document.querySelector<HTMLElement>(href)
                  target?.scrollIntoView({ behavior: 'smooth' })
                  target?.focus({ preventScroll: true })
                }}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {mode === 'ta' && <TaPanel prompt={buildExamPrompt(exam)} trackingId={exam.id} />}

      <ComprehensionSection exam={exam} skill="CO" progress={progress} resetKey={resetKey} />
      <ComprehensionSection exam={exam} skill="CE" progress={progress} resetKey={resetKey} />

      <section id="pe" tabIndex={-1} aria-labelledby="pe-titre" className="scroll-mt-24 space-y-4">
        <h2 id="pe-titre" className="text-2xl font-bold">
          📝 {SKILL_LABELS.PE} <span className="font-normal text-slate-600">· {exam.pe.minutes} min · /25</span>
        </h2>
        <Timer minutes={exam.pe.minutes} label={SKILL_LABELS.PE} />
        <WritingPrompt
          task={exam.pe.task}
          text={progress?.writing?.text ?? ''}
          onTextChange={(t) => saveExamWriting(exam.id, t)}
          checked={progress?.checked?.PE ?? []}
          onCheckedChange={(c) => setExamChecked(exam.id, 'PE', c)}
        />
        {productionGrade('PE')}
      </section>

      <section id="po" tabIndex={-1} aria-labelledby="po-titre" className="scroll-mt-24 space-y-4">
        <h2 id="po-titre" className="text-2xl font-bold">
          🎤 {SKILL_LABELS.PO}{' '}
          <span className="font-normal text-slate-600">
            · {exam.po.prepMinutes} min de préparation + {exam.po.task.speakMinutes} min · /25
          </span>
        </h2>
        <SpeakingPrompt
          task={exam.po.task}
          checked={progress?.checked?.PO ?? []}
          onCheckedChange={(c) => setExamChecked(exam.id, 'PO', c)}
          revealFollowUps={mode !== 'eleve'}
        />
        {productionGrade('PO')}
      </section>

      <section id="bilan" tabIndex={-1} aria-label="Bilan" className="scroll-mt-24 space-y-4">
        <DelfScoreDisplay scores={scores} />
        <button
          type="button"
          className="btn-secondary"
          onClick={() => {
            if (window.confirm('Effacer toutes les réponses et les notes de cet examen ?')) {
              resetExam(exam.id)
              setResetKey((k) => k + 1)
            }
          }}
        >
          Recommencer cet examen
        </button>
      </section>
    </div>
  )
}
