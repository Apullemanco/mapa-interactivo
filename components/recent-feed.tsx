import type { BoardSnapshot } from '@/lib/store'

function timeAgo(ms: number) {
  const s = Math.max(0, Math.round(ms / 1000))
  if (s < 10) return 'ahora'
  if (s < 60) return `hace ${s} s`
  const m = Math.round(s / 60)
  if (m < 60) return `hace ${m} min`
  return `hace ${Math.round(m / 60)} h`
}

export function RecentFeed({
  recent,
  now,
}: {
  recent: BoardSnapshot['recent']
  now: number
}) {
  return (
    <section
      aria-labelledby="recent-title"
      className="flex min-h-0 flex-1 flex-col gap-3"
    >
      <h2
        id="recent-title"
        className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground"
      >
        Últimas llegadas
      </h2>
      {recent.length === 0 ? (
        <p className="text-base text-muted-foreground">Aún nadie. ¿Serás tú?</p>
      ) : (
        <ul className="flex min-h-0 flex-col gap-2 overflow-hidden" aria-live="polite">
          {recent.map((r, i) => (
            <li
              key={r.id}
              className="flex items-center justify-between gap-3 border-b border-border pb-2 animate-in fade-in slide-in-from-top-2 duration-500"
              style={{ opacity: 1 - i * 0.09 }}
            >
              <div className="flex min-w-0 flex-col">
                <span className="truncate font-heading text-lg font-semibold">{r.city}</span>
                <span className="text-sm text-muted-foreground">{r.region}</span>
              </div>
              <span className="shrink-0 text-sm tabular-nums text-muted-foreground">
                {timeAgo(now - r.createdAt)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
