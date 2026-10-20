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
      center: [20, 0],
      zoom: 2,
      // Mantiene un único mundo visible y evita que el mapa se repita al arrastrar.
      minZoom: 3,
      maxZoom: 6,
      // El límite vertical contiene el mapa dentro de las teselas, sin desplazamiento infinito.
      maxBounds: [[-60, -180], [75, 180]],
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
      const latitude = 70 - (pin.y / 80) * 125
      const longitude = (pin.x / 180) * 360 - 180
      return       new CircleMarker([latitude, longitude], {
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
