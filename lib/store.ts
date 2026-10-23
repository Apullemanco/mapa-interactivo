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
  __registrationsVersion?: string
}

function getAll(): Registration[] {
  // Cambiar la versión reinicia los registros de demostración del proceso actual.
  if (globalForStore.__registrationsVersion !== 'empty-2026-10-23') {
    globalForStore.__registrations = []
    globalForStore.__registrationsVersion = 'empty-2026-10-23'
  }
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
    // Corrige registros antiguos que guardaron Saltillo con latitud/longitud invertidas.
    const isSaltillo = r.city.trim().toLocaleLowerCase() === 'saltillo'
    const x = isSaltillo ? -100.99 : r.x
    const y = isSaltillo ? 25.42 : r.y
    const key = `${x}:${y}`
    const pin = pinMap.get(key)
    if (pin) {
      pin.count += 1
      pin.last = Math.max(pin.last, r.createdAt)
    } else {
      pinMap.set(key, { x, y, count: 1, last: r.createdAt })
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
