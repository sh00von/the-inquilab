import { readFileSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";

/**
 * Script to audit all 540+ news titles in D1 database, filter out
 * off-topic, irrelevant, or low-quality articles, and clean both local and remote D1 databases.
 */

// Keywords that indicate relevance to the Bangladesh July-August 2024 Mass Uprising
const RELEVANT_KEYWORDS = [
	"bangladesh", "dhaka", "sheikh hasina", "hasina", "yunus", "protest", "quota",
	"uprising", "revolution", "martyr", "killed", "death", "death toll", "police",
	"chhatra league", "bcl", "aynaghar", "detention", "ict", "tribunal", "arrest",
	"curfew", "internet", "shahbagh", "interim", "adviser", "rangpur", "abu sayed",
	"mugdho", "student", "bnp", "jamaat", "army", "general", "resignation", "flee",
	"নিহত", "মৃত্যু", "কোটা", "আন্দোলন", "ছাত্রলীগ", "পুলিশ", "শহীদ", "হাসিনা", "আওয়ামী"
];

// Keywords that indicate off-topic / irrelevant news
const IRRELEVANT_KEYWORDS = [
	"ipl", "cricket", "world cup", "champions trophy", "bollywood", "hollywood",
	"box office", "fashion", "recipe", "horoscope", "stock market", "crypto",
	"bitcoin", "iphone", "samsung", "premier league", "la liga", "tennis", "golf"
];

function isRelevant(title, description) {
	const text = `${title} ${description}`.toLowerCase();

	// If contains off-topic keywords, mark irrelevant
	if (IRRELEVANT_KEYWORDS.some((k) => text.includes(k))) return false;

	// Check if title has minimum length (avoid junk fragments)
	if (title.trim().length < 15) return false;

	// Must match at least one relevant keyword
	return RELEVANT_KEYWORDS.some((k) => text.includes(k));
}

async function auditDatabase() {
	console.log("🔍 Querying all news records from remote D1 database...");
	const rawOutput = execSync(
		'npx wrangler d1 execute DB --remote --command="SELECT id, title, description FROM news ORDER BY id ASC;" --json',
		{ encoding: "utf8" }
	);

	const parsed = JSON.parse(rawOutput);
	const rows = parsed[0]?.results || [];
	console.log(`Total records found in DB: ${rows.length}`);

	const toKeep = [];
	const toDeleteIds = [];

	for (const row of rows) {
		if (isRelevant(row.title, row.description)) {
			toKeep.push(row);
		} else {
			toDeleteIds.push(row.id);
			console.log(`❌ Removing irrelevant/inconsistent ID ${row.id}: "${row.title}"`);
		}
	}

	console.log(`\nAudit Complete: ${toKeep.length} relevant articles kept, ${toDeleteIds.length} irrelevant items flagged for deletion.`);

	if (toDeleteIds.length > 0) {
		const idChunks = [];
		for (let i = 0; i < toDeleteIds.length; i += 50) {
			idChunks.push(toDeleteIds.slice(i, i + 50));
		}

		console.log(`Deleting ${toDeleteIds.length} items from local & remote DB...`);
		for (const chunk of idChunks) {
			const idList = chunk.join(",");
			const sql = `DELETE FROM news WHERE id IN (${idList});`;
			
			// Execute on local
			execSync(`npx wrangler d1 execute DB --local --command="${sql}"`);
			// Execute on remote
			execSync(`npx wrangler d1 execute DB --remote --command="${sql}"`);
		}
		console.log("✅ Database cleanup complete!");
	}
}

auditDatabase().catch((err) => console.error(err));
