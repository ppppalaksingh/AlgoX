// ============================================================================
// COLOR MAP - Glassmorphic & Glowing AI/SaaS Tokens
// ----------------------------------------------------------------------------
// Curated for high-contrast dark surfaces with frosted glass borders & glows.
// ============================================================================

export const colorMap = {
  blue: {
    bg: "bg-blue-500/10 border border-blue-500/20",
    text: "text-blue-400",
    bar: "bg-gradient-to-r from-blue-500 to-indigo-500 shadow-[0_0_12px_rgba(59,130,246,0.4)]",
    badgeBg: "bg-blue-500/15 border border-blue-500/30",
    badgeText: "text-blue-300",
  },
  green: {
    bg: "bg-emerald-500/10 border border-emerald-500/20",
    text: "text-emerald-400",
    bar: "bg-gradient-to-r from-emerald-500 to-teal-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]",
    badgeBg: "bg-emerald-500/15 border border-emerald-500/30",
    badgeText: "text-emerald-300",
  },
  orange: {
    bg: "bg-amber-500/10 border border-amber-500/20",
    text: "text-amber-400",
    bar: "bg-gradient-to-r from-amber-500 to-orange-500 shadow-[0_0_12px_rgba(245,158,11,0.4)]",
    badgeBg: "bg-amber-500/15 border border-amber-500/30",
    badgeText: "text-amber-300",
  },
  purple: {
    bg: "bg-purple-500/10 border border-purple-500/20",
    text: "text-purple-400",
    bar: "bg-gradient-to-r from-purple-500 to-indigo-500 shadow-[0_0_12px_rgba(168,85,247,0.4)]",
    badgeBg: "bg-purple-500/15 border border-purple-500/30",
    badgeText: "text-purple-300",
  },
};

export const getColor = (color) => colorMap[color] || colorMap.blue;

