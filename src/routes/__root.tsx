import {
	createRootRoute,
	HeadContent,
	Link,
	Outlet,
	Scripts,
	useRouterState,
} from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1, viewport-fit=cover",
			},
			{ title: "The Inquilab — Bangladesh July Revolution Archive" },
			{
				name: "description",
				content:
					"A living archive of the Bangladesh July–August 2024 Mass Uprising. Documenting martyrs, news, and testimonies of the student-people revolution.",
			},
			{ name: "theme-color", content: "#0f172a" },
			{
				property: "og:title",
				content: "The Inquilab — Bangladesh July Revolution Archive",
			},
			{
				property: "og:description",
				content:
					"A verified digital archive of the 2024 Bangladesh mass uprising. Martyrs, testimonies, and news records.",
			},
			{ property: "og:type", content: "website" },
		],
		links: [
			{ rel: "stylesheet", href: appCss },
			{ rel: "preconnect", href: "https://fonts.googleapis.com" },
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous",
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700;800;900&display=swap",
			},
		],
	}),
	shellComponent: Shell,
	component: RootLayout,
	notFoundComponent: NotFound,
	errorComponent: RouteError,
});

function NotFound() {
	return (
		<div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-5 py-10">
			<h1 className="font-display font-black text-[clamp(3rem,12vw,6rem)] text-red-600 mb-3 leading-none">
				404
			</h1>
			<h2 className="font-display font-bold text-[clamp(1.1rem,3vw,1.5rem)] text-slate-900 mb-3">
				Record Not Found
			</h2>
			<p className="text-slate-600 max-w-[460px] mb-6 text-sm sm:text-base">
				The archive record or route you requested could not be located in our
				system.
			</p>
			<Link
				to="/"
				search={{ filter: "all", page: 1 }}
				className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-800 transition-all shadow-[0_8px_22px_-4px_rgba(220,38,38,0.28)] hover:-translate-y-0.5 active:translate-y-0"
			>
				Return to Main Archive →
			</Link>
		</div>
	);
}

function RouteError({ error }: { error: Error }) {
	return (
		<div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-5 py-10">
			<h1 className="font-display font-extrabold text-[clamp(1.5rem,4vw,2rem)] text-red-600 mb-3">
				Archive System Error
			</h1>
			<p className="text-slate-600 max-w-[480px] mb-6 text-sm sm:text-base">
				{error?.message ||
					"An unexpected error occurred while loading archive data."}
			</p>
			<Link
				to="/"
				search={{ filter: "all", page: 1 }}
				className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-800 transition-all shadow-[0_8px_22px_-4px_rgba(220,38,38,0.28)] hover:-translate-y-0.5 active:translate-y-0"
			>
				Reload Main Archive →
			</Link>
		</div>
	);
}

/* ── Preloader ─────────────────────────────────────────────── */

function Preloader({ onDone }: { onDone: () => void }) {
	const [exiting, setExiting] = useState(false);
	useEffect(() => {
		const t1 = setTimeout(() => setExiting(true), 1200);
		const t2 = setTimeout(() => onDone(), 1700);
		return () => {
			clearTimeout(t1);
			clearTimeout(t2);
		};
	}, [onDone]);
	return (
		<div
			className={`fixed inset-0 z-[9999] bg-slate-900 text-white flex flex-col items-center justify-center gap-3.5 p-5 ${
				exiting ? "animate-preloader-exit" : ""
			}`}
		>
			<div className="font-display font-black text-[clamp(2rem,8vw,3.8rem)] tracking-tight text-white text-center animate-preloader-in">
				THE <span className="text-red-600">INQUILAB</span>
			</div>
			<div className="w-11 h-0.5 bg-red-600" />
			<div className="text-[clamp(9px,2.5vw,12px)] font-semibold tracking-[0.22em] uppercase text-slate-400 text-center">
				Bangladesh July Revolution Archive
			</div>
		</div>
	);
}

/* ── Progress bar ──────────────────────────────────────────── */

function ProgressBar() {
	const isLoading = useRouterState({ select: (s) => s.status === "pending" });
	const [visible, setVisible] = useState(false);
	const [done, setDone] = useState(false);

	useEffect(() => {
		if (isLoading) {
			setDone(false);
			setVisible(true);
		} else if (visible) {
			setDone(true);
			const t = setTimeout(() => {
				setVisible(false);
				setDone(false);
			}, 500);
			return () => clearTimeout(t);
		}
	}, [isLoading, visible]);

	if (!visible) return null;
	return (
		<div
			className={`fixed top-0 left-0 right-0 h-0.5 bg-red-600 z-[10000] transition-[width] duration-300 ease-in-out ${
				done ? "w-full" : "animate-progress-indeterminate"
			}`}
			style={{ width: done ? "100%" : undefined }}
		/>
	);
}

/* ── Scroll detection ──────────────────────────────────────── */

function useScrolled(threshold = 10) {
	const [scrolled, setScrolled] = useState(false);
	const prev = useRef(false);
	useEffect(() => {
		const fn = () => {
			const now = window.scrollY > threshold;
			if (now !== prev.current) {
				prev.current = now;
				setScrolled(now);
			}
		};
		window.addEventListener("scroll", fn, { passive: true });
		return () => window.removeEventListener("scroll", fn);
	}, [threshold]);
	return scrolled;
}

type Filter = "all" | "killed" | "alive";

/* ── Navbar ────────────────────────────────────────────────── */

function SiteNav() {
	const scrolled = useScrolled();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const searchFilter = useRouterState({
		select: (s) => (s.location.search as { filter?: Filter })?.filter ?? "all",
	});
	const isArticle = pathname.startsWith("/news/");

	const [menuOpen, setMenuOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	// Close menu on route change
	// biome-ignore lint/correctness/useExhaustiveDependencies: intentional route-change reset
	useEffect(() => {
		setMenuOpen(false);
	}, [pathname, searchFilter]);

	// Close menu on ESC
	useEffect(() => {
		const handleKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") setMenuOpen(false);
		};
		window.addEventListener("keydown", handleKey);
		return () => window.removeEventListener("keydown", handleKey);
	}, []);

	// Lock body scroll when mobile menu is open
	useEffect(() => {
		if (menuOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [menuOpen]);

	const closeMenu = useCallback(() => setMenuOpen(false), []);

	return (
		<>
			<nav
				className={`sticky top-0 z-[1000] h-14 md:h-16 flex items-center justify-between px-4 md:px-8 lg:px-12 transition-all duration-200 ${
					scrolled
						? "bg-white/99 shadow-[0_2px_16px_rgba(15,23,42,0.09)]"
						: "bg-white/95 backdrop-blur-md"
				}`}
			>
				<Link
					to="/"
					search={{ filter: "all" as Filter, page: 1 }}
					className="font-display font-extrabold text-lg md:text-xl tracking-tight text-slate-900 flex items-center gap-1 shrink-0 no-underline"
					onClick={closeMenu}
				>
					THE <span className="text-red-600">INQUILAB</span>
					<span className="hidden md:inline-block text-[9px] font-bold bg-red-50 text-red-600 border border-red-200 px-1.5 py-0.5 tracking-wider uppercase ml-1.5">
						2024 ARCHIVE
					</span>
				</Link>

				{isArticle ? (
					<Link
						to="/"
						search={{ filter: "all" as Filter, page: 1 }}
						className="text-xs md:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 px-3 py-2 transition-colors inline-flex items-center gap-1.5 min-h-[44px] no-underline"
					>
						← <span className="hidden md:inline">Return to Main Archive</span>
					</Link>
				) : (
					<>
						{/* Desktop nav links */}
						<div className="hidden md:flex items-center gap-1">
							<Link
								to="/"
								search={{ filter: "all" as Filter, page: 1 }}
								resetScroll={false}
								className={`font-body text-sm font-semibold px-3.5 py-2 transition-colors inline-flex items-center min-h-[44px] no-underline ${
									searchFilter === "all"
										? "text-red-600 bg-red-50"
										: "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
								}`}
							>
								All Records
							</Link>
							<Link
								to="/"
								search={{ filter: "killed" as Filter, page: 1 }}
								resetScroll={false}
								className={`font-body text-sm font-semibold px-3.5 py-2 transition-colors inline-flex items-center min-h-[44px] no-underline ${
									searchFilter === "killed"
										? "text-red-600 bg-red-50"
										: "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
								}`}
							>
								Martyrs
							</Link>
						</div>

						{/* Mobile hamburger */}
						<button
							type="button"
							className="md:hidden flex flex-col items-center justify-center gap-1.25 w-11 h-11 bg-transparent border-0 cursor-pointer p-2.5 shrink-0 relative z-[1002]"
							aria-label={
								menuOpen ? "Close navigation menu" : "Open navigation menu"
							}
							aria-expanded={menuOpen}
							onClick={() => setMenuOpen((v) => !v)}
						>
							<span
								className={`block w-5.5 h-0.5 bg-slate-800 transition-all duration-300 ease-out origin-center ${
									menuOpen ? "translate-y-[7px] rotate-45" : ""
								}`}
							/>
							<span
								className={`block w-5.5 h-0.5 bg-slate-800 transition-all duration-200 ease-out ${
									menuOpen ? "opacity-0 scale-x-0" : ""
								}`}
							/>
							<span
								className={`block w-5.5 h-0.5 bg-slate-800 transition-all duration-300 ease-out origin-center ${
									menuOpen ? "-translate-y-[7px] -rotate-45" : ""
								}`}
							/>
						</button>
					</>
				)}
			</nav>

			{/* Mobile overlay backdrop */}
			{/* biome-ignore lint/a11y/useSemanticElements: overlay backdrop */}
			<div
				className={`fixed inset-0 z-[1001] bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300 ${
					menuOpen
						? "opacity-100 pointer-events-auto"
						: "opacity-0 pointer-events-none"
				}`}
				role="button"
				tabIndex={-1}
				aria-hidden="true"
				onClick={closeMenu}
				onKeyDown={(e) => e.key === "Escape" && closeMenu()}
			/>

			{/* Mobile slide-down menu */}
			<nav
				ref={menuRef}
				className={`fixed top-14 left-0 right-0 z-[1001] bg-white border-b-2 border-red-600 shadow-xl transition-all duration-300 py-2 ${
					menuOpen
						? "translate-y-0 opacity-100 pointer-events-auto"
						: "-translate-y-2 opacity-0 pointer-events-none"
				}`}
				aria-label="Mobile navigation"
			>
				<Link
					to="/"
					search={{ filter: "all" as Filter, page: 1 }}
					className={`flex items-center gap-3 px-5 py-3.5 font-body text-base font-semibold border-b border-slate-100 transition-colors min-h-[52px] no-underline ${
						searchFilter === "all"
							? "text-red-600 bg-red-50"
							: "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
					}`}
					onClick={closeMenu}
				>
					<span className="w-2 h-2 rounded-full bg-current opacity-60 shrink-0" />
					All Records
				</Link>
				<Link
					to="/"
					search={{ filter: "killed" as Filter, page: 1 }}
					className={`flex items-center gap-3 px-5 py-3.5 font-body text-base font-semibold transition-colors min-h-[52px] no-underline ${
						searchFilter === "killed"
							? "text-red-600 bg-red-50"
							: "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
					}`}
					onClick={closeMenu}
				>
					<span className="w-2 h-2 rounded-full bg-current opacity-60 shrink-0" />
					Martyr Records
				</Link>
			</nav>
		</>
	);
}

/* ── Footer ────────────────────────────────────────────────── */

function SiteFooter() {
	return (
		<footer className="bg-slate-900 text-slate-400 px-4 md:px-8 lg:px-12 pt-11 pb-9">
			<div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-6 pb-7 border-b border-slate-800">
				<div>
					<div className="font-display font-black text-xl text-white mb-2">
						THE <span className="text-red-600">INQUILAB</span>
					</div>
					<p className="text-sm leading-relaxed text-slate-400 max-w-md m-0">
						A comprehensive historical and digital archive preserving
						testimonies, records, and martyrdom accounts of the Bangladesh
						July–August 2024 Student-People Uprising.
					</p>
				</div>
				<div>
					<div className="text-sm font-bold text-white mb-2.5">
						Archive Sections
					</div>
					<div className="flex flex-col gap-2 text-sm">
						<Link
							to="/"
							search={{ filter: "all", page: 1 }}
							className="text-slate-400 hover:text-white no-underline transition-colors"
						>
							All Records
						</Link>
						<Link
							to="/"
							search={{ filter: "killed", page: 1 }}
							className="text-slate-400 hover:text-white no-underline transition-colors"
						>
							Martyr Records
						</Link>
					</div>
				</div>
			</div>
			<div className="max-w-7xl mx-auto mt-5 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-slate-500">
				<span>July Revolution Digital Preservation · 2024–2026</span>
				<span>Bangladesh Mass Uprising Archive</span>
			</div>
		</footer>
	);
}

/* ── Root layout (inside router context) ───────────────────── */

function RootLayout() {
	return (
		<>
			<SiteNav />
			<Outlet />
			<SiteFooter />
		</>
	);
}

/* ── Shell (outer HTML document) ──────────────────────────── */

function Shell({ children }: { children: React.ReactNode }) {
	const [preloaderDone, setPreloaderDone] = useState(false);
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				{!preloaderDone && <Preloader onDone={() => setPreloaderDone(true)} />}
				<ProgressBar />
				{children}
				<Scripts />
			</body>
		</html>
	);
}
