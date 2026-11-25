import { draftMode, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import type { NextRequest } from 'next/server'

import { db } from '@/lib/data'

/** Ouvre l'aperçu des brouillons, seulement pour une personne connectée à Payload. */
export async function GET(req: NextRequest) {
  const draft = await draftMode()
  if (req.nextUrl.searchParams.has('fin')) {
    draft.disable()
    redirect('/')
  }
  const { user } = await (await db()).auth({ headers: await headers() })
  if (!user) return new Response('Connectez-vous à Payload pour voir cet aperçu.', { status: 403 })
  draft.enable()
  const path = req.nextUrl.searchParams.get('path') ?? '/'
  // Seulement une adresse de ce site.
  redirect(/^\/(?![/\\])/.test(path) ? path : '/')
}
