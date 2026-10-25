import { useState } from 'react'
import { Link } from 'react-router-dom'
import { GuideLayout } from '../guides/GuideLayout'
import { searchVocabulary, vocabularyBanks, vocabularyPrompt } from '../data/vocabulary'
import { CopyButton } from '../components/CopyButton'

export function VocabularyPage() {
  const [query, setQuery] = useState('')
  const [moduleId, setModuleId] = useState('')
  const entries = searchVocabulary(query, moduleId || undefined)

  return (
    <GuideLayout
      title="Banques de vocabulaire"
      intro={
        <p>
          Tout le vocabulaire des leçons, par thème. Filtre une banque, puis copie le prompt pour la réviser avec Gemini par répétition
          espacée.
        </p>
      }
    >
      <div className="card flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex flex-1 flex-col gap-1">
          <label htmlFor="vocab-search" className="font-semibold">
            Rechercher un mot (français ou anglais)
          </label>
          <input
            id="vocab-search"
            type="search"
            className="field"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="vocab-module" className="font-semibold">
            Thème
          </label>
          <select id="vocab-module" className="field" value={moduleId} onChange={(e) => setModuleId(e.target.value)}>
            <option value="">Tous les thèmes</option>
            {vocabularyBanks.map((b) => (
              <option key={b.moduleId} value={b.moduleId}>
                {b.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <p role="status" className="font-semibold">
          {entries.length} mot{entries.length > 1 ? 's' : ''}
        </p>
        {entries.length > 0 && (
          <CopyButton text={vocabularyPrompt(entries.slice(0, 40))} label="Réviser ces mots avec Gemini" />
        )}
        {entries.length > 40 && <span className="text-sm text-slate-600">(les 40 premiers mots)</span>}
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[32rem] text-left">
          <caption className="sr-only">Vocabulaire filtré</caption>
          <thead>
            <tr className="border-b border-slate-300 text-sm text-slate-600">
              <th scope="col" className="py-2 pr-3">Français</th>
              <th scope="col" className="py-2 pr-3">Anglais / note</th>
              <th scope="col" className="py-2">Leçon</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr key={`${e.lessonId}-${e.fr}`} className="border-b border-slate-100 align-top">
                <th scope="row" className="py-2 pr-3 font-semibold" lang="fr">
                  {e.fr}
                </th>
                <td className="py-2 pr-3">
                  {e.en && <span lang="en">{e.en}</span>}
                  {e.note && <span className="block text-sm text-slate-600">{e.note}</span>}
                </td>
                <td className="py-2">
                  <Link to={`/lecon/${e.lessonId}`} className="text-blue-800 underline">
                    {e.lessonId}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GuideLayout>
  )
}
