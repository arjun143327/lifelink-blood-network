"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/context/AuthContext";
import { BloodType, BloodComponent, HospitalSearchResult } from "@/lib/types";
import { BLOOD_TYPES, BLOOD_COMPONENTS } from "@/lib/utils";
import { api } from "@/lib/api/client";
import { InteractiveMap, MapMarkerItem } from "@/components/map/InteractiveMap";
import {
  Building2,
  Search,
  MapPin,
  Phone,
  ArrowRight,
  ShieldCheck,
  Send,
  CheckCircle2,
} from "lucide-react";

export default function HospitalStockSearchPage() {
  const { user } = useAuth();
  const [bloodType, setBloodType] = useState<BloodType>("O-");
  const [component, setComponent] = useState<BloodComponent>("whole_blood");
  const [results, setResults] = useState<HospitalSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [transferFeedback, setTransferFeedback] = useState<string | null>(null);

  useEffect(() => {
    async function searchPartnerStock() {
      setIsLoading(true);
      try {
        const data = await api.searchHospitals({
          blood_type: bloodType,
          component: component,
          lat: 12.8931, // Apollo Hospital
          lng: 77.5979,
          radius_km: 30,
        });
        // Filter out own hospital
        const currentId = user?.id || "hosp_apollo_blr";
        setResults(data.filter((d) => d.hospital_id !== currentId));
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    searchPartnerStock();
  }, [bloodType, component, user]);

  const handleRequestTransfer = (hospitalName: string, units: number) => {
    setTransferFeedback(`Transfer dispatch request sent to ${hospitalName} for ${units} units of ${bloodType}.`);
    setTimeout(() => setTransferFeedback(null), 5000);
  };

  const mapMarkers: MapMarkerItem[] = results.map((r) => ({
    id: r.hospital_id,
    lat: r.latitude,
    lng: r.longitude,
    title: r.hospital_name,
    subtitle: `${r.units} units of ${r.blood_type} • ${r.distance_km} km`,
    type: "hospital",
    bloodType: r.blood_type,
    badge: `${r.units}u`,
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
          <Building2 className="h-4 w-4" />
          <span>Inter-Hospital Stock Exchange</span>
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight mt-1">
          Search Partner Hospital Inventories
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Locate surplus stock across certified blood banks in your regional health corridor to arrange emergency inter-hospital transfer.
        </p>
      </div>

      {transferFeedback && (
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/70 p-3.5 text-xs font-semibold text-emerald-300 shadow-xl backdrop-blur-md flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{transferFeedback}</span>
        </div>
      )}

      {/* Filter Selector */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-xl flex flex-wrap items-center gap-4">
        <div className="space-y-1 sm:w-48">
          <label className="text-[11px] font-semibold text-slate-400">Target Blood Group</label>
          <select
            value={bloodType}
            onChange={(e) => setBloodType(e.target.value as BloodType)}
            className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
          >
            {BLOOD_TYPES.map((bt) => (
              <option key={bt} value={bt}>
                {bt}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1 sm:w-64">
          <label className="text-[11px] font-semibold text-slate-400">Component Needed</label>
          <select
            value={component}
            onChange={(e) => setComponent(e.target.value as BloodComponent)}
            className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
          >
            {BLOOD_COMPONENTS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid: Map and Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 px-1">
            <span>Available Partner Banks</span>
            <span>{results.length} Facilities with Surplus</span>
          </div>

          {isLoading ? (
            <div className="flex h-64 items-center justify-center text-xs text-slate-400 rounded-2xl border border-slate-800 bg-slate-900/40">
              Querying regional network...
            </div>
          ) : results.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 text-center text-xs text-slate-400">
              No partner hospitals currently have surplus of {bloodType} ({component.replace("_", " ")}).
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {results.map((item) => (
                <div
                  key={item.hospital_id}
                  className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-3 transition hover:border-slate-700"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-base font-bold text-white">{item.hospital_name}</h4>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3.5 w-3.5 text-slate-500" />
                        <span>{item.address}</span>
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-lg font-black text-emerald-400">
                        {item.units} Units
                      </span>
                      <p className="text-[10px] text-slate-400">{item.distance_km} km away</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                    <a
                      href={`tel:${item.phone}`}
                      className="flex items-center gap-1.5 text-xs text-cyan-400 hover:underline font-semibold"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      <span>{item.phone}</span>
                    </a>

                    <button
                      onClick={() => handleRequestTransfer(item.hospital_name, Math.min(2, item.units))}
                      className="flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 px-3 py-1.5 text-xs font-bold text-white transition shadow-md"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>Request Transfer</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-6 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 px-1">
            <span>Regional Partner Map</span>
            <span>Bengaluru Health Corridor</span>
          </div>

          <InteractiveMap
            center={[12.95, 77.61]}
            zoom={12}
            markers={mapMarkers}
            height="500px"
          />
        </div>
      </div>
    </div>
  );
}
