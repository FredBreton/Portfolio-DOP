import { Fragment, type CSSProperties } from 'react'

// Chaque mot monte de sous sa ligne, l'un après l'autre (voir .words dans site.css).
export function Words({ text }: { text?: string | null }) {
  return (
    <span className="words">
      {(text ?? '').split(/\s+/).filter(Boolean).map((word, i) => (
        <Fragment key={i}>{i > 0 && ' '}<span className="w"><span style={{ '--i': i } as CSSProperties}>{word}</span></span></Fragment>
      ))}
    </span>
  )
}
