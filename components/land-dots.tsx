export function LandDots({ points }: { points: { x: number; y: number }[] }) {
  return (
    <g className="fill-land" aria-hidden="true">
      {points.map((p) => (
        <circle key={`${p.x}-${p.y}`} cx={p.x} cy={p.y} r={0.26} />
      ))}
    </g>
  )
}
