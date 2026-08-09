import { r as __toESM } from "../_runtime.mjs";
import { f as Link, h as require_react, p as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as C, r as Route$1 } from "./router-cfnMORXD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-7VsmSyY3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function fmtDate(s) {
	if (!s) return "";
	return new Intl.DateTimeFormat("en-GB", {
		day: "numeric",
		month: "short",
		year: "numeric"
	}).format(new Date(s));
}
function LazyImage({ src, alt }) {
	const [loaded, setLoaded] = (0, import_react.useState)(false);
	const [err, setErr] = (0, import_react.useState)(false);
	const imgRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (imgRef.current?.complete) {
			if (imgRef.current.naturalWidth === 0) setErr(true);
			else setLoaded(true);
		}
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			position: "relative",
			width: "100%",
			height: "100%",
			background: "#131314"
		},
		children: [
			!loaded && !err && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "news-card-placeholder shimmer",
				style: {
					position: "absolute",
					inset: 0,
					zIndex: 2
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "INQUILAB" })
			}),
			err && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "news-card-placeholder",
				style: {
					position: "absolute",
					inset: 0,
					zIndex: 2
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "INQUILAB" })
			}),
			!err && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				ref: imgRef,
				src,
				alt,
				referrerPolicy: "no-referrer",
				className: `img-fade${loaded ? " loaded" : ""}`,
				style: {
					position: "absolute",
					inset: 0,
					width: "100%",
					height: "100%",
					objectFit: "cover",
					zIndex: 1,
					opacity: loaded ? 1 : 0,
					transition: "opacity 0.3s ease"
				},
				onLoad: () => setLoaded(true),
				onError: () => setErr(true)
			})
		]
	});
}
var MILESTONES = [
	{
		id: "jul16",
		date: "July 16, 2024",
		title: "First Fatalities in Student Clashes",
		desc: "Widespread non-violent student protests demanding quota reform turned deadly when violent crackdowns began in Chattogram, Dhaka, and Rangpur (Abu Sayed)."
	},
	{
		id: "jul18",
		date: "July 18, 2024",
		title: "Nationwide Complete Shutdown",
		desc: "Government ordered complete internet and telecommunications blackout across Bangladesh while military and paramilitary forces were deployed."
	},
	{
		id: "jul19",
		date: "July 19, 2024",
		title: "Curfew & Shoot-on-Sight Orders",
		desc: "Strict military curfew declared. High casualty rate reported nationwide as citizens and student coordinators resisted authoritarian suppression."
	},
	{
		id: "aug02",
		date: "August 2, 2024",
		title: "\"March to Dhaka\" Call",
		desc: "Anti-Discrimination Student Movement announced full 1-Point Demand for regime resignation, calling for millions to march into central Dhaka."
	},
	{
		id: "aug05",
		date: "August 5, 2024",
		title: "Fall of Regime & Liberation",
		desc: "Prime Minister Sheikh Hasina resigned and fled the country. Hundreds of thousands of citizens celebrated victory at Gono Bhaban and Parliament."
	},
	{
		id: "aug08",
		date: "August 8, 2024",
		title: "Interim Government Sworn In",
		desc: "Nobel laureate Dr. Muhammad Yunus took oath as Chief Adviser alongside student leaders to lead Bangladesh’s democratic transition."
	}
];
function TimelineSection() {
	const [activeIdx, setActiveIdx] = (0, import_react.useState)(4);
	const current = MILESTONES[activeIdx];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "timeline-section",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "timeline-header",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
					className: "timeline-title",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "timeline-title-dot" }), "July–August 2024 Uprising Chronology"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					style: {
						fontSize: "0.82rem",
						color: C.textSec,
						fontWeight: 500
					},
					children: "Click a milestone to inspect event details"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "timeline-nav",
				children: MILESTONES.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: `timeline-step${activeIdx === i ? " active" : ""}`,
					onClick: () => setActiveIdx(i),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "timeline-step-date",
						children: m.date.split(",")[0]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "timeline-step-title",
						children: m.title
					})]
				}, m.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "milestone-box",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "milestone-date",
						children: current.date
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "milestone-heading",
						children: current.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "milestone-desc",
						children: current.desc
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: {
						display: "flex",
						flexDirection: "column",
						alignItems: "flex-end",
						gap: 6
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						style: {
							fontSize: "0.75rem",
							color: C.subtle,
							fontWeight: 700,
							letterSpacing: "0.1em"
						},
						children: [
							"STEP 0",
							activeIdx + 1,
							" OF 0",
							MILESTONES.length
						]
					})
				})]
			})
		]
	});
}
function NewsCard({ item, onQuickView }) {
	const isKilled = item.is_killed === 1;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `news-card${isKilled ? " is-killed" : ""}`,
		role: "button",
		tabIndex: 0,
		onClick: () => onQuickView(item),
		onKeyDown: (e) => {
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				onQuickView(item);
			}
		},
		style: { cursor: "pointer" },
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "news-card-img-wrap",
			children: [item.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LazyImage, {
				src: item.image,
				alt: item.title
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "news-card-placeholder",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "INQUILAB" })
			}), isKilled && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "news-card-martyr-badge",
				children: "MARTYR"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "news-card-body",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "news-card-title",
					children: item.title
				}),
				item.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "news-card-desc",
					children: item.description.replace(/\r?\n/g, " ").trim()
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "news-card-footer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "news-card-date",
						children: fmtDate(item.published) || "Jul 2024"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "news-card-quickview",
						onClick: (e) => {
							e.stopPropagation();
							onQuickView(item);
						},
						children: "Quick View →"
					})]
				})
			]
		})]
	});
}
function QuickViewModal({ item, onClose }) {
	const isKilled = item.is_killed === 1;
	(0, import_react.useEffect)(() => {
		const handleKeyDown = (e) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [onClose]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "modal-backdrop",
		role: "button",
		tabIndex: 0,
		onClick: onClose,
		onKeyDown: (e) => {
			if (e.key === "Escape") onClose();
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "modal-drawer",
			role: "dialog",
			"aria-modal": "true",
			onClick: (e) => e.stopPropagation(),
			onKeyDown: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "modal-header",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							display: "flex",
							alignItems: "center",
							gap: 8
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "modal-header-tag",
							children: "ARCHIVE RECORD"
						}), isKilled && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "news-card-martyr-badge",
							style: { position: "static" },
							children: "MARTYR"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "modal-close-btn",
						onClick: onClose,
						title: "Close drawer (Esc)",
						children: "×"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "modal-body",
					children: [
						isKilled && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "modal-martyr-banner",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "modal-martyr-tag",
								children: "MARTYR RECORD"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "modal-martyr-text",
								children: "Documented loss of life during the Bangladesh July–August 2024 Revolution."
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "modal-title",
							children: item.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "modal-meta",
							children: [item.published && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Published: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: fmtDate(item.published) })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								"Status:",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									style: { color: isKilled ? C.red : C.textSec },
									children: isKilled ? "Martyrdom" : "Record"
								})
							] })]
						}),
						item.image && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "modal-img-wrap",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: item.image,
								alt: item.title,
								className: "modal-img",
								referrerPolicy: "no-referrer"
							})
						}),
						item.description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: item.description.split(/\r?\n\r?\n/).map((para) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "modal-content-p",
							children: para.trim()
						}, para)) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "modal-content-p",
							style: {
								color: C.muted,
								fontStyle: "italic"
							},
							children: "No extra description recorded for this item."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "modal-footer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							display: "flex",
							gap: 8
						},
						children: [item.link && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: item.link,
							target: "_blank",
							rel: "noopener noreferrer",
							className: "btn btn-ghost",
							style: {
								fontSize: "0.85rem",
								padding: "8px 16px"
							},
							children: "↗ Original Source"
						}), item.archive_link && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: item.archive_link,
							target: "_blank",
							rel: "noopener noreferrer",
							className: "btn btn-ghost",
							style: {
								fontSize: "0.85rem",
								padding: "8px 16px"
							},
							children: "⊞ Web Archive"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "btn btn-primary",
						style: {
							fontSize: "0.85rem",
							padding: "8px 18px"
						},
						onClick: onClose,
						children: "Close Drawer"
					})]
				})
			]
		})
	});
}
function getPaginationRange(current, total) {
	const delta = 1;
	const range = [];
	const rangeWithDots = [];
	for (let i = 1; i <= total; i++) if (i === 1 || i === total || i >= current - delta && i <= current + delta) range.push(i);
	let l = null;
	for (const i of range) {
		if (l !== null) {
			if (i - l === 2) rangeWithDots.push(l + 1);
			else if (i - l !== 1) rangeWithDots.push("...");
		}
		rangeWithDots.push(i);
		l = i;
	}
	return rangeWithDots;
}
function HomePage() {
	const { news } = Route$1.useLoaderData();
	const { filter, page, q } = Route$1.useSearch();
	const navigate = Route$1.useNavigate();
	const [quickItem, setQuickItem] = (0, import_react.useState)(null);
	const handleSearchChange = (val) => {
		navigate({
			search: (prev) => ({
				...prev,
				q: val || void 0,
				page: 1
			}),
			replace: true,
			resetScroll: false
		});
	};
	const filteredItems = (0, import_react.useMemo)(() => {
		if (!q || !q.trim()) return news.data;
		const queryStr = q.toLowerCase().trim();
		return news.data.filter((n) => n.title.toLowerCase().includes(queryStr) || (n.description ?? "").toLowerCase().includes(queryStr));
	}, [news.data, q]);
	const totalPages = Math.max(1, Math.ceil(filteredItems.length / 9));
	const currentPage = Math.min(Math.max(1, page), totalPages);
	const paginatedItems = (0, import_react.useMemo)(() => {
		const start = (currentPage - 1) * 9;
		return filteredItems.slice(start, start + 9);
	}, [filteredItems, currentPage]);
	const TABS = [{
		key: "all",
		label: "All Records"
	}, {
		key: "killed",
		label: "Martyrs"
	}];
	const sectionLabel = filter === "killed" ? "Martyrs" : filter === "alive" ? "Survivors & Others" : "All Movement Records";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			minHeight: "100vh",
			background: C.bg
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "hero",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "hero-lines" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hero-inner",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "hero-eyebrow",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "hero-eyebrow-line" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hero-eyebrow-text",
									children: "HISTORICAL ARCHIVE • JULY UPRISING 2024"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "hero-eyebrow-line" })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "hero-headline",
							children: [
								"Documenting the ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Uprising" }),
								",",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								"Preserving Every Voice."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "hero-sub",
							children: "A verified digital archive preserving testimonies, martyrdom records, and pivotal events of the July–August 2024 mass uprising in Bangladesh."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "hero-stat-row",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "hero-stat-item",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "hero-stat-num",
										children: "1,400+"
									}), " Martyrs & Lives Lost"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "hero-stat-divider" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "hero-stat-item",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "hero-stat-num",
										children: "20,000+"
									}), " Injured & Wounded"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "hero-stat-divider" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "hero-stat-item",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										style: {
											color: "#94a3b8",
											fontWeight: 700
										},
										children: "36 Days Uprising (Jul 1 – Aug 5)"
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "hero-cta",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "#archive",
								className: "btn btn-primary",
								children: "Explore Main Archive ↓"
							})
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TimelineSection, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				id: "archive",
				className: "archive-section",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "archive-header",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "section-title",
							children: ["List of ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: sectionLabel })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "search-wrap",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "search-icon",
									children: "⌕"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: "search-input",
									type: "text",
									placeholder: "Search records by title, location or detail…",
									value: q || "",
									onChange: (e) => handleSearchChange(e.target.value)
								}),
								q && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "search-clear",
									onClick: () => handleSearchChange(""),
									title: "Clear search",
									children: "×"
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "filter-tabs-row",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "filter-tabs",
							children: TABS.map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/",
								search: {
									filter: tab.key,
									page: 1,
									q: q || void 0
								},
								resetScroll: false,
								className: `filter-tab${filter === tab.key ? " active" : ""}`,
								children: tab.label
							}, tab.key))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "filter-count",
							children: q ? `Found ${filteredItems.length} matching items (Page ${currentPage} of ${totalPages})` : `Showing page ${currentPage} of ${totalPages} (${news.total} total records)`
						})]
					}),
					paginatedItems.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							textAlign: "center",
							padding: "80px 0",
							color: C.muted
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							style: {
								fontSize: "1.1rem",
								fontWeight: 600,
								margin: 0
							},
							children: "No records match your search criteria."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							style: {
								fontSize: "0.9rem",
								color: C.subtle,
								marginTop: 6
							},
							children: "Try clearing your search query or switching filter tabs."
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "card-grid",
						children: paginatedItems.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewsCard, {
							item,
							onQuickView: (item) => setQuickItem(item)
						}, item.id))
					}),
					totalPages > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pagination",
						children: [
							currentPage > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/",
								search: {
									filter,
									page: currentPage - 1,
									q: q || void 0
								},
								resetScroll: false,
								className: "page-btn",
								children: "← Prev"
							}),
							getPaginationRange(currentPage, totalPages).map((p, idx) => p === "..." ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "page-ellipsis",
								children: "…"
							}, `ellipsis-${idx}`) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/",
								search: {
									filter,
									page: p,
									q: q || void 0
								},
								resetScroll: false,
								className: `page-btn${p === currentPage ? " active" : ""}`,
								children: p
							}, p)),
							currentPage < totalPages && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/",
								search: {
									filter,
									page: currentPage + 1,
									q: q || void 0
								},
								resetScroll: false,
								className: "page-btn",
								children: "Next →"
							})
						]
					})
				]
			}),
			quickItem && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickViewModal, {
				item: quickItem,
				onClose: () => setQuickItem(null)
			})
		]
	});
}
//#endregion
export { HomePage as component };
