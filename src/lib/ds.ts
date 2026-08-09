/* Design System — single source of truth for JS-side tokens */

export const C = {
	red: "#dc2626", // High-contrast Crimson Red
	redDark: "#991b1b", // Deep Crimson Dark
	redLight: "#fef2f2", // Soft Crimson Light
	redBorder: "#fecaca", // Red Tint Border
	slate: "#131314", // Gemini Dark Primary
	text: "#1f1f23", // Dark Heading / Body Text
	textSec: "#475569", // Slate Secondary Text
	muted: "#64748b", // Muted Text
	subtle: "#94a3b8", // Subtle Border / Placeholder
	border: "#e2e8f0", // Crisp Border Light
	borderLight: "#f8fafc", // Soft Surface Border
	bg: "#ffffff", // Pure White Canvas
	bgSubtle: "#f8fafc", // Subtly Tinted Background
	footer: "#131314", // Gemini Dark Footer Background
} as const;

export const F = {
	display: "'Outfit', 'Plus Jakarta Sans', system-ui, sans-serif",
	body: "'Inter', system-ui, -apple-system, sans-serif",
	bengali: "'Noto Serif Bengali', serif",
} as const;

/* nav height — used as sticky offset in content */
export const NAV_H = 64;

export const API = "https://the-inquilab.minar-svn.workers.dev";
export const LIMIT = 9;
