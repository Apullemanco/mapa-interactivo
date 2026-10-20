import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
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

  const payload = body as { lat?: unknown; lng?: unknown }
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

  if (!hasCoordinates) {
    return NextResponse.json({ error: 'Selecciona un punto en el mapa.' }, { status: 400 })
  }

  const record = addRegistration({
    city: 'Origen seleccionado',
    region: 'Comunidad estudiantil',
    x: suppliedLng,
    y: suppliedLat,
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
