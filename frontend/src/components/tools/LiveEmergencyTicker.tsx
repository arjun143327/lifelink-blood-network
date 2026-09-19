"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { EmergencyRequest } from "@/lib/types";
import { api } from "@/lib/api/client";
import { AlertCircle, ArrowRight, ShieldAlert } from "lucide-react";
import { formatTimeAgo } from "@/lib/utils";

export function LiveEmergencyTicker() {
  const [requests, setRequests] = useState<EmergencyRequest[]>([]);

  useEffect(() => {
    async function loadRequests() {
      try {
        const list = await api.getEmergencyRequestsList();
        setRequests(list.filter((r) => r.status === "open").slice(0, 3));
      } catch (err) {
        console.error(err);
      }
    }
    loadRequests();
  }, []);

  if (requests.length === 0) return null;

  return (
    <div className="border-y border-red-500/20 bg-gradient-to-r from-red-950/40 via-slate-950 to-red-950/40 px-4 py-2 text-xs">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-red-400 font-bold uppercase tracking-wider">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
          </span>
          <ShieldAlert className="h-4 w-4" />
          <span>Active Emergencies ({requests.length})</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {requests.map((req) => (
            <div
              key={req.id}
              className="flex items-center gap-2 rounded-lg bg-slate-900/90 border border-red-500/30 px-2.5 py-1 text-slate-200"
            >
              <span className="rounded bg-red-600 px-1.5 py-0.5 font-black text-white text-[11px]">
                {req.blood_type}
              </span>
              <span className="font-semibold text-white">{req.units_needed} units</span>
              <span className="text-slate-400 hidden sm:inline">&bull; {req.hospital_name}</span>
              <span className="text-[10px] text-red-400 uppercase font-bold">
                [{req.urgency}]
              </span>
              <span className="text-[10px] text-slate-500">
                {formatTimeAgo(req.created_at)}
              </span>
            </div>
          ))}
        </div>

        <Link
          href="/explore/blood-search"
          className="flex items-center gap-1 font-semibold text-rose-400 hover:text-rose-300 transition text-[11px]"
        >
          <span>View All Shortages</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
