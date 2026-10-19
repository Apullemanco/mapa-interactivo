import type { BoardSnapshot } from '@/lib/store'

const FRESH_MS = 12_000

export function PinLayer({
  pins,
  now,
}: {
  pins: BoardSnapshot['pins']
  now: number
}) {
  return (
    <g aria-hidden="true">
      {pins.map((pin) => {
        const r = 0.42 + Math.min(pin.count, 25) * 0.05
        const fresh = now - pin.last < FRESH_MS
        return (
          <g key={`${pin.x}:${pin.y}`} className="fill-primary">
            <circle
              className="pin pin-glow"
              cx={pin.x}
              cy={pin.y}
              r={r * 3.2}
              opacity={0.22}
              filter="url(#pin-blur)"
            />
            {fresh && (
              <circle
                key={pin.last}
                className="pin pin-ripple stroke-primary"
                cx={pin.x}
                cy={pin.y}
                r={r}
                fill="none"
                strokeWidth={0.12}
              />
            )}
            <circle className="pin pin-core" cx={pin.x} cy={pin.y} r={r} />
          </g>
        )
      })}
    </g>
  )
}
