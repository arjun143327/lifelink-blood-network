"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { DonorProfile, BloodType } from "@/lib/types";
import { api } from "@/lib/api/client";
import { BLOOD_TYPES } from "@/lib/utils";
import { InteractiveMap } from "@/components/map/InteractiveMap";
import { MapPin, Droplets, CheckCircle2, Save, User, Shield } from "lucide-react";

export default function DonorProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<DonorProfile | null>(null);
  const [bloodType, setBloodType] = useState<BloodType>("O-");
  const [lat, setLat] = useState<number>(12.9050);
  const [lng, setLng] = useState<number>(77.5850);
  const [city, setCity] = useState<string>("Bengaluru");
  const [phone, setPhone] = useState<string>("+91 98450 12345");
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const p = await api.getDonorMe(user?.id || "donor_1");
        setProfile(p);
        setBloodType(p.blood_type);
        setLat(p.latitude);
        setLng(p.longitude);
        setCity(p.city);
        if (p.phone) setPhone(p.phone);
      } catch (err) {
        console.error(err);
      }
    }
    loadProfile();
  }, [user]);

  const handleLocationSelect = (newLat: number, newLng: number) => {
    setLat(Math.round(newLat * 10000) / 10000);
    setLng(Math.round(newLng * 10000) / 10000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updated = await api.updateDonorProfile(user?.id || "donor_1", {
        blood_type: bloodType,
        latitude: lat,
        longitude: lng,
        available: profile?.available ?? true,
        city: city,
      });
      setProfile(updated);
      setSuccessMsg("Geofence and blood type coordinates updated successfully!");
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-rose-500 uppercase tracking-wider">
          <User className="h-4 w-4" />
          <span>Donor Telemetry &amp; Profile</span>
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight mt-1">
          Geofence &amp; Biological Record
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure your biological blood group and standby location pin used by hospital PostGIS spatial queries.
        </p>
      </div>

      {successMsg && (
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/70 p-3.5 text-xs font-semibold text-emerald-300 shadow-xl flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form */}
        <form onSubmit={handleSave} className="lg:col-span-5 space-y-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Registered Name</label>
            <input
              type="text"
              disabled
              value={profile?.name || "Rahul Sharma"}
              className="w-full rounded-xl bg-slate-950/60 border border-slate-800 px-3.5 py-2.5 text-xs text-slate-400 cursor-not-allowed"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Blood Group</label>
            <select
              value={bloodType}
              onChange={(e) => setBloodType(e.target.value as BloodType)}
              className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3.5 py-2.5 text-xs text-white focus:border-rose-500 focus:outline-none"
            >
              {BLOOD_TYPES.map((bt) => (
                <option key={bt} value={bt}>
                  {bt} {bt === "O-" ? "(Universal Donor)" : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Contact Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98450 12345"
              className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3.5 py-2.5 text-xs text-white focus:border-rose-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Primary City</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3.5 py-2.5 text-xs text-white focus:border-rose-500 focus:outline-none"
            >
              <option value="Bengaluru">Bengaluru</option>
              <option value="Mumbai">Mumbai</option>
              <option value="New Delhi">New Delhi</option>
            </select>
          </div>

          <div className="rounded-xl bg-slate-950/70 p-3.5 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Current Coordinates:</span>
              <span className="font-mono text-cyan-400 font-bold">
                {lat.toFixed(4)}, {lng.toFixed(4)}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Tip: Click anywhere on the map to place your updated standby pin.
            </p>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full rounded-xl bg-rose-600 hover:bg-rose-500 py-3 text-xs font-bold text-white shadow-[0_0_20px_rgba(225,29,72,0.3)] transition flex items-center justify-center gap-2"
          >
            <Save className="h-4 w-4" />
            <span>{isSaving ? "Saving Coordinates..." : "Save Profile Coordinates"}</span>
          </button>
        </form>

        {/* Right Map */}
        <div className="lg:col-span-7 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 px-1">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-rose-500" />
              <span>Interactive Standby Geofence Pin</span>
            </span>
            <span className="text-emerald-400 text-[11px]">Click on map to reposition</span>
          </div>

          <InteractiveMap
            center={[lat, lng]}
            zoom={13}
            selectedPin={[lat, lng]}
            onSelectLocation={handleLocationSelect}
            height="460px"
          />
        </div>
      </div>
    </div>
  );
}
