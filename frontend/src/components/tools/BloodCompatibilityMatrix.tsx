"use client";

import React, { useState } from "react";
import { BloodType } from "@/lib/types";
import { BLOOD_TYPES, RED_CELL_COMPATIBILITY } from "@/lib/utils";
import { Check, X, Info, ArrowRight, ShieldCheck, HeartHandshake } from "lucide-react";

export function BloodCompatibilityMatrix() {
  const [selectedType, setSelectedType] = useState<BloodType>("O-");

  const compatibility = RED_CELL_COMPATIBILITY[selectedType];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <HeartHandshake className="h-5 w-5 text-rose-500" />
            Interactive Compatibility Calculator
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Select any blood group below to inspect who you can donate red blood cells to and receive from.
          </p>
        </div>

        {/* Universal Callout Badges */}
        <div className="flex items-center gap-2">
          {selectedType === "O-" && (
            <span className="rounded-full bg-rose-500/20 border border-rose-500/40 px-3 py-1 text-xs font-bold text-rose-300 animate-pulse">
              ⭐ Universal Red Cell Donor
            </span>
          )}
          {selectedType === "AB+" && (
            <span className="rounded-full bg-cyan-500/20 border border-cyan-500/40 px-3 py-1 text-xs font-bold text-cyan-300 animate-pulse">
              🛡️ Universal Red Cell Recipient
            </span>
          )}
        </div>
      </div>

      {/* Blood Group Selector Chips */}
      <div className="mt-5">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
          Select Blood Group
        </label>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {BLOOD_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`flex flex-col items-center justify-center rounded-xl p-3 font-black text-sm transition-all ${
                selectedType === type
                  ? "bg-gradient-to-b from-rose-600 to-red-700 text-white shadow-[0_0_15px_rgba(225,29,72,0.5)] scale-105 border border-rose-400"
                  : "bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700"
              }`}
            >
              <span>{type}</span>
              <span className="text-[9px] font-normal opacity-75 mt-0.5">
                {type === "O-" ? "Universal" : type === "AB+" ? "Recipient" : "Donor"}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Two-Column Comparison View */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Can Donate To */}
        <div className="rounded-xl bg-slate-950/70 border border-slate-800 p-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4" />
              Can Donate Red Cells To ({compatibility.canDonateTo.length})
            </span>
            <span className="text-[11px] text-slate-400">
              When {selectedType} is the donor
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 mt-3">
            {BLOOD_TYPES.map((type) => {
              const can = compatibility.canDonateTo.includes(type);
              return (
                <div
                  key={`give-${type}`}
                  className={`flex items-center justify-between rounded-lg p-2 text-xs font-bold border ${
                    can
                      ? "bg-emerald-950/30 border-emerald-800/60 text-emerald-300"
                      : "bg-slate-900/40 border-slate-800 text-slate-500 opacity-50"
                  }`}
                >
                  <span>{type}</span>
                  {can ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <X className="h-3.5 w-3.5 text-slate-600" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Can Receive From */}
        <div className="rounded-xl bg-slate-950/70 border border-slate-800 p-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <ArrowRight className="h-4 w-4" />
              Can Receive Red Cells From ({compatibility.canReceiveFrom.length})
            </span>
            <span className="text-[11px] text-slate-400">
              When {selectedType} is patient
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 mt-3">
            {BLOOD_TYPES.map((type) => {
              const can = compatibility.canReceiveFrom.includes(type);
              return (
                <div
                  key={`receive-${type}`}
                  className={`flex items-center justify-between rounded-lg p-2 text-xs font-bold border ${
                    can
                      ? "bg-cyan-950/30 border-cyan-800/60 text-cyan-300"
                      : "bg-slate-900/40 border-slate-800 text-slate-500 opacity-50"
                  }`}
                >
                  <span>{type}</span>
                  {can ? <Check className="h-3.5 w-3.5 text-cyan-400" /> : <X className="h-3.5 w-3.5 text-slate-600" />}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Clinical Guidance Footnote */}
      <div className="mt-4 flex items-start gap-2 rounded-xl bg-slate-950/50 p-3 text-[11px] text-slate-400 border border-slate-800/60">
        <Info className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
        <p>
          <strong className="text-slate-200">Plasma Clinical Note:</strong> Plasma compatibility is the reverse of red blood cell compatibility. 
          AB individuals are universal plasma donors, while O individuals are universal plasma recipients.
        </p>
      </div>
    </div>
  );
}
