import React from "react";
import { BloodCompatibilityMatrix } from "@/components/tools/BloodCompatibilityMatrix";
import { Activity, ShieldCheck, HeartPulse, Info } from "lucide-react";

export default function CompatibilityPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
          <Activity className="h-4 w-4" />
          <span>Clinical Transfusion Science</span>
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight mt-1">
          Blood Group &amp; Component Compatibility
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Antigen-antibody matching rules governing red blood cell transfusions, platelets, and plasma.
        </p>
      </div>

      <BloodCompatibilityMatrix />

      {/* Deep-dive Clinical Educational Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-2">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
            <HeartPulse className="h-4 w-4" />
            <span>Universal Red Cell Donor: O-</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Type O Negative red blood cells carry neither A nor B antigens, and are RhD negative. In emergency trauma when a patient&apos;s blood type is unknown, O- is the safest whole blood component.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
            <ShieldCheck className="h-4 w-4" />
            <span>Universal Recipient: AB+</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Individuals with AB Positive blood have both A and B antigens on their red cells and lack anti-A and anti-B antibodies in their plasma, meaning they can safely receive red cells of any blood type.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <Info className="h-4 w-4" />
            <span>Plasma Inversion Principle</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Unlike red blood cells, plasma compatibility works in exact reverse! Type AB plasma is universal because it has no anti-A or anti-B antibodies, making it crucial for burn therapy.
          </p>
        </div>
      </div>
    </div>
  );
}
