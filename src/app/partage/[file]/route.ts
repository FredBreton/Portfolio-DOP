import sharp from 'sharp'

import { db } from '@/lib/data'

/** Image d'aperçu de partage en JPEG 1200 × 630 : LinkedIn et Facebook lisent mal le WebP. Adresse : /partage/<id>.jpg */
export async function GET(request: Request, { params }: { params: Promise<{ file: string }> }) {
  const id = Number((await params).file.match(/^(\d+)\.jpg$/)?.[1])
  if (!id) return new Response(null, { status: 404 })
  const image = await (await db()).findByID({ collection: 'media', id, depth: 0, disableErrors: true })
  if (!image?.url || !image.mimeType?.startsWith('image/')) return new Response(null, { status: 404 })
  const source = await fetch(new URL(image.url, request.url))
  if (!source.ok) return new Response(null, { status: 502 })
  const jpeg = await sharp(Buffer.from(await source.arrayBuffer()))
    .resize(1200, 630, { fit: 'cover' })
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer()
  return new Response(new Uint8Array(jpeg), {
    headers: { 'Content-Type': 'image/jpeg', 'Cache-Control': 'public, max-age=86400, s-maxage=31536000' },
  })
}
