import type { Media } from '@/payload-types'

type Props = { image: Media | null; sizes: string; priority?: boolean; className?: string }

export function Picture({ image, sizes, priority, className }: Props) {
  if (!image?.url || !image.mimeType?.startsWith('image/')) return null
  const { petite, moyenne, grande } = image.sizes ?? {}
  const sources = [petite, moyenne, grande].flatMap((s) => (s?.url && s.width ? [`${encodeURI(decodeURI(s.url))} ${s.width}w`] : []))
  return (
    <img
      className={className}
      src={grande?.url ?? moyenne?.url ?? image.url}
      srcSet={sources.length ? sources.join(', ') : undefined}
      sizes={sizes}
      alt={image.alt ?? ''}
      width={image.width ?? undefined}
      height={image.height ?? undefined}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
      style={image.focalX != null ? { objectPosition: `${image.focalX}% ${image.focalY}%` } : undefined}
    />
  )
}
