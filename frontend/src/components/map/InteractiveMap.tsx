"use client";

import React, { useEffect, useRef, useState } from "react";
import { BloodType } from "@/lib/types";

export interface MapMarkerItem {
  id: string;
  lat: number;
  lng: number;
  title: string;
  subtitle?: string;
  type: "hospital" | "donor" | "camp" | "emergency";
  badge?: string;
  bloodType?: BloodType;
  actionText?: string;
  onAction?: () => void;
}

interface InteractiveMapProps {
  center?: [number, number]; // [lat, lng]
  zoom?: number;
  markers?: MapMarkerItem[];
  radiusCircle?: {
    lat: number;
    lng: number;
    radiusKm: number;
  };
  onSelectLocation?: (lat: number, lng: number) => void;
  selectedPin?: [number, number] | null;
  height?: string;
  className?: string;
}

export function InteractiveMap({
  center = [12.9716, 77.5946], // Default Bengaluru
  zoom = 12,
  markers = [],
  radiusCircle,
  onSelectLocation,
  selectedPin,
  height = "420px",
  className = "",
}: InteractiveMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !mapContainerRef.current) return;

    let L: any;
    let isCancelled = false;

    async function initMap() {
      L = (await import("leaflet")).default;
      if (isCancelled || !mapContainerRef.current) return;

      // Clean up existing instance if already created
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Initialize map
      const map = L.map(mapContainerRef.current, {
        center: center,
        zoom: zoom,
        zoomControl: true,
        attributionControl: false,
      });

      // CartoDB Dark Matter tiles (sleek dark medical map theme)
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        {
          maxZoom: 19,
          subdomains: "abcd",
        }
      ).addTo(map);

      // Layer group for markers
      const markersLayer = L.layerGroup().addTo(map);
      markersLayerRef.current = markersLayer;
      mapInstanceRef.current = map;

      // Click to place pin handler
      if (onSelectLocation) {
        map.on("click", (e: any) => {
          onSelectLocation(e.latlng.lat, e.latlng.lng);
        });
      }

      renderMarkers(L, map, markersLayer);
    }

    initMap();

    return () => {
      isCancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isClient, center[0], center[1], zoom]);

  // Re-render markers when marker list or radius updates
  useEffect(() => {
    if (!isClient || !mapInstanceRef.current || !markersLayerRef.current) return;
    import("leaflet").then((leafletModule) => {
      renderMarkers(leafletModule.default, mapInstanceRef.current, markersLayerRef.current);
    });
  }, [markers, radiusCircle, selectedPin, isClient]);

  const renderMarkers = (L: any, map: any, layer: any) => {
    layer.clearLayers();

    // Custom marker icon helper
    const createHtmlIcon = (type: string, badge?: string) => {
      let bg = "#e11d48";
      let iconSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`;

      if (type === "hospital") {
        bg = "#2563eb";
        iconSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M12 6v12m-6-6h12"/></svg>`;
      } else if (type === "camp") {
        bg = "#f59e0b";
        iconSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7"/></svg>`;
      } else if (type === "emergency") {
        bg = "#dc2626";
        iconSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
      }

      return L.divIcon({
        className: "custom-map-marker",
        html: `
          <div style="position: relative; display: flex; align-items: center; justify-content: center;">
            <div style="
              width: 32px;
              height: 32px;
              border-radius: 50%;
              background: ${bg};
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 0 12px ${bg};
              border: 2px solid white;
            ">
              ${iconSvg}
            </div>
            ${
              badge
                ? `<span style="
                    position: absolute;
                    top: -8px;
                    right: -10px;
                    background: #111827;
                    color: #fb7185;
                    font-size: 10px;
                    font-weight: 800;
                    padding: 1px 5px;
                    border-radius: 9999px;
                    border: 1px solid rgba(225,29,72,0.4);
                  ">${badge}</span>`
                : ""
            }
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16],
      });
    };

    // Render markers
    markers.forEach((m) => {
      const marker = L.marker([m.lat, m.lng], {
        icon: createHtmlIcon(m.type, m.badge || m.bloodType),
      }).addTo(layer);

      const popupContent = `
        <div style="min-width: 170px; padding: 4px; font-family: inherit;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
            <strong style="font-size: 13px; color: #f8fafc;">${m.title}</strong>
            ${m.bloodType ? `<span style="background: #e11d48; color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold;">${m.bloodType}</span>` : ""}
          </div>
          ${m.subtitle ? `<p style="font-size: 11px; color: #94a3b8; margin: 0 0 8px 0;">${m.subtitle}</p>` : ""}
          <div style="display: flex; align-items: center; gap: 4px; font-size: 10px; color: #38bdf8;">
            <span>📍 ${m.lat.toFixed(4)}, ${m.lng.toFixed(4)}</span>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
    });

    // Render radius circle if specified
    if (radiusCircle) {
      L.circle([radiusCircle.lat, radiusCircle.lng], {
        radius: radiusCircle.radiusKm * 1000,
        color: "#e11d48",
        fillColor: "#e11d48",
        fillOpacity: 0.12,
        weight: 1.5,
        dashArray: "4, 6",
      }).addTo(layer);
    }

    // Render manual selected pin if in dropper mode
    if (selectedPin) {
      const pinIcon = L.divIcon({
        className: "custom-selected-pin",
        html: `
          <div style="
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: #10b981;
            border: 3px solid white;
            box-shadow: 0 0 15px #10b981;
          "></div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });
      L.marker(selectedPin, { icon: pinIcon }).addTo(layer);
    }
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 ${className}`}
      style={{ height }}
    >
      {!isClient && (
        <div className="flex h-full w-full items-center justify-center bg-slate-950 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="h-4 w-4 rounded-full border-2 border-rose-500 border-t-transparent animate-spin"></span>
            Loading dynamic geospatial radar...
          </div>
        </div>
      )}
      <div ref={mapContainerRef} className="h-full w-full z-10" />

      {/* Map Legend Overlay */}
      <div className="absolute bottom-3 left-3 z-20 flex flex-wrap items-center gap-2 rounded-xl bg-slate-950/85 px-3 py-1.5 text-[11px] font-medium text-slate-300 backdrop-blur-md border border-slate-800 shadow-lg">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-blue-500"></span> Hospital
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-500"></span> Donor
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500"></span> Camp Drive
        </span>
        {radiusCircle && (
          <span className="flex items-center gap-1.5 text-rose-400">
            <span className="h-2 w-2 rounded-full border border-rose-500"></span> {radiusCircle.radiusKm}km Radius
          </span>
        )}
      </div>
    </div>
  );
}
