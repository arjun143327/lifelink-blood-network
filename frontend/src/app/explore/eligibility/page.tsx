import React from "react";
import { DonorEligibilityQuiz } from "@/components/tools/DonorEligibilityQuiz";
import { Heart, CheckCircle2, HelpCircle } from "lucide-react";

export default function EligibilityPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-pink-400 uppercase tracking-wider">
          <Heart className="h-4 w-4" />
          <span>Donor Readiness Protocol</span>
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight mt-1">
          Can I Donate Blood Today?
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Review Indian National Blood Transfusion Council (NBTC) donor screening guidelines.
        </p>
      </div>

      <DonorEligibilityQuiz />

      {/* FAQs */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-rose-400" />
          Frequently Asked Questions
        </h3>

        <div className="space-y-3 text-xs text-slate-300">
          <div className="rounded-xl bg-slate-950/60 p-3.5 border border-slate-800/80 space-y-1">
            <h5 className="font-bold text-white">How much blood is taken during a donation?</h5>
            <p className="text-slate-400">
              Standard collection is 350ml or 450ml depending on body weight. This is only about 8-10% of your total blood volume and your body restores fluid volume within 24-48 hours.
            </p>
          </div>

          <div className="rounded-xl bg-slate-950/60 p-3.5 border border-slate-800/80 space-y-1">
            <h5 className="font-bold text-white">Can I donate if I have high blood pressure or diabetes?</h5>
            <p className="text-slate-400">
              Yes, provided your blood pressure is well controlled under 140/90 mmHg at the time of donation, and diabetes is maintained via oral medication without insulin injections.
            </p>
          </div>

          <div className="rounded-xl bg-slate-950/60 p-3.5 border border-slate-800/80 space-y-1">
            <h5 className="font-bold text-white">What should I eat or drink before donating?</h5>
            <p className="text-slate-400">
              Drink plenty of water or juice beforehand, and eat a healthy light meal 2-3 hours prior. Avoid fatty foods and alcohol for 24 hours before donating.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
