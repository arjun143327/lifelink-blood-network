"use client";

import React, { useState, useEffect } from "react";
import { BloodType, BloodComponent, HospitalSearchResult } from "@/lib/types";
import { api } from "@/lib/api/client";
import { BLOOD_TYPES, BLOOD_COMPONENTS } from "@/lib/utils";
import { InteractiveMap, MapMarkerItem } from "@/components/map/InteractiveMap";
import {
  Search,
  MapPin,
  Phone,
  Droplets,
  Building2,
  Filter,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

export default function BloodSearchPage() {
  const [selectedBloodType, setSelectedBloodType] = useState<BloodType | "">("O-");
  const [selectedComponent, setSelectedComponent] = useState<BloodComponent | "">("whole_blood");
  const [radiusKm, setRadiusKm] = useState<number>(25);
  const [selectedCity, setSelectedCity] = useState<string>("Bengaluru");
  const [results, setResults] = useState<HospitalSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // City center coordinates
  const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
    Bengaluru: { lat: 12.9716, lng: 77.5946 },
    Mumbai: { lat: 19.076, lng: 72.8777 },
    "New Delhi": { lat: 28.6139, lng: 77.209 },
  };

  const currentCoords = CITY_COORDS[selectedCity] || CITY_COORDS["Bengaluru"];

  useEffect(() => {
    async function performSearch() {
      setIsLoading(true);
      try {
        const data = await api.searchHospitals({
          blood_type: (selectedBloodType || undefined) as BloodType,
          component: (selectedComponent || undefined) as BloodComponent,
          lat: currentCoords.lat,
          lng: currentCoords.lng,
          radius_km: radiusKm,
        });
        setResults(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    performSearch();
  }, [selectedBloodType, selectedComponent, radiusKm, selectedCity]);

  const mapMarkers: MapMarkerItem[] = results.map((r) => ({
    id: r.hospital_id,
    lat: r.latitude,
    lng: r.longitude,
    title: r.hospital_name,
    subtitle: `${r.units} units available • ${r.distance_km} km away`,
    type: "hospital",
    bloodType: r.blood_type,
    badge: `${r.units} units`,
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-rose-500 uppercase tracking-wider">
          <Droplets className="h-4 w-4" />
          <span>Real-Time Spatial Search</span>
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight mt-1">
          Hospital Blood Bank Availability
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Live PostGIS spatial queries across verified hospital blood banks. Find critical stock in your immediate radius.
        </p>
      </div>

      {/* Filter Control Bar */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-xl space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
          <Filter className="h-3.5 w-3.5 text-rose-400" />
          <span>Filter Blood &amp; Location</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Blood Type Filter */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-400">Target Blood Group</label>
            <select
              value={selectedBloodType}
              onChange={(e) => setSelectedBloodType(e.target.value as BloodType)}
              className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2.5 text-xs text-white focus:border-rose-500 focus:outline-none"
            >
              <option value="">All Blood Groups</option>
              {BLOOD_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type} {type === "O-" ? "(Universal Donor)" : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Component Filter */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-400">Blood Component</label>
            <select
              value={selectedComponent}
              onChange={(e) => setSelectedComponent(e.target.value as BloodComponent)}
              className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2.5 text-xs text-white focus:border-rose-500 focus:outline-none"
            >
              <option value="">All Components</option>
              {BLOOD_COMPONENTS.map((comp) => (
                <option key={comp.id} value={comp.id}>
                  {comp.label}
                </option>
              ))}
            </select>
          </div>

          {/* City Filter */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-400">Metropolitan Center</label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2.5 text-xs text-white focus:border-rose-500 focus:outline-none"
            >
              <option value="Bengaluru">Bengaluru</option>
              <option value="Mumbai">Mumbai</option>
              <option value="New Delhi">New Delhi</option>
            </select>
          </div>

          {/* Radius Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-semibold text-slate-400">
              <span>Radius Distance</span>
              <span className="text-rose-400 font-bold">{radiusKm} km</span>
            </div>
            <input
              type="range"
              min="5"
              max="50"
              step="5"
              value={radiusKm}
              onChange={(e) => setRadiusKm(Number(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer mt-2"
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Map & Results List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Map Column */}
        <div className="lg:col-span-6 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 px-1">
            <span>Spatial Distribution</span>
            <span>{results.length} Stocks Located</span>
          </div>
          <InteractiveMap
            center={[currentCoords.lat, currentCoords.lng]}
            zoom={11}
            markers={mapMarkers}
            radiusCircle={{
              lat: currentCoords.lat,
              lng: currentCoords.lng,
              radiusKm: radiusKm,
            }}
            height="520px"
          />
        </div>

        {/* Results Column */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 px-1">
            <span>Nearby Hospital Inventories</span>
            <span>Ranked by Distance</span>
          </div>

          {isLoading ? (
            <div className="flex h-64 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/40 text-xs text-slate-400">
              <span className="h-5 w-5 rounded-full border-2 border-rose-500 border-t-transparent animate-spin mr-2"></span>
              Executing spatial search...
            </div>
          ) : results.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/40 p-8 text-center space-y-2">
              <AlertCircle className="h-8 w-8 text-amber-400" />
              <h4 className="text-sm font-bold text-white">No Hospital Stocks Match Current Criteria</h4>
              <p className="text-xs text-slate-400 max-w-sm">
                Try widening your search radius or selecting &quot;All Blood Groups&quot; to locate alternative units.
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
              {results.map((item, idx) => (
                <div
                  key={`${item.hospital_id}-${item.blood_type}-${item.component}-${idx}`}
                  className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 transition hover:border-slate-700 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-blue-400 shrink-0" />
                        <h4 className="text-sm font-bold text-white">{item.hospital_name}</h4>
                      </div>
                      <p className="text-xs text-slate-400 flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                        <span>{item.address}</span>
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="inline-flex items-center rounded-lg bg-rose-500/15 border border-rose-500/30 px-2.5 py-1 text-sm font-black text-rose-400">
                        {item.blood_type}
                      </span>
                      <p className="text-[10px] text-emerald-400 font-bold mt-1">
                        {item.units} Units In Stock
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-xs">
                    <div className="flex items-center gap-3 text-slate-400">
                      <span className="font-semibold text-white">{item.distance_km} km away</span>
                      <span className="capitalize text-slate-300">
                        {item.component.replace("_", " ")}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${item.phone}`}
                        className="flex items-center gap-1 rounded-lg bg-slate-800 hover:bg-slate-700 px-2.5 py-1 text-[11px] font-semibold text-slate-200 transition"
                      >
                        <Phone className="h-3 w-3 text-emerald-400" />
                        <span>Call Blood Bank</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
