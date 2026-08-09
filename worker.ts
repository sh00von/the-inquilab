export interface Env {
	DB: D1Database;
}

function json(data: unknown, status = 200) {
	return new Response(JSON.stringify(data), {
		status,
		headers: {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*",
		},
	});
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);
		const path = url.pathname;
		const method = request.method;

		if (method === "OPTIONS") {
			return new Response(null, {
				headers: {
					"Access-Control-Allow-Origin": "*",
					"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
					"Access-Control-Allow-Headers": "Content-Type",
				},
			});
		}

		// GET /api/news — list all (with optional filters)
		if (method === "GET" && path === "/api/news") {
			const approved = url.searchParams.get("approved");
			const isKilled = url.searchParams.get("is_killed");
			const page = parseInt(url.searchParams.get("page") ?? "1");
			const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "20"), 2000);
			const offset = (page - 1) * limit;

			let query = "SELECT * FROM news WHERE 1=1";
			const bindings: unknown[] = [];

			if (approved !== null) {
				query += " AND approved = ?";
				bindings.push(approved === "true" ? 1 : 0);
			}
			if (isKilled !== null) {
				query += " AND is_killed = ?";
				bindings.push(isKilled === "true" ? 1 : 0);
			}

			query += " ORDER BY published DESC, id DESC LIMIT ? OFFSET ?";
			bindings.push(limit, offset);

			const stmt = env.DB.prepare(query);
			const { results } = await stmt.bind(...bindings).all();
			const countStmt = env.DB.prepare("SELECT COUNT(*) as total FROM news");
			const countRow = await countStmt.first<{ total: number }>();

			return json({ data: results, total: countRow?.total ?? 0, page, limit });
		}

		// GET /api/news/:id
		const matchId = path.match(/^\/api\/news\/(\d+)$/);
		if (method === "GET" && matchId) {
			const id = parseInt(matchId[1]);
			const row = await env.DB.prepare("SELECT * FROM news WHERE id = ?").bind(id).first();
			if (!row) return json({ error: "Not found" }, 404);
			return json(row);
		}

		// POST /api/news — create
		if (method === "POST" && path === "/api/news") {
			const body = await request.json<{
				title: string;
				link?: string;
				description?: string;
				archive_link?: string;
				image?: string;
				is_killed?: boolean;
				approved?: boolean;
				published?: string;
			}>();

			if (!body.title) return json({ error: "title is required" }, 400);

			const { meta } = await env.DB.prepare(
				"INSERT INTO news (title, link, description, archive_link, image, is_killed, approved, published) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
			)
				.bind(
					body.title,
					body.link ?? null,
					body.description ?? null,
					body.archive_link ?? null,
					body.image ?? null,
					body.is_killed ? 1 : 0,
					body.approved ? 1 : 0,
					body.published ?? null,
				)
				.run();

			const created = await env.DB.prepare("SELECT * FROM news WHERE id = ?").bind(meta.last_row_id).first();
			return json(created, 201);
		}

		// PUT /api/news/:id — update
		if (method === "PUT" && matchId) {
			const id = parseInt(matchId[1]);
			const body = await request.json<Record<string, unknown>>();

			const allowed = ["title", "link", "description", "archive_link", "image", "is_killed", "approved", "published"];
			const fields = Object.keys(body).filter((k) => allowed.includes(k));
			if (fields.length === 0) return json({ error: "No valid fields to update" }, 400);

			const setClauses = fields.map((f) => `${f} = ?`).join(", ");
			const values = fields.map((f) => {
				const v = body[f];
				if (f === "is_killed" || f === "approved") return v ? 1 : 0;
				return v;
			});

			await env.DB.prepare(`UPDATE news SET ${setClauses} WHERE id = ?`)
				.bind(...values, id)
				.run();

			const updated = await env.DB.prepare("SELECT * FROM news WHERE id = ?").bind(id).first();
			if (!updated) return json({ error: "Not found" }, 404);
			return json(updated);
		}

		// DELETE /api/news/:id
		if (method === "DELETE" && matchId) {
			const id = parseInt(matchId[1]);
			const existing = await env.DB.prepare("SELECT id FROM news WHERE id = ?").bind(id).first();
			if (!existing) return json({ error: "Not found" }, 404);
			await env.DB.prepare("DELETE FROM news WHERE id = ?").bind(id).run();
			return json({ deleted: true });
		}

		// GET /api/stats
		if (method === "GET" && path === "/api/stats") {
			const [totalRes, killedRes] = await env.DB.batch([
				env.DB.prepare("SELECT COUNT(*) as count FROM news"),
				env.DB.prepare("SELECT COUNT(*) as count FROM news WHERE is_killed = 1"),
			]);
			return json({
				total: (totalRes.results[0] as { count: number }).count,
				killed: (killedRes.results[0] as { count: number }).count,
			});
		}

		return json({ error: "Not found" }, 404);
	},
};
