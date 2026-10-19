'use client'

'use client'

import type { ReactNode } from 'react'
import useSWR from 'swr'
import type { BoardSnapshot } from '@/lib/store'
import { LeafletMapView } from './leaflet-map'
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
    <main className="origins-shell relative min-h-dvh overflow-hidden p-5 md:p-8 lg:h-dvh lg:p-10">
      <header className="origins-header relative z-10 flex items-start justify-between">
        <div>
          <p className="origin-wordmark">ORIGINS<span className="text-primary">/</span></p>
          <p className="origin-subtitle">Jardín de las Carreras · 2026</p>
        </div>
        <div className="live-pill" aria-live="polite">
          <span className="live-dot" />
          <span>{snapshot.total.toLocaleString('es')} origins live</span>
        </div>
      </header>

      <div className="origins-map-frame absolute inset-0">
        <section aria-label="Mapa de participantes" className="origins-map absolute inset-0 flex items-center justify-center">
          <div className="size-full max-h-full origin-center transition-transform duration-300">
            <LeafletMapView pins={snapshot.pins} />
          </div>
          <div className="map-caption"><span className="map-caption-line" />Live origins map</div>
        </section>
        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-5 md:p-8 lg:p-10">
          <div />
          <div className="pointer-events-auto ml-auto flex w-full max-w-sm flex-col gap-4 lg:w-80">
            <QrPanel url={registerUrl} />
            <div className="origin-counter"><span>{snapshot.total.toLocaleString('es')}</span> locations connected</div>
          </div>
        </div>
      </div>
      <div className="sr-only"><RegionStats regions={snapshot.regions} total={snapshot.total} /><RecentFeed recent={snapshot.recent} now={snapshot.updatedAt} /></div>
    </main>
  )
}
