import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { API, C, F, LIMIT } from "../lib/ds";

export interface NewsItem {
	id: number;
	title: string;
	link: string | null;
	description: string | null;
	archive_link: string | null;
	image: string | null;
	is_killed: number;
	approved: number;
	published: string | null;
}

interface NewsResponse {
	data: NewsItem[];
	total: number;
	page: number;
	limit: number;
}

export type Filter = "all" | "killed" | "alive";

export const Route = createFileRoute("/")({
	validateSearch: (
		search: Record<string, unknown>,
	): { filter: Filter; page: number; q?: string } => ({
		filter: (["all", "killed", "alive"].includes(search.filter as string)
			? (search.filter as Filter)
			: "all") as Filter,
		page: typeof search.page === "number" ? Math.max(1, search.page) : 1,
		q: (search.q as string) || undefined,
	}),
	loaderDeps: ({ search }) => ({
		filter: search.filter,
		page: search.page,
		q: search.q,
	}),
	loader: async ({ deps }) => {
		// Fetch all records for current filter to allow instant client search and dynamic multi-page pagination
		const p = new URLSearchParams({ limit: "1000", page: "1" });
		if (deps.filter === "killed") p.set("is_killed", "true");
		if (deps.filter === "alive") p.set("is_killed", "false");

		const [newsRes, killedRes, totalRes] = await Promise.all([
			fetch(`${API}/api/news?${p}`),
			fetch(`${API}/api/news?is_killed=true&limit=1`),
			fetch(`${API}/api/news?limit=1`),
		]);
		const news: NewsResponse = await newsRes.json();
		const killed: NewsResponse = await killedRes.json();
		const total: NewsResponse = await totalRes.json();

		return { news, killedCount: killed.total, totalCount: total.total };
	},
	errorComponent: IndexError,
	component: HomePage,
});

function IndexError({ error }: { error: Error }) {
	return (
		<div
			style={{
				minHeight: "60vh",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				textAlign: "center",
				padding: "40px 20px",
			}}
		>
			<h2
				style={{
					fontFamily: F.display,
					fontSize: "1.8rem",
					fontWeight: 800,
					color: C.red,
					margin: "0 0 12px 0",
				}}
			>
				Unable to Load Archive Records
			</h2>
			<p style={{ color: C.textSec, maxWidth: 460, margin: "0 0 24px 0" }}>
				{error?.message ||
					"A network error occurred while connecting to the July Revolution database."}
			</p>
			<Link
				to="/"
				search={{ filter: "all", page: 1 }}
				className="btn btn-primary"
			>
				Retry Loading Archive →
			</Link>
		</div>
	);
}

/* ── Date Helper ────────────────────────────────────────────── */

function fmtDate(s: string | null) {
	if (!s) return "";
	return new Intl.DateTimeFormat("en-GB", {
		day: "numeric",
		month: "short",
		year: "numeric",
	}).format(new Date(s));
}

/* ── LazyImage ────────────────────────────────────────────── */

function LazyImage({ src, alt }: { src: string; alt: string }) {
	const [loaded, setLoaded] = useState(false);
	const [err, setErr] = useState(false);
	const imgRef = useRef<HTMLImageElement>(null);

	useEffect(() => {
		if (imgRef.current?.complete) {
			if (imgRef.current.naturalWidth === 0) {
				setErr(true);
			} else {
				setLoaded(true);
			}
		}
	}, []);

	return (
		<div
			style={{
				position: "relative",
				width: "100%",
				height: "100%",
				background: "#131314",
			}}
		>
			{!loaded && !err && (
				<div
					className="news-card-placeholder shimmer"
					style={{ position: "absolute", inset: 0, zIndex: 2 }}
				>
					<span>INQUILAB</span>
				</div>
			)}
			{err && (
				<div
					className="news-card-placeholder"
					style={{ position: "absolute", inset: 0, zIndex: 2 }}
				>
					<span>INQUILAB</span>
				</div>
			)}
			{!err && (
				<img
					ref={imgRef}
					src={src}
					alt={alt}
					referrerPolicy="no-referrer"
					className={`img-fade${loaded ? " loaded" : ""}`}
					style={{
						position: "absolute",
						inset: 0,
						width: "100%",
						height: "100%",
						objectFit: "cover",
						zIndex: 1,
						opacity: loaded ? 1 : 0,
						transition: "opacity 0.3s ease",
					}}
					onLoad={() => setLoaded(true)}
					onError={() => setErr(true)}
				/>
			)}
		</div>
	);
}

/* ── Timeline Data ────────────────────────────────────────── */

interface Milestone {
	id: string;
	date: string;
	title: string;
	desc: string;
}

const MILESTONES: Milestone[] = [
	{
		id: "jul16",
		date: "July 16, 2024",
		title: "First Fatalities in Student Clashes",
		desc: "Widespread non-violent student protests demanding quota reform turned deadly when violent crackdowns began in Chattogram, Dhaka, and Rangpur (Abu Sayed).",
	},
	{
		id: "jul18",
		date: "July 18, 2024",
		title: "Nationwide Complete Shutdown",
		desc: "Government ordered complete internet and telecommunications blackout across Bangladesh while military and paramilitary forces were deployed.",
	},
	{
		id: "jul19",
		date: "July 19, 2024",
		title: "Curfew & Shoot-on-Sight Orders",
		desc: "Strict military curfew declared. High casualty rate reported nationwide as citizens and student coordinators resisted authoritarian suppression.",
	},
	{
		id: "aug02",
		date: "August 2, 2024",
		title: '"March to Dhaka" Call',
		desc: "Anti-Discrimination Student Movement announced full 1-Point Demand for regime resignation, calling for millions to march into central Dhaka.",
	},
	{
		id: "aug05",
		date: "August 5, 2024",
		title: "Fall of Regime & Liberation",
		desc: "Prime Minister Sheikh Hasina resigned and fled the country. Hundreds of thousands of citizens celebrated victory at Gono Bhaban and Parliament.",
	},
	{
		id: "aug08",
		date: "August 8, 2024",
		title: "Interim Government Sworn In",
		desc: "Nobel laureate Dr. Muhammad Yunus took oath as Chief Adviser alongside student leaders to lead Bangladesh’s democratic transition.",
	},
];

function TimelineSection() {
	const [activeIdx, setActiveIdx] = useState(4); // default to Aug 5 Fall of Regime
	const current = MILESTONES[activeIdx];

	return (
		<section className="timeline-section">
			<div className="timeline-header">
				<h3 className="timeline-title">
					<span className="timeline-title-dot" />
					July–August 2024 Uprising Chronology
				</h3>
				<span
					style={{ fontSize: "0.82rem", color: C.textSec, fontWeight: 500 }}
				>
					Click a milestone to inspect event details
				</span>
			</div>

			{/* Horizontal Step Slider */}
			<div className="timeline-nav">
				{MILESTONES.map((m, i) => (
					<button
						key={m.id}
						type="button"
						className={`timeline-step${activeIdx === i ? " active" : ""}`}
						onClick={() => setActiveIdx(i)}
					>
						<span className="timeline-step-date">{m.date.split(",")[0]}</span>
						<span className="timeline-step-title">{m.title}</span>
					</button>
				))}
			</div>

			{/* Selected Milestone Box */}
			<div className="milestone-box">
				<div>
					<div className="milestone-date">{current.date}</div>
					<h4 className="milestone-heading">{current.title}</h4>
					<p className="milestone-desc">{current.desc}</p>
				</div>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "flex-end",
						gap: 6,
					}}
				>
					<span
						style={{
							fontSize: "0.75rem",
							color: C.subtle,
							fontWeight: 700,
							letterSpacing: "0.1em",
						}}
					>
						STEP 0{activeIdx + 1} OF 0{MILESTONES.length}
					</span>
				</div>
			</div>
		</section>
	);
}

/* ── NewsCard ─────────────────────────────────────────────── */

function NewsCard({
	item,
	onQuickView,
}: {
	item: NewsItem;
	onQuickView: (item: NewsItem) => void;
}) {
	const isKilled = item.is_killed === 1;

	return (
		// biome-ignore lint/a11y/useSemanticElements: news card container
		<div
			className={`news-card${isKilled ? " is-killed" : ""}`}
			role="button"
			tabIndex={0}
			onClick={() => onQuickView(item)}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					onQuickView(item);
				}
			}}
			style={{ cursor: "pointer" }}
		>
			<div className="news-card-img-wrap">
				{item.image ? (
					<LazyImage src={item.image} alt={item.title} />
				) : (
					<div className="news-card-placeholder">
						<span>INQUILAB</span>
					</div>
				)}
				{isKilled && <div className="news-card-martyr-badge">MARTYR</div>}
			</div>

			<div className="news-card-body">
				<h3 className="news-card-title">{item.title}</h3>
				{item.description && (
					<p className="news-card-desc">
						{item.description.replace(/\r?\n/g, " ").trim()}
					</p>
				)}

				<div className="news-card-footer">
					<span className="news-card-date">
						{fmtDate(item.published) || "Jul 2024"}
					</span>
					<button
						type="button"
						className="news-card-quickview"
						onClick={(e) => {
							e.stopPropagation();
							onQuickView(item);
						}}
					>
						Quick View →
					</button>
				</div>
			</div>
		</div>
	);
}

/* ── QuickViewModal ────────────────────────────────────────── */

function QuickViewModal({
	item,
	onClose,
}: {
	item: NewsItem;
	onClose: () => void;
}) {
	const isKilled = item.is_killed === 1;

	// Handle ESC key press
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [onClose]);

	return (
		// biome-ignore lint/a11y/useSemanticElements: modal backdrop
		<div
			className="modal-backdrop"
			role="button"
			tabIndex={0}
			onClick={onClose}
			onKeyDown={(e) => {
				if (e.key === "Escape") onClose();
			}}
		>
			<div
				className="modal-drawer"
				role="dialog"
				aria-modal="true"
				onClick={(e) => e.stopPropagation()}
				onKeyDown={(e) => e.stopPropagation()}
			>
				{/* Header */}
				<div className="modal-header">
					<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
						<span className="modal-header-tag">ARCHIVE RECORD</span>
						{isKilled && (
							<span
								className="news-card-martyr-badge"
								style={{ position: "static" }}
							>
								MARTYR
							</span>
						)}
					</div>
					<button
						type="button"
						className="modal-close-btn"
						onClick={onClose}
						title="Close drawer (Esc)"
					>
						×
					</button>
				</div>

				{/* Body */}
				<div className="modal-body">
					{isKilled && (
						<div className="modal-martyr-banner">
							<span className="modal-martyr-tag">MARTYR RECORD</span>
							<span className="modal-martyr-text">
								Documented loss of life during the Bangladesh July–August 2024
								Revolution.
							</span>
						</div>
					)}

					<h2 className="modal-title">{item.title}</h2>

					<div className="modal-meta">
						{item.published && (
							<span>
								Published: <strong>{fmtDate(item.published)}</strong>
							</span>
						)}
						<span>
							Status:{" "}
							<strong style={{ color: isKilled ? C.red : C.textSec }}>
								{isKilled ? "Martyrdom" : "Record"}
							</strong>
						</span>
					</div>

					{item.image && (
						<div className="modal-img-wrap">
							<img
								src={item.image}
								alt={item.title}
								className="modal-img"
								referrerPolicy="no-referrer"
							/>
						</div>
					)}

					{item.description ? (
						<div>
							{item.description.split(/\r?\n\r?\n/).map((para) => (
								<p key={para} className="modal-content-p">
									{para.trim()}
								</p>
							))}
						</div>
					) : (
						<p
							className="modal-content-p"
							style={{ color: C.muted, fontStyle: "italic" }}
						>
							No extra description recorded for this item.
						</p>
					)}
				</div>

				{/* Footer */}
				<div className="modal-footer">
					<div style={{ display: "flex", gap: 8 }}>
						{item.link && (
							<a
								href={item.link}
								target="_blank"
								rel="noopener noreferrer"
								className="btn btn-ghost"
								style={{ fontSize: "0.85rem", padding: "8px 16px" }}
							>
								↗ Original Source
							</a>
						)}
						{item.archive_link && (
							<a
								href={item.archive_link}
								target="_blank"
								rel="noopener noreferrer"
								className="btn btn-ghost"
								style={{ fontSize: "0.85rem", padding: "8px 16px" }}
							>
								⊞ Web Archive
							</a>
						)}
					</div>
					<button
						type="button"
						className="btn btn-primary"
						style={{ fontSize: "0.85rem", padding: "8px 18px" }}
						onClick={onClose}
					>
						Close Drawer
					</button>
				</div>
			</div>
		</div>
	);
}

/* ── HomePage ─────────────────────────────────────────────── */

function getPaginationRange(current: number, total: number) {
	const delta = 1;
	const range: number[] = [];
	const rangeWithDots: (number | "...")[] = [];

	for (let i = 1; i <= total; i++) {
		if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
			range.push(i);
		}
	}

	let l: number | null = null;
	for (const i of range) {
		if (l !== null) {
			if (i - l === 2) {
				rangeWithDots.push(l + 1);
			} else if (i - l !== 1) {
				rangeWithDots.push("...");
			}
		}
		rangeWithDots.push(i);
		l = i;
	}

	return rangeWithDots;
}

function HomePage() {
	const { news } = Route.useLoaderData();
	const { filter, page, q } = Route.useSearch();
	const navigate = Route.useNavigate();
	const [quickItem, setQuickItem] = useState<NewsItem | null>(null);

	const handleSearchChange = (val: string) => {
		navigate({
			search: (prev) => ({
				...prev,
				q: val || undefined,
				page: 1,
			}),
			replace: true,
			resetScroll: false,
		});
	};

	// Filter dataset dynamically based on `q` search query and tab `filter`
	const filteredItems = useMemo(() => {
		if (!q || !q.trim()) return news.data;
		const queryStr = q.toLowerCase().trim();
		return news.data.filter(
			(n) =>
				n.title.toLowerCase().includes(queryStr) ||
				(n.description ?? "").toLowerCase().includes(queryStr),
		);
	}, [news.data, q]);

	// Dynamic filter-aware pagination
	const totalPages = Math.max(1, Math.ceil(filteredItems.length / LIMIT));
	const currentPage = Math.min(Math.max(1, page), totalPages);

	// Sliced items for the current page
	const paginatedItems = useMemo(() => {
		const start = (currentPage - 1) * LIMIT;
		return filteredItems.slice(start, start + LIMIT);
	}, [filteredItems, currentPage]);

	const TABS: { key: Filter; label: string }[] = [
		{ key: "all", label: "All Records" },
		{ key: "killed", label: "Martyrs" },
	];

	const sectionLabel =
		filter === "killed"
			? "Martyrs"
			: filter === "alive"
				? "Survivors & Others"
				: "All Movement Records";

	return (
		<div style={{ minHeight: "100vh", background: C.bg }}>
			{/* ── HERO SECTION ── */}
			<section className="hero">
				<div className="hero-lines" />
				<div className="hero-inner">
					<div className="hero-eyebrow">
						<span className="hero-eyebrow-line" />
						<span className="hero-eyebrow-text">HISTORICAL ARCHIVE • JULY UPRISING 2024</span>
						<span className="hero-eyebrow-line" />
					</div>

					<h1 className="hero-headline">
						Documenting the <span>Uprising</span>,<br />
						Preserving Every Voice.
					</h1>

					<p className="hero-sub">
						A verified digital archive preserving testimonies, martyrdom
						records, and pivotal events of the July–August 2024 mass uprising in
						Bangladesh.
					</p>

					<div className="hero-stat-row">
						<div className="hero-stat-item">
							<span className="hero-stat-num">1,400+</span> Martyrs & Lives Lost
						</div>
						<div className="hero-stat-divider" />
						<div className="hero-stat-item">
							<span className="hero-stat-num">20,000+</span> Injured & Wounded
						</div>
						<div className="hero-stat-divider" />
						<div className="hero-stat-item">
							<span style={{ color: "#94a3b8", fontWeight: 700 }}>
								36 Days Uprising (Jul 1 – Aug 5)
							</span>
						</div>
					</div>

					<div className="hero-cta">
						<a href="#archive" className="btn btn-primary">
							Explore Main Archive ↓
						</a>
					</div>
				</div>
			</section>

			{/* ── CHRONOLOGY TIMELINE ── */}
			<TimelineSection />

			{/* ── ARCHIVE SECTION ── */}
			<section id="archive" className="archive-section">
				{/* Header & Search Bar */}
				<div className="archive-header">
					<h2 className="section-title">
						List of <span>{sectionLabel}</span>
					</h2>

					<div className="search-wrap">
						<span className="search-icon">⌕</span>
						<input
							className="search-input"
							type="text"
							placeholder="Search records by title, location or detail…"
							value={q || ""}
							onChange={(e) => handleSearchChange(e.target.value)}
						/>
						{q && (
							<button
								type="button"
								className="search-clear"
								onClick={() => handleSearchChange("")}
								title="Clear search"
							>
								×
							</button>
						)}
					</div>
				</div>

				{/* Filter Tabs & Results Count */}
				<div className="filter-tabs-row">
					<div className="filter-tabs">
						{TABS.map((tab) => (
							<Link
								key={tab.key}
								to="/"
								search={{ filter: tab.key, page: 1, q: q || undefined }}
								resetScroll={false}
								className={`filter-tab${filter === tab.key ? " active" : ""}`}
							>
								{tab.label}
							</Link>
						))}
					</div>

					<span className="filter-count">
						{q
							? `Found ${filteredItems.length} matching items (Page ${currentPage} of ${totalPages})`
							: `Showing page ${currentPage} of ${totalPages} (${news.total} total records)`}
					</span>
				</div>

				{/* Card Grid */}
				{paginatedItems.length === 0 ? (
					<div
						style={{ textAlign: "center", padding: "80px 0", color: C.muted }}
					>
						<p style={{ fontSize: "1.1rem", fontWeight: 600, margin: 0 }}>
							No records match your search criteria.
						</p>
						<p style={{ fontSize: "0.9rem", color: C.subtle, marginTop: 6 }}>
							Try clearing your search query or switching filter tabs.
						</p>
					</div>
				) : (
					<div className="card-grid">
						{paginatedItems.map((item) => (
							<NewsCard
								key={item.id}
								item={item}
								onQuickView={(item) => setQuickItem(item)}
							/>
						))}
					</div>
				)}

				{/* Pagination Controls */}
				{totalPages > 1 && (
					<div className="pagination">
						{currentPage > 1 && (
							<Link
								to="/"
								search={{ filter, page: currentPage - 1, q: q || undefined }}
								resetScroll={false}
								className="page-btn"
							>
								← Prev
							</Link>
						)}
						{getPaginationRange(currentPage, totalPages).map((p, idx) =>
							p === "..." ? (
								<span key={`ellipsis-${idx}`} className="page-ellipsis">
									…
								</span>
							) : (
								<Link
									key={p}
									to="/"
									search={{ filter, page: p, q: q || undefined }}
									resetScroll={false}
									className={`page-btn${p === currentPage ? " active" : ""}`}
								>
									{p}
								</Link>
							),
						)}
						{currentPage < totalPages && (
							<Link
								to="/"
								search={{ filter, page: currentPage + 1, q: q || undefined }}
								resetScroll={false}
								className="page-btn"
							>
								Next →
							</Link>
						)}
					</div>
				)}
			</section>

			{/* ── QUICK VIEW DRAWER MODAL ── */}
			{quickItem && (
				<QuickViewModal item={quickItem} onClose={() => setQuickItem(null)} />
			)}
		</div>
	);
}
