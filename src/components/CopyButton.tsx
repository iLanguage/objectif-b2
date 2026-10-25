import { useState } from 'react'

interface CopyButtonProps {
  text: string
  label?: string
  onCopied?: () => void
}

async function copy(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Repli pour les navigateurs sans API Clipboard (ou contexte non sécurisé).
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

export function CopyButton({ text, label = 'Copier le prompt', onCopied }: CopyButtonProps) {
  const [status, setStatus] = useState<'idle' | 'ok' | 'error'>('idle')
  return (
    <>
      <button
        type="button"
        className="btn-primary"
        onClick={async () => {
          const ok = await copy(text)
          setStatus(ok ? 'ok' : 'error')
          if (ok) onCopied?.()
          window.setTimeout(() => setStatus('idle'), 3000)
        }}
      >
        {status === 'ok' ? 'Copié !' : label}
      </button>
      <span className="sr-only" aria-live="polite">
        {status === 'ok' ? 'Prompt copié dans le presse-papiers.' : status === 'error' ? 'La copie a échoué. Sélectionne le texte manuellement.' : ''}
      </span>
    </>
  )
}
