import { db } from '@/lib/data'

/**
 * Appelé chaque mois par Vercel (vercel.json, crons). Brevo désactive une clé après 90 jours sans envoi :
 * ce courriel la garde active et prouve à Frédérick que les avis du formulaire partent encore.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) return new Response('Non autorisé', { status: 401 })

  const payload = await db()
  const settings = await payload.findGlobal({ slug: 'reglages' })
  const to = settings.courrielMessages || settings.courriel
  if (!process.env.SMTP_HOST || !to) return new Response('Courriel non configuré', { status: 503 })

  await payload.sendEmail({
    to,
    subject: 'Le formulaire de ton site fonctionne',
    text: 'Bonjour Frédérick,\n\nCe courriel automatique arrive le 1er de chaque mois. Il prouve que les messages du formulaire de contact de ton site te parviennent bien.\n\nSi tu ne le reçois plus un mois donné, la clé d’envoi Brevo a probablement expiré : voir la section « Les courriels du formulaire » de ton document de remise.',
  })
  return new Response('Envoyé')
}
