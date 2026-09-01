// ============================================================================
// COLOR MAP
// ----------------------------------------------------------------------------
// Centralizing Tailwind class names here means: to re-theme a color used
// across many components (icon bubble, progress bar, badge...), change it
// ONCE, here — instead of hunting through every component file.
// ============================================================================

export const colorMap = {
  blue: {
    bg: "bg-blue-100",
    text: "text-blue-600",
    bar: "bg-blue-600",
    badgeBg: "bg-blue-50",
    badgeText: "text-blue-700",
  },
  green: {
    bg: "bg-green-100",
    text: "text-green-600",
    bar: "bg-green-600",
    badgeBg: "bg-green-50",
    badgeText: "text-green-700",
  },
  orange: {
    bg: "bg-orange-100",
    text: "text-orange-600",
    bar: "bg-orange-500",
    badgeBg: "bg-orange-50",
    badgeText: "text-orange-700",
  },
  purple: {
    bg: "bg-purple-100",
    text: "text-purple-600",
    bar: "bg-purple-600",
    badgeBg: "bg-purple-50",
    badgeText: "text-purple-700",
  },
};

export const getColor = (color) => colorMap[color] || colorMap.blue;
