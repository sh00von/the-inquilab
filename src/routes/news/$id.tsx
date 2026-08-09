import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { API, C, F } from "../../lib/ds";
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
				style={{
					marginBottom: 36,
					overflow: "hidden",
					height: 260,
					border: `3px solid ${killed ? C.red : C.border}`,
					background: C.slate,
					color: "rgba(255,255,255,0.2)",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					fontFamily: F.display,
					fontWeight: 900,
					fontSize: "2rem",
					letterSpacing: "0.1em",
				}}
			>
				<span>INQUILAB</span>
			</div>
		);
	}
	return (
		<div
			style={{
				marginBottom: 36,
				overflow: "hidden",
				border: `3px solid ${killed ? C.red : C.border}`,
				position: "relative",
				background: "#131314",
			}}
		>
			{!loaded && (
				<div
					className="news-card-placeholder shimmer"
					style={{ position: "absolute", inset: 0, minHeight: 280, zIndex: 2 }}
				>
					<span>INQUILAB</span>
				</div>
			)}
			<img
				ref={imgRef}
				src={src}
				alt={alt}
				referrerPolicy="no-referrer"
				className={`img-fade${loaded ? " loaded" : ""}`}
				style={{
					width: "100%",
					maxHeight: 500,
					objectFit: "cover",
					display: "block",
					opacity: loaded ? 1 : 0,
					transition: "opacity 0.3s ease",
				}}
				onLoad={() => setLoaded(true)}
				onError={() => setErr(true)}
			/>
		</div>
	);
}

/* ── Not found ────────────────────────────────────────────── */

function NotFoundPage() {
	return (
		<div className="not-found">
			<div className="not-found-code">404</div>
			<p className="not-found-msg">This record could not be found.</p>
			<Link
				to="/"
				search={{ filter: "all", page: 1 }}
				className="btn btn-primary"
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
		<div style={{ minHeight: "100vh", background: C.bg }}>
			<div className="article-page">
				{/* Breadcrumb */}
				<nav className="article-breadcrumb">
					<Link to="/" search={{ filter: "all", page: 1 }}>
						Archive
					</Link>
					<span>/</span>
					<span style={{ color: C.slate, fontWeight: 600 }}>
						Archive Record
					</span>
				</nav>

				{/* Martyr Banner */}
				{killed && (
					<div className="modal-martyr-banner" style={{ marginBottom: 28 }}>
						<span className="modal-martyr-tag">MARTYR RECORD</span>
						<span className="modal-martyr-text">
							This record documents a martyrdom loss during the Bangladesh July
							2024 Mass Uprising.
						</span>
					</div>
				)}

				{/* Meta Header */}
				<div className="article-meta">
					{item.published && (
						<span style={{ fontWeight: 600, color: C.slate }}>
							{fmtDate(item.published)}
						</span>
					)}
					{killed && <span className="article-martyr-tag">MARTYR</span>}
					<button
						type="button"
						onClick={handleCopyLink}
						style={{
							marginLeft: "auto",
							fontSize: "0.82rem",
							fontWeight: 600,
							background: copied ? "#dcfce7" : C.bgSubtle,
							color: copied ? "#15803d" : C.slate,
							border: `1px solid ${copied ? "#86efac" : C.border}`,
							padding: "4px 12px",
							borderRadius: 6,
							cursor: "pointer",
							transition: "all 0.15s ease",
						}}
					>
						{copied ? "✓ Link Copied" : "Copy Record Link 🔗"}
					</button>
				</div>

				{/* Title */}
				<h1 className="article-title">{item.title}</h1>

				{/* Image */}
				{item.image && (
					<LazyImage src={item.image} alt={item.title} killed={killed} />
				)}

				{/* Content Paragraphs */}
				{item.description ? (
					<div className="article-content" style={{ marginTop: 24 }}>
						{item.description.split(/\r?\n\r?\n/).map((para) => (
							<p key={para}>{para.trim()}</p>
						))}
					</div>
				) : (
					<p style={{ color: C.muted, fontStyle: "italic", margin: "30px 0" }}>
						No additional text description is attached to this archive record.
					</p>
				)}

				{/* Actions */}
				<div className="article-actions">
					{item.link && (
						<a
							href={item.link}
							target="_blank"
							rel="noopener noreferrer"
							className="btn btn-primary"
						>
							↗ View Original Source Article
						</a>
					)}
					{item.archive_link && item.archive_link !== item.link && (
						<a
							href={item.archive_link}
							target="_blank"
							rel="noopener noreferrer"
							className="btn btn-ghost"
						>
							⊞ View Web Archive Snapshot
						</a>
					)}
					<Link
						to="/"
						search={{ filter: "all", page: 1 }}
						className="btn btn-ghost"
						style={{ marginLeft: "auto" }}
					>
						← Back to Archive List
					</Link>
				</div>
			</div>
		</div>
	);
}
