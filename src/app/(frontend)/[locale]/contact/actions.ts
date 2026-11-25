'use server'

import { headers } from 'next/headers'

import { readMessage, verifyTurnstile } from '@/lib/contact'
import { db } from '@/lib/data'
import { saveMessage } from '@/lib/save-message'

export type ContactState = { status: 'vide' | 'ok' } | { status: 'erreur'; error: 'requis' | 'courriel' | 'long' | 'verification' | 'limite' | 'panne' }

export async function sendMessage(_previous: ContactState, form: FormData): Promise<ContactState> {
  const result = readMessage(form)
  if (!result.ok) return result.reason === 'piege' ? { status: 'ok' } : { status: 'erreur', error: result.reason }

  const token = form.get('cf-turnstile-response')
  if (!(await verifyTurnstile(typeof token === 'string' ? token : ''))) return { status: 'erreur', error: 'verification' }

  try {
    const h = await headers()
    // Seule l'adresse écrite par l'hébergeur est fiable; sinon, on se rabat sur le courriel.
    const ip = process.env.VERCEL ? h.get('x-vercel-forwarded-for') : process.env.NETLIFY ? h.get('x-nf-client-connection-ip') : null
    const outcome = await saveMessage(await db(), result.data, ip || result.data.courriel)
    return outcome === 'ok' ? { status: 'ok' } : { status: 'erreur', error: 'limite' }
  } catch (error) {
    console.error('Message non enregistré', error)
    return { status: 'erreur', error: 'panne' }
  }
}
