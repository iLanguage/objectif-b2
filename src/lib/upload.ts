/** Envoi d'un enregistrement vers speech.lingsync.org (AudioWebService). */
const UPLOAD_URL = atob('aHR0cHM6Ly9zcGVlY2gubGluZ3N5bmMub3JnL3VwbG9hZC9leHRyYWN0L3V0dGVyYW5jZXM=');
const USERNAME = atob('bWlrYWVs');
const DBNAME = `${USERNAME}-objectif-b2`
/** Le serveur répond seulement après avoir converti et analysé le fichier. */
const TIMEOUT_MS = 180_000

/** Le serveur range chaque fichier par nom : un nom unique évite de retomber sur un ancien envoi. */
function uniqueFileName(fileName: string, date: Date): string {
  const stamp = date.toISOString().replace(/\D/g, '').slice(0, 14)
  return fileName.replace(/(\.[^.]+)?$/, `-${stamp}$1`)
}

export async function uploadRecording(blob: Blob, fileName: string): Promise<void> {
  const body = new FormData()
  // Avec un seul fichier, le champ « files » est refusé : le serveur y attend une liste.
  body.append('0', blob, uniqueFileName(fileName, new Date()))
  body.append('token', crypto.randomUUID())
  body.append('username', USERNAME)
  body.append('dbname', DBNAME)

  const response = await fetch(UPLOAD_URL, { method: 'POST', body, signal: AbortSignal.timeout(TIMEOUT_MS) })
  if (!response.ok) throw new Error(`Envoi refusé : ${response.status}`)
  // Une erreur de traitement revient aussi avec le statut 200 : seule la liste des fichiers confirme l'envoi.
  const result = (await response.json()) as { files?: unknown }
  if (!Array.isArray(result.files) || result.files.length === 0) throw new Error('Envoi non confirmé')
}
