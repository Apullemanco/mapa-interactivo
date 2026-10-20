'use client'

import { Check, Loader2, MapPin, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { LeafletMapView } from '@/components/leaflet-map'

type Coordinates = { lat: number; lng: number }

export function RegistrationForm() {
  const [picked, setPicked] = useState<Coordinates | null>(null)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done'>('idle')
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!picked || status === 'submitting') return
    setStatus('submitting')
    setError(null)
    try {
      const response = await fetch('/api/registros', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(picked),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error ?? 'No se pudo registrar.')
      setStatus('done')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo registrar.')
      setStatus('idle')
    }
  }

  if (status === 'done') {
    return (
      <div className="flex flex-col items-center gap-5 rounded-3xl bg-card px-6 py-10 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Check className="size-8" aria-hidden="true" />
        </div>
        <h2 className="font-heading text-3xl font-bold">¡Punto registrado!</h2>
        <p className="leading-relaxed text-muted-foreground">Gracias por marcar de dónde viene nuestra comunidad estudiantil.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="overflow-hidden rounded-3xl border border-border bg-card">
        <div className="relative h-[48dvh] min-h-[360px] w-full">
          <LeafletMapView onPick={setPicked} picked={picked} />
          <div className="pointer-events-none absolute left-4 top-4 rounded-full bg-black/70 px-4 py-2 text-sm font-medium text-white">
            Toca el mapa para poner tu punto
          </div>
        </div>
      </div>

      {picked && (
        <div className="flex items-center gap-3 rounded-2xl border border-primary bg-card p-4">
          <MapPin className="size-6 shrink-0 text-primary" aria-hidden="true" />
          <span className="flex-1 text-sm text-muted-foreground">Punto seleccionado en el mapa</span>
          <button type="button" onClick={() => setPicked(null)} className="flex size-9 items-center justify-center rounded-full text-muted-foreground hover:bg-background" aria-label="Quitar punto">
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>
      )}

      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}

      <Button type="submit" size="lg" disabled={!picked || status === 'submitting'} className="h-14 rounded-2xl text-lg font-semibold">
        {status === 'submitting' ? <><Loader2 className="size-5 animate-spin" aria-hidden="true" /> Registrando…</> : 'Registrar este punto'}
      </Button>
    </form>
  )
}
