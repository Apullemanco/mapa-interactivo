import type { BoardSnapshot } from '@/lib/store'

export function RegionStats({
  regions,
  total,
}: {
  regions: BoardSnapshot['regions']
  total: number
}) {
  const max = Math.max(1, ...regions.map((r) => r.count))
  return (
    <section aria-labelledby="regions-title" className="flex flex-col gap-3">
      <h2
        id="regions-title"
        className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground"
      >
        Por región
      </h2>
      <ul className="flex flex-col gap-2.5">
        {regions.map((r) => {
          const pct = total ? Math.round((r.count / total) * 100) : 0
          return (
            <li key={r.name} className="flex flex-col gap-1">
              <div className="flex items-baseline justify-between gap-3 text-base">
                <span>{r.name}</span>
                <span className="tabular-nums text-muted-foreground">
                  <span className="font-semibold text-foreground">{r.count}</span>
                  {total > 0 && <span className="text-sm">{` · ${pct}%`}</span>}
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-card">
                <div
                  className="h-full rounded-full bg-primary transition-[width] duration-700 ease-out"
                  style={{ width: `${(r.count / max) * 100}%` }}
                />
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
