import { f as Link, p as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as F, i as C } from "./router-cfnMORXD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DyVBzmWp.js
var import_jsx_runtime = require_jsx_runtime();
function IndexError({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			minHeight: "60vh",
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			justifyContent: "center",
			textAlign: "center",
			padding: "40px 20px"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				style: {
					fontFamily: F.display,
					fontSize: "1.8rem",
					fontWeight: 800,
					color: C.red,
					margin: "0 0 12px 0"
				},
				children: "Unable to Load Archive Records"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				style: {
					color: C.textSec,
					maxWidth: 460,
					margin: "0 0 24px 0"
				},
				children: error?.message || "A network error occurred while connecting to the July Revolution database."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				search: {
					filter: "all",
					page: 1
				},
				className: "btn btn-primary",
				children: "Retry Loading Archive →"
			})
		]
	});
}
//#endregion
export { IndexError as errorComponent };
