"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { BloodType } from "@/lib/types";
import { BLOOD_TYPES } from "@/lib/utils";
import { api } from "@/lib/api/client";
import { InteractiveMap } from "@/components/map/InteractiveMap";
import { Calendar, MapPin, Plus, CheckCircle2, ArrowRight } from "lucide-react";

export default function NewCampPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("2026-10-25");
  const [time, setTime] = useState("09:00 AM - 04:00 PM");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Bengaluru");
  const [lat, setLat] = useState(12.9716);
  const [lng, setLng] = useState(77.5946);
  const [targetBloodTypes, setTargetBloodTypes] = useState<BloodType[]>(["O-", "A-", "B-", "AB-"]);
  const [expectedDonors, setExpectedDonors] = useState(150);
  const [contactPhone, setContactPhone] = useState("+91 80 2226 8435");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleBloodType = (bt: BloodType) => {
    if (targetBloodTypes.includes(bt)) {
      setTargetBloodTypes(targetBloodTypes.filter((t) => t !== bt));
    } else {
      setTargetBloodTypes([...targetBloodTypes, bt]);
    }
  };

  const handleMapClick = (newLat: number, newLng: number) => {
    setLat(Math.round(newLat * 10000) / 10000);
    setLng(Math.round(newLng * 10000) / 10000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !address) return;
    setIsSubmitting(true);
    try {
      await api.createCamp(user?.id || "usr_ngo_1", {
        title,
        location: {
          lat,
          lng,
          address,
          city,
        },
        date,
        time,
        target_blood_types: targetBloodTypes,
        expected_donors: expectedDonors,
        contact_phone: contactPhone,
      });
      router.push("/ngo/camps");
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
          <Calendar className="h-4 w-4" />
          <span>Donation Drive Organizer</span>
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight mt-1">
          Schedule New Blood Donation Camp
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Publish a public donation drive with venue geofencing and prioritized blood group quotas.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-7 space-y-5 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl"
        >
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Camp Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Central Mall Mega Blood Drive 2026"
              className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3.5 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Drive Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3.5 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Operational Hours</label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="09:00 AM - 04:00 PM"
                className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3.5 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Venue Address</label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. Town Hall Auditorium, JC Road, Bengaluru"
              className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3.5 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">City</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3.5 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
              >
                <option value="Bengaluru">Bengaluru</option>
                <option value="Mumbai">Mumbai</option>
                <option value="New Delhi">New Delhi</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Expected Donors Capacity</label>
              <input
                type="number"
                min="20"
                max="1000"
                value={expectedDonors}
                onChange={(e) => setExpectedDonors(Number(e.target.value))}
                className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3.5 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none font-bold"
              />
            </div>
          </div>

          {/* Target Blood Groups Multi-Select */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 block">
              Target Blood Groups (Priority Need)
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {BLOOD_TYPES.map((type) => {
                const isSelected = targetBloodTypes.includes(type);
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => toggleBloodType(type)}
                    className={`rounded-xl p-2 text-xs font-bold transition border ${
                      isSelected
                        ? "bg-amber-600 text-white border-amber-500 shadow-[0_0_10px_rgba(217,119,6,0.4)]"
                        : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-amber-600 hover:bg-amber-500 py-3.5 text-xs font-bold text-white shadow-[0_0_20px_rgba(217,119,6,0.4)] transition flex items-center justify-center gap-2 mt-4"
          >
            <Plus className="h-4 w-4" />
            <span>{isSubmitting ? "Publishing Drive..." : "Publish Donation Camp Drive"}</span>
          </button>
        </form>

        {/* Map Column */}
        <div className="lg:col-span-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 px-1">
            <span>Venue Map Coordinates</span>
            <span className="text-amber-400 font-mono text-[11px]">
              {lat.toFixed(4)}, {lng.toFixed(4)}
            </span>
          </div>

          <InteractiveMap
            center={[lat, lng]}
            zoom={12}
            selectedPin={[lat, lng]}
            onSelectLocation={handleMapClick}
            height="460px"
          />
          <p className="text-[11px] text-slate-500 px-1">
            Click anywhere on the map to pin the exact drive location.
          </p>
        </div>
      </div>
    </div>
  );
}
