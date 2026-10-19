import { NextResponse } from 'next/server'
import { searchPlaces } from '@/lib/geocoding'

export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get('q')?.trim() ?? ''
  if (q.length < 2 || q.length > 60) {
    return NextResponse.json({ results: [] })
  }
  try {
    const results = await searchPlaces(q)
    return NextResponse.json({ results })
  } catch {
    return NextResponse.json(
      { error: 'No pudimos buscar ciudades en este momento.' },
      { status: 502 },
    )
  }
}
