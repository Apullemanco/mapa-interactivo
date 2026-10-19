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
      minZoom: 1.5,
      maxZoom: 5,
      maxBounds: [[-60, -180], [78, 180]],
      maxBoundsViscosity: 1,
      zoomControl: true,
      attributionControl: true,
      worldCopyJump: true,
    })

    new TileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19,
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
      return new CircleMarker([latitude, longitude], {
        radius: Math.min(12, 5 + pin.count * 1.2),
        color: '#c8f54a',
        weight: 2,
        fillColor: '#c8f54a',
        fillOpacity: 0.9,
        bubblingPointerEvents: false,
      }).bindTooltip(`${pin.count} origin${pin.count === 1 ? '' : 's'}`, { direction: 'top', opacity: 0.9 }).addTo(map)
    })
  }, [pins])

  return <div ref={containerRef} className="leaflet-map" aria-label="Mapa satelital interactivo de orígenes" />
}
