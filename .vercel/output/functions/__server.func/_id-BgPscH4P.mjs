import { f as Link, p as require_jsx_runtime } from "./_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_id-BgPscH4P.js
var import_jsx_runtime = require_jsx_runtime();
function NotFoundPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "not-found",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "not-found-code",
				children: "404"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "not-found-msg",
				children: "This record could not be found."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				search: {
					filter: "all",
					page: 1
				},
				className: "btn btn-primary",
				children: "Back to Archive"
			})
		]
	});
}
//#endregion
export { NotFoundPage as notFoundComponent };
