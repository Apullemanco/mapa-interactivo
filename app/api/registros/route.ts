import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getPlaceById } from '@/lib/geocoding'
import { addRegistration, getSnapshot } from '@/lib/store'
const COOKIE = 'jdc_registrado'

export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json(getSnapshot(), {
    headers: { 'Cache-Control': 'no-store' },
  })
}

export async function POST(request: Request) {
  const cookieStore = await cookies()
  if (cookieStore.get(COOKIE)) {
    return NextResponse.json(
      { error: 'Ya registraste tu ciudad desde este dispositivo.' },
      { status: 409 },
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Solicitud inválida.' }, { status: 400 })
  }

  const payload = body as { id?: unknown; lat?: unknown; lng?: unknown }
  const id = payload.id
  if (typeof id !== 'number' || !Number.isInteger(id) || id <= 0) {
    return NextResponse.json(
      { error: 'Selecciona una ciudad de la lista.' },
      { status: 400 },
    )
  }

  const suppliedLat = payload.lat
  const suppliedLng = payload.lng
  const hasCoordinates =
    typeof suppliedLat === 'number' &&
    typeof suppliedLng === 'number' &&
    Number.isFinite(suppliedLat) &&
    Number.isFinite(suppliedLng) &&
    suppliedLat >= -90 &&
    suppliedLat <= 90 &&
    suppliedLng >= -180 &&
    suppliedLng <= 180

  const place = await getPlaceById(id)
  if (!place) {
    return NextResponse.json(
      { error: 'No encontramos esa ciudad. Intenta de nuevo.' },
      { status: 404 },
    )
  }

  const record = addRegistration({
    city: place.name.slice(0, 60),
    region: place.region,
    // Usamos las coordenadas de la ciudad elegida en el buscador.
    // Leaflet recibe longitud como x y latitud como y.
    x: hasCoordinates ? suppliedLng : place.lng,
    y: hasCoordinates ? suppliedLat : place.lat,
  })

  const response = NextResponse.json({
    city: record.city,
    region: record.region,
  })
  response.cookies.set(COOKIE, '1', {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    maxAge: 60 * 60 * 8,
    path: '/',
  })
  return response
}
