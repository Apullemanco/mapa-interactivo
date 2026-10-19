import 'server-only'
import DottedMap from 'dotted-map'

const MAP_HEIGHT = 80
const LAT_MIN = -55
const LAT_MAX = 70

type WorldMap = {
  map: DottedMap
  width: number
  height: number
  points: { x: number; y: number }[]
}

const globalForMap = globalThis as unknown as { __worldMap?: WorldMap }

function getWorldMap(): WorldMap {
  if (!globalForMap.__worldMap) {
    const map = new DottedMap({ height: MAP_HEIGHT, grid: 'diagonal' })
    const { width, height } = map.image
    const points = map.getPoints().map((p) => ({ x: p.x, y: p.y }))
    globalForMap.__worldMap = { map, width, height, points }
  }
  return globalForMap.__worldMap
}

export function getLandPoints() {
  const { width, height, points } = getWorldMap()
  return { width, height, points }
}

export function projectToMap(lat: number, lng: number) {
  const { map } = getWorldMap()
  const safeLat = Math.min(LAT_MAX, Math.max(LAT_MIN, lat))
  const pin = map.getPin({ lat: safeLat, lng })
  if (!pin) return null
  return { x: Math.round(pin.x * 10) / 10, y: Math.round(pin.y * 10) / 10 }
}
