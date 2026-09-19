import React from "react";
import Link from "next/link";
import { Droplets, Heart, Shield, PhoneCall } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Mission */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-600 text-white">
                <Droplets className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Life<span className="text-rose-500">Link</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Real-time blood availability & donor coordination network. Solving India&apos;s 1M+ unit
              visibility gap through intelligent spatial PostGIS matching and rapid SOS alerts.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-medium pt-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
              All systems operational &bull; 24/7 Live Ticker
            </div>
          </div>

          {/* Col 2: For Donors */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              For Donors
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link href="/explore/blood-search" className="hover:text-rose-400 transition">
                  Find Urgent Needs
                </Link>
              </li>
              <li>
                <Link href="/explore/compatibility" className="hover:text-rose-400 transition">
                  Blood Group Compatibility
                </Link>
              </li>
              <li>
                <Link href="/explore/eligibility" className="hover:text-rose-400 transition">
                  Eligibility Self-Check
                </Link>
              </li>
              <li>
                <Link href="/ngo/camps" className="hover:text-rose-400 transition">
                  Upcoming Donation Camps
                </Link>
              </li>
              <li>
                <Link href="/donor/dashboard" className="hover:text-rose-400 transition">
                  Donor Radar Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: For Hospitals & Healthcare */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Hospitals &amp; NGOs
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link href="/hospital/dashboard" className="hover:text-rose-400 transition">
                  Hospital Blood Bank Console
                </Link>
              </li>
              <li>
                <Link href="/hospital/inventory" className="hover:text-rose-400 transition">
                  Live Stock Matrix (8x3)
                </Link>
              </li>
              <li>
                <Link href="/hospital/requests/new" className="hover:text-rose-400 transition">
                  Dispatch Emergency SOS
                </Link>
              </li>
              <li>
                <Link href="/hospital/search" className="hover:text-rose-400 transition">
                  Inter-Hospital Stock Finder
                </Link>
              </li>
              <li>
                <Link href="/ngo/dashboard" className="hover:text-rose-400 transition">
                  NGO Drive Organizer
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Academic & Emergency Info */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Emergency &amp; Academic
            </h4>
            <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-3 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-rose-400">
                <PhoneCall className="h-3.5 w-3.5" />
                <span>National Helpline: 104 / 1910</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Central blood transfusion council emergency assistance &amp; ambulance hotline.
              </p>
            </div>
            <div className="rounded-xl bg-rose-950/20 border border-rose-900/30 p-2.5 text-[11px] text-slate-400">
              <span className="font-semibold text-rose-300">FSD Semester Project</span>: Next.js App Router + FastAPI + Supabase PostGIS spatial queries.
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-900 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-3">
          <p>&copy; {new Date().getFullYear()} LifeLink Blood Network. Built for public healthcare impact.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400">
              <Heart className="h-3 w-3 text-rose-500 fill-rose-500" /> Powered by Donors Nationwide
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <Shield className="h-3 w-3 text-emerald-400" /> PostGIS Spatial Matching
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
