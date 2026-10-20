'use client'

import { Check, Loader2, MapPin, Search, X } from 'lucide-react'
import { useEffect, useId, useState } from 'react'
import useSWR from 'swr'
import { Button } from '@/components/ui/button'

type Place = {
  id: number
  name: string
  area: string | null
  region: string
  lat: number
  lng: number
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  const data = await res.json()
  if (!res.ok) throw new Error(data.error ?? 'Error de búsqueda')
  return data.results as Place[]
}

function useDebounced<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

export function RegistrationForm() {
  const inputId = useId()
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Place | null>(null)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done'>('idle')
  const [error, setError] = useState<string | null>(null)

  const q = useDebounced(query.trim())
  const { data: results, isLoading, error: searchError } = useSWR(
    !selected && q.length >= 2 ? `/api/buscar?q=${encodeURIComponent(q)}` : null,
    fetcher,
    { keepPreviousData: true },
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selected || status === 'submitting') return
    setStatus('submitting')
    setError(null)
    try {
      const res = await fetch('/api/registros', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selected.id,
          lat: selected.lat,
          lng: selected.lng,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'No se pudo registrar.')
      setStatus('done')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo registrar.')
      setStatus('idle')
    }
  }

  if (status === 'done' && selected) {
    return (
      <div className="flex flex-col items-center gap-5 rounded-3xl bg-card px-6 py-10 text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Check className="size-8" aria-hidden="true" />
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="font-heading text-3xl font-bold">¡Ya estás en el mapa!</h2>
          <p className="text-lg">
            {selected.name} · <span className="text-muted-foreground">{selected.region}</span>
          </p>
        </div>
        <p className="leading-relaxed text-muted-foreground text-pretty">
          Mira la pantalla grande: tu punto acaba de florecer.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {selected ? (
        <div className="flex items-center gap-4 rounded-2xl border border-primary bg-card p-4">
          <MapPin className="size-6 shrink-0 text-primary" aria-hidden="true" />
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate font-heading text-xl font-semibold">{selected.name}</span>
            <span className="truncate text-sm text-muted-foreground">
              {[selected.area, selected.region].filter(Boolean).join(' · ')}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              setSelected(null)
              setError(null)
            }}
            className="flex size-10 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-background hover:text-foreground"
          >
            <X className="size-5" aria-hidden="true" />
            <span className="sr-only">Cambiar ciudad</span>
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <label htmlFor={inputId} className="font-medium">
            ¿De qué ciudad vienes?
          </label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              id={inputId}
              type="search"
              autoComplete="off"
              enterKeyHint="search"
              placeholder="Ej. Medellín, Lima, Madrid…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key !== 'Enter') return
                e.preventDefault()
                if (e.nativeEvent.isComposing || e.keyCode === 229) return
                if (results?.[0]) setSelected(results[0])
              }}
              className="h-14 w-full rounded-2xl border border-input bg-card pl-12 pr-12 text-lg outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
            />
            {isLoading && (
              <Loader2
                className="absolute right-4 top-1/2 size-5 -translate-y-1/2 animate-spin text-muted-foreground"
                aria-hidden="true"
              />
            )}
          </div>

          {searchError && (
            <p role="alert" className="text-sm text-destructive">
              {searchError.message}
            </p>
          )}

          {q.length >= 2 && results && (
            <ul className="flex flex-col gap-2" aria-label="Resultados">
              {results.length === 0 && !isLoading && (
                <li className="px-1 text-muted-foreground">
                  Sin resultados. Prueba con otra ortografía.
                </li>
              )}
              {results.map((place) => (
                <li key={place.id}>
                  <button
                    type="button"
                    onClick={() => setSelected(place)}
                    className="flex w-full items-center gap-3 rounded-xl bg-card px-4 py-3 text-left transition-colors hover:bg-border focus-visible:outline-2 focus-visible:outline-ring"
                  >
                    <MapPin className="size-5 shrink-0 text-primary" aria-hidden="true" />
                    <span className="flex min-w-0 flex-col">
                      <span className="truncate font-medium">{place.name}</span>
                      <span className="truncate text-sm text-muted-foreground">
                        {[place.area, place.region].filter(Boolean).join(' · ')}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={!selected || status === 'submitting'}
        className="h-14 rounded-2xl text-lg font-semibold"
      >
        {status === 'submitting' ? (
          <>
            <Loader2 className="size-5 animate-spin" aria-hidden="true" />
            Registrando…
          </>
        ) : (
          'Registrar mi origen'
        )}
      </Button>
    </form>
  )
}
