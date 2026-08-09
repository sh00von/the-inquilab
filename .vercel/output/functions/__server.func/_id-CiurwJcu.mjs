import { r as __toESM } from "./_runtime.mjs";
import { f as Link, h as require_react, p as require_jsx_runtime } from "./_libs/@tanstack/react-router+[...].mjs";
import { a as F, i as C, n as Route } from "./_ssr/router-cfnMORXD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_id-CiurwJcu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function fmtDate(s) {
	if (!s) return "";
	return new Intl.DateTimeFormat("en-GB", {
		day: "numeric",
		month: "long",
		year: "numeric"
	}).format(new Date(s));
}
function LazyImage({ src, alt, killed }) {
	const [loaded, setLoaded] = (0, import_react.useState)(false);
	const [err, setErr] = (0, import_react.useState)(false);
	const imgRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (imgRef.current?.complete) {
			if (imgRef.current.naturalWidth === 0) setErr(true);
			else setLoaded(true);
		}
	}, []);
	if (err) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		style: {
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
			letterSpacing: "0.1em"
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "INQUILAB" })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			marginBottom: 36,
			overflow: "hidden",
			border: `3px solid ${killed ? C.red : C.border}`,
			position: "relative",
			background: "#131314"
		},
		children: [!loaded && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "news-card-placeholder shimmer",
			style: {
				position: "absolute",
				inset: 0,
				minHeight: 280,
				zIndex: 2
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "INQUILAB" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			ref: imgRef,
			src,
			alt,
			referrerPolicy: "no-referrer",
			className: `img-fade${loaded ? " loaded" : ""}`,
			style: {
				width: "100%",
				maxHeight: 500,
				objectFit: "cover",
				display: "block",
				opacity: loaded ? 1 : 0,
				transition: "opacity 0.3s ease"
			},
			onLoad: () => setLoaded(true),
			onError: () => setErr(true)
		})]
	});
}
function ArticlePage() {
	const { item } = Route.useLoaderData();
	const killed = item.is_killed === 1;
	const [copied, setCopied] = (0, import_react.useState)(false);
	const handleCopyLink = () => {
		if (typeof window !== "undefined") {
			navigator.clipboard.writeText(window.location.href);
			setCopied(true);
			setTimeout(() => setCopied(false), 2e3);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		style: {
			minHeight: "100vh",
			background: C.bg
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "article-page",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "article-breadcrumb",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							search: {
								filter: "all",
								page: 1
							},
							children: "Archive"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "/" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							style: {
								color: C.slate,
								fontWeight: 600
							},
							children: "Archive Record"
						})
					]
				}),
				killed && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "modal-martyr-banner",
					style: { marginBottom: 28 },
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "modal-martyr-tag",
						children: "MARTYR RECORD"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "modal-martyr-text",
						children: "This record documents a martyrdom loss during the Bangladesh July 2024 Mass Uprising."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "article-meta",
					children: [
						item.published && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							style: {
								fontWeight: 600,
								color: C.slate
							},
							children: fmtDate(item.published)
						}),
						killed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "article-martyr-tag",
							children: "MARTYR"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: handleCopyLink,
							style: {
								marginLeft: "auto",
								fontSize: "0.82rem",
								fontWeight: 600,
								background: copied ? "#dcfce7" : C.bgSubtle,
								color: copied ? "#15803d" : C.slate,
								border: `1px solid ${copied ? "#86efac" : C.border}`,
								padding: "4px 12px",
								borderRadius: 6,
								cursor: "pointer",
								transition: "all 0.15s ease"
							},
							children: copied ? "✓ Link Copied" : "Copy Record Link 🔗"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "article-title",
					children: item.title
				}),
				item.image && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LazyImage, {
					src: item.image,
					alt: item.title,
					killed
				}),
				item.description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "article-content",
					style: { marginTop: 24 },
					children: item.description.split(/\r?\n\r?\n/).map((para) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: para.trim() }, para))
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					style: {
						color: C.muted,
						fontStyle: "italic",
						margin: "30px 0"
					},
					children: "No additional text description is attached to this archive record."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "article-actions",
					children: [
						item.link && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: item.link,
							target: "_blank",
							rel: "noopener noreferrer",
							className: "btn btn-primary",
							children: "↗ View Original Source Article"
						}),
						item.archive_link && item.archive_link !== item.link && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: item.archive_link,
							target: "_blank",
							rel: "noopener noreferrer",
							className: "btn btn-ghost",
							children: "⊞ View Web Archive Snapshot"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							search: {
								filter: "all",
								page: 1
							},
							className: "btn btn-ghost",
							style: { marginLeft: "auto" },
							children: "← Back to Archive List"
						})
					]
				})
			]
		})
	});
}
//#endregion
export { ArticlePage as component };
