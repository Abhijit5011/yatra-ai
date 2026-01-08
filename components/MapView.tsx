
import React, { useEffect, useRef } from 'react';
import { Destination } from '../types';

// Declare L as a global variable provided by the Leaflet library script
declare const L: any;

interface MapViewProps {
  destinations: Destination[];
  onSelect: (id: string) => void;
  center?: [number, number];
  zoom?: number;
}

const MapView: React.FC<MapViewProps> = ({ destinations, onSelect, center = [20, 0], zoom = 2 }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<any>(null);

  useEffect(() => {
    if (mapRef.current && !leafletMap.current) {
      // Fix: Use global L variable to initialize the map
      leafletMap.current = L.map(mapRef.current).setView(center, zoom);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(leafletMap.current);
    }

    if (leafletMap.current) {
      // Clear existing markers
      leafletMap.current.eachLayer((layer: any) => {
        if (layer instanceof L.Marker) {
          leafletMap.current.removeLayer(layer);
        }
      });

      // Add markers
      destinations.forEach(dest => {
        const marker = L.marker([dest.location_lat, dest.location_lng])
          .addTo(leafletMap.current)
          .bindPopup(`<b>${dest.name}</b><br>${dest.category}`);
        
        marker.on('click', () => onSelect(dest.id));
      });
    }

    return () => {
      // Cleanup if needed
    };
  }, [destinations, onSelect, center, zoom]);

  return <div ref={mapRef} className="w-full h-[400px] rounded-2xl shadow-inner border border-slate-200 overflow-hidden" />;
};

export default MapView;
