import {
	createRootRoute,
	HeadContent,
	Link,
	Outlet,
	Scripts,
	useRouterState,
} from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			{ title: "The Inquilab — Bangladesh July Revolution Archive" },
			{
				name: "description",
				content:
					"A living archive of the Bangladesh July–August 2024 Mass Uprising. Documenting martyrs, news, and testimonies of the student-people revolution.",
			},
			{ name: "theme-color", content: "#0f172a" },
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
		<div
			style={{
				minHeight: "70vh",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				textAlign: "center",
				padding: "40px 20px",
			}}
		>
			<h1
				style={{
					fontFamily: "Outfit, sans-serif",
					fontSize: "3.5rem",
					fontWeight: 900,
					color: "#dc2626",
					margin: "0 0 12px 0",
				}}
			>
				404
			</h1>
			<h2
				style={{
					fontFamily: "Outfit, sans-serif",
					fontSize: "1.5rem",
					fontWeight: 700,
					color: "#1f1f23",
					margin: "0 0 12px 0",
				}}
			>
				Record Not Found
			</h2>
			<p style={{ color: "#475569", maxWidth: 460, margin: "0 0 24px 0" }}>
				The archive record or route you requested could not be located in our
				system.
			</p>
			<Link
				to="/"
				search={{ filter: "all", page: 1 }}
				className="btn btn-primary"
			>
				Return to Main Archive →
			</Link>
		</div>
	);
}

function RouteError({ error }: { error: Error }) {
	return (
		<div
			style={{
				minHeight: "70vh",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				textAlign: "center",
				padding: "40px 20px",
			}}
		>
			<h1
				style={{
					fontFamily: "Outfit, sans-serif",
					fontSize: "2rem",
					fontWeight: 800,
					color: "#dc2626",
					margin: "0 0 12px 0",
				}}
			>
				Archive System Error
			</h1>
			<p style={{ color: "#475569", maxWidth: 480, margin: "0 0 24px 0" }}>
				{error?.message ||
					"An unexpected error occurred while loading archive data."}
			</p>
			<Link
				to="/"
				search={{ filter: "all", page: 1 }}
				className="btn btn-primary"
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
		<div className={`preloader${exiting ? " exiting" : ""}`}>
			<div className="preloader-logo">
				THE <span>INQUILAB</span>
			</div>
			<div className="preloader-line" />
			<div className="preloader-sub">Bangladesh July Revolution Archive</div>
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
			className={`progress-bar${done ? " done" : " indeterminate"}`}
			style={{ width: done ? "100%" : undefined }}
		/>
	);
}

/* ── Navbar ────────────────────────────────────────────────── */

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

function SiteNav() {
	const scrolled = useScrolled();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const searchFilter = useRouterState({
		select: (s) => (s.location.search as { filter?: Filter })?.filter ?? "all",
	});
	const isArticle = pathname.startsWith("/news/");

	return (
		<nav className={`navbar${scrolled ? " scrolled" : ""}`}>
			<Link
				to="/"
				search={{ filter: "all" as Filter, page: 1 }}
				className="navbar-logo"
			>
				THE <span>INQUILAB</span>
				<span className="navbar-badge">2024 ARCHIVE</span>
			</Link>

			{isArticle ? (
				<Link
					to="/"
					search={{ filter: "all" as Filter, page: 1 }}
					className="nav-back"
				>
					← Return to Main Archive
				</Link>
			) : (
				<div className="nav-links">
					<Link
						to="/"
						search={{ filter: "all" as Filter, page: 1 }}
						resetScroll={false}
						className={`nav-link${searchFilter === "all" ? " active" : ""}`}
					>
						All Records
					</Link>
					<Link
						to="/"
						search={{ filter: "killed" as Filter, page: 1 }}
						resetScroll={false}
						className={`nav-link${searchFilter === "killed" ? " active" : ""}`}
					>
						Martyrs
					</Link>
				</div>
			)}
		</nav>
	);
}

/* ── Footer ────────────────────────────────────────────────── */

function SiteFooter() {
	return (
		<footer className="site-footer">
			<div className="footer-inner">
				<div>
					<div className="footer-logo">
						THE <span>INQUILAB</span>
					</div>
					<p className="footer-desc">
						A comprehensive historical and digital archive preserving
						testimonies, records, and martyrdom accounts of the Bangladesh
						July–August 2024 Student-People Uprising.
					</p>
				</div>
				<div>
					<div
						style={{
							fontSize: "0.88rem",
							fontWeight: 700,
							color: "#ffffff",
							marginBottom: 12,
						}}
					>
						Archive Sections
					</div>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							gap: 8,
							fontSize: "0.85rem",
						}}
					>
						<Link
							to="/"
							search={{ filter: "all", page: 1 }}
							style={{ color: "inherit", textDecoration: "none" }}
						>
							All Records
						</Link>
						<Link
							to="/"
							search={{ filter: "killed", page: 1 }}
							style={{ color: "inherit", textDecoration: "none" }}
						>
							Martyr Records
						</Link>
					</div>
				</div>
			</div>
			<div className="footer-bottom">
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
