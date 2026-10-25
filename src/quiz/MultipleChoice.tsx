import type { MultipleChoiceQuestion } from '../types'
import { seededOrder } from '../lib/shuffle'
import { RoadSign } from '../components/RoadSign'

interface MultipleChoiceProps {
  question: MultipleChoiceQuestion
  number: number
  value: number | undefined
  onChange: (value: number) => void
  showResult: boolean
}

function Visual({ visual, alt }: { visual: string; alt: string }) {
  if (visual.startsWith('sign:')) {
    return <RoadSign id={visual.slice(5)} label={alt} />
  }
  return (
    <span role="img" aria-label={alt} className="text-6xl leading-none">
      {visual}
    </span>
  )
}

export function MultipleChoice({ question, number, value, onChange, showResult }: MultipleChoiceProps) {
  // Vrai/Faux garde son ordre ; les autres options sont mélangées de façon stable.
  const order = question.options.length <= 2 ? [0, 1] : seededOrder(question.options.length, question.id)
  const name = `q-${question.id}`
  return (
    <fieldset>
      <legend className="text-lg font-semibold">
        <span className="mr-2 text-slate-500">{number}.</span>
        {question.prompt}
      </legend>
      {question.visual && (
        <div className="my-3">
          <Visual visual={question.visual} alt={question.visualAlt ?? 'Illustration'} />
        </div>
      )}
      <div className="mt-3 grid gap-2">
        {order.map((optionIndex) => {
          const option = question.options[optionIndex]
          const selected = value === optionIndex
          const isAnswer = optionIndex === question.answer
          let style = 'border-slate-300 bg-white hover:bg-slate-50'
          if (showResult && isAnswer) style = 'border-green-700 bg-green-50'
          else if (showResult && selected) style = 'border-red-700 bg-red-50'
          else if (selected) style = 'border-blue-700 bg-blue-50'
          return (
            <label
              key={optionIndex}
              className={`flex min-h-11 cursor-pointer items-start gap-3 rounded-lg border-2 px-3 py-2 ${style} ${showResult ? 'cursor-default' : ''}`}
            >
              <input
                type="radio"
                name={name}
                value={optionIndex}
                checked={selected}
                disabled={showResult}
                onChange={() => onChange(optionIndex)}
                className="mt-1 h-5 w-5 shrink-0 accent-blue-800"
              />
              <span>
                {option}
                {showResult && isAnswer && <span className="ml-2 font-semibold text-green-800">✓ Bonne réponse</span>}
                {showResult && selected && !isAnswer && <span className="ml-2 font-semibold text-red-800">✗ Ta réponse</span>}
              </span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
