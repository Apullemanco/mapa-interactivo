'use client'

import { useEffect, useRef } from 'react'
import { CircleMarker, Map as LeafletMap, TileLayer, type Map as LeafletMapInstance } from 'leaflet'
import 'leaflet/dist/leaflet.css'

type Pin = { x: number; y: number; count: number; last: number }

export function LeafletMapView({ pins }: { pins: Pin[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<LeafletMapInstance | null>(null)
  const markersRef = useRef<CircleMarker[]>([])

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = new LeafletMap(containerRef.current, {
      center: [18, 0],
      // Zoom mínimo 4: el ancho del mundo es mayor que la pantalla de evento,
      // así Leaflet no necesita repetirlo horizontalmente.
      zoom: 4,
      minZoom: 4,
      maxZoom: 7,
      // Un único mundo visible: el arrastre queda limitado a sus bordes.
      maxBounds: [[-78, -180], [82, 180]],
      maxBoundsViscosity: 1,
      inertia: true,
      bounceAtZoomLimits: false,
      zoomControl: true,
      attributionControl: true,
      worldCopyJump: false,
    })

    new TileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19,
      noWrap: true,
      attribution: 'Tiles © Esri',
    }).addTo(map)

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
        color: '#d9ff55',
        weight: 1,
        fillColor: '#d9ff55',
        fillOpacity: 0.9,
        bubblingPointerEvents: false,
      }).addTo(map)
    })
  }, [pins])

  return <div ref={containerRef} className="leaflet-map" aria-label="Mapa satelital interactivo de orígenes" />
}
