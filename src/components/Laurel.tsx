/** Lauriers de festival : deux branches autour du nom du prix (« Prix du public · Fantasia 2025 »). */
const r = (n: number) => Math.round(n * 10) / 10

// Une branche : une tige en arc de cercle et des paires de feuilles, du bas vers le haut, à gauche.
const leaves = Array.from({ length: 7 }, (_, i) => {
  const deg = 112 + i * 21
  const a = (deg * Math.PI) / 180
  const x = 40 + 34 * Math.cos(a)
  const y = 46 + 34 * Math.sin(a)
  const tangent = deg + 90
  const nx = Math.cos(a) * 4.5
  const ny = Math.sin(a) * 4.5
  return [
    { cx: r(x + nx), cy: r(y + ny), rot: r(tangent + 28) },
    { cx: r(x - nx), cy: r(y - ny), rot: r(tangent - 28) },
  ]
}).flat()

function Branch({ flip }: { flip?: boolean }) {
  return (
    <svg viewBox="-2 6 38 82" className={flip ? 'flip' : undefined} aria-hidden="true">
      <path d="M 27.3 77.5 A 34 34 0 0 1 28.3 14" fill="none" stroke="currentColor" strokeWidth="1.2" />
      {leaves.map((l, i) => <ellipse key={i} cx={l.cx} cy={l.cy} rx="5.2" ry="2.1" transform={`rotate(${l.rot} ${l.cx} ${l.cy})`} fill="currentColor" />)}
    </svg>
  )
}

export function Laurel({ text }: { text: string }) {
  const [award, festival] = text.split('·').map((s) => s.trim())
  return (
    <span className="laurel">
      <Branch />
      <span className="laurel-text">
        <b>{award}</b>
        {festival && <span>{festival}</span>}
      </span>
      <Branch flip />
    </span>
  )
}
