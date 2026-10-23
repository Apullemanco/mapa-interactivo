'use client'

import { useEffect, useRef } from 'react'
import { CircleMarker, Map as LeafletMap, TileLayer, type Map as LeafletMapInstance } from 'leaflet'
import 'leaflet/dist/leaflet.css'

type Pin = { x: number; y: number; count: number; last: number }

type LeafletMapViewProps = {
  pins?: Pin[]
  onPick?: (coordinates: { lat: number; lng: number }) => void
  picked?: { lat: number; lng: number } | null
}

export function LeafletMapView({ pins = [], onPick, picked }: LeafletMapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<LeafletMapInstance | null>(null)
  const markersRef = useRef<CircleMarker[]>([])
  const pickedMarkerRef = useRef<CircleMarker | null>(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = new LeafletMap(containerRef.current, {
      center: [20, 0],
      // Un encuadre amplio muestra un solo mundo, con el mapa recortado
      // naturalmente por la pantalla y sin repetirlo horizontalmente.
      zoom: 3,
      minZoom: 3,
      maxZoom: 22,
      maxBounds: [[-58, -180], [78, 180]],
      maxBoundsViscosity: 1,
      inertia: true,
      bounceAtZoomLimits: false,
      zoomControl: true,
      attributionControl: true,
      worldCopyJump: false,
    })

    new TileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxNativeZoom: 19,
      maxZoom: 22,
      noWrap: true,
      attribution: 'Tiles © Esri',
    }).addTo(map)

    if (onPick) {
      map.on('click', (event) => onPick({ lat: event.latlng.lat, lng: event.latlng.lng }))
    }

    mapRef.current = map
    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    markersRef.current.forEach((marker) => marker.remove())
    markersRef.current = pins.map((pin) => {
      // Las coordenadas se guardan como longitud (x) y latitud (y),
      // por lo que Leaflet puede posicionarlas directamente sin una segunda proyección.
      return new CircleMarker([pin.y, pin.x], {
        radius: 5,
        color: '#12b8d8',
        weight: 1,
        fillColor: '#12b8d8',
        fillOpacity: 0.9,
        bubblingPointerEvents: false,
      }).addTo(map)
    })
  }, [pins])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    pickedMarkerRef.current?.remove()
    pickedMarkerRef.current = picked
      ? new CircleMarker([picked.lat, picked.lng], {
          radius: 7,
          color: '#b9f5ff',
          weight: 2,
          fillColor: '#12b8d8',
          fillOpacity: 1,
          bubblingPointerEvents: false,
        }).addTo(map)
      : null
  }, [picked])

  return <div ref={containerRef} className="leaflet-map" aria-label="Mapa satelital interactivo; toca para seleccionar tu origen" />
}
