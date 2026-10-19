import 'server-only'
import { classifyRegion, type Region } from './regions'

const BASE = 'https://geocoding-api.open-meteo.com/v1'

type OpenMeteoPlace = {
  id: number
  name: string
  latitude: number
  longitude: number
  admin1?: string
  timezone?: string
  feature_code?: string
}

export type Place = {
  id: number
  name: string
  area: string | null
  region: Region
  lat: number
  lng: number
}

function toPlace(p: OpenMeteoPlace): Place {
  return {
    id: p.id,
    name: p.name,
    area: p.admin1 && p.admin1 !== p.name ? p.admin1 : null,
    region: classifyRegion(p.latitude, p.longitude, p.timezone),
    lat: p.latitude,
    lng: p.longitude,
  }
}

export async function searchPlaces(query: string): Promise<Place[]> {
  const url = `${BASE}/search?name=${encodeURIComponent(query)}&count=6&language=es&format=json`
  const res = await fetch(url, { next: { revalidate: 3600 } })
  if (!res.ok) throw new Error('Geocoding search failed')
  const data = (await res.json()) as { results?: OpenMeteoPlace[] }
  return (data.results ?? []).map(toPlace)
}

export async function getPlaceById(id: number): Promise<Place | null> {
  const res = await fetch(`${BASE}/get?id=${id}&language=es`, {
    next: { revalidate: 86400 },
  })
  if (!res.ok) return null
  const data = (await res.json()) as Partial<OpenMeteoPlace>
  if (
    typeof data.id !== 'number' ||
    typeof data.latitude !== 'number' ||
    typeof data.longitude !== 'number' ||
    !data.name
  ) {
    return null
  }
  return toPlace(data as OpenMeteoPlace)
}
