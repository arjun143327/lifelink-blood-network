"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { EmergencyRequest } from "@/lib/types";
import { api } from "@/lib/api/client";
import { formatTimeAgo, getUrgencyStyles } from "@/lib/utils";
import {
  Radio,
  Clock,
  CheckCircle2,
  XCircle,
  Phone,
  ArrowLeft,
  Users,
  RefreshCw,
  MapPin,
  Building2,
  AlertTriangle,
} from "lucide-react";

export default function RequestTrackerPage() {
  const params = useParams();
  const router = useRouter();
  const requestId = params.id as string;

  const [request, setRequest] = useState<EmergencyRequest | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const fetchRequest = async () => {
    setIsRefreshing(true);
    try {
      const data = await api.getEmergencyRequest(requestId);
      if (data) setRequest(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRequest();
    // Auto-poll every 10 seconds for real-time donor responses
    const interval = setInterval(fetchRequest, 10000);
    return () => clearInterval(interval);
  }, [requestId]);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center text-xs text-slate-400">
        <span className="h-5 w-5 rounded-full border-2 border-red-500 border-t-transparent animate-spin mr-2"></span>
        Loading Live Emergency Dispatch Board...
      </div>
    );
  }

  if (!request) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center space-y-4">
        <AlertTriangle className="h-10 w-10 text-amber-400 mx-auto" />
        <h2 className="text-lg font-bold text-white">Emergency Request Not Found</h2>
        <p className="text-xs text-slate-400">
          The requested emergency dispatch record could not be found or has expired.
        </p>
        <Link
          href="/hospital/dashboard"
          className="inline-block rounded-xl bg-slate-800 px-4 py-2 text-xs font-bold text-white"
        >
          Return to Hospital Dashboard
        </Link>
      </div>
    );
  }

  const urgencyStyle = getUrgencyStyles(request.urgency);
  const confirmedDonors = request.matched_donors?.filter((d) => d.response === "confirmed") || [];
  const pendingDonors = request.matched_donors?.filter((d) => d.response === "pending") || [];
  const declinedDonors = request.matched_donors?.filter((d) => d.response === "declined") || [];

  const fulfillmentPercent = Math.min(
    100,
    Math.round((confirmedDonors.length / request.units_needed) * 100)
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Back button & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <Link
            href="/hospital/dashboard"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition mb-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Hospital Dashboard</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Emergency SOS Tracker #{request.id.slice(-6)}
            </h1>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase border ${urgencyStyle.badge}`}>
              {urgencyStyle.label}
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Dispatched {formatTimeAgo(request.created_at)} by {request.hospital_name}
          </p>
        </div>

        <button
          onClick={fetchRequest}
          disabled={isRefreshing}
          className="flex items-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 px-3.5 py-2 text-xs font-bold text-slate-200 border border-slate-700 transition self-start sm:self-auto"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-cyan-400" : ""}`} />
          <span>Refresh Live Board</span>
        </button>
      </div>

      {/* Progress & Telemetry Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Fulfillment Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Units Fulfillment
            </span>
            <span className="text-xs font-black text-emerald-400">{fulfillmentPercent}%</span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{confirmedDonors.length}</span>
            <span className="text-slate-400 text-sm">/ {request.units_needed} Units Confirmed</span>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full bg-gradient-to-r from-rose-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${fulfillmentPercent}%` }}
            />
          </div>

          <p className="text-[11px] text-slate-400">
            Target Blood Group: <strong className="text-white">{request.blood_type}</strong> (
            {request.component.replace("_", " ")})
          </p>
        </div>

        {/* Spatial Radius Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            PostGIS Geofence
          </span>
          <div className="text-3xl font-black text-white">{request.radius_km} km</div>
          <p className="text-xs text-slate-300">
            Scanning available registered donors in {request.hospital_city}
          </p>
          <div className="pt-2 flex items-center gap-2 text-[11px] text-cyan-400">
            <Radio className="h-3.5 w-3.5 animate-pulse" />
            <span>Live spatial ping active</span>
          </div>
        </div>

        {/* Total Matched Donors Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Matched Donors Located
          </span>
          <div className="text-3xl font-black text-white">
            {request.matched_donors?.length || 0}
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold pt-1">
            <span className="text-emerald-400">{confirmedDonors.length} Confirmed</span>
            <span className="text-amber-400">{pendingDonors.length} Pending</span>
            <span className="text-slate-500">{declinedDonors.length} Declined</span>
          </div>
        </div>
      </div>

      {/* Matched Donors Response Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Users className="h-5 w-5 text-cyan-400" />
            Matched Volunteer Donors &amp; Real-Time Responses
          </h3>
          <span className="text-xs text-slate-400">
            Sorted by Proximity to Hospital
          </span>
        </div>

        {!request.matched_donors || request.matched_donors.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 text-center text-xs text-slate-400">
            No donors matched within the current radius. Consider expanding radius to 30 km.
          </div>
        ) : (
          <div className="space-y-3">
            {request.matched_donors.map((donor) => {
              return (
                <div
                  key={donor.donor_id}
                  className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition hover:border-slate-700"
                >
                  <div className="flex items-center gap-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-rose-700 to-red-500 font-black text-white text-base shadow-[0_0_12px_rgba(225,29,72,0.4)]">
                      {donor.blood_type}
                    </span>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">{donor.name}</h4>
                        <span className="text-xs text-cyan-400 font-semibold">
                          • {donor.distance_km} km away
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        {donor.responded_at
                          ? `Responded ${formatTimeAgo(donor.responded_at)}`
                          : "Awaiting donor response..."}
                      </p>
                    </div>
                  </div>

                  {/* Status & Call Action */}
                  <div className="flex items-center gap-3">
                    {donor.response === "confirmed" && (
                      <span className="flex items-center gap-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 px-3 py-1.5 text-xs font-bold text-emerald-300">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        <span>CONFIRMED &bull; On The Way</span>
                      </span>
                    )}

                    {donor.response === "pending" && (
                      <span className="flex items-center gap-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 px-3 py-1.5 text-xs font-bold text-amber-300 animate-pulse">
                        <Radio className="h-4 w-4 text-amber-400" />
                        <span>PENDING &bull; Ping Dispatched</span>
                      </span>
                    )}

                    {donor.response === "declined" && (
                      <span className="flex items-center gap-1.5 rounded-xl bg-slate-800 border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-400">
                        <XCircle className="h-4 w-4 text-slate-500" />
                        <span>DECLINED</span>
                      </span>
                    )}

                    {donor.phone && (
                      <a
                        href={`tel:${donor.phone}`}
                        className="flex items-center gap-1 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 text-xs font-bold text-slate-200 transition"
                      >
                        <Phone className="h-3.5 w-3.5 text-emerald-400" />
                        <span>Call Donor</span>
                      </a>
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
