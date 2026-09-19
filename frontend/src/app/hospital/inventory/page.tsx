"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/context/AuthContext";
import { BloodType, BloodComponent, InventoryItem } from "@/lib/types";
import { BLOOD_TYPES, BLOOD_COMPONENTS, formatDate } from "@/lib/utils";
import { api } from "@/lib/api/client";
import {
  Layers,
  Plus,
  Minus,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  TrendingDown,
  Building2,
  Search,
} from "lucide-react";

export default function HospitalInventoryPage() {
  const { user } = useAuth();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState<string>("");

  const hospitalId = user?.id || "hosp_apollo_blr";

  useEffect(() => {
    async function loadInventory() {
      setIsLoading(true);
      try {
        const items = await api.getHospitalInventory(hospitalId);
        setInventory(items);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadInventory();
  }, [hospitalId]);

  const updateUnits = async (
    bloodType: BloodType,
    component: BloodComponent,
    delta: number
  ) => {
    const current = inventory.find(
      (i) => i.blood_type === bloodType && i.component === component
    );
    const newUnits = Math.max(0, (current?.units ?? 0) + delta);

    // Optimistic update
    setInventory((prev) => {
      const idx = prev.findIndex(
        (i) => i.blood_type === bloodType && i.component === component
      );
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], units: newUnits, updated_at: new Date().toISOString() };
        return copy;
      }
      return [
        ...prev,
        {
          blood_type: bloodType,
          component: component,
          units: newUnits,
          updated_at: new Date().toISOString(),
        },
      ];
    });

    try {
      await api.updateHospitalInventory(hospitalId, {
        blood_type: bloodType,
        component: component,
        units: newUnits,
      });
      setSaveFeedback(`Updated ${bloodType} (${component.replace("_", " ")}) to ${newUnits} units`);
      setTimeout(() => setSaveFeedback(null), 2500);
    } catch (err) {
      console.error("Failed to update inventory", err);
    }
  };

  const getStockStatus = (units: number) => {
    if (units <= 2) {
      return {
        label: "CRITICAL",
        color: "bg-red-500/20 text-red-400 border-red-500/40 animate-pulse",
      };
    }
    if (units <= 5) {
      return {
        label: "LOW",
        color: "bg-amber-500/20 text-amber-400 border-amber-500/40",
      };
    }
    if (units <= 15) {
      return {
        label: "OPTIMAL",
        color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
      };
    }
    return {
      label: "SURPLUS",
      color: "bg-blue-500/20 text-blue-400 border-blue-500/40",
    };
  };

  const filteredBloodTypes = BLOOD_TYPES.filter(
    (bt) => !searchFilter || bt.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
            <Layers className="h-4 w-4" />
            <span>Blood Bank Stock Matrix</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight mt-1">
            Live Inventory Management (8×3 Matrix)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage 8 blood groups across Whole Blood, Plasma, and Platelets. Updates sync immediately with the national network.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/hospital/requests/new"
            className="flex items-center gap-2 rounded-xl bg-red-600 hover:bg-red-500 px-4 py-2.5 text-xs font-bold text-white shadow-[0_0_15px_rgba(239,68,68,0.4)] transition"
          >
            <AlertTriangle className="h-4 w-4" />
            <span>Dispatch Emergency SOS</span>
          </Link>
        </div>
      </div>

      {/* Save Notification Pill */}
      {saveFeedback && (
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/70 p-3 text-xs font-semibold text-emerald-300 shadow-xl backdrop-blur-md flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{saveFeedback}</span>
        </div>
      )}

      {/* Quick Search & Summary Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-xl">
        <div className="flex items-center gap-2 bg-slate-950 rounded-xl px-3 py-2 border border-slate-800 w-full sm:w-64">
          <Search className="h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Filter blood group (e.g. O-, A+)..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none w-full"
          />
        </div>

        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-red-400">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span> Critical (&le; 2)
          </span>
          <span className="flex items-center gap-1.5 text-amber-400">
            <span className="h-2 w-2 rounded-full bg-amber-400"></span> Low (3-5)
          </span>
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400"></span> Optimal (6-15)
          </span>
          <span className="flex items-center gap-1.5 text-blue-400">
            <span className="h-2 w-2 rounded-full bg-blue-400"></span> Surplus (&gt; 15)
          </span>
        </div>
      </div>

      {/* 8 Blood Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredBloodTypes.map((bloodType) => {
          return (
            <div
              key={bloodType}
              className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4 shadow-xl backdrop-blur-xl"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-rose-700 to-red-500 font-black text-white text-base shadow-[0_0_12px_rgba(225,29,72,0.4)]">
                    {bloodType}
                  </span>
                  <div>
                    <h3 className="font-bold text-white text-sm">Group {bloodType}</h3>
                    <span className="text-[10px] text-slate-400">
                      {bloodType === "O-" ? "Universal Donor" : bloodType === "AB+" ? "Universal Recipient" : "Standard"}
                    </span>
                  </div>
                </div>

                <Link
                  href={`/hospital/requests/new?blood_type=${bloodType}`}
                  className="rounded-lg bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 px-2 py-1 text-[10px] font-bold text-red-400 transition"
                  title="Broadcast SOS for this blood group"
                >
                  SOS
                </Link>
              </div>

              {/* 3 Components for this blood group */}
              <div className="space-y-3">
                {BLOOD_COMPONENTS.map((comp) => {
                  const item = inventory.find(
                    (i) => i.blood_type === bloodType && i.component === comp.id
                  );
                  const units = item?.units ?? 0;
                  const status = getStockStatus(units);

                  return (
                    <div
                      key={comp.id}
                      className="rounded-xl bg-slate-950/70 p-3 border border-slate-800/80 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-300">
                          {comp.label}
                        </span>
                        <span
                          className={`rounded px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider border ${status.color}`}
                        >
                          {status.label}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl font-black text-white">{units}</span>
                          <span className="text-[11px] text-slate-400">units</span>
                        </div>

                        {/* Quick +/- Control Buttons */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => updateUnits(bloodType, comp.id, -1)}
                            disabled={units <= 0}
                            className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-200 border border-slate-700 transition"
                            title="Decrease 1 unit"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => updateUnits(bloodType, comp.id, 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800 hover:bg-rose-600 hover:border-rose-500 text-slate-200 border border-slate-700 transition"
                            title="Add 1 unit"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
