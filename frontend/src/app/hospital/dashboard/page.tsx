"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/context/AuthContext";
import { Hospital, InventoryItem, EmergencyRequest } from "@/lib/types";
import { api } from "@/lib/api/client";
import { formatTimeAgo, getUrgencyStyles } from "@/lib/utils";
import {
  Building2,
  AlertTriangle,
  Radio,
  Layers,
  Search,
  PlusCircle,
  ArrowRight,
  TrendingDown,
  CheckCircle2,
  Clock,
  ShieldCheck,
} from "lucide-react";

export function HospitalDashboardPage() {
  const { user } = useAuth();
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [activeRequests, setActiveRequests] = useState<EmergencyRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const hospitalId = user?.id || "hosp_apollo_blr";

  useEffect(() => {
    async function loadData() {
      try {
        const hosp = await api.getHospital(hospitalId);
        if (hosp) setHospital(hosp);

        const inv = await api.getHospitalInventory(hospitalId);
        setInventory(inv);

        const reqs = await api.getEmergencyRequestsList(hospitalId);
        setActiveRequests(reqs);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [hospitalId]);

  // Critical stock items (< 5 units)
  const criticalItems = inventory.filter((item) => item.units < 5);
  const totalUnits = inventory.reduce((sum, item) => sum + item.units, 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Hospital Banner */}
      <div className="rounded-3xl border border-blue-950/60 bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950/20 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                Hospital Command Center
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              {hospital?.name || "Apollo Hospital, Bannerghatta"}
            </h1>
            <p className="text-xs text-slate-400">
              {hospital?.address || "154/11, Opp IIMB, Bannerghatta Rd, Bengaluru"} • Verified Blood Bank Console
            </p>
          </div>

          {/* Quick SOS Action */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/hospital/requests/new"
              className="flex items-center gap-2 rounded-xl bg-red-600 hover:bg-red-500 px-4 py-3 text-xs font-bold text-white shadow-[0_0_20px_rgba(239,68,68,0.4)] transition"
            >
              <AlertTriangle className="h-4 w-4 animate-pulse" />
              <span>Broadcast Emergency SOS</span>
            </Link>

            <Link
              href="/hospital/inventory"
              className="flex items-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-3 text-xs font-bold text-slate-200 transition"
            >
              <Layers className="h-4 w-4 text-cyan-400" />
              <span>Manage Stock Matrix</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Telemetry Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Units In Bank
            </span>
            <Layers className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="mt-2 text-3xl font-black text-white">{totalUnits}</div>
          <p className="mt-1 text-[11px] text-slate-400">
            Across 24 component types
          </p>
        </div>

        <div className="rounded-2xl border border-red-500/30 bg-red-950/20 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-red-400 uppercase tracking-wider">
              Critical Shortages
            </span>
            <TrendingDown className="h-4 w-4 text-red-400 animate-pulse" />
          </div>
          <div className="mt-2 text-3xl font-black text-red-400">
            {criticalItems.length}
          </div>
          <p className="mt-1 text-[11px] text-red-300/80">
            Below safe threshold (&lt; 5 units)
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Active Broadcasts
            </span>
            <Radio className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-2 text-3xl font-black text-white">
            {activeRequests.filter((r) => r.status === "open").length}
          </div>
          <p className="mt-1 text-[11px] text-amber-400">
            Live PostGIS radar pings
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Inter-Hospital Link
            </span>
            <Building2 className="h-4 w-4 text-blue-400" />
          </div>
          <div className="mt-2 text-3xl font-black text-emerald-400">
            Connected
          </div>
          <Link
            href="/hospital/search"
            className="mt-1 text-[11px] text-cyan-400 hover:underline flex items-center gap-1 font-medium"
          >
            <span>Search Partner Banks</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* Two-Column Section: Critical Shortages Alerts & Active Requests Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Critical Stock Gauge */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              Critical Stock Depletion Alerts
            </h3>
            <Link
              href="/hospital/inventory"
              className="text-xs text-rose-400 hover:underline font-semibold"
            >
              Full Matrix &rarr;
            </Link>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-2.5 backdrop-blur-xl">
            {criticalItems.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 space-y-1">
                <CheckCircle2 className="h-6 w-6 text-emerald-400 mx-auto" />
                <p>All blood components are within safe thresholds.</p>
              </div>
            ) : (
              criticalItems.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-xl bg-slate-950/80 p-3 border border-red-500/20"
                >
                  <div className="flex items-center gap-3">
                    <span className="rounded-lg bg-red-600 px-2.5 py-1 text-xs font-black text-white">
                      {item.blood_type}
                    </span>
                    <div>
                      <h5 className="text-xs font-bold text-white capitalize">
                        {item.component.replace("_", " ")}
                      </h5>
                      <span className="text-[10px] text-red-400 font-medium">
                        CRITICAL SHORTAGE
                      </span>
                    </div>
                  </div>

                  <div className="text-right flex items-center gap-3">
                    <span className="text-sm font-black text-red-400">
                      {item.units} units
                    </span>
                    <Link
                      href={`/hospital/requests/new?blood_type=${item.blood_type}&component=${item.component}`}
                      className="rounded-lg bg-rose-600/20 hover:bg-rose-600 hover:text-white border border-rose-500/40 px-2.5 py-1 text-[11px] font-bold text-rose-300 transition"
                    >
                      Broadcast SOS
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Live Dispatched Requests */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Radio className="h-4 w-4 text-emerald-400" />
              Live Emergency Dispatches &amp; Donor Matches
            </h3>
            <span className="text-xs text-slate-400">
              {activeRequests.length} Total Requests
            </span>
          </div>

          <div className="space-y-3">
            {activeRequests.length === 0 ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 text-center text-xs text-slate-400">
                No active emergency broadcasts right now.
              </div>
            ) : (
              activeRequests.map((req) => {
                const urgency = getUrgencyStyles(req.urgency);
                const confirmedCount =
                  req.matched_donors?.filter((d) => d.response === "confirmed").length || 0;
                const pendingCount =
                  req.matched_donors?.filter((d) => d.response === "pending").length || 0;

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
                        <h4 className="text-base font-bold text-white mt-1">
                          SOS #{req.id.slice(-6)}: {req.units_needed} Units of {req.blood_type}{" "}
                          <span className="capitalize text-slate-400 font-normal text-xs">
                            ({req.component.replace("_", " ")})
                          </span>
                        </h4>
                      </div>

                      <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400 uppercase">
                        {req.status}
                      </span>
                    </div>

                    {/* Donor Responses Counters */}
                    <div className="grid grid-cols-3 gap-2 rounded-xl bg-slate-950/70 p-3 border border-slate-800/80 text-center">
                      <div>
                        <span className="text-xs text-slate-400 block">Radius Target</span>
                        <span className="text-sm font-bold text-white">{req.radius_km} km</span>
                      </div>
                      <div>
                        <span className="text-xs text-emerald-400 block font-semibold">Confirmed</span>
                        <span className="text-sm font-bold text-emerald-400">{confirmedCount}</span>
                      </div>
                      <div>
                        <span className="text-xs text-amber-400 block font-semibold">Pending</span>
                        <span className="text-sm font-bold text-amber-400">{pendingCount}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs text-slate-400">
                        {req.matched_donor_count || 0} Donors Located via PostGIS
                      </span>

                      <Link
                        href={`/hospital/requests/${req.id}`}
                        className="flex items-center gap-1 rounded-lg bg-blue-600 hover:bg-blue-500 px-3 py-1.5 text-xs font-bold text-white transition"
                      >
                        <span>Open Live Tracker</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HospitalDashboardPage;
