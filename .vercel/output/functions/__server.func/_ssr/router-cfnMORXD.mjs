import { r as __toESM } from "../_runtime.mjs";
import { a as useRouterState, c as Outlet, d as createRootRoute, f as Link, h as require_react, i as HeadContent, l as lazyRouteComponent, m as notFound, p as require_jsx_runtime, r as Scripts, s as createRouter, u as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ds-Pf8enslz.js
var C = {
	red: "#dc2626",
	redDark: "#991b1b",
	redLight: "#fef2f2",
	redBorder: "#fecaca",
	slate: "#131314",
	text: "#1f1f23",
	textSec: "#475569",
	muted: "#64748b",
	subtle: "#94a3b8",
	border: "#e2e8f0",
	borderLight: "#f8fafc",
	bg: "#ffffff",
	bgSubtle: "#f8fafc",
	footer: "#131314"
};
var F = {
	display: "'Outfit', 'Plus Jakarta Sans', system-ui, sans-serif",
	body: "'Inter', system-ui, -apple-system, sans-serif",
	bengali: "'Noto Serif Bengali', serif"
};
var API = "https://the-inquilab.minar-svn.workers.dev";
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-cfnMORXD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var styles_default = "/assets/styles-C46GfrHk.css";
var Route$2 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1, viewport-fit=cover"
			},
			{ title: "The Inquilab — Bangladesh July Revolution Archive" },
			{
				name: "description",
				content: "A living archive of the Bangladesh July–August 2024 Mass Uprising. Documenting martyrs, news, and testimonies of the student-people revolution."
			},
			{
				name: "theme-color",
				content: "#0f172a"
			},
			{
				property: "og:title",
				content: "The Inquilab — Bangladesh July Revolution Archive"
			},
			{
				property: "og:description",
				content: "A verified digital archive of the 2024 Bangladesh mass uprising. Martyrs, testimonies, and news records."
			},
			{
				property: "og:type",
				content: "website"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700;800;900&display=swap"
			}
		]
	}),
	shellComponent: Shell,
	component: RootLayout,
	notFoundComponent: NotFound,
	errorComponent: RouteError
});
function NotFound() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			minHeight: "70vh",
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			justifyContent: "center",
			textAlign: "center",
			padding: "40px 20px"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				style: {
					fontFamily: "Outfit, sans-serif",
					fontSize: "clamp(3rem, 12vw, 6rem)",
					fontWeight: 900,
					color: "#dc2626",
					margin: "0 0 12px 0",
					lineHeight: 1
				},
				children: "404"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				style: {
					fontFamily: "Outfit, sans-serif",
					fontSize: "clamp(1.1rem, 3vw, 1.5rem)",
					fontWeight: 700,
					color: "#1f1f23",
					margin: "0 0 12px 0"
				},
				children: "Record Not Found"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				style: {
					color: "#475569",
					maxWidth: 460,
					margin: "0 0 24px 0",
					fontSize: "0.95rem"
				},
				children: "The archive record or route you requested could not be located in our system."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				search: {
					filter: "all",
					page: 1
				},
				className: "btn btn-primary",
				children: "Return to Main Archive →"
			})
		]
	});
}
function RouteError({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			minHeight: "70vh",
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			justifyContent: "center",
			textAlign: "center",
			padding: "40px 20px"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				style: {
					fontFamily: "Outfit, sans-serif",
					fontSize: "clamp(1.5rem, 4vw, 2rem)",
					fontWeight: 800,
					color: "#dc2626",
					margin: "0 0 12px 0"
				},
				children: "Archive System Error"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				style: {
					color: "#475569",
					maxWidth: 480,
					margin: "0 0 24px 0"
				},
				children: error?.message || "An unexpected error occurred while loading archive data."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				search: {
					filter: "all",
					page: 1
				},
				className: "btn btn-primary",
				children: "Reload Main Archive →"
			})
		]
	});
}
function Preloader({ onDone }) {
	const [exiting, setExiting] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const t1 = setTimeout(() => setExiting(true), 1200);
		const t2 = setTimeout(() => onDone(), 1700);
		return () => {
			clearTimeout(t1);
			clearTimeout(t2);
		};
	}, [onDone]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `preloader${exiting ? " exiting" : ""}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "preloader-logo",
				children: ["THE ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "INQUILAB" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "preloader-line" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "preloader-sub",
				children: "Bangladesh July Revolution Archive"
			})
		]
	});
}
function ProgressBar() {
	const isLoading = useRouterState({ select: (s) => s.status === "pending" });
	const [visible, setVisible] = (0, import_react.useState)(false);
	const [done, setDone] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `progress-bar${done ? " done" : " indeterminate"}`,
		style: { width: done ? "100%" : void 0 }
	});
}
function useScrolled(threshold = 10) {
	const [scrolled, setScrolled] = (0, import_react.useState)(false);
	const prev = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
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
function SiteNav() {
	const scrolled = useScrolled();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const searchFilter = useRouterState({ select: (s) => s.location.search?.filter ?? "all" });
	const isArticle = pathname.startsWith("/news/");
	const [menuOpen, setMenuOpen] = (0, import_react.useState)(false);
	const menuRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		setMenuOpen(false);
	}, [pathname, searchFilter]);
	(0, import_react.useEffect)(() => {
		const handleKey = (e) => {
			if (e.key === "Escape") setMenuOpen(false);
		};
		window.addEventListener("keydown", handleKey);
		return () => window.removeEventListener("keydown", handleKey);
	}, []);
	(0, import_react.useEffect)(() => {
		if (menuOpen) document.body.style.overflow = "hidden";
		else document.body.style.overflow = "";
		return () => {
			document.body.style.overflow = "";
		};
	}, [menuOpen]);
	const closeMenu = (0, import_react.useCallback)(() => setMenuOpen(false), []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
			className: `navbar${scrolled ? " scrolled" : ""}`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/",
				search: {
					filter: "all",
					page: 1
				},
				className: "navbar-logo",
				onClick: closeMenu,
				children: [
					"THE ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "INQUILAB" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "navbar-badge",
						children: "2024 ARCHIVE"
					})
				]
			}), isArticle ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/",
				search: {
					filter: "all",
					page: 1
				},
				className: "nav-back",
				children: ["← ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "nav-back-label",
					children: "Return to Main Archive"
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "nav-links",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					search: {
						filter: "all",
						page: 1
					},
					resetScroll: false,
					className: `nav-link${searchFilter === "all" ? " active" : ""}`,
					children: "All Records"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					search: {
						filter: "killed",
						page: 1
					},
					resetScroll: false,
					className: `nav-link${searchFilter === "killed" ? " active" : ""}`,
					children: "Martyrs"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: `navbar-hamburger${menuOpen ? " open" : ""}`,
				"aria-label": menuOpen ? "Close navigation menu" : "Open navigation menu",
				"aria-expanded": menuOpen,
				onClick: () => setMenuOpen((v) => !v),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {})
				]
			})] })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `nav-mobile-overlay${menuOpen ? " open" : ""}`,
			role: "button",
			tabIndex: -1,
			"aria-hidden": "true",
			onClick: closeMenu,
			onKeyDown: (e) => e.key === "Escape" && closeMenu()
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			ref: menuRef,
			className: `nav-mobile-menu${menuOpen ? " open" : ""}`,
			role: "navigation",
			"aria-label": "Mobile navigation",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/",
				search: {
					filter: "all",
					page: 1
				},
				className: `nav-mobile-link${searchFilter === "all" ? " active" : ""}`,
				onClick: closeMenu,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "nav-mobile-link-dot" }), "All Records"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/",
				search: {
					filter: "killed",
					page: 1
				},
				className: `nav-mobile-link${searchFilter === "killed" ? " active" : ""}`,
				onClick: closeMenu,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "nav-mobile-link-dot" }), "Martyr Records"]
			})]
		})
	] });
}
function SiteFooter() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
		className: "site-footer",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "footer-inner",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "footer-logo",
				children: ["THE ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "INQUILAB" })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "footer-desc",
				children: "A comprehensive historical and digital archive preserving testimonies, records, and martyrdom accounts of the Bangladesh July–August 2024 Student-People Uprising."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "footer-nav-heading",
				children: "Archive Sections"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "footer-nav-links",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					search: {
						filter: "all",
						page: 1
					},
					children: "All Records"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					search: {
						filter: "killed",
						page: 1
					},
					children: "Martyr Records"
				})]
			})] })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "footer-bottom",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "July Revolution Digital Preservation · 2024–2026" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Bangladesh Mass Uprising Archive" })]
		})]
	});
}
function RootLayout() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteNav, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
	] });
}
function Shell({ children }) {
	const [preloaderDone, setPreloaderDone] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			!preloaderDone && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Preloader, { onDone: () => setPreloaderDone(true) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgressBar, {}),
			children,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	});
}
var $$splitComponentImporter$1 = () => import("./routes-7VsmSyY3.mjs");
var $$splitErrorComponentImporter = () => import("./routes-DyVBzmWp.mjs");
var Route$1 = createFileRoute("/")({
	validateSearch: (search) => ({
		filter: [
			"all",
			"killed",
			"alive"
		].includes(search.filter) ? search.filter : "all",
		page: typeof search.page === "number" ? Math.max(1, search.page) : 1,
		q: search.q || void 0
	}),
	loaderDeps: ({ search }) => ({
		filter: search.filter,
		page: search.page,
		q: search.q
	}),
	loader: async ({ deps }) => {
		const p = new URLSearchParams({
			limit: "1000",
			page: "1"
		});
		if (deps.filter === "killed") p.set("is_killed", "true");
		if (deps.filter === "alive") p.set("is_killed", "false");
		const [newsRes, killedRes, totalRes] = await Promise.all([
			fetch(`${API}/api/news?${p}`),
			fetch(`${API}/api/news?is_killed=true&limit=1`),
			fetch(`${API}/api/news?limit=1`)
		]);
		const news = await newsRes.json();
		const killed = await killedRes.json();
		const total = await totalRes.json();
		return {
			news,
			killedCount: killed.total,
			totalCount: total.total
		};
	},
	errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent"),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("../_id-CiurwJcu.mjs");
var $$splitNotFoundComponentImporter = () => import("../_id-BgPscH4P.mjs");
var Route = createFileRoute("/news/$id")({
	loader: async ({ params }) => {
		const res = await fetch(`${API}/api/news/${params.id}`);
		if (!res.ok) throw notFound();
		return { item: await res.json() };
	},
	notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent"),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var rootRouteChildren = {
	IndexRoute: Route$1.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$2
	}),
	NewsIdRoute: Route.update({
		id: "/news/$id",
		path: "/news/$id",
		getParentRoute: () => Route$2
	})
};
var routeTree = Route$2._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		scrollRestoration: true,
		defaultPreload: "intent",
		defaultPreloadStaleTime: 0
	});
}
//#endregion
export { F as a, C as i, Route as n, Route$1 as r, router_exports as t };
