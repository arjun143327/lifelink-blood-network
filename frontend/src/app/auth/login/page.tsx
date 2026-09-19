"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/context/AuthContext";
import { Droplets, ArrowRight, Shield, User, Building2, HeartHandshake, Lock } from "lucide-react";

export default function LoginPage() {
  const { login, loginAsDemo, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address");
      return;
    }
    setError(null);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-600 text-white shadow-[0_0_20px_rgba(225,29,72,0.4)]">
            <Droplets className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Sign In to LifeLink
          </h1>
          <p className="text-xs text-slate-400">
            Real-time blood logistics and emergency donor response console.
          </p>
        </div>

        {error && (
          <div className="rounded-xl bg-red-500/15 border border-red-500/30 p-3 text-xs text-red-400">
            {error}
          </div>
        )}

        {/* Standard credentials form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. rahul.sharma@example.com"
              className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-rose-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Password</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-rose-500 focus:outline-none"
              />
              <Lock className="absolute right-3 top-2.5 h-4 w-4 text-slate-500" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-rose-600 hover:bg-rose-500 py-3 text-xs font-bold text-white shadow-[0_0_20px_rgba(225,29,72,0.3)] transition flex items-center justify-center gap-2"
          >
            <span>{isLoading ? "Authenticating..." : "Sign In with Credentials"}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </form>

        {/* 1-Click Academic Evaluation Logins */}
        <div className="pt-2 border-t border-slate-800/80 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              ⚡ 1-Click Evaluator Presets
            </span>
            <span className="text-[10px] text-rose-400 font-medium">No typing needed</span>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => loginAsDemo("donor_rahul")}
              className="w-full flex items-center justify-between rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 p-2.5 text-xs font-medium text-slate-200 transition text-left"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/20 text-rose-400">
                  <User className="h-3.5 w-3.5" />
                </div>
                <div>
                  <div className="font-semibold text-white">Rahul Sharma</div>
                  <div className="text-[10px] text-slate-400">Donor • O- Universal • Bengaluru</div>
                </div>
              </div>
              <span className="text-[10px] text-rose-400 font-bold">Launch &rarr;</span>
            </button>

            <button
              onClick={() => loginAsDemo("hospital_apollo")}
              className="w-full flex items-center justify-between rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 p-2.5 text-xs font-medium text-slate-200 transition text-left"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400">
                  <Building2 className="h-3.5 w-3.5" />
                </div>
                <div>
                  <div className="font-semibold text-white">Apollo Hospital Admin</div>
                  <div className="text-[10px] text-slate-400">Hospital Admin • Bannerghatta Rd</div>
                </div>
              </div>
              <span className="text-[10px] text-blue-400 font-bold">Launch &rarr;</span>
            </button>

            <button
              onClick={() => loginAsDemo("ngo_redcross")}
              className="w-full flex items-center justify-between rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 p-2.5 text-xs font-medium text-slate-200 transition text-left"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
                  <HeartHandshake className="h-3.5 w-3.5" />
                </div>
                <div>
                  <div className="font-semibold text-white">Red Cross Society</div>
                  <div className="text-[10px] text-slate-400">NGO Admin • Camp Organizer</div>
                </div>
              </div>
              <span className="text-[10px] text-amber-400 font-bold">Launch &rarr;</span>
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-slate-400">
          Need an account?{" "}
          <Link href="/auth/signup" className="font-bold text-rose-400 hover:underline">
            Register new account
          </Link>
        </div>
      </div>
    </div>
  );
}
