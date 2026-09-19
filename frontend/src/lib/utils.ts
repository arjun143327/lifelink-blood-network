import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { BloodType, BloodComponent, UrgencyLevel } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Calculate Haversine distance in kilometers between two GPS coordinates
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// Format date into human-readable string
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return dateString;
  }
}

// Format relative time (e.g. "5m ago", "2h ago")
export function formatTimeAgo(dateString: string): string {
  try {
    const now = new Date();
    const date = new Date(dateString);
    const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSec < 60) return "Just now";
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    return `${Math.floor(diffSec / 86400)}d ago`;
  } catch {
    return dateString;
  }
}

// Blood compatibility matrix
export const BLOOD_TYPES: BloodType[] = [
  "O-",
  "O+",
  "A-",
  "A+",
  "B-",
  "B+",
  "AB-",
  "AB+",
];

export const BLOOD_COMPONENTS: { id: BloodComponent; label: string; desc: string; shelfLife: string }[] = [
  { id: "whole_blood", label: "Whole Blood", desc: "For trauma, surgery, and major hemorrhage", shelfLife: "35 days" },
  { id: "plasma", label: "Fresh Frozen Plasma (FFP)", desc: "Contains vital clotting factors for burns and liver disease", shelfLife: "1 year (frozen)" },
  { id: "platelets", label: "Platelets (SDP/RDP)", desc: "Critical for dengue, cancer, and leukemia patients", shelfLife: "5 days" },
];

export const RED_CELL_COMPATIBILITY: Record<BloodType, { canDonateTo: BloodType[]; canReceiveFrom: BloodType[] }> = {
  "O-": {
    canDonateTo: ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
    canReceiveFrom: ["O-"],
  },
  "O+": {
    canDonateTo: ["O+", "A+", "B+", "AB+"],
    canReceiveFrom: ["O-", "O+"],
  },
  "A-": {
    canDonateTo: ["A-", "A+", "AB-", "AB+"],
    canReceiveFrom: ["O-", "A-"],
  },
  "A+": {
    canDonateTo: ["A+", "AB+"],
    canReceiveFrom: ["O-", "O+", "A-", "A+"],
  },
  "B-": {
    canDonateTo: ["B-", "B+", "AB-", "AB+"],
    canReceiveFrom: ["O-", "B-"],
  },
  "B+": {
    canDonateTo: ["B+", "AB+"],
    canReceiveFrom: ["O-", "O+", "B-", "B+"],
  },
  "AB-": {
    canDonateTo: ["AB-", "AB+"],
    canReceiveFrom: ["O-", "A-", "B-", "AB-"],
  },
  "AB+": {
    canDonateTo: ["AB+"],
    canReceiveFrom: ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
  },
};

export function canDonateRedCells(donor: BloodType, recipient: BloodType): boolean {
  return RED_CELL_COMPATIBILITY[donor]?.canDonateTo.includes(recipient) ?? false;
}

export function canReceiveRedCells(recipient: BloodType, donor: BloodType): boolean {
  return RED_CELL_COMPATIBILITY[recipient]?.canReceiveFrom.includes(donor) ?? false;
}

export function getUrgencyStyles(urgency: UrgencyLevel) {
  switch (urgency) {
    case "critical":
      return {
        badge: "bg-red-500/20 text-red-400 border-red-500/40 animate-pulse",
        dot: "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]",
        text: "text-red-400",
        label: "CRITICAL (Immediate)",
      };
    case "high":
      return {
        badge: "bg-amber-500/20 text-amber-400 border-amber-500/40",
        dot: "bg-amber-400",
        text: "text-amber-400",
        label: "HIGH URGENCY (< 2 hrs)",
      };
    case "normal":
      return {
        badge: "bg-blue-500/20 text-blue-400 border-blue-500/40",
        dot: "bg-blue-400",
        text: "text-blue-400",
        label: "NORMAL (< 24 hrs)",
      };
  }
}
