"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import {
  Heart,
  Droplets,
  Search,
  Activity,
  Calendar,
  AlertTriangle,
  Menu,
  X,
  LogOut,
  Shield,
  Hospital as HospitalIcon,
  UserCheck,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { user, role, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + "/");

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-rose-700 via-rose-600 to-red-500 shadow-[0_0_20px_rgba(225,29,72,0.4)] transition group-hover:scale-105">
            <Droplets className="h-5 w-5 text-white" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tight text-white">
                Life<span className="text-rose-500">Link</span>
              </span>
              <span className="rounded bg-rose-500/10 px-1.5 py-0.2 text-[10px] font-bold tracking-wide text-rose-400 border border-rose-500/20">
                LIVE
              </span>
            </div>
            <p className="text-[10px] text-slate-400 tracking-wide font-medium hidden sm:block">
              Real-Time Blood Availability Network
            </p>
          </div>
        </Link>

        {/* Desktop Primary Navigation */}
        <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-slate-300">
          <Link
            href="/explore/blood-search"
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 transition ${
              isActive("/explore/blood-search")
                ? "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                : "hover:bg-slate-900 hover:text-white"
            }`}
          >
            <Search className="h-4 w-4 text-rose-500" />
            <span>Find Blood</span>
          </Link>

          <Link
            href="/explore/compatibility"
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 transition ${
              isActive("/explore/compatibility")
                ? "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                : "hover:bg-slate-900 hover:text-white"
            }`}
          >
            <Activity className="h-4 w-4 text-cyan-400" />
            <span>Compatibility Matrix</span>
          </Link>

          <Link
            href="/explore/eligibility"
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 transition ${
              isActive("/explore/eligibility")
                ? "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                : "hover:bg-slate-900 hover:text-white"
            }`}
          >
            <Heart className="h-4 w-4 text-pink-400" />
            <span>Can I Donate?</span>
          </Link>

          <Link
            href="/ngo/camps"
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 transition ${
              isActive("/ngo/camps")
                ? "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                : "hover:bg-slate-900 hover:text-white"
            }`}
          >
            <Calendar className="h-4 w-4 text-amber-400" />
            <span>Donation Drives</span>
          </Link>

          {/* Role-Specific Portals Link */}
          {role === "donor" && (
            <Link
              href="/donor/dashboard"
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 font-semibold transition ${
                isActive("/donor")
                  ? "bg-rose-600 text-white"
                  : "bg-rose-950/40 text-rose-300 hover:bg-rose-900/60 border border-rose-800/60"
              }`}
            >
              <UserCheck className="h-4 w-4" />
              <span>Donor Radar</span>
            </Link>
          )}

          {role === "hospital_admin" && (
            <Link
              href="/hospital/dashboard"
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 font-semibold transition ${
                isActive("/hospital")
                  ? "bg-rose-600 text-white"
                  : "bg-blue-950/40 text-blue-300 hover:bg-blue-900/60 border border-blue-800/60"
              }`}
            >
              <HospitalIcon className="h-4 w-4" />
              <span>Hospital Console</span>
            </Link>
          )}

          {role === "ngo_admin" && (
            <Link
              href="/ngo/dashboard"
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 font-semibold transition ${
                isActive("/ngo/dashboard")
                  ? "bg-rose-600 text-white"
                  : "bg-amber-950/40 text-amber-300 hover:bg-amber-900/60 border border-amber-800/60"
              }`}
            >
              <Shield className="h-4 w-4" />
              <span>NGO Hub</span>
            </Link>
          )}
        </nav>

        {/* Right CTA & Account */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Emergency SOS Shortcut */}
          <Link
            href={role === "hospital_admin" ? "/hospital/requests/new" : "/explore/blood-search"}
            className="flex items-center gap-1.5 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-3.5 py-1.5 text-xs font-bold transition animate-pulse"
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>{role === "hospital_admin" ? "Dispatch SOS" : "Emergency SOS"}</span>
          </Link>

          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="text-right">
                <p className="text-xs font-medium text-white line-clamp-1 max-w-[140px]">
                  {user.name || user.email}
                </p>
                <span className="text-[10px] text-rose-400 capitalize font-semibold">
                  {role.replace("_", " ")}
                </span>
              </div>
              <button
                onClick={logout}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-900 hover:text-white transition"
                title="Log out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth/login"
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-900 hover:text-white transition"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="rounded-lg bg-rose-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-[0_0_15px_rgba(225,29,72,0.4)] hover:bg-rose-500 transition"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu trigger button */}
        <div className="flex items-center lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-900 hover:text-white"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-slate-950 px-4 py-4 space-y-2">
          <Link
            href="/explore/blood-search"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-900"
          >
            <Search className="h-4 w-4 text-rose-500" />
            <span>Find Blood Availability</span>
          </Link>
          <Link
            href="/explore/compatibility"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-900"
          >
            <Activity className="h-4 w-4 text-cyan-400" />
            <span>Compatibility Matrix</span>
          </Link>
          <Link
            href="/explore/eligibility"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-900"
          >
            <Heart className="h-4 w-4 text-pink-400" />
            <span>Donor Eligibility Quiz</span>
          </Link>
          <Link
            href="/ngo/camps"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-900"
          >
            <Calendar className="h-4 w-4 text-amber-400" />
            <span>Donation Camps</span>
          </Link>

          <div className="pt-2 border-t border-slate-800">
            {user ? (
              <div className="space-y-2">
                <div className="px-3 text-xs text-slate-400">
                  Signed in as <strong className="text-white">{user.name}</strong> ({role})
                </div>
                {role === "donor" && (
                  <Link
                    href="/donor/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-lg bg-rose-600 px-3 py-2 text-center text-sm font-semibold text-white"
                  >
                    Go to Donor Radar
                  </Link>
                )}
                {role === "hospital_admin" && (
                  <Link
                    href="/hospital/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-lg bg-rose-600 px-3 py-2 text-center text-sm font-semibold text-white"
                  >
                    Go to Hospital Console
                  </Link>
                )}
                {role === "ngo_admin" && (
                  <Link
                    href="/ngo/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-lg bg-rose-600 px-3 py-2 text-center text-sm font-semibold text-white"
                  >
                    Go to NGO Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-slate-900"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  href="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg bg-slate-900 px-3 py-2 text-center text-xs font-semibold text-slate-200"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg bg-rose-600 px-3 py-2 text-center text-xs font-semibold text-white"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
