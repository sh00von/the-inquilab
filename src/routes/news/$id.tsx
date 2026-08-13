import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { API } from "../../lib/ds";
import type { NewsItem } from "../index";

export const Route = createFileRoute("/news/$id")({
	loader: async ({ params }) => {
		const res = await fetch(`${API}/api/news/${params.id}`);
		if (!res.ok) throw notFound();
		const item: NewsItem = await res.json();
		return { item };
	},
	notFoundComponent: NotFoundPage,
	component: ArticlePage,
});

function fmtDate(s: string | null) {
	if (!s) return "";
	return new Intl.DateTimeFormat("en-GB", {
		day: "numeric",
		month: "long",
		year: "numeric",
	}).format(new Date(s));
}

/* ── LazyImage ────────────────────────────────────────────── */

function LazyImage({
	src,
	alt,
	killed,
}: {
	src: string;
	alt: string;
	killed: boolean;
}) {
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

	if (err) {
		return (
			<div
				className={`mb-9 overflow-hidden h-[260px] border-4 ${
					killed ? "border-red-600" : "border-slate-200"
				} bg-slate-900 text-white/20 flex items-center justify-center font-display font-black text-3xl tracking-widest`}
			>
				<span>INQUILAB</span>
			</div>
		);
	}
	return (
		<div
			className={`mb-9 overflow-hidden border-4 ${
				killed ? "border-red-600" : "border-slate-200"
			} relative bg-slate-900`}
		>
			{!loaded && (
				<div className="absolute inset-0 min-h-[280px] z-10 flex items-center justify-center font-display font-black text-2xl tracking-widest text-white/20 animate-shimmer">
					<span>INQUILAB</span>
				</div>
			)}
			<img
				ref={imgRef}
				src={src}
				alt={alt}
				referrerPolicy="no-referrer"
				className={`w-full max-h-[500px] object-cover block transition-opacity duration-300 ${
					loaded ? "opacity-100" : "opacity-0"
				}`}
				onLoad={() => setLoaded(true)}
				onError={() => setErr(true)}
			/>
		</div>
	);
}

/* ── Not found ────────────────────────────────────────────── */

function NotFoundPage() {
	return (
		<div className="flex flex-col items-center justify-center text-center px-5 py-16 min-h-[60vh] gap-3.5">
			<div className="font-display text-red-600 font-black text-[clamp(4rem,18vw,7rem)] leading-none">
				404
			</div>
			<p className="text-slate-600 text-lg max-w-[380px] m-0">
				This record could not be found.
			</p>
			<Link
				to="/"
				search={{ filter: "all", page: 1 }}
				className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-red-600 hover:bg-red-800 transition-all shadow-[0_8px_22px_-4px_rgba(220,38,38,0.28)] hover:-translate-y-0.5 no-underline"
			>
				Back to Archive
			</Link>
		</div>
	);
}

/* ── Article page ─────────────────────────────────────────── */

function ArticlePage() {
	const { item } = Route.useLoaderData();
	const killed = item.is_killed === 1;
	const [copied, setCopied] = useState(false);

	const handleCopyLink = () => {
		if (typeof window !== "undefined") {
			navigator.clipboard.writeText(window.location.href);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		}
	};

	return (
		<div className="min-h-screen bg-white">
			<div className="max-w-4xl mx-auto px-4 md:px-8 py-6 md:py-10 pb-20">
				{/* Breadcrumb */}
				<nav className="flex items-center gap-2 flex-wrap text-xs sm:text-sm text-slate-500 mb-4.5">
					<Link
						to="/"
						search={{ filter: "all", page: 1 }}
						className="text-slate-700 font-medium hover:text-red-600 no-underline transition-colors"
					>
						Archive
					</Link>
					<span>/</span>
					<span className="text-slate-900 font-semibold">Archive Record</span>
				</nav>

				{/* Martyr Banner */}
				{killed && (
					<div className="bg-red-500/10 p-3.5 mb-7 flex items-start gap-2.5 flex-wrap">
						<span className="bg-red-600 text-white font-extrabold text-[0.68rem] px-2 py-0.5 tracking-wider uppercase shrink-0 mt-0.5">
							MARTYR RECORD
						</span>
						<span className="text-sm font-medium text-red-700 leading-normal">
							This record documents a martyrdom loss during the Bangladesh July
							2024 Mass Uprising.
						</span>
					</div>
				)}

				{/* Meta Header */}
				<div className="flex items-center gap-3 flex-wrap text-xs sm:text-sm text-slate-500 mb-7 pb-3.5 border-b border-slate-100">
					{item.published && (
						<span className="font-semibold text-slate-900">
							{fmtDate(item.published)}
						</span>
					)}
					{killed && (
						<span className="bg-red-600 text-white font-extrabold text-[0.68rem] px-2 py-0.5 tracking-wider">
							MARTYR
						</span>
					)}
					<button
						type="button"
						onClick={handleCopyLink}
						className={`ml-auto text-xs font-semibold px-3 py-1 rounded-md cursor-pointer transition-colors border ${
							copied
								? "bg-emerald-50 text-emerald-700 border-emerald-300"
								: "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
						}`}
					>
						{copied ? "✓ Link Copied" : "Copy Record Link 🔗"}
					</button>
				</div>

				{/* Title */}
				<h1 className="font-display font-extrabold text-[clamp(1.6rem,5.5vw,2.8rem)] leading-tight text-slate-900 mb-4.5">
					{item.title}
				</h1>

				{/* Image */}
				{item.image && (
					<LazyImage src={item.image} alt={item.title} killed={killed} />
				)}

				{/* Content Paragraphs */}
				{item.description ? (
					<div className="mt-6">
						{item.description.split(/\r?\n\r?\n/).map((para) => (
							<p
								key={para}
								className="text-slate-800 text-base sm:text-lg leading-relaxed mb-5"
							>
								{para.trim()}
							</p>
						))}
					</div>
				) : (
					<p className="text-slate-500 italic my-8 text-base">
						No additional text description is attached to this archive record.
					</p>
				)}

				{/* Actions */}
				<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-8 pt-5 border-t border-slate-100">
					{item.link && (
						<a
							href={item.link}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-red-600 hover:bg-red-800 transition-all shadow-[0_8px_22px_-4px_rgba(220,38,38,0.28)] hover:-translate-y-0.5 no-underline"
						>
							↗ View Original Source Article
						</a>
					)}
					{item.archive_link && item.archive_link !== item.link && (
						<a
							href={item.archive_link}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-slate-800 bg-white border border-slate-200 hover:border-slate-400 hover:bg-slate-50 shadow-xs transition-all hover:-translate-y-0.5 no-underline"
						>
							⊞ View Web Archive Snapshot
						</a>
					)}
					<Link
						to="/"
						search={{ filter: "all", page: 1 }}
						className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-slate-800 bg-white border border-slate-200 hover:border-slate-400 hover:bg-slate-50 shadow-xs transition-all hover:-translate-y-0.5 no-underline sm:ml-auto"
					>
						← Back to Archive List
					</Link>
				</div>
			</div>
		</div>
	);
}
