import type { LessonSection } from '../types'
import { RichText } from './RichText'
import { AudioPlayer } from './AudioPlayer'

/** Affiche une section de contenu de leçon. Les titres sont des h3 sous le h2 « Contenu ». */
export function SectionView({ section }: { section: LessonSection }) {
  switch (section.kind) {
    case 'text':
      return (
        <section className="card">
          {section.title && <h3 className="mb-3 text-xl font-bold">{section.title}</h3>}
          <div className="prose-lesson leading-relaxed">
            {section.paragraphs.map((p, i) => (
              <p key={i}>
                <RichText text={p} />
              </p>
            ))}
          </div>
        </section>
      )
    case 'reading':
      return (
        <section className="card">
          <h3 className="text-xl font-bold">📰 {section.title}</h3>
          {section.source && <p className="mt-1 text-sm italic text-slate-600">{section.source}</p>}
          <article className="prose-lesson mt-4 border-l-4 border-slate-300 pl-4 text-lg leading-relaxed" lang="fr">
            {section.paragraphs.map((p, i) => (
              <p key={i}>
                <RichText text={p} />
              </p>
            ))}
          </article>
        </section>
      )
    case 'audio':
      return <AudioPlayer title={section.title} description={section.description} paragraphs={section.transcript} />
    case 'vocab':
      return (
        <section className="card">
          <h3 className="mb-3 text-xl font-bold">{section.title ?? 'Vocabulaire'}</h3>
          <dl className="divide-y divide-slate-100">
            {section.items.map((item) => (
              <div key={item.fr} className="grid gap-1 py-2 sm:grid-cols-[1fr_1fr]">
                <dt className="font-semibold" lang="fr">
                  {item.fr}
                </dt>
                <dd className="text-slate-700">
                  {item.en && <span lang="en">{item.en}</span>}
                  {item.note && <span className="block text-sm text-slate-600">{item.note}</span>}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )
    case 'grammar':
      return (
        <section className="card">
          <h3 className="mb-3 text-xl font-bold">📐 {section.title}</h3>
          <ul className="list-disc space-y-2 pl-6 leading-relaxed">
            {section.rule.map((r, i) => (
              <li key={i}>
                <RichText text={r} />
              </li>
            ))}
          </ul>
          <h4 className="mt-4 font-semibold">Exemples</h4>
          <ul className="mt-2 space-y-1 rounded-lg bg-blue-50 p-4">
            {section.examples.map((ex, i) => (
              <li key={i}>
                <RichText text={ex} />
              </li>
            ))}
          </ul>
        </section>
      )
    case 'tip':
      return (
        <aside className="rounded-xl border-l-4 border-amber-500 bg-amber-50 p-4" aria-label="Astuce">
          <p>
            <span aria-hidden="true">💡 </span>
            <RichText text={section.text} />
          </p>
        </aside>
      )
    case 'resources':
      return (
        <section className="card">
          <h3 className="mb-3 text-xl font-bold">{section.title ?? 'Ressources'}</h3>
          <ul className="space-y-2">
            {section.links.map((l) => (
              <li key={l.url}>
                <a href={l.url} target="_blank" rel="noreferrer" className="font-semibold text-blue-800 underline">
                  {l.label}
                  <span className="sr-only"> (s’ouvre dans un nouvel onglet)</span>
                </a>
                {l.description && <span className="block text-slate-700">{l.description}</span>}
              </li>
            ))}
          </ul>
        </section>
      )
  }
}
