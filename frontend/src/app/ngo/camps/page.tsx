"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Camp } from "@/lib/types";
import { api } from "@/lib/api/client";
import { InteractiveMap, MapMarkerItem } from "@/components/map/InteractiveMap";
import {
  Calendar,
  MapPin,
  Users,
  CheckCircle2,
  Clock,
  Phone,
  ArrowRight,
  Filter,
} from "lucide-react";

export default function CampsDirectoryPage() {
  const [camps, setCamps] = useState<Camp[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>("Bengaluru");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [registeredCampId, setRegisteredCampId] = useState<string | null>(null);

  const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
    Bengaluru: { lat: 12.9716, lng: 77.5946 },
    Mumbai: { lat: 19.076, lng: 72.8777 },
    "New Delhi": { lat: 28.6139, lng: 77.209 },
  };

  const coords = CITY_COORDS[selectedCity] || CITY_COORDS["Bengaluru"];

  useEffect(() => {
    async function loadCamps() {
      setIsLoading(true);
      try {
        const list = await api.getCamps({
          lat: coords.lat,
          lng: coords.lng,
          radius_km: 50,
        });
        setCamps(list);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadCamps();
  }, [selectedCity]);

  const handleRegister = (campId: string) => {
    setRegisteredCampId(campId);
    setCamps((prev) =>
      prev.map((c) =>
        c.id === campId ? { ...c, registered_count: (c.registered_count || 0) + 1 } : c
      )
    );
  };

  const mapMarkers: MapMarkerItem[] = camps.map((c) => ({
    id: c.id,
    lat: c.location.lat,
    lng: c.location.lng,
    title: c.title,
    subtitle: `${c.location.address} • Date: ${c.date}`,
    type: "camp",
    badge: "Camp Drive",
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Calendar className="h-4 w-4" />
            <span>Community Donation Drives</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight mt-1">
            Upcoming Blood Donation Camps
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Certified community donation camps organized by authorized non-profits and humanitarian agencies.
          </p>
        </div>

        <Link
          href="/ngo/camps/new"
          className="flex items-center gap-2 rounded-xl bg-amber-600 hover:bg-amber-500 px-4 py-2.5 text-xs font-bold text-white shadow-[0_0_15px_rgba(217,119,6,0.4)] transition shrink-0"
        >
          <span>Organize a Camp Drive</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* City Filter */}
      <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-xl">
        <Filter className="h-4 w-4 text-amber-400" />
        <span className="text-xs font-bold text-slate-300">Filter by City:</span>
        <div className="flex gap-2">
          {["Bengaluru", "Mumbai", "New Delhi"].map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition border ${
                selectedCity === city
                  ? "bg-amber-600 text-white border-amber-500 shadow-md"
                  : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Grid: Interactive Map & Camp Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Camp Cards */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 px-1">
            <span>Verified Camp Drives ({camps.length})</span>
            <span>{selectedCity} Region</span>
          </div>

          {isLoading ? (
            <div className="flex h-64 items-center justify-center text-xs text-slate-400 rounded-2xl border border-slate-800 bg-slate-900/40">
              Loading camps...
            </div>
          ) : camps.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 text-center text-xs text-slate-400">
              No donation drives currently scheduled in {selectedCity}. Check back soon or organize one!
            </div>
          ) : (
            <div className="space-y-4 max-h-[550px] overflow-y-auto pr-1">
              {camps.map((camp) => {
                const isRegistered = registeredCampId === camp.id;

                return (
                  <div
                    key={camp.id}
                    className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4 transition hover:border-slate-700"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="rounded-md bg-amber-500/20 border border-amber-500/40 px-2.5 py-0.5 text-[10px] font-bold text-amber-300">
                            {camp.date}
                          </span>
                          <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{camp.time || "09:00 AM - 04:00 PM"}</span>
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-white mt-1">{camp.title}</h3>
                        <p className="text-xs text-slate-400 mt-0.5">{camp.ngo_name}</p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-emerald-400">
                          {camp.registered_count || 0} Registered
                        </span>
                        <p className="text-[10px] text-slate-500">
                          Target: {camp.expected_donors || 100}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-xl bg-slate-950/70 p-3 border border-slate-800/80 space-y-1.5 text-xs">
                      <p className="text-slate-300 flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                        <span>{camp.location.address}, {camp.location.city}</span>
                      </p>

                      <div className="flex flex-wrap items-center gap-1 pt-1">
                        <span className="text-slate-400 text-[11px] mr-1">Target Groups:</span>
                        {camp.target_blood_types.map((bt) => (
                          <span
                            key={bt}
                            className="rounded bg-rose-950/60 border border-rose-800/50 px-1.5 py-0.2 text-[10px] font-bold text-rose-300"
                          >
                            {bt}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      {camp.contact_phone && (
                        <a
                          href={`tel:${camp.contact_phone}`}
                          className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition font-medium"
                        >
                          <Phone className="h-3 w-3 text-amber-400" />
                          <span>{camp.contact_phone}</span>
                        </a>
                      )}

                      {isRegistered ? (
                        <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Registered Successfully!</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => handleRegister(camp.id)}
                          className="rounded-xl bg-amber-600 hover:bg-amber-500 px-3.5 py-1.5 text-xs font-bold text-white transition shadow-md"
                        >
                          Register As Volunteer Donor
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Map Column */}
        <div className="lg:col-span-6 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 px-1">
            <span>Drive Venues Map</span>
            <span>{selectedCity} Region</span>
          </div>

          <InteractiveMap
            center={[coords.lat, coords.lng]}
            zoom={11}
            markers={mapMarkers}
            height="550px"
          />
        </div>
      </div>
    </div>
  );
}
