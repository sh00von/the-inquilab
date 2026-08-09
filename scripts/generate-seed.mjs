import { readFileSync, writeFileSync } from "node:fs";

const data = JSON.parse(readFileSync("C:/Users/Shovon/Downloads/news (1).json", "utf8"));

const lines = data.map((item) => {
	const escape = (v) => (v == null ? "NULL" : `'${String(v).replace(/'/g, "''")}'`);
	return `INSERT OR REPLACE INTO news (id, title, link, description, archive_link, image, is_killed, approved, published) VALUES (${item.id}, ${escape(item.title)}, ${escape(item.link)}, ${escape(item.description)}, ${escape(item.archive_link)}, ${escape(item.image)}, ${item.is_killed ? 1 : 0}, ${item.approved ? 1 : 0}, ${escape(item.published)});`;
});

writeFileSync("migrations/0002_seed_news.sql", lines.join("\n") + "\n", "utf8");
console.log(`Written ${data.length} rows`);
