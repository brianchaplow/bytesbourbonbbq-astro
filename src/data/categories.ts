export interface Category {
  slug: string;
  label: string;
  description: string;
  color: string;       // Tailwind color name
  tabColor: string;    // Hex color for inline tab border-top
  borderColor: string; // Full Tailwind border-left class
  bgColor: string;     // Badge background
  textColor: string;   // Badge text
}

export const categories: Category[] = [
  {
    slug: "all",
    label: "All Operations",
    description: "Complete procedure index",
    color: "orange",
    tabColor: "#f97316",
    borderColor: "border-l-orange-500",
    bgColor: "bg-orange-500/20",
    textColor: "text-orange-300",
  },
  {
    slug: "low-slow",
    label: "Low & Slow",
    description: "APT-class operations requiring extended monitoring",
    color: "red",
    tabColor: "#ef4444",
    borderColor: "border-l-red-500",
    bgColor: "bg-red-500/20",
    textColor: "text-red-300",
  },
  {
    slug: "hot-fast",
    label: "Hot & Fast",
    description: "Rapid response protocols with high-heat execution",
    color: "amber",
    tabColor: "#f59e0b",
    borderColor: "border-l-amber-500",
    bgColor: "bg-amber-500/20",
    textColor: "text-amber-300",
  },
  {
    slug: "cold-ops",
    label: "Cold Ops",
    description: "Reconnaissance, curing, and intelligence gathering",
    color: "cyan",
    tabColor: "#06b6d4",
    borderColor: "border-l-cyan-500",
    bgColor: "bg-cyan-500/20",
    textColor: "text-cyan-300",
  },
  {
    slug: "auxiliary",
    label: "Auxiliary",
    description: "Support operations and force multipliers",
    color: "emerald",
    tabColor: "#10b981",
    borderColor: "border-l-emerald-500",
    bgColor: "bg-emerald-500/20",
    textColor: "text-emerald-300",
  },
  {
    slug: "tooling",
    label: "Tooling",
    description: "Detection signatures, scripts, and baseline configurations",
    color: "purple",
    tabColor: "#a855f7",
    borderColor: "border-l-purple-500",
    bgColor: "bg-purple-500/20",
    textColor: "text-purple-300",
  },
];

export function getCategoryBySlug(slug: string): Category {
  return categories.find(c => c.slug === slug) || categories[0];
}
