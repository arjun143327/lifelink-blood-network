"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/context/AuthContext";
import { EmergencyRequest } from "@/lib/types";
import { api } from "@/lib/api/client";
import { formatTimeAgo, getUrgencyStyles } from "@/lib/utils";
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  ArrowLeft,
  Radio,
  Phone,
} from "lucide-react";

export default function DonorRequestsPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<EmergencyRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadRequests() {
      try {
        const list = await api.getDonorAlerts(user?.id || "donor_1");
        setRequests(list);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadRequests();
  }, [user]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <div>
        <Link
          href="/donor/dashboard"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition mb-2"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Donor Dashboard</span>
        </Link>
        <div className="flex items-center gap-2 text-xs font-bold text-red-400 uppercase tracking-wider">
          <Radio className="h-4 w-4" />
          <span>Emergency Broadcast Log</span>
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight mt-1">
          Hospital Emergency SOS History
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Review all urgent hospital requests broadcast to your device and your historical responses.
        </p>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center text-xs text-slate-400">
          Loading alerts log...
        </div>
      ) : requests.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 text-center text-xs text-slate-400">
          No emergency alerts recorded yet.
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => {
            const urgency = getUrgencyStyles(req.urgency);
            const myResponse = req.matched_donors?.find(
              (m) => m.donor_id === user?.id || m.donor_id === "donor_1"
            )?.response || "pending";

            return (
              <div
                key={req.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4 transition hover:border-slate-700"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${urgency.badge}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${urgency.dot}`}></span>
                        {urgency.label}
                      </span>
                      <span className="text-xs text-slate-400">
                        {formatTimeAgo(req.created_at)}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white mt-1">
                      {req.hospital_name}
                    </h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3.5 w-3.5 text-slate-500" />
                      <span>{req.hospital_city} • Broadcast Radius: {req.radius_km} km</span>
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="rounded-lg bg-rose-600 px-2.5 py-1 text-xs font-black text-white">
                      {req.blood_type}
                    </span>
                    <p className="text-xs font-bold text-slate-300 mt-1">
                      {req.units_needed} Units Needed
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-400">Your Response:</span>
                    {myResponse === "confirmed" ? (
                      <span className="flex items-center gap-1 text-emerald-400 font-bold">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Confirmed
                      </span>
                    ) : myResponse === "declined" ? (
                      <span className="flex items-center gap-1 text-slate-400 font-medium">
                        <XCircle className="h-3.5 w-3.5" /> Declined
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-amber-400 font-bold">
                        <Clock className="h-3.5 w-3.5" /> Pending Action
                      </span>
                    )}
                  </div>

                  <Link
                    href="/donor/dashboard"
                    className="rounded-lg bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-xs font-bold text-slate-200 transition"
                  >
                    Open in Radar
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
