"use client";

import React, { useState } from "react";
import { useAuth, DemoPersona } from "@/lib/context/AuthContext";
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Server,
  Zap,
  UserCheck,
  Building2,
  HeartHandshake,
  Globe,
} from "lucide-react";

export function EvaluatorDemoBar() {
  const { role, user, isMockMode, toggleMockMode, loginAsDemo, resetDemoData, isLoading } =
    useAuth();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="relative z-50 border-b border-rose-950/60 bg-slate-950/95 text-xs text-slate-300 shadow-md backdrop-blur-md">
      {/* Top micro bar with collapse trigger */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 sm:px-6">
        <div className="flex items-center space-x-2">
          <span className="flex items-center gap-1 rounded bg-rose-500/20 px-2 py-0.5 font-semibold text-rose-400 border border-rose-500/30">
            <Sparkles className="h-3 w-3 animate-pulse" />
            Project Evaluator Toolbar
          </span>
          <span className="hidden sm:inline text-slate-400">
            Active Role:{" "}
            <span className="font-semibold text-white capitalize">
              {user ? user.name || role : "Public Explorer"}
            </span>
          </span>
        </div>

        <div className="flex items-center space-x-3">
          {/* Mode Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-900 rounded-full px-2.5 py-0.5 border border-slate-800">
            {isMockMode ? (
              <Zap className="h-3 w-3 text-amber-400" />
            ) : (
              <Server className="h-3 w-3 text-emerald-400" />
            )}
            <span className="text-[11px] font-medium">
              {isMockMode ? "Mock API Engine" : "FastAPI Backend"}
            </span>
            <button
              onClick={() => toggleMockMode(!isMockMode)}
              className="ml-1 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase transition bg-slate-800 hover:bg-slate-700 text-slate-200"
              title="Toggle between stateful Mock data and live FastAPI backend"
            >
              Switch to {isMockMode ? "Live" : "Mock"}
            </button>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1 rounded p-1 text-slate-400 hover:text-white"
            title={isOpen ? "Collapse evaluator bar" : "Expand evaluator bar"}
          >
            {isOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* Expanded quick 1-click persona switcher */}
      {isOpen && (
        <div className="border-t border-slate-800/80 bg-slate-900/80 px-4 py-2 sm:px-6">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-slate-400 font-medium text-[11px] mr-1">
                1-Click Persona Switch:
              </span>

              <button
                disabled={isLoading}
                onClick={() => loginAsDemo("donor_rahul")}
                className={`flex items-center gap-1 rounded-md px-2.5 py-1 font-medium transition ${
                  user?.email === "rahul.sharma@example.com"
                    ? "bg-rose-600 text-white shadow-[0_0_10px_rgba(225,29,72,0.5)]"
                    : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                }`}
              >
                <UserCheck className="h-3 w-3 text-rose-400" />
                <span>Donor (Rahul - O-)</span>
              </button>

              <button
                disabled={isLoading}
                onClick={() => loginAsDemo("hospital_apollo")}
                className={`flex items-center gap-1 rounded-md px-2.5 py-1 font-medium transition ${
                  user?.email === "bloodbank@apollo.org"
                    ? "bg-rose-600 text-white shadow-[0_0_10px_rgba(225,29,72,0.5)]"
                    : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                }`}
              >
                <Building2 className="h-3 w-3 text-blue-400" />
                <span>Hospital (Apollo Admin)</span>
              </button>

              <button
                disabled={isLoading}
                onClick={() => loginAsDemo("hospital_manipal")}
                className={`flex items-center gap-1 rounded-md px-2.5 py-1 font-medium transition ${
                  user?.email === "admin@manipal.org"
                    ? "bg-rose-600 text-white shadow-[0_0_10px_rgba(225,29,72,0.5)]"
                    : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                }`}
              >
                <Building2 className="h-3 w-3 text-cyan-400" />
                <span>Hospital (Manipal)</span>
              </button>

              <button
                disabled={isLoading}
                onClick={() => loginAsDemo("ngo_redcross")}
                className={`flex items-center gap-1 rounded-md px-2.5 py-1 font-medium transition ${
                  user?.email === "coordinator@redcross.org"
                    ? "bg-rose-600 text-white shadow-[0_0_10px_rgba(225,29,72,0.5)]"
                    : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                }`}
              >
                <HeartHandshake className="h-3 w-3 text-amber-400" />
                <span>NGO (Red Cross)</span>
              </button>

              <button
                disabled={isLoading}
                onClick={() => loginAsDemo("public")}
                className={`flex items-center gap-1 rounded-md px-2.5 py-1 font-medium transition ${
                  !user
                    ? "bg-rose-600 text-white shadow-[0_0_10px_rgba(225,29,72,0.5)]"
                    : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                }`}
              >
                <Globe className="h-3 w-3 text-slate-400" />
                <span>Public Portal</span>
              </button>
            </div>

            {/* Reset data button */}
            <div className="flex items-center gap-2">
              <button
                onClick={resetDemoData}
                className="flex items-center gap-1 rounded bg-slate-800 hover:bg-rose-950/40 hover:text-rose-300 border border-slate-700 px-2 py-1 text-[11px] text-slate-300 transition"
                title="Reset mock data to fresh initial values"
              >
                <RefreshCw className="h-3 w-3" />
                <span>Reset Demo State</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
