import { headers } from 'next/headers'
import { LiveBoard } from '@/components/live-board'
import { LandDots } from '@/components/land-dots'
import { getSnapshot } from '@/lib/store'
import { getLandPoints } from '@/lib/world-map'

export default async function Page() {
  const h = await headers()
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost:3000'
  const proto = h.get('x-forwarded-proto') ?? 'https'
  const registerUrl = `${proto}://${host}/registro`

  const { width, height, points } = getLandPoints()

  return (
    <LiveBoard
      registerUrl={registerUrl}
      mapWidth={width}
      mapHeight={height}
      initialSnapshot={getSnapshot()}
      land={<LandDots points={points} />}
    />
  )
}
