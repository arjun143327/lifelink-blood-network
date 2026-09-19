"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { UserRole, BloodType } from "@/lib/types";
import { BLOOD_TYPES } from "@/lib/utils";
import { api } from "@/lib/api/client";
import { Droplets, ArrowRight, UserCheck, Building2, HeartHandshake } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [role, setRole] = useState<UserRole>("donor");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bloodType, setBloodType] = useState<BloodType>("O+");
  const [city, setCity] = useState("Bengaluru");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("Please fill out all required fields");
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      const res = await api.signup({
        name,
        email,
        password,
        role,
      });

      // If donor, update donor profile immediately
      if (role === "donor") {
        await api.updateDonorProfile(res.id, {
          name,
          blood_type: bloodType,
          latitude: city === "Bengaluru" ? 12.9716 : city === "Mumbai" ? 19.076 : 28.6139,
          longitude: city === "Bengaluru" ? 77.5946 : city === "Mumbai" ? 72.8777 : 77.209,
          available: true,
          city,
        });
      }

      await login(email, password);
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-12 sm:px-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-600 text-white shadow-[0_0_20px_rgba(225,29,72,0.4)]">
            <Droplets className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Create LifeLink Account
          </h1>
          <p className="text-xs text-slate-400">
            Join the real-time emergency blood network as a donor, hospital, or NGO.
          </p>
        </div>

        {error && (
          <div className="rounded-xl bg-red-500/15 border border-red-500/30 p-3 text-xs text-red-400">
            {error}
          </div>
        )}

        {/* Role Selector Tabs */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Select Account Persona</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setRole("donor")}
              className={`flex flex-col items-center justify-center rounded-xl p-3 text-xs font-bold transition border ${
                role === "donor"
                  ? "bg-rose-600 text-white border-rose-500 shadow-[0_0_15px_rgba(225,29,72,0.4)]"
                  : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              <UserCheck className="h-4 w-4 mb-1" />
              <span>Donor</span>
            </button>

            <button
              type="button"
              onClick={() => setRole("hospital_admin")}
              className={`flex flex-col items-center justify-center rounded-xl p-3 text-xs font-bold transition border ${
                role === "hospital_admin"
                  ? "bg-blue-600 text-white border-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                  : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              <Building2 className="h-4 w-4 mb-1" />
              <span>Hospital</span>
            </button>

            <button
              type="button"
              onClick={() => setRole("ngo_admin")}
              className={`flex flex-col items-center justify-center rounded-xl p-3 text-xs font-bold transition border ${
                role === "ngo_admin"
                  ? "bg-amber-600 text-white border-amber-500 shadow-[0_0_15px_rgba(217,119,6,0.4)]"
                  : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              <HeartHandshake className="h-4 w-4 mb-1" />
              <span>NGO Admin</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              {role === "donor" ? "Full Name" : role === "hospital_admin" ? "Hospital Name" : "Organization Name"}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={role === "donor" ? "e.g. Rahul Sharma" : role === "hospital_admin" ? "e.g. Apollo Hospital" : "e.g. Indian Red Cross"}
              className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-rose-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-rose-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-rose-500 focus:outline-none"
            />
          </div>

          {/* Donor specific fields */}
          {role === "donor" && (
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Blood Group</label>
                <select
                  value={bloodType}
                  onChange={(e) => setBloodType(e.target.value as BloodType)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2.5 text-xs text-white focus:border-rose-500 focus:outline-none"
                >
                  {BLOOD_TYPES.map((bt) => (
                    <option key={bt} value={bt}>
                      {bt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">City / Location</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2.5 text-xs text-white focus:border-rose-500 focus:outline-none"
                >
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="New Delhi">New Delhi</option>
                </select>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-rose-600 hover:bg-rose-500 py-3 text-xs font-bold text-white shadow-[0_0_20px_rgba(225,29,72,0.3)] transition flex items-center justify-center gap-2 mt-2"
          >
            <span>{isLoading ? "Creating Account..." : "Register & Activate Portal"}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-400">
          Already registered?{" "}
          <Link href="/auth/login" className="font-bold text-rose-400 hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
