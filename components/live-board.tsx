'use client'

'use client'

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
    <main className="origins-shell relative min-h-dvh overflow-hidden lg:h-dvh">
      <section aria-label="Mapa de participantes" className="origins-map absolute inset-0">
        <LeafletMapView pins={snapshot.pins} />
      </section>
      <div className="pointer-events-none absolute inset-0 z-10 p-5 md:p-8 lg:p-10">
        <div className="pointer-events-auto ml-auto w-full max-w-sm lg:w-80">
          <QrPanel url={registerUrl} />
        </div>
      </div>
      <div className="sr-only"><RegionStats regions={snapshot.regions} total={snapshot.total} /><RecentFeed recent={snapshot.recent} now={snapshot.updatedAt} /></div>
    </main>
  )
}
