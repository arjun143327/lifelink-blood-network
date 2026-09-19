"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle2, AlertCircle, ArrowRight, RotateCcw, Heart } from "lucide-react";

interface Question {
  id: string;
  title: string;
  description: string;
  requiredAnswer: boolean;
  failMessage: string;
}

const QUESTIONS: Question[] = [
  {
    id: "age",
    title: "Are you between 18 and 65 years of age?",
    description: "Standard legal and physiological eligibility window in India.",
    requiredAnswer: true,
    failMessage: "Donors must be between 18 and 65 years of age.",
  },
  {
    id: "weight",
    title: "Is your body weight at least 45 kg (or 50 kg for platelets)?",
    description: "Ensures safety against post-donation dizziness or hypovolemia.",
    requiredAnswer: true,
    failMessage: "A minimum weight of 45 kg is required for standard 350ml whole blood donation.",
  },
  {
    id: "interval",
    title: "Has it been at least 3 months (90 days) since your last blood donation?",
    description: "Allows adequate time for red cell regeneration and ferritin replenishment.",
    requiredAnswer: true,
    failMessage: "Male donors should wait 3 months, and female donors 4 months between whole blood donations.",
  },
  {
    id: "health",
    title: "Are you currently free of fever, cold, cough, or recent antibiotic use in the last 48 hours?",
    description: "Blood should only be collected when you are in optimum baseline health.",
    requiredAnswer: true,
    failMessage: "Please wait 48-72 hours after recovery from minor infections and completing antibiotics.",
  },
  {
    id: "tattoos",
    title: "Have you avoided tattoos, acupuncture, or major piercings in the last 6 months?",
    description: "Window period protocol to rule out transmissible bloodborne pathogens.",
    requiredAnswer: true,
    failMessage: "There is a standard 6-month deferral following body art or major cosmetic piercings.",
  },
];

export function DonorEligibilityQuiz() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const handleAnswer = (val: boolean) => {
    const q = QUESTIONS[currentStep];
    const newAnswers = { ...answers, [q.id]: val };
    setAnswers(newAnswers);

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const resetQuiz = () => {
    setAnswers({});
    setCurrentStep(0);
    setIsCompleted(false);
  };

  // Check results
  const failedQuestions = QUESTIONS.filter((q) => answers[q.id] !== q.requiredAnswer);
  const isEligible = failedQuestions.length === 0;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-500/20 text-pink-400">
            <Heart className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              Donor Quick-Check Screener
            </h3>
            <p className="text-[11px] text-slate-400">
              5-step rapid eligibility self-assessment before donation.
            </p>
          </div>
        </div>

        {isCompleted && (
          <button
            onClick={resetQuiz}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Retake</span>
          </button>
        )}
      </div>

      {!isCompleted ? (
        <div className="mt-6 space-y-6">
          {/* Progress bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-medium text-slate-400">
              <span>Question {currentStep + 1} of {QUESTIONS.length}</span>
              <span>{Math.round(((currentStep) / QUESTIONS.length) * 100)}% Complete</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full bg-gradient-to-r from-rose-600 to-pink-500 transition-all duration-300"
                style={{ width: `${((currentStep + 1) / QUESTIONS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          <div className="rounded-xl bg-slate-950/70 border border-slate-800 p-5 space-y-2">
            <h4 className="text-base font-bold text-white">
              {QUESTIONS[currentStep].title}
            </h4>
            <p className="text-xs text-slate-400">
              {QUESTIONS[currentStep].description}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleAnswer(true)}
              className="rounded-xl bg-slate-800 hover:bg-emerald-600 hover:text-white border border-slate-700 hover:border-emerald-500 p-3.5 text-center font-bold text-sm text-slate-200 transition shadow-lg"
            >
              Yes
            </button>
            <button
              onClick={() => handleAnswer(false)}
              className="rounded-xl bg-slate-800 hover:bg-rose-600 hover:text-white border border-slate-700 hover:border-rose-500 p-3.5 text-center font-bold text-sm text-slate-200 transition shadow-lg"
            >
              No
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-6 space-y-5">
          {isEligible ? (
            <div className="rounded-xl bg-emerald-950/40 border border-emerald-500/40 p-5 text-center space-y-2">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <h4 className="text-lg font-bold text-emerald-300">
                You Are Eligible To Donate!
              </h4>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Based on your answers, you meet baseline health criteria for donating blood today. One unit can save up to three lives.
              </p>
              <div className="pt-2 flex flex-wrap justify-center gap-3">
                <Link
                  href="/auth/signup"
                  className="rounded-lg bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-xs font-bold text-white shadow-md transition"
                >
                  Register As Donor
                </Link>
                <Link
                  href="/ngo/camps"
                  className="rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2 text-xs font-bold text-slate-200 transition"
                >
                  View Nearby Drives
                </Link>
              </div>
            </div>
          ) : (
            <div className="rounded-xl bg-amber-950/30 border border-amber-500/30 p-5 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <AlertCircle className="h-5 w-5" />
                <span>Temporary Deferral Suggested</span>
              </div>
              <p className="text-xs text-slate-300">
                You may need to wait before donating blood due to the following criteria:
              </p>
              <ul className="space-y-1.5 text-xs text-amber-200/90 pl-4 list-disc">
                {failedQuestions.map((q) => (
                  <li key={q.id}>{q.failMessage}</li>
                ))}
              </ul>
              <div className="pt-2">
                <button
                  onClick={resetQuiz}
                  className="rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-200 transition"
                >
                  Review Answers
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
