import Link from 'next/link'

// Next ne transmet pas la langue ici : le message est donné dans les deux langues.
export default function NotFound() {
  return (
    <div className="intro">
      <h1>404</h1>
      <p className="lead">Cette page est introuvable. <Link className="link" href="/">Retour à l’accueil</Link></p>
      <p className="lead" lang="en">This page could not be found. <Link className="link" href="/en">Back to home</Link></p>
    </div>
  )
}
