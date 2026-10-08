import React, { useEffect, useRef } from 'react';
import { Locate, Plus, Minus, Layers } from 'lucide-react';
import { SeedWorker, SeedCrew } from '../data/mockSeed';

interface MapDiscoveryViewProps {
  workers: SeedWorker[];
  crews: SeedCrew[];
  selectedId: string | null;
  onSelectWorker: (worker: SeedWorker) => void;
  onSelectCrew: (crew: SeedCrew) => void;
  userCoords: [number, number];
}

declare global {
  interface Window {
    L: any;
  }
}

export const MapDiscoveryView: React.FC<MapDiscoveryViewProps> = ({
  workers,
  crews,
  selectedId,
  onSelectWorker,
  onSelectCrew,
  userCoords,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || !window.L) return;

    if (!mapInstanceRef.current) {
      // Create Leaflet Map centered around Coimbatore (11.0168, 76.9558)
      const map = window.L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false,
      }).setView([11.025, 76.995], 13);

      // Clean tile layer with good landmark contrast (CartoDB Positron / OSM style)
      window.L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      // Markers Layer Group
      const markersLayer = window.L.layerGroup().addTo(map);
      markersLayerRef.current = markersLayer;
      mapInstanceRef.current = map;
    }
  }, []);

  // Update Markers when workers, crews, or selection changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layer = markersLayerRef.current;
    if (!map || !layer || !window.L) return;

    layer.clearLayers();

    // 1. Add User Location Marker (Pulse ring)
    const userIcon = window.L.divIcon({
      className: 'user-pin-custom',
      html: `
        <div style="position: relative; width: 24px; height: 24px;">
          <div style="position: absolute; width: 24px; height: 24px; background: rgba(0, 112, 192, 0.25); border-radius: 50%; animation: pulse 1.8s infinite;"></div>
          <div style="position: absolute; top: 4px; left: 4px; width: 16px; height: 16px; background: #0070C0; border: 2.5px solid white; border-radius: 50%; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
    window.L.marker(userCoords, { icon: userIcon }).addTo(layer);

    // 2. Add Worker Pins with Ratings (PPT Requirement F5)
    workers.forEach((worker) => {
      const isSelected = worker.id === selectedId;
      const isKeypad = worker.isKeypadPreBookOnly;

      const html = `
        <div class="rating-pin-container ${isSelected ? 'selected' : ''}" id="worker-pin-${worker.id}">
          <div class="rating-pin-pill ${isKeypad ? 'keypad-pin' : ''}">
            <img src="${worker.avatarUrl}" class="rating-pin-avatar" alt="${worker.name}" />
            <span class="star-gold">★</span>
            <span>${worker.ratingAverage.toFixed(2)}</span>
            ${isKeypad ? '<span style="font-size: 9px; color: #b45309; margin-left: 2px;">📞</span>' : ''}
          </div>
          <div class="rating-pin-triangle"></div>
        </div>
      `;

      const customIcon = window.L.divIcon({
        className: 'leaflet-marker-clean',
        html,
        iconSize: [84, 42],
        iconAnchor: [42, 38],
      });

      const marker = window.L.marker([worker.latitude, worker.longitude], {
        icon: customIcon,
      }).addTo(layer);

      marker.on('click', () => {
        onSelectWorker(worker);
      });
    });

    // 3. Add Crew Pins (Worker Groups)
    crews.forEach((crew) => {
      const isSelected = crew.id === selectedId;
      const html = `
        <div class="rating-pin-container ${isSelected ? 'selected' : ''}" id="crew-pin-${crew.id}">
          <div class="rating-pin-pill crew-pin">
            <span style="background: #2E7D32; color: white; border-radius: 50%; width: 18px; height: 18px; display: inline-flex; align-items: center; justify-content: center; font-size: 10px;">${crew.headcount}</span>
            <span class="star-gold">★</span>
            <span>${crew.ratingAverage.toFixed(2)}</span>
          </div>
          <div class="rating-pin-triangle" style="border-top-color: #2E7D32;"></div>
        </div>
      `;

      const customIcon = window.L.divIcon({
        className: 'leaflet-marker-clean',
        html,
        iconSize: [84, 42],
        iconAnchor: [42, 38],
      });

      const marker = window.L.marker([crew.latitude, crew.longitude], {
        icon: customIcon,
      }).addTo(layer);

      marker.on('click', () => {
        onSelectCrew(crew);
      });
    });
  }, [workers, crews, selectedId, userCoords]);

  // Recenter helper
  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(userCoords, 14);
    }
  };

  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  return (
    <div className="map-container-rel">
      <div id="map-view-elem" ref={mapContainerRef} />

      {/* Floating Controls */}
      <div className="map-floating-controls">
        <button className="map-control-btn" title="My Location" onClick={handleRecenter}>
          <Locate size={20} />
        </button>
        <button className="map-control-btn" title="Zoom In" onClick={handleZoomIn}>
          <Plus size={20} />
        </button>
        <button className="map-control-btn" title="Zoom Out" onClick={handleZoomOut}>
          <Minus size={20} />
        </button>
      </div>
    </div>
  );
};
