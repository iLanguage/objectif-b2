import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <div className="card text-center">
      <h1 className="text-2xl font-bold">Page introuvable</h1>
      <p className="mt-2">Cette page n’existe pas (ou plus).</p>
      <Link to="/" className="btn-primary mt-4">
        Retour au tableau de bord
      </Link>
    </div>
  )
}
