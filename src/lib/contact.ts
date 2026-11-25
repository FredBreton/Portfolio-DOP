import { createHmac } from 'node:crypto'

export type Message = { nom: string; courriel: string; type: 'film' | 'video'; message: string }
type Refusal = 'piege' | 'requis' | 'courriel' | 'long'

const LIMITS = { nom: 120, courriel: 254, message: 8000 }

/** Valide le formulaire. « piege » : un robot a rempli le champ caché. */
export function readMessage(form: FormData): { ok: true; data: Message } | { ok: false; reason: Refusal } {
  const read = (key: string) => {
    const value = form.get(key)
    return typeof value === 'string' ? value.trim() : ''
  }
  if (read('site_web')) return { ok: false, reason: 'piege' }
  const data = { nom: read('nom'), courriel: read('courriel'), message: read('message') }
  if (!data.nom || !data.courriel || !data.message) return { ok: false, reason: 'requis' }
  if (Object.entries(LIMITS).some(([key, max]) => data[key as keyof typeof data].length > max)) return { ok: false, reason: 'long' }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.courriel)) return { ok: false, reason: 'courriel' }
  // Le nom sert dans l'objet du courriel : aucune fin de ligne.
  return { ok: true, data: { ...data, nom: data.nom.replace(/\s+/g, ' '), type: read('type') === 'video' ? 'video' : 'film' } }
}

/** Empreinte de l'expéditeur : son adresse IP n'est jamais conservée en clair. */
export const senderKey = (identity: string, secret: string) =>
  createHmac('sha256', secret).update(identity.toLowerCase()).digest('hex')

export async function verifyTurnstile(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim()
  if (!secret) return true
  if (!token || token.length > 2048) return false
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, response: token }),
      signal: AbortSignal.timeout(8000),
    })
    return res.ok && (await res.json()).success === true
  } catch {
    return false
  }
}
