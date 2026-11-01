import { useState, useRef } from 'react'
import {
  exportProgress,
  getProgress,
  importProgress,
  resetProgress,
  useProgress,
} from '../lib/progress'

function download(filename: string, content: string) {
  const url = URL.createObjectURL(new Blob([content], { type: 'application/json' }))
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const area = document.createElement('textarea')
    area.value = text
    area.setAttribute('readonly', '')
    area.style.position = 'fixed'
    area.style.opacity = '0'
    document.body.appendChild(area)
    area.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(area)
    return ok
  }
}

interface ProgressSyncCardProps {
  title?: string
}

export function ProgressSyncCard({
  title = 'Transférer et synchroniser la progression',
}: ProgressSyncCardProps) {
  const state = useProgress()
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle')
  const [pasteText, setPasteText] = useState('')
  const [importStatus, setImportStatus] = useState<
    { ok: boolean; message: string } | null
  >(null)
  const [showRaw, setShowRaw] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const lessonCount = Object.keys(state.lessons).length
  const examCount = Object.keys(state.exams).length

  async function handleCopy() {
    const json = exportProgress(true) // version compacte sur une ligne très facile à copier-coller
    const ok = await copyToClipboard(json)
    setCopyStatus(ok ? 'copied' : 'error')
    setTimeout(() => setCopyStatus('idle'), 4000)
  }

  function handleImport() {
    if (!pasteText.trim()) {
      setImportStatus({
        ok: false,
        message: 'Veuillez coller le texte de progression avant de cliquer sur Charger.',
      })
      return
    }

    const ok = importProgress(pasteText)
    if (ok) {
      const count = Object.keys(getProgress().lessons).length
      setImportStatus({
        ok: true,
        message: `Progression importée avec succès ! (${count} leçon${count > 1 ? 's' : ''} enregistrée${count > 1 ? 's' : ''}).`,
      })
      setPasteText('')
    } else {
      setImportStatus({
        ok: false,
        message:
          'Texte invalide : impossible de lire la progression. Assurez-vous d’avoir copié tout le texte sans en couper une partie.',
      })
    }
  }

  function handleReset() {
    if (
      window.confirm(
        'Attention : ceci va effacer toute la progression enregistrée sur cet appareil. Pensez à copier ou exporter avant. Continuer ?',
      )
    ) {
      resetProgress()
      setImportStatus({ ok: true, message: 'La progression locale a été effacée.' })
    }
  }

  return (
    <section aria-labelledby="sync-card-title" className="card border-2 border-info-line-soft bg-surface shadow-sm space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
        <div>
          <h2 id="sync-card-title" className="text-xl font-bold text-ink">
            {title}
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            Copiez-collez votre progression entre l’élève et le professeur sans avoir besoin de créer de compte.
          </p>
        </div>
        <span className="rounded-full bg-info-tint px-3 py-1 text-xs font-bold text-info-ink">
          {lessonCount} leçon{lessonCount > 1 ? 's' : ''} commencée{lessonCount > 1 ? 's' : ''} · {examCount} examen{examCount > 1 ? 's' : ''}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Colonne 1 : Pour l'Élève (Copier) */}
        <div className="rounded-xl border border-line bg-surface-muted/60 p-4 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl" aria-hidden="true">
              📤
            </span>
            <div>
              <h3 className="font-bold text-ink">1. Pour l’élève : Envoyer ma progression</h3>
              <p className="text-xs text-ink-muted">
                Copiez le texte et collez-le dans un courriel, un message ou un chat pour votre professeur.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={handleCopy}
              className={`w-full min-h-12 rounded-lg px-4 py-2 text-sm font-bold shadow transition flex items-center justify-center gap-2 ${
                copyStatus === 'copied'
                  ? 'bg-success text-on-solid hover:bg-success-hover'
                  : 'bg-primary text-on-solid hover:bg-primary-hover'
              }`}
            >
              <span>{copyStatus === 'copied' ? '✅ Copié dans le presse-papiers !' : '📋 Copier ma progression'}</span>
            </button>

            {copyStatus === 'copied' && (
              <p className="rounded-md bg-success-soft p-2 text-center text-xs font-semibold text-success-ink border border-success-line-soft">
                Parfait ! Le texte est copié. Ouvre un message pour ton professeur et fais <em>Coller</em> (Ctrl+V ou Cmd+V).
              </p>
            )}

            {copyStatus === 'error' && (
              <p className="rounded-md bg-warning-soft p-2 text-center text-xs font-semibold text-warning-ink border border-warning-line-soft">
                La copie automatique a échoué. Utilisez le bouton « Voir le texte » ci-dessous pour le copier manuellement.
              </p>
            )}
          </div>

          <div>
            <button
              type="button"
              onClick={() => setShowRaw((v) => !v)}
              className="text-xs font-semibold text-link underline hover:text-link-hover"
            >
              {showRaw ? 'Masquer le texte' : 'Afficher / sélectionner le texte manuellement'}
            </button>

            {showRaw && (
              <div className="mt-2 space-y-1">
                <label htmlFor="raw-export-text" className="sr-only">
                  Texte de progression à copier
                </label>
                <textarea
                  id="raw-export-text"
                  readOnly
                  rows={4}
                  value={exportProgress()}
                  onClick={(e) => (e.target as HTMLTextAreaElement).select()}
                  className="w-full rounded border border-line-strong bg-surface p-2 font-mono text-xs text-ink-soft focus:outline-none focus:ring-2 focus:ring-focus"
                />
                <p className="text-[11px] text-ink-muted">
                  Cliquez dans la boîte pour tout sélectionner, puis faites Copier (Ctrl+C / Cmd+C).
                </p>
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-line flex flex-wrap gap-2 text-xs">
            <button
              type="button"
              onClick={() =>
                download(
                  `objectif-b2-progression-${new Date().toISOString().slice(0, 10)}.json`,
                  exportProgress(),
                )
              }
              className="font-semibold text-ink-soft underline hover:text-ink"
            >
              💾 Télécharger en fichier .json (sauvegarde)
            </button>
          </div>
        </div>

        {/* Colonne 2 : Pour le Professeur (Coller et charger) */}
        <div className="rounded-xl border border-line bg-surface-muted/60 p-4 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl" aria-hidden="true">
              📥
            </span>
            <div>
              <h3 className="font-bold text-ink">2. Pour le professeur : Charger la progression</h3>
              <p className="text-xs text-ink-muted">
                Collez ici le texte que l’élève vous a envoyé pour voir son travail sur votre ordinateur.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="paste-import-text" className="block text-xs font-semibold text-ink-soft">
              Coller le texte de progression ici :
            </label>
            <textarea
              id="paste-import-text"
              rows={4}
              placeholder='Collez ici le texte reçu de l’élève (ex. {"version":1,...})'
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              className="w-full rounded border border-line-strong bg-surface p-2.5 font-mono text-xs text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-focus"
            />

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleImport}
                className="btn-primary text-sm font-bold min-h-11"
              >
                📥 Charger la progression
              </button>

              <label className="btn-secondary text-sm cursor-pointer min-h-11 inline-flex items-center">
                📁 Importer un fichier .json
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/json,.json"
                  className="sr-only"
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    const ok = importProgress(await file.text())
                    setImportStatus({
                      ok,
                      message: ok
                        ? 'Fichier chargé avec succès !'
                        : 'Fichier invalide : impossible de lire la progression.',
                    })
                    if (fileInputRef.current) fileInputRef.current.value = ''
                  }}
                />
              </label>
            </div>

            {importStatus && (
              <div
                role="status"
                className={`rounded-md p-2.5 text-xs font-semibold border ${
                  importStatus.ok
                    ? 'bg-success-soft text-success-ink border-success-line-soft'
                    : 'bg-danger-soft text-danger-ink border-danger-line-soft'
                }`}
              >
                {importStatus.ok ? '✅ ' : '❌ '}
                {importStatus.message}
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-line text-right">
            <button
              type="button"
              onClick={handleReset}
              className="text-xs font-semibold text-danger-ink underline hover:text-danger-ink"
            >
              Effacer la progression sur cet appareil
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
