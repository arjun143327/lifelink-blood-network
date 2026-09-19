"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/context/AuthContext";
import { DonorProfile, EmergencyRequest } from "@/lib/types";
import { api } from "@/lib/api/client";
import { formatTimeAgo, getUrgencyStyles } from "@/lib/utils";
import {
  Radio,
  Power,
  Droplets,
  Heart,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  MapPin,
  Clock,
  ArrowRight,
  Shield,
  Phone,
} from "lucide-react";

export function DonorDashboardPage() {
  const { user, loginAsDemo } = useAuth();
  const [profile, setProfile] = useState<DonorProfile | null>(null);
  const [alerts, setAlerts] = useState<EmergencyRequest[]>([]);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  useEffect(() => {
    async function loadDonorData() {
      try {
        const userId = user?.id || "donor_1";
        const p = await api.getDonorMe(userId);
        setProfile(p);

        const list = await api.getDonorAlerts(p.id);
        setAlerts(list);
      } catch (err) {
        console.error("Failed to load donor dashboard", err);
      }
    }

    loadDonorData();
  }, [user]);

  const toggleAvailability = async () => {
    if (!profile) return;
    setIsUpdating(true);
    try {
      const newStatus = !profile.available;
      await api.updateDonorAvailability(profile.id, newStatus);
      setProfile({ ...profile, available: newStatus });
      setActionFeedback(
        newStatus
          ? "You are now ONLINE & ready for emergency pings!"
          : "You are now OFFLINE. You won't receive emergency pings."
      );
      setTimeout(() => setActionFeedback(null), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRespond = async (requestId: string, response: "confirmed" | "declined") => {
    if (!profile) return;
    try {
      await api.respondToRequest(requestId, profile.id, response);
      // Update local alerts list
      setAlerts((prev) =>
        prev.map((req) => {
          if (req.id === requestId) {
            const matches = req.matched_donors || [];
            const existing = matches.find((m) => m.donor_id === profile.id);
            if (existing) {
              existing.response = response;
            } else {
              matches.push({
                donor_id: profile.id,
                name: profile.name,
                blood_type: profile.blood_type,
                phone: profile.phone,
                distance_km: 1.8,
                response: response,
                responded_at: new Date().toISOString(),
              });
            }
            return { ...req, matched_donors: matches };
          }
          return req;
        })
      );
      setActionFeedback(
        response === "confirmed"
          ? "Hero move! Your confirmation has been dispatched directly to the hospital blood bank."
          : "Response recorded. Thank you for keeping the network updated."
      );
      setTimeout(() => setActionFeedback(null), 5000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Toast Feedback */}
      {actionFeedback && (
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/70 p-3.5 text-xs font-semibold text-emerald-300 shadow-xl backdrop-blur-md flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>{actionFeedback}</span>
          </div>
          <button onClick={() => setActionFeedback(null)} className="text-emerald-400 hover:text-white">
            &times;
          </button>
        </div>
      )}

      {/* Top Banner & Availability Radar */}
      <div className="rounded-3xl border border-rose-950/60 bg-gradient-to-br from-slate-900 via-slate-950 to-rose-950/20 p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        {/* Animated ambient radar circle */}
        <div className="absolute -right-16 -top-16 h-72 w-72 rounded-full border border-rose-500/10 pointer-events-none" />
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full border border-rose-500/5 pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-rose-500 animate-ping" />
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                Volunteer Donor Command Console
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Welcome, {profile?.name || "LifeLink Donor"}
            </h1>
            <p className="text-xs text-slate-400 max-w-xl">
              Your registered blood group is{" "}
              <strong className="text-rose-400 font-black">{profile?.blood_type || "O-"}</strong>. Hospitals within your vicinity will ping your device when matching units are needed.
            </p>
          </div>

          {/* Real-time Radar Toggle Switch */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 sm:p-5 flex items-center gap-5 backdrop-blur-md shrink-0">
            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 border border-slate-800">
              {profile?.available ? (
                <>
                  <div className="absolute inset-0 rounded-2xl border border-rose-500/40 animate-ping-slow" />
                  <Radio className="h-6 w-6 text-rose-500 animate-pulse" />
                </>
              ) : (
                <Power className="h-6 w-6 text-slate-600" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">Standby Radar:</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    profile?.available
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                      : "bg-slate-800 text-slate-400 border border-slate-700"
                  }`}
                >
                  {profile?.available ? "Active & Ready" : "Standby / Offline"}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {profile?.available
                  ? "Discoverable for urgent emergency pings"
                  : "Unavailable for emergency matching"}
              </p>

              <button
                disabled={isUpdating}
                onClick={toggleAvailability}
                className={`mt-2 rounded-lg px-3 py-1.5 text-xs font-bold transition flex items-center gap-1.5 ${
                  profile?.available
                    ? "bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                    : "bg-rose-600 hover:bg-rose-500 text-white shadow-[0_0_15px_rgba(225,29,72,0.4)]"
                }`}
              >
                <Power className="h-3 w-3" />
                <span>{profile?.available ? "Go Offline" : "Activate Emergency Radar"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Blood Type
            </span>
            <Droplets className="h-4 w-4 text-rose-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-white">
            {profile?.blood_type || "O-"}
          </div>
          <p className="mt-1 text-[11px] text-rose-400 font-medium">
            {profile?.blood_type === "O-" ? "Universal Red Cell Donor" : "Registered Donor"}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Donations
            </span>
            <Heart className="h-4 w-4 text-pink-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-white">
            {profile?.donation_count || 6}
          </div>
          <p className="mt-1 text-[11px] text-emerald-400 font-medium">
            ~{((profile?.donation_count || 6) * 3)} Lives Saved
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Location Geofence
            </span>
            <MapPin className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-white">
            {profile?.city || "Bengaluru"}
          </div>
          <Link
            href="/donor/profile"
            className="mt-1 text-[11px] text-cyan-400 font-medium hover:underline flex items-center gap-1"
          >
            <span>Update Pin Coordinates</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Next Eligible
            </span>
            <Calendar className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-400">
            Eligible Today
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            Last donated 90+ days ago
          </p>
        </div>
      </div>

      {/* Active Urgent Requests Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-red-400 uppercase tracking-wider">
              <AlertTriangle className="h-4 w-4" />
              <span>Incoming Emergency SOS Broadcasts</span>
            </div>
            <h2 className="text-xl font-black text-white tracking-tight mt-0.5">
              Urgent Requests Matching Your Blood Group
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            {alerts.length} Active Hospital Pings
          </span>
        </div>

        {alerts.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-8 text-center space-y-2">
            <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto" />
            <h4 className="text-sm font-bold text-white">No Critical Emergencies Nearby</h4>
            <p className="text-xs text-slate-400">
              All hospitals in your immediate radius have adequate stock for your blood type. Keep your radar on!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {alerts.map((req) => {
              const urgencyStyle = getUrgencyStyles(req.urgency);
              const myResponse = req.matched_donors?.find(
                (m) => m.donor_id === profile?.id || m.donor_id === "donor_1"
              )?.response;

              return (
                <div
                  key={req.id}
                  className="rounded-2xl border border-red-500/30 bg-gradient-to-br from-slate-900 to-slate-950 p-5 space-y-4 shadow-xl relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${urgencyStyle.badge}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${urgencyStyle.dot}`}></span>
                          {urgencyStyle.label}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {formatTimeAgo(req.created_at)}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white mt-1">
                        {req.hospital_name}
                      </h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3.5 w-3.5 text-slate-500" />
                        <span>{req.hospital_city} • ~1.8 km from your location</span>
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="inline-block rounded-xl bg-rose-600 px-3 py-1 text-sm font-black text-white shadow-[0_0_12px_rgba(225,29,72,0.4)]">
                        {req.blood_type}
                      </span>
                      <p className="text-[11px] font-bold text-rose-400 mt-1">
                        {req.units_needed} Units Needed
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl bg-slate-950/70 p-3 border border-slate-800 text-xs text-slate-300 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Component Needed:</span>
                      <span className="font-semibold text-white capitalize">
                        {req.component.replace("_", " ")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Hospital Phone:</span>
                      <a href={`tel:${req.hospital_phone}`} className="font-semibold text-cyan-400 hover:underline">
                        {req.hospital_phone || "+91 80 2630 4050"}
                      </a>
                    </div>
                  </div>

                  {/* Response Actions */}
                  <div className="pt-1 flex items-center justify-between gap-3">
                    {myResponse === "confirmed" ? (
                      <div className="flex items-center gap-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 px-3 py-2 text-xs font-bold text-emerald-300 w-full justify-center">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        <span>Confirmed! Hospital expects your arrival</span>
                      </div>
                    ) : myResponse === "declined" ? (
                      <div className="flex items-center gap-2 rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-xs font-medium text-slate-400 w-full justify-center">
                        <XCircle className="h-4 w-4 text-slate-500" />
                        <span>Declined for this request</span>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => handleRespond(req.id, "confirmed")}
                          className="flex-1 rounded-xl bg-rose-600 hover:bg-rose-500 p-2.5 text-xs font-bold text-white shadow-[0_0_15px_rgba(225,29,72,0.4)] transition flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          <span>I Can Donate (Accept)</span>
                        </button>
                        <button
                          onClick={() => handleRespond(req.id, "declined")}
                          className="rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-slate-200 transition"
                        >
                          Decline
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default DonorDashboardPage;
