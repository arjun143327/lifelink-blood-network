"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/context/AuthContext";
import { Camp } from "@/lib/types";
import { api } from "@/lib/api/client";
import { formatDate } from "@/lib/utils";
import {
  Calendar,
  Users,
  PlusCircle,
  MapPin,
  HeartHandshake,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export function NgoDashboardPage() {
  const { user } = useAuth();
  const [camps, setCamps] = useState<Camp[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCamps() {
      try {
        const list = await api.getCamps();
        setCamps(list);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadCamps();
  }, []);

  const totalRegistered = camps.reduce((sum, c) => sum + (c.registered_count || 0), 0);
  const totalExpected = camps.reduce((sum, c) => sum + (c.expected_donors || 0), 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* NGO Banner */}
      <div className="rounded-3xl border border-amber-950/60 bg-gradient-to-br from-slate-900 via-slate-950 to-amber-950/20 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                NGO &amp; Community Drives Console
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              {user?.name || "Indian Red Cross Society"}
            </h1>
            <p className="text-xs text-slate-400">
              Community blood donation drive planning, donor engagement, and multi-hospital mobilization.
            </p>
          </div>

          <Link
            href="/ngo/camps/new"
            className="flex items-center gap-2 rounded-xl bg-amber-600 hover:bg-amber-500 px-5 py-3 text-xs font-bold text-white shadow-[0_0_20px_rgba(217,119,6,0.4)] transition shrink-0"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Schedule New Donation Camp</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Drives Scheduled
            </span>
            <Calendar className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-2 text-3xl font-black text-white">{camps.length}</div>
          <p className="mt-1 text-[11px] text-slate-400">
            Across Bengaluru, Mumbai &amp; Delhi
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Donors Mobilized
            </span>
            <Users className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-3xl font-black text-emerald-400">{totalRegistered}</div>
          <p className="mt-1 text-[11px] text-slate-400">
            Registered volunteers for upcoming drives
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Capacity Target
            </span>
            <HeartHandshake className="h-4 w-4 text-rose-400" />
          </div>
          <div className="mt-2 text-3xl font-black text-white">{totalExpected}</div>
          <p className="mt-1 text-[11px] text-slate-400">
            Units projected for partner hospitals
          </p>
        </div>
      </div>

      {/* Camps List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Calendar className="h-4 w-4 text-amber-400" />
            Scheduled Blood Donation Drives
          </h3>
          <Link
            href="/ngo/camps"
            className="text-xs text-amber-400 hover:underline font-semibold"
          >
            Public Directory &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {camps.map((camp) => (
            <div
              key={camp.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4 backdrop-blur-xl transition hover:border-slate-700"
            >
              <div className="space-y-1">
                <span className="rounded bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold text-amber-400">
                  {camp.date}
                </span>
                <h4 className="text-base font-bold text-white mt-1">{camp.title}</h4>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                  <span>{camp.location.address}, {camp.location.city}</span>
                </p>
              </div>

              {/* Target blood types chips */}
              <div className="space-y-1">
                <span className="text-[11px] text-slate-400">Target Blood Groups:</span>
                <div className="flex flex-wrap gap-1">
                  {camp.target_blood_types.map((type) => (
                    <span
                      key={type}
                      className="rounded bg-rose-950/60 border border-rose-800/60 px-2 py-0.5 text-[10px] font-bold text-rose-300"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>

              {/* Progress counter */}
              <div className="rounded-xl bg-slate-950/70 p-3 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Registered Donors:</span>
                  <span className="font-bold text-white">
                    {camp.registered_count || 0} / {camp.expected_donors || 100}
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-amber-500"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.round(((camp.registered_count || 0) / (camp.expected_donors || 100)) * 100)
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NgoDashboardPage;
