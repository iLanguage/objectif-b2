import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { uploadRecording } from './upload'

const fetchMock = vi.fn()
const reply = (body: unknown, status = 200) => Promise.resolve(new Response(JSON.stringify(body), { status }))
const sent = () => fetchMock.mock.calls[0][1].body as FormData

describe('uploadRecording', () => {
  beforeEach(() => {
    fetchMock.mockReset()
    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('envoie le fichier et les champs attendus par le service', async () => {
    fetchMock.mockReturnValue(reply({ status: 200, files: [{ fileBaseName: 'bonjour' }] }))
    await uploadRecording(new Blob(['voix'], { type: 'audio/webm' }), 'bonjour.webm')

    expect(fetchMock.mock.calls[0][0]).toContain('/extract/')
    expect(fetchMock.mock.calls[0][1].method).toBe('POST')
    const body = sent()
    expect(body.get('username')).toBe('mikael')
    expect(body.get('dbname')).toBe('mikael-objectif-b2')
    expect(body.get('token')).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
    expect((body.get('0') as File).name).toMatch(/^bonjour-\d{14}\.webm$/)
    expect((body.get('0') as File).size).toBe(4)
  })

  it('crée un jeton différent à chaque envoi', async () => {
    fetchMock.mockImplementation(() => reply({ files: [{}] }))
    await uploadRecording(new Blob(['voix']), 'a.webm')
    await uploadRecording(new Blob(['voix']), 'a.webm')
    const tokens = fetchMock.mock.calls.map(([, init]) => (init.body as FormData).get('token'))
    expect(tokens[0]).not.toBe(tokens[1])
  })

  it('échoue si le serveur refuse le fichier', async () => {
    fetchMock.mockReturnValue(reply({ status: 413 }, 413))
    await expect(uploadRecording(new Blob(['voix']), 'a.webm')).rejects.toThrow('413')
  })

  it('échoue si le traitement rate malgré un statut 200', async () => {
    fetchMock.mockReturnValue(reply({ status: 200, files: { status: 500, reason: 'ffmpeg' } }))
    await expect(uploadRecording(new Blob(['voix']), 'a.webm')).rejects.toThrow('non confirmé')
  })

  it('échoue hors connexion', async () => {
    fetchMock.mockRejectedValue(new TypeError('Failed to fetch'))
    await expect(uploadRecording(new Blob(['voix']), 'a.webm')).rejects.toThrow('Failed to fetch')
  })
})
