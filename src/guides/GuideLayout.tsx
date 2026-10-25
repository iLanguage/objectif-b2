import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export function GuideLayout({ title, intro, children }: { title: string; intro: ReactNode; children: ReactNode }) {
  return (
    <article className="space-y-8">
      <nav aria-label="Fil d’Ariane" className="text-sm">
        <Link to="/" className="underline">
          Tableau de bord
        </Link>{' '}
        › <span aria-current="page">{title}</span>
      </nav>
      <header>
        <h1 className="text-3xl font-bold">{title}</h1>
        <div className="mt-3 max-w-3xl text-lg text-slate-700">{intro}</div>
      </header>
      {children}
    </article>
  )
}

export function GuideSection({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="card space-y-3 leading-relaxed">
      <h2 id={id} className="text-2xl font-bold">
        {title}
      </h2>
      {children}
    </section>
  )
}
