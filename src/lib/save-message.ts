import type { Payload } from 'payload'

import { senderKey, type Message } from './contact'

const WINDOW = 10 * 60 * 1000
const MAX = 3
const KIND = { film: 'Fiction ou documentaire', video: 'Création vidéo' }
const escape = (v: string) => v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** Enregistre d'abord le message, puis tente l'avis par courriel : une panne de courriel ne perd rien. */
export async function saveMessage(payload: Payload, data: Message, identity: string, mailReady = Boolean(process.env.SMTP_HOST)): Promise<'ok' | 'limite'> {
  const expediteur = senderKey(identity, payload.secret)
  // shortcut: comptage non atomique, quelques envois simultanés peuvent passer; à durcir si le pourriel devient un problème.
  const recent = await payload.count({
    collection: 'messages',
    where: { expediteur: { equals: expediteur }, createdAt: { greater_than: new Date(Date.now() - WINDOW).toISOString() } },
  })
  if (recent.totalDocs >= MAX) return 'limite'

  const saved = await payload.create({ collection: 'messages', data: { ...data, expediteur, notification: 'attente' } })

  let notification: 'envoye' | 'desactive' | 'echec' = 'desactive'
  let erreur: string | null = null
  try {
    const settings = await payload.findGlobal({ slug: 'reglages' })
    const to = settings.courrielMessages || settings.courriel
    if (mailReady && to) {
      await payload.sendEmail({
        to,
        replyTo: data.courriel,
        subject: `Nouveau message de ${data.nom}`,
        text: `Nom : ${data.nom}\nCourriel : ${data.courriel}\nProjet : ${KIND[data.type]}\n\n${data.message}`,
        html: `<p><b>Nom :</b> ${escape(data.nom)}<br><b>Courriel :</b> ${escape(data.courriel)}<br><b>Projet :</b> ${KIND[data.type]}</p><p style="white-space:pre-wrap">${escape(data.message)}</p>`,
      })
      notification = 'envoye'
    }
  } catch (error) {
    notification = 'echec'
    erreur = error instanceof Error ? error.message : String(error)
    payload.logger.error(`Avis par courriel non envoyé (message ${saved.id}) : ${erreur}`)
  }
  try {
    await payload.update({ collection: 'messages', id: saved.id, data: { notification, erreur } })
  } catch (error) {
    payload.logger.error({ err: error }, `État de l'avis non noté (message ${saved.id})`)
  }
  return 'ok'
}
