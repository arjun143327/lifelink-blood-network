"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { BloodType, BloodComponent, UrgencyLevel, Hospital } from "@/lib/types";
import { BLOOD_TYPES, BLOOD_COMPONENTS, calculateDistance, canReceiveRedCells } from "@/lib/utils";
import { api } from "@/lib/api/client";
import { InteractiveMap, MapMarkerItem } from "@/components/map/InteractiveMap";
import {
  AlertTriangle,
  Radio,
  Send,
  Users,
  Building2,
  Clock,
  MapPin,
  CheckCircle2,
} from "lucide-react";

function NewEmergencyRequestContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [bloodType, setBloodType] = useState<BloodType>(
    (searchParams.get("blood_type") as BloodType) || "O-"
  );
  const [component, setComponent] = useState<BloodComponent>(
    (searchParams.get("component") as BloodComponent) || "whole_blood"
  );
  const [unitsNeeded, setUnitsNeeded] = useState<number>(3);
  const [urgency, setUrgency] = useState<UrgencyLevel>("critical");
  const [radiusKm, setRadiusKm] = useState<number>(15);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [matchingDonorsCount, setMatchingDonorsCount] = useState<number>(2);

  const hospitalId = user?.id || "hosp_apollo_blr";

  useEffect(() => {
    async function loadHospital() {
      try {
        const hosp = await api.getHospital(hospitalId);
        if (hosp) setHospital(hosp);
      } catch (err) {
        console.error(err);
      }
    }
    loadHospital();
  }, [hospitalId]);

  // Simulate PostGIS spatial query preview dynamically
  useEffect(() => {
    // Dynamic preview estimate based on blood scarcity and radius
    let count = Math.max(1, Math.floor(radiusKm / 5));
    if (bloodType === "O-" || bloodType === "AB-") {
      count = Math.max(1, Math.floor(radiusKm / 8));
    } else if (bloodType === "O+" || bloodType === "B+") {
      count = Math.max(2, Math.floor(radiusKm / 3));
    }
    setMatchingDonorsCount(count);
  }, [bloodType, radiusKm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const created = await api.createEmergencyRequest(hospitalId, {
        blood_type: bloodType,
        component: component,
        units_needed: unitsNeeded,
        urgency: urgency,
        radius_km: radiusKm,
      });
      router.push(`/hospital/requests/${created.id}`);
    } catch (err) {
      console.error("Failed to broadcast request", err);
      setIsSubmitting(false);
    }
  };

  const hospLat = hospital?.latitude ?? 12.8931;
  const hospLng = hospital?.longitude ?? 77.5979;

  const mapMarkers: MapMarkerItem[] = [
    {
      id: "hospital_loc",
      lat: hospLat,
      lng: hospLng,
      title: hospital?.name || "Hospital Location",
      subtitle: "Broadcast Epicenter",
      type: "emergency",
      badge: "Epicenter",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-red-400 uppercase tracking-wider">
          <AlertTriangle className="h-4 w-4 animate-pulse" />
          <span>Emergency Broadcast Dispatcher</span>
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight mt-1">
          Broadcast Emergency SOS Request
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Triggers backend PostGIS spatial matching and dispatches high-priority notifications to nearby available donors.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Column */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-7 space-y-6 rounded-2xl border border-red-500/30 bg-slate-900/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl"
        >
          {/* Urgency Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Urgency Level
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setUrgency("critical")}
                className={`flex flex-col items-center justify-center rounded-xl p-3 text-xs font-black transition border ${
                  urgency === "critical"
                    ? "bg-red-600 text-white border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-pulse"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                <span>CRITICAL</span>
                <span className="text-[10px] font-normal opacity-80 mt-0.5">Immediate (&lt; 30m)</span>
              </button>

              <button
                type="button"
                onClick={() => setUrgency("high")}
                className={`flex flex-col items-center justify-center rounded-xl p-3 text-xs font-black transition border ${
                  urgency === "high"
                    ? "bg-amber-600 text-white border-amber-500 shadow-[0_0_15px_rgba(217,119,6,0.5)]"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                <span>HIGH</span>
                <span className="text-[10px] font-normal opacity-80 mt-0.5">Urgent (&lt; 2h)</span>
              </button>

              <button
                type="button"
                onClick={() => setUrgency("normal")}
                className={`flex flex-col items-center justify-center rounded-xl p-3 text-xs font-black transition border ${
                  urgency === "normal"
                    ? "bg-blue-600 text-white border-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.5)]"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                <span>NORMAL</span>
                <span className="text-[10px] font-normal opacity-80 mt-0.5">Scheduled (&lt; 24h)</span>
              </button>
            </div>
          </div>

          {/* Blood Group and Component */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Blood Group Required
              </label>
              <select
                value={bloodType}
                onChange={(e) => setBloodType(e.target.value as BloodType)}
                className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3.5 py-2.5 text-xs text-white focus:border-red-500 focus:outline-none"
              >
                {BLOOD_TYPES.map((bt) => (
                  <option key={bt} value={bt}>
                    {bt} {bt === "O-" ? "(Universal Donor)" : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Component Needed
              </label>
              <select
                value={component}
                onChange={(e) => setComponent(e.target.value as BloodComponent)}
                className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3.5 py-2.5 text-xs text-white focus:border-red-500 focus:outline-none"
              >
                {BLOOD_COMPONENTS.map((comp) => (
                  <option key={comp.id} value={comp.id}>
                    {comp.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Units and Radius */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Units Required
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={unitsNeeded}
                onChange={(e) => setUnitsNeeded(Number(e.target.value))}
                className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3.5 py-2.5 text-xs text-white focus:border-red-500 focus:outline-none font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-300">
                <span>Broadcast Radius</span>
                <span className="text-red-400 font-bold">{radiusKm} km</span>
              </div>
              <input
                type="range"
                min="3"
                max="40"
                step="1"
                value={radiusKm}
                onChange={(e) => setRadiusKm(Number(e.target.value))}
                className="w-full accent-red-500 cursor-pointer mt-2"
              />
            </div>
          </div>

          {/* PostGIS Matching Preview Callout */}
          <div className="rounded-xl bg-slate-950/80 p-4 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <Users className="h-4 w-4 text-emerald-400" />
                PostGIS Matching Preview:
              </span>
              <span className="text-sm font-black text-emerald-400">
                ~{matchingDonorsCount} Donors Located
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Query will search: <code className="font-mono text-cyan-400">ST_DWithin(location, hospital_point, {radiusKm * 1000}m)</code> for available {bloodType} donors.
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-red-600 hover:bg-red-500 py-3.5 text-xs font-bold text-white shadow-[0_0_25px_rgba(239,68,68,0.5)] transition flex items-center justify-center gap-2"
          >
            <Radio className="h-4 w-4 animate-pulse" />
            <span>{isSubmitting ? "Broadcasting Emergency SOS..." : "Dispatch Emergency SOS Now"}</span>
          </button>
        </form>

        {/* Map Column */}
        <div className="lg:col-span-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 px-1">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-red-500" />
              <span>Broadcast Radius Ring</span>
            </span>
            <span className="text-red-400 font-bold">{radiusKm} km PostGIS Radius</span>
          </div>

          <InteractiveMap
            center={[hospLat, hospLng]}
            zoom={11}
            markers={mapMarkers}
            radiusCircle={{
              lat: hospLat,
              lng: hospLng,
              radiusKm: radiusKm,
            }}
            height="460px"
          />
        </div>
      </div>
    </div>
  );
}

export default function NewEmergencyRequestPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-96 items-center justify-center text-xs text-slate-400">
          Loading SOS dispatcher...
        </div>
      }
    >
      <NewEmergencyRequestContent />
    </Suspense>
  );
}
