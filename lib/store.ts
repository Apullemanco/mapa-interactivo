import 'server-only'
import { REGIONS, type Region } from './regions'

export type Registration = {
  id: string
  city: string
  region: Region
  x: number
  y: number
  createdAt: number
}

export type BoardSnapshot = {
  total: number
  regions: { name: Region; count: number }[]
  recent: Pick<Registration, 'id' | 'city' | 'region' | 'createdAt'>[]
  pins: { x: number; y: number; count: number; last: number }[]
  updatedAt: number
}

/*
 * Almacenamiento en memoria del servidor. Sirve para la vista previa y para un
 * único servidor durante el evento; para producción multi-instancia conviene
 * reemplazarlo por una base de datos (Neon, Supabase, etc.).
 */
const globalForStore = globalThis as unknown as {
  __registrations?: Registration[]
}

function getAll(): Registration[] {
  if (!globalForStore.__registrations) globalForStore.__registrations = []
  return globalForStore.__registrations
}

export function addRegistration(entry: Omit<Registration, 'id' | 'createdAt'>) {
  const record: Registration = {
    ...entry,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  }
  getAll().push(record)
  return record
}

export function getSnapshot(): BoardSnapshot {
  const all = getAll()

  const regionCounts = new Map<Region, number>(REGIONS.map((r) => [r, 0]))
  const pinMap = new Map<string, BoardSnapshot['pins'][number]>()

  for (const r of all) {
    regionCounts.set(r.region, (regionCounts.get(r.region) ?? 0) + 1)
    const key = `${r.x}:${r.y}`
    const pin = pinMap.get(key)
    if (pin) {
      pin.count += 1
      pin.last = Math.max(pin.last, r.createdAt)
    } else {
      pinMap.set(key, { x: r.x, y: r.y, count: 1, last: r.createdAt })
    }
  }

  return {
    total: all.length,
    regions: REGIONS.map((name) => ({
      name,
      count: regionCounts.get(name) ?? 0,
    })),
    recent: all
      .slice(-6)
      .reverse()
      .map(({ id, city, region, createdAt }) => ({
        id,
        city,
        region,
        createdAt,
      })),
    pins: [...pinMap.values()],
    updatedAt: Date.now(),
  }
}
