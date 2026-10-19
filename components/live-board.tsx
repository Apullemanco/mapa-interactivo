'use client'

import type { ReactNode } from 'react'
import useSWR from 'swr'
import type { BoardSnapshot } from '@/lib/store'
import { PinLayer } from './pin-layer'
import { QrPanel } from './qr-panel'
import { RegionStats } from './region-stats'
import { RecentFeed } from './recent-feed'

const fetcher = (url: string) =>
  fetch(url, { cache: 'no-store' }).then((r) => r.json() as Promise<BoardSnapshot>)

export function LiveBoard({
  registerUrl,
  mapWidth,
  mapHeight,
  initialSnapshot,
  land,
}: {
  registerUrl: string
  mapWidth: number
  mapHeight: number
  initialSnapshot: BoardSnapshot
  land: ReactNode
}) {
  const { data } = useSWR('/api/registros', fetcher, {
    refreshInterval: 2500,
    fallbackData: initialSnapshot,
    revalidateOnFocus: true,
  })
  const snapshot = data ?? initialSnapshot

  return (
    <main className="flex min-h-dvh flex-col gap-6 p-5 md:p-8 lg:h-dvh lg:gap-8 lg:p-10">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-2">
          <p className="flex items-center gap-2 text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex size-2.5 rounded-full bg-primary" />
            </span>
            Jardín de las Carreras · En vivo
          </p>
          <h1 className="font-heading text-5xl font-bold leading-none tracking-tight text-balance md:text-6xl xl:text-7xl">
            ¿De dónde vienes?
          </h1>
        </div>
        <div className="flex items-baseline gap-3" aria-live="polite">
          <span className="font-heading text-6xl font-bold tabular-nums leading-none text-primary xl:text-7xl">
            {snapshot.total.toLocaleString('es')}
          </span>
          <span className="max-w-32 text-base leading-snug text-muted-foreground">
            {snapshot.total === 1 ? 'semilla sembrada' : 'semillas sembradas'}
          </span>
        </div>
      </header>

      <div className="grid min-h-0 flex-1 gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-10">
        <section
          aria-label="Mapa de participantes"
          className="relative flex min-h-64 items-center justify-center"
        >
          <svg
            viewBox={`0 0 ${mapWidth} ${mapHeight}`}
            preserveAspectRatio="xMidYMid meet"
            className="size-full max-h-full"
            role="img"
            aria-label={`Mapa de puntos con ${snapshot.total} participantes registrados`}
          >
            <defs>
              <filter id="pin-blur" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="0.6" />
              </filter>
            </defs>
            {land}
            <PinLayer pins={snapshot.pins} now={snapshot.updatedAt} />
          </svg>
          {snapshot.total === 0 && (
            <p className="absolute inset-x-0 bottom-4 text-center text-lg text-muted-foreground text-pretty">
              El jardín está listo. Escanea el código y siembra el primer punto.
            </p>
          )}
        </section>

        <aside className="flex min-h-0 flex-col gap-5">
          <QrPanel url={registerUrl} />
          <RegionStats regions={snapshot.regions} total={snapshot.total} />
          <RecentFeed recent={snapshot.recent} now={snapshot.updatedAt} />
        </aside>
      </div>
    </main>
  )
}
