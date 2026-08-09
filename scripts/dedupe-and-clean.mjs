import { execSync } from "node:child_process";

/**
 * Deduplication and Inconsistency Cleanup Script for Cloudflare D1
 */

function normalizeTitle(t) {
	if (!t) return "";
	return t
		.toLowerCase()
		.replace(/https?:\/\/\S+/g, "") // strip URLs
		.replace(/\s*-\s*(daily-sun|prothomalo|thedailystar|dhakatribune|tbsnews|bbc|aljazeera|newagebd|bd-pratidin).*$/i, "") // strip source suffixes
		.replace(/[^\w\s\u0980-\u09FF]/g, "") // keep letters/digits & Bengali unicode
		.replace(/\s+/g, " ")
		.trim();
}

const OFF_TOPIC_TERMS = [
	"ipl", "cricket", "world cup", "football", "tennis", "bollywood", "hollywood",
	"recipe", "fashion", "horoscope", "stock market", "bitcoin", "crypto"
];

async function dedupeAndClean() {
	console.log("🔍 Fetching all records from remote D1 database...");
	const rawOutput = execSync(
		`npx wrangler d1 execute DB --remote --command="SELECT id, title, description, link FROM news ORDER BY id ASC;" --json`,
		{ encoding: "utf8" }
	);

	const parsed = JSON.parse(rawOutput);
	const rows = parsed[0]?.results || [];

	console.log(`Analyzing ${rows.length} records for duplicates and inconsistencies...`);

	const seenTitles = new Map();
	const duplicateIds = [];
	const offTopicIds = [];

	for (const row of rows) {
		const titleLower = (row.title || "").toLowerCase();

		// Check off-topic
		if (OFF_TOPIC_TERMS.some((term) => titleLower.includes(term))) {
			offTopicIds.push(row.id);
			console.log(`❌ Off-topic ID ${row.id}: "${row.title}"`);
			continue;
		}

		// Check normalized title for duplicates
		const norm = normalizeTitle(row.title);
		if (!norm || norm.length < 10) {
			offTopicIds.push(row.id);
			console.log(`❌ Low quality title ID ${row.id}: "${row.title}"`);
			continue;
		}

		if (seenTitles.has(norm)) {
			duplicateIds.push(row.id);
			const originalId = seenTitles.get(norm);
			console.log(`🔄 Duplicate ID ${row.id} (matches ID ${originalId}): "${row.title.slice(0, 45)}..."`);
		} else {
			seenTitles.set(norm, row.id);
		}
	}

	const toDelete = [...new Set([...duplicateIds, ...offTopicIds])];

	console.log(`\nFound ${duplicateIds.length} duplicate records and ${offTopicIds.length} inconsistent/off-topic records.`);
	console.log(`Total records flagged for removal: ${toDelete.length}`);

	if (toDelete.length === 0) {
		console.log("✅ Database is 100% clean of duplicates and inconsistencies!");
		return;
	}

	const idList = toDelete.join(",");
	const sql = `DELETE FROM news WHERE id IN (${idList});`;

	console.log("⚡ Deleting flagged records from local D1 database...");
	execSync(`npx wrangler d1 execute DB --local --command="${sql}"`);

	console.log("⚡ Deleting flagged records from remote D1 database...");
	execSync(`npx wrangler d1 execute DB --remote --command="${sql}"`);

	console.log(`\n✅ Cleaned ${toDelete.length} duplicate/inconsistent records across local & remote D1 databases!`);
}

dedupeAndClean().catch((err) => console.error(err));
