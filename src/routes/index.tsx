import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { API, LIMIT } from "../lib/ds";

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
		<div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-5 py-10">
			<h2 className="font-display text-[1.8rem] font-extrabold text-red-600 mb-3">
				Unable to Load Archive Records
			</h2>
			<p className="text-slate-600 max-w-[460px] mb-6 text-sm sm:text-base">
				{error?.message ||
					"A network error occurred while connecting to the July Revolution database."}
			</p>
			<Link
				to="/"
				search={{ filter: "all", page: 1 }}
				className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-red-600 hover:bg-red-800 transition-all shadow-[0_8px_22px_-4px_rgba(220,38,38,0.28)] hover:-translate-y-0.5 no-underline"
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
		<div className="relative w-full h-full bg-slate-900">
			{!loaded && !err && (
				<div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-900 text-white/20 font-display font-black text-2xl tracking-widest uppercase animate-shimmer">
					<span>INQUILAB</span>
				</div>
			)}
			{err && (
				<div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-900 text-white/20 font-display font-black text-2xl tracking-widest uppercase">
					<span>INQUILAB</span>
				</div>
			)}
			{!err && (
				<img
					ref={imgRef}
					src={src}
					alt={alt}
					referrerPolicy="no-referrer"
					className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-300 ${
						loaded ? "opacity-100" : "opacity-0"
					}`}
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
		<section className="max-w-7xl mx-auto px-4 md:px-8 pt-7 md:pt-10 pb-4">
			<div className="flex items-start justify-between mb-4 flex-wrap gap-2">
				<h3 className="font-display text-lg font-bold text-slate-900 flex items-center gap-2 m-0">
					<span className="w-2 h-2 rounded-full bg-red-600 shrink-0" />
					July–August 2024 Uprising Chronology
				</h3>
				<span className="text-xs text-slate-500 font-medium">
					Click a milestone to inspect event details
				</span>
			</div>

			{/* Horizontal Step Slider */}
			<div className="flex gap-2 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-3.5 pt-1 px-0.5">
				{MILESTONES.map((m, i) => (
					<button
						key={m.id}
						type="button"
						className={`shrink-0 snap-start bg-slate-50 hover:bg-red-50 hover:text-red-700 p-3.5 cursor-pointer transition-all text-left min-h-[60px] min-w-[130px] max-w-[175px] border-0 outline-none ${
							activeIdx === i
								? "bg-red-600 text-white shadow-[0_8px_22px_-4px_rgba(220,38,38,0.28)] -translate-y-0.5"
								: "text-slate-700"
						}`}
						onClick={() => setActiveIdx(i)}
					>
						<span
							className={`font-display text-sm font-extrabold block tracking-tight ${
								activeIdx === i ? "text-white" : "text-slate-900"
							}`}
						>
							{m.date.split(",")[0]}
						</span>
						<span
							className={`text-[0.72rem] font-semibold block mt-1 truncate max-w-[150px] ${
								activeIdx === i ? "text-white/90" : "text-slate-600"
							}`}
						>
							{m.title}
						</span>
					</button>
				))}
			</div>

			{/* Selected Milestone Box */}
			<div className="bg-slate-900 text-white p-5 md:p-6 mt-2.5 flex flex-col md:flex-row md:items-start justify-between gap-3 shadow-xl relative overflow-hidden border-l-4 border-red-600">
				<div>
					<div className="font-body text-xs font-bold tracking-widest uppercase text-red-500 mb-1">
						{current.date}
					</div>
					<h4 className="font-display text-lg md:text-xl font-bold text-white mb-1.5 leading-snug">
						{current.title}
					</h4>
					<p className="text-sm leading-relaxed text-slate-300 m-0">
						{current.desc}
					</p>
				</div>
				<div className="flex flex-col items-end gap-1.5">
					<span className="text-[0.75rem] text-slate-400 font-bold tracking-widest shrink-0">
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
			className={`bg-white overflow-hidden flex flex-col no-underline text-inherit transition-all duration-200 cursor-pointer shadow-xs hover:shadow-lg hover:-translate-y-1 ${
				isKilled
					? "shadow-[0_2px_8px_rgba(220,38,38,0.1)] hover:shadow-[0_10px_26px_-4px_rgba(220,38,38,0.22)]"
					: ""
			}`}
			role="button"
			tabIndex={0}
			onClick={() => onQuickView(item)}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					onQuickView(item);
				}
			}}
		>
			<div className="relative w-full h-[180px] sm:h-[200px] lg:h-[210px] bg-slate-900 overflow-hidden">
				{item.image ? (
					<LazyImage src={item.image} alt={item.title} />
				) : (
					<div className="w-full h-full flex items-center justify-center bg-slate-900 text-white/20 font-display font-black text-2xl tracking-widest uppercase">
						<span>INQUILAB</span>
					</div>
				)}
				{isKilled && (
					<div className="absolute top-2.5 right-2.5 bg-red-600 text-white font-body font-bold text-[0.68rem] tracking-wider uppercase px-2 py-1 shadow-md z-10">
						MARTYR
					</div>
				)}
			</div>

			<div className="p-4 flex-1 flex flex-col">
				<h3 className="font-display text-base sm:text-[1.05rem] lg:text-lg font-bold leading-snug text-slate-900 mb-2 line-clamp-2">
					{item.title}
				</h3>
				{item.description && (
					<p className="text-xs sm:text-sm leading-relaxed text-slate-600 mb-3.5 flex-1 line-clamp-2 sm:line-clamp-3">
						{item.description.replace(/\r?\n/g, " ").trim()}
					</p>
				)}

				<div className="flex items-center justify-between pt-2.5 mt-auto gap-2">
					<span className="text-xs font-medium text-slate-500 whitespace-nowrap">
						{fmtDate(item.published) || "Jul 2024"}
					</span>
					<button
						type="button"
						className="text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-600 hover:text-white px-3 py-1.5 min-h-[32px] transition-colors cursor-pointer whitespace-nowrap shrink-0 border-0"
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
			className="fixed inset-0 z-[9000] bg-slate-950/72 backdrop-blur-xs flex items-end md:items-stretch md:justify-end"
			role="button"
			tabIndex={0}
			onClick={onClose}
			onKeyDown={(e) => {
				if (e.key === "Escape") onClose();
			}}
		>
			<div
				className="w-full max-h-[92vh] h-[92vh] md:w-[min(600px,90vw)] md:max-h-none md:h-full bg-slate-900 text-slate-200 shadow-2xl flex flex-col relative z-[9001] md:border-l md:border-slate-800"
				role="dialog"
				aria-modal="true"
				onClick={(e) => e.stopPropagation()}
				onKeyDown={(e) => e.stopPropagation()}
			>
				{/* Drag handle for mobile */}
				<div className="md:hidden flex justify-center items-center py-2 bg-slate-900 shrink-0 cursor-grab">
					<div className="w-9 h-1 bg-slate-700 rounded-full" />
				</div>

				{/* Header */}
				<div className="p-3.5 md:p-4.5 px-4 md:px-6 flex items-center justify-between bg-slate-800 shrink-0">
					<div className="flex items-center gap-2">
						<span className="font-body text-[0.7rem] font-bold tracking-widest uppercase text-slate-400">
							ARCHIVE RECORD
						</span>
						{isKilled && (
							<span className="bg-red-600 text-white font-body font-bold text-[0.68rem] tracking-wider uppercase px-2 py-0.5">
								MARTYR
							</span>
						)}
					</div>
					<button
						type="button"
						className="bg-slate-700 hover:bg-red-600 text-slate-200 hover:text-white text-lg w-9 h-9 flex items-center justify-center cursor-pointer transition-colors rounded-full border-0 shrink-0"
						onClick={onClose}
						title="Close drawer (Esc)"
					>
						×
					</button>
				</div>

				{/* Body */}
				<div className="p-4 md:p-7 overflow-y-auto flex-1">
					{isKilled && (
						<div className="bg-red-500/14 p-3.5 mb-5 flex items-start gap-2.5 flex-wrap">
							<span className="bg-red-600 text-white font-extrabold text-[0.67rem] px-2 py-0.5 tracking-wider uppercase shrink-0 mt-0.5">
								MARTYR RECORD
							</span>
							<span className="text-xs sm:text-sm font-medium text-red-300 leading-normal">
								Documented loss of life during the Bangladesh July–August 2024
								Revolution.
							</span>
						</div>
					)}

					<h2 className="font-display text-xl md:text-2xl font-extrabold leading-snug text-white mb-3.5">
						{item.title}
					</h2>

					<div className="flex items-center gap-3 flex-wrap text-xs text-slate-400 mb-5">
						{item.published && (
							<span>
								Published:{" "}
								<strong className="text-slate-200">
									{fmtDate(item.published)}
								</strong>
							</span>
						)}
						<span>
							Status:{" "}
							<strong className={isKilled ? "text-red-400" : "text-slate-300"}>
								{isKilled ? "Martyrdom" : "Record"}
							</strong>
						</span>
					</div>

					{item.image && (
						<div className="w-full overflow-hidden mb-5 bg-slate-800 max-h-[280px]">
							<img
								src={item.image}
								alt={item.title}
								className="w-full h-full object-cover block"
								referrerPolicy="no-referrer"
							/>
						</div>
					)}

					{item.description ? (
						<div>
							{item.description.split(/\r?\n\r?\n/).map((para) => (
								<p
									key={para}
									className="text-sm sm:text-base leading-relaxed text-slate-200 mb-4"
								>
									{para.trim()}
								</p>
							))}
						</div>
					) : (
						<p className="text-sm italic text-slate-400 mb-4">
							No extra description recorded for this item.
						</p>
					)}
				</div>

				{/* Footer */}
				<div className="p-3.5 md:p-4.5 px-4 md:px-6 bg-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-2 shrink-0">
					<div className="flex gap-2">
						{item.link && (
							<a
								href={item.link}
								target="_blank"
								rel="noopener noreferrer"
								className="text-xs font-semibold px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 hover:text-white transition-colors no-underline"
							>
								↗ Original Source
							</a>
						)}
						{item.archive_link && (
							<a
								href={item.archive_link}
								target="_blank"
								rel="noopener noreferrer"
								className="text-xs font-semibold px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 hover:text-white transition-colors no-underline"
							>
								⊞ Web Archive
							</a>
						)}
					</div>
					<button
						type="button"
						className="text-xs font-semibold px-4.5 py-2 bg-red-600 hover:bg-red-800 text-white transition-colors border-0 cursor-pointer"
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
		if (
			i === 1 ||
			i === total ||
			(i >= current - delta && i <= current + delta)
		) {
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
		<div className="min-h-screen bg-white">
			{/* ── HERO SECTION ── */}
			<section className="relative bg-[#0d0e12] bg-[url('/hero-bg.jpg')] bg-[position:center_30%] bg-cover bg-no-repeat px-5 py-16 md:py-24 lg:py-28 text-center text-white min-h-[min(100vh,680px)] flex items-center justify-center overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-b before:from-black/25 before:to-black/72 before:pointer-events-none before:z-0">
				<div className="absolute inset-0 pointer-events-none opacity-10 z-0 bg-[radial-gradient(rgba(255,255,255,0.45)_1px,transparent_1px)] [background-size:24px_24px]" />
				<div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center">
					<div className="inline-flex items-center gap-2 mb-5 bg-red-600/18 px-3.5 py-1.5 backdrop-blur-xs flex-wrap justify-center">
						<span className="w-3.5 h-0.5 bg-red-500 shrink-0" />
						<span className="font-body text-[clamp(0.62rem,2.2vw,0.78rem)] font-extrabold tracking-widest uppercase text-red-400 text-center">
							HISTORICAL ARCHIVE • JULY UPRISING 2024
						</span>
						<span className="w-3.5 h-0.5 bg-red-500 shrink-0" />
					</div>

					<h1 className="font-display font-black text-[clamp(2rem,7.5vw,4.5rem)] leading-none tracking-tight text-white mb-4.5 drop-shadow-md">
						Documenting the{" "}
						<span className="text-red-500 bg-gradient-to-br from-red-400 to-red-600 bg-clip-text text-transparent">
							Uprising
						</span>
						,<br />
						Preserving Every Voice.
					</h1>

					<p className="font-body text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed text-slate-300 max-w-2xl mb-7 drop-shadow-xs">
						A verified digital archive preserving testimonies, martyrdom
						records, and pivotal events of the July–August 2024 mass uprising in
						Bangladesh.
					</p>

					<div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2 sm:gap-4 bg-slate-900/82 backdrop-blur-md shadow-2xl p-3 sm:px-6 mb-7 w-full max-w-xl">
						<div className="flex items-center justify-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-200 py-1.5 sm:py-0">
							<span className="font-display text-lg sm:text-xl font-extrabold text-red-400 whitespace-nowrap">
								1,400+
							</span>{" "}
							Martyrs & Lives Lost
						</div>
						<div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-white/28 shrink-0" />
						<div className="flex items-center justify-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-200 py-1.5 sm:py-0">
							<span className="font-display text-lg sm:text-xl font-extrabold text-red-400 whitespace-nowrap">
								20,000+
							</span>{" "}
							Injured & Wounded
						</div>
						<div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-white/28 shrink-0" />
						<div className="flex items-center justify-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-400 py-1.5 sm:py-0">
							<span>36 Days Uprising (Jul 1 – Aug 5)</span>
						</div>
					</div>

					<div className="flex flex-col sm:flex-row items-stretch justify-center gap-2.5 w-full max-w-xs sm:max-w-none">
						<a
							href="#archive"
							className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm sm:text-base font-semibold text-white bg-red-600 hover:bg-red-800 transition-all shadow-[0_8px_22px_-4px_rgba(220,38,38,0.28)] hover:-translate-y-0.5 no-underline"
						>
							Explore Main Archive ↓
						</a>
					</div>
				</div>
			</section>

			{/* ── CHRONOLOGY TIMELINE ── */}
			<TimelineSection />

			{/* ── ARCHIVE SECTION ── */}
			<section
				id="archive"
				className="max-w-7xl mx-auto px-4 md:px-8 py-7 md:py-10 pb-20"
			>
				{/* Header & Search Bar */}
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 mb-5">
					<h2 className="font-display font-extrabold text-[clamp(1.4rem,5vw,2.1rem)] tracking-tight text-slate-900 m-0">
						List of <span className="text-red-600">{sectionLabel}</span>
					</h2>

					<div className="relative w-full sm:max-w-md">
						<span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none select-none">
							⌕
						</span>
						<input
							className="w-full h-12 pl-12 pr-11 bg-slate-50 border border-slate-200 font-body text-sm text-slate-900 outline-none focus:bg-white focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition-all"
							type="text"
							placeholder="Search records by title, location or detail…"
							value={q || ""}
							onChange={(e) => handleSearchChange(e.target.value)}
						/>
						{q && (
							<button
								type="button"
								className="absolute right-3 top-1/2 -translate-y-1/2 bg-slate-200 hover:bg-red-600 hover:text-white text-slate-700 border-0 rounded-full w-6 h-6 flex items-center justify-center text-xs cursor-pointer transition-colors"
								onClick={() => handleSearchChange("")}
								title="Clear search"
							>
								×
							</button>
						)}
					</div>
				</div>

				{/* Filter Tabs & Results Count */}
				<div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 mb-6 gap-2.5 border-b border-slate-100">
					<div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
						{TABS.map((tab) => (
							<Link
								key={tab.key}
								to="/"
								search={{ filter: tab.key, page: 1, q: q || undefined }}
								resetScroll={false}
								className={`font-body text-xs sm:text-sm font-semibold px-4 py-2 transition-colors shrink-0 whitespace-nowrap inline-flex items-center min-h-[40px] no-underline ${
									filter === tab.key
										? "bg-red-600 text-white"
										: "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
								}`}
							>
								{tab.label}
							</Link>
						))}
					</div>

					<span className="text-xs font-medium text-slate-500 px-0.5">
						{q
							? `Found ${filteredItems.length} matching items (Page ${currentPage} of ${totalPages})`
							: `Showing page ${currentPage} of ${totalPages} (${news.total} total records)`}
					</span>
				</div>

				{/* Card Grid */}
				{paginatedItems.length === 0 ? (
					<div className="text-center py-20 text-slate-500">
						<p className="text-lg font-semibold m-0">
							No records match your search criteria.
						</p>
						<p className="text-sm text-slate-400 mt-1.5">
							Try clearing your search query or switching filter tabs.
						</p>
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7">
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
					<div className="flex items-center justify-center gap-1.25 mt-10 flex-wrap">
						{currentPage > 1 && (
							<Link
								to="/"
								search={{ filter, page: currentPage - 1, q: q || undefined }}
								resetScroll={false}
								className="font-body text-xs sm:text-sm font-semibold text-slate-700 min-w-[42px] h-[42px] px-3 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 flex items-center justify-center transition-colors whitespace-nowrap no-underline active:scale-95"
							>
								← Prev
							</Link>
						)}
						{getPaginationRange(currentPage, totalPages).map((p, idx) =>
							p === "..." ? (
								<span
									// biome-ignore lint/suspicious/noArrayIndexKey: pagination ellipsis position index is stable
									key={`ellipsis-${idx}`}
									className="inline-flex items-center justify-center min-w-[28px] h-[42px] px-0.5 text-base font-extrabold text-slate-400 select-none"
								>
									…
								</span>
							) : (
								<Link
									key={p}
									to="/"
									search={{ filter, page: p, q: q || undefined }}
									resetScroll={false}
									className={`font-body text-xs sm:text-sm font-semibold min-w-[42px] h-[42px] px-3 flex items-center justify-center transition-colors whitespace-nowrap no-underline active:scale-95 ${
										p === currentPage
											? "bg-red-600 text-white shadow-[0_8px_22px_-4px_rgba(220,38,38,0.28)]"
											: "text-slate-700 bg-slate-100 hover:bg-slate-200 hover:text-slate-900"
									}`}
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
								className="font-body text-xs sm:text-sm font-semibold text-slate-700 min-w-[42px] h-[42px] px-3 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 flex items-center justify-center transition-colors whitespace-nowrap no-underline active:scale-95"
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
