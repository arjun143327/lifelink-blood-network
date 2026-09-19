"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { LiveEmergencyTicker } from "@/components/tools/LiveEmergencyTicker";
import { BloodCompatibilityMatrix } from "@/components/tools/BloodCompatibilityMatrix";
import { DonorEligibilityQuiz } from "@/components/tools/DonorEligibilityQuiz";
import { InteractiveMap, MapMarkerItem } from "@/components/map/InteractiveMap";
import { api } from "@/lib/api/client";
import { useAuth } from "@/lib/context/AuthContext";
import {
  Droplets,
  Search,
  Radio,
  Hospital as HospitalIcon,
  ShieldCheck,
  ArrowRight,
  Heart,
  Activity,
  MapPin,
  Clock,
  Sparkles,
} from "lucide-react";

export default function HomePage() {
  const { loginAsDemo } = useAuth();
  const [mapMarkers, setMapMarkers] = useState<MapMarkerItem[]>([]);

  useEffect(() => {
    async function loadMapData() {
      try {
        const hospitals = await api.getHospitalList();
        const camps = await api.getCamps();

        const markers: MapMarkerItem[] = [
          ...hospitals.map((h) => ({
            id: h.id,
            lat: h.latitude,
            lng: h.longitude,
            title: h.name,
            subtitle: `${h.city} • Verified Blood Bank`,
            type: "hospital" as const,
            badge: "Blood Bank",
          })),
          ...camps.map((c) => ({
            id: c.id,
            lat: c.location.lat,
            lng: c.location.lng,
            title: c.title,
            subtitle: `${c.location.address} (${c.date})`,
            type: "camp" as const,
            badge: "Drive",
          })),
        ];

        setMapMarkers(markers);
      } catch (err) {
        console.error("Failed to load map data", err);
      }
    }
    loadMapData();
  }, []);

  return (
    <div className="flex flex-col space-y-16 pb-20">
      {/* Real-time Emergency Ticker */}
      <LiveEmergencyTicker />

      {/* Hero Section */}
      <section className="relative px-4 pt-10 sm:px-6 lg:px-8">
        {/* Glow ambient backdrops */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[380px] w-[550px] rounded-full bg-rose-600/15 blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 -z-10 h-[280px] w-[350px] rounded-full bg-blue-600/10 blur-[100px] pointer-events-none" />

        <div className="mx-auto max-w-5xl text-center space-y-6">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-3.5 py-1 text-xs font-semibold text-rose-300 backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-ping" />
            <span>Bridging India&apos;s 1,000,000+ Unit Blood Visibility Gap</span>
          </div>

          {/* Hero Headline */}
          <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl sm:leading-[1.15]">
            Real-Time Blood Availability.{" "}
            <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-rose-500 via-red-400 to-amber-400 bg-clip-text text-transparent">
              Zero Guesswork. Instant Response.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto max-w-2xl text-sm sm:text-base text-slate-300 leading-relaxed">
            Hospitals connect directly with surplus blood inventories and nearby verified donors through intelligent{" "}
            <strong className="text-white">PostGIS spatial queries</strong>. Every second counts in an emergency.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/explore/blood-search"
              className="flex items-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-500 px-6 py-3.5 text-sm font-bold text-white shadow-[0_0_25px_rgba(225,29,72,0.4)] transition transform hover:-translate-y-0.5"
            >
              <Search className="h-4 w-4" />
              <span>Search Blood Availability</span>
            </Link>

            <Link
              href="/auth/signup"
              className="flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 px-6 py-3.5 text-sm font-bold text-slate-200 transition"
            >
              <Droplets className="h-4 w-4 text-rose-500" />
              <span>Join As Volunteer Donor</span>
            </Link>
          </div>

          {/* Evaluator Quick Launch Portals */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
            <span className="font-medium text-slate-500">Evaluator Shortcuts:</span>
            <button
              onClick={() => loginAsDemo("donor_rahul")}
              className="rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 px-2.5 py-1 text-rose-300 transition"
            >
              🩸 Donor Console
            </button>
            <button
              onClick={() => loginAsDemo("hospital_apollo")}
              className="rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 px-2.5 py-1 text-blue-300 transition"
            >
              🏥 Hospital Console
            </button>
            <button
              onClick={() => loginAsDemo("ngo_redcross")}
              className="rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 px-2.5 py-1 text-amber-300 transition"
            >
              🤝 NGO Camps
            </button>
          </div>
        </div>

        {/* Live Telemetry Metric Strips */}
        <div className="mx-auto mt-14 max-w-6xl grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Active Donors
              </span>
              <Droplets className="h-4 w-4 text-rose-500" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-white">8,420+</span>
              <span className="text-xs text-emerald-400 font-medium">Verified</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              Standing by with live GPS radar status
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Spatial Matching
              </span>
              <Radio className="h-4 w-4 text-emerald-400 animate-pulse" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-white">&lt; 10 km</span>
              <span className="text-xs text-emerald-400 font-medium">PostGIS</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              ST_DWithin spatial radius search
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Emergency Turnaround
              </span>
              <Clock className="h-4 w-4 text-amber-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-white">4.2 min</span>
              <span className="text-xs text-amber-400 font-medium">Median</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              From SOS broadcast to first donor accept
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Hospitals Network
              </span>
              <HospitalIcon className="h-4 w-4 text-cyan-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-white">142</span>
              <span className="text-xs text-cyan-400 font-medium">Stock Matrix</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              Across Bengaluru, Mumbai, and Delhi
            </p>
          </div>
        </div>
      </section>

      {/* Live Geospatial Network Radar View */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-rose-500 uppercase tracking-wider">
                <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping"></span>
                <span>Live Spatial Topology</span>
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight mt-1">
                Active Hospital Blood Banks &amp; Drives
              </h2>
              <p className="text-xs text-slate-400">
                Interactive geospatial map displaying verified blood banks and upcoming donation camps.
              </p>
            </div>

            <Link
              href="/explore/blood-search"
              className="flex items-center gap-1 text-xs font-bold text-rose-400 hover:text-rose-300 transition"
            >
              <span>Launch Full Spatial Search</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <InteractiveMap
            center={[12.935, 77.61]}
            zoom={12}
            markers={mapMarkers}
            height="440px"
          />
        </div>
      </section>

      {/* Three Personas Deep-Dive */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              One Unified System. Three Seamless Personas.
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              Engineered to eliminate fragmentation between healthcare providers, donors, and non-profits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Donor Persona */}
            <div className="rounded-2xl border border-rose-900/30 bg-gradient-to-b from-slate-900 to-slate-950 p-6 space-y-4 relative group hover:border-rose-700/60 transition">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/30">
                <Droplets className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">
                  For Donors
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  Live Availability Radar
                </h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Toggle your standby availability on/off in real-time. Receive emergency alerts from nearby hospitals with exact distance, blood component needed, and 1-click confirmation.
              </p>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-rose-500" />
                  <span>Privacy-preserving coordinate geofence</span>
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-rose-500" />
                  <span>Interactive SOS Accept / Decline cards</span>
                </li>
              </ul>
              <div className="pt-2">
                <button
                  onClick={() => loginAsDemo("donor_rahul")}
                  className="flex items-center gap-1.5 text-xs font-bold text-rose-400 hover:text-rose-300 transition"
                >
                  <span>Launch Donor Radar Demo</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Hospital Persona */}
            <div className="rounded-2xl border border-blue-900/30 bg-gradient-to-b from-slate-900 to-slate-950 p-6 space-y-4 relative group hover:border-blue-700/60 transition">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/30">
                <HospitalIcon className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                  For Hospitals
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  Blood Bank Command Center
                </h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Manage full 8x3 stock matrix (Whole Blood, Plasma, Platelets). Broadcast Emergency SOS with custom radius (1-50 km) and track live donor confirmations in real time.
              </p>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-blue-500" />
                  <span>Instant +/- inventory adjustment</span>
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-blue-500" />
                  <span>PostGIS nearby donor matching engine</span>
                </li>
              </ul>
              <div className="pt-2">
                <button
                  onClick={() => loginAsDemo("hospital_apollo")}
                  className="flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 transition"
                >
                  <span>Launch Hospital Console Demo</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* NGO Persona */}
            <div className="rounded-2xl border border-amber-900/30 bg-gradient-to-b from-slate-900 to-slate-950 p-6 space-y-4 relative group hover:border-amber-700/60 transition">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
                <Activity className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  For NGOs
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  Donation Camp Coordinator
                </h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Organize public blood donation drives, drop venue pins on the interactive map, broadcast alerts for target blood groups, and track attendee registration.
              </p>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-amber-500" />
                  <span>Target blood group filtering</span>
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-amber-500" />
                  <span>Public registration directory</span>
                </li>
              </ul>
              <div className="pt-2">
                <button
                  onClick={() => loginAsDemo("ngo_redcross")}
                  className="flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition"
                >
                  <span>Launch NGO Hub Demo</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Tools Showcase */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Interactive Clinical Utilities
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              Equipping patients and volunteers with scientific blood transfusion insight.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <BloodCompatibilityMatrix />
            <DonorEligibilityQuiz />
          </div>
        </div>
      </section>
    </div>
  );
}
