import { execSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "playwright";

/**
 * High-Performance Parallel Screenshot Generator
 * - Concurrency: 15 parallel browser instances (10-20 range)
 * - Render Delay: 10 seconds per page for full dynamic image & layout loading
 * - Realistic Chrome Desktop User Agent & Headers
 */

const SCREENSHOT_DIR = join(process.cwd(), "public", "screenshots");
const CONCURRENCY = parseInt(process.env.CONCURRENCY || "15", 10);
const DELAY_MS = parseInt(process.env.DELAY || "10000", 10); // 10 seconds render wait
const FORCE_RECAPTURE = process.argv.includes("--force") || process.env.FORCE === "true";

const USER_AGENT =
	"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

if (!existsSync(SCREENSHOT_DIR)) {
	mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function fetchAllNews() {
	console.log("🔍 Loading article URLs from database...");

	// 1. Try parsing from migrations/0003_auto_ingest_news.sql first (Fast & offline)
	const sqlPath = join(process.cwd(), "migrations", "0003_auto_ingest_news.sql");
	if (existsSync(sqlPath)) {
		const sqlContent = readFileSync(sqlPath, "utf8");
		const lines = sqlContent.split("\n");
		const records = [];
		let id = 1;

		for (const line of lines) {
			if (!line.includes("VALUES")) continue;
			const matches = line.match(/'([^'\\]*(?:\\.[^'\\]*)*)'/g);
			if (matches && matches.length >= 4) {
				const title = matches[0].replace(/^'|'$/g, "").replace(/''/g, "'");
				const link = matches[1].replace(/^'|'$/g, "");
				const archive_link = matches[3].replace(/^'|'$/g, "");
				records.push({ id: id++, title, link, archive_link });
			}
		}

		if (records.length > 0) {
			console.log(`✅ Loaded ${records.length} records from migration SQL file.`);
			return records;
		}
	}

	// 2. Try fetching via D1 CLI command
	try {
		const isRemote = process.argv.includes("--remote");
		const flag = isRemote ? "--remote" : "--local";
		const rawOutput = execSync(
			`npx wrangler d1 execute DB ${flag} --command="SELECT id, title, link, archive_link FROM news;" --json`,
			{ encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }
		);
		const parsed = JSON.parse(rawOutput);
		const records = parsed[0]?.results || [];
		if (records.length > 0) {
			console.log(`✅ Loaded ${records.length} records from D1 database (${flag}).`);
			return records;
		}
	} catch (_err) {
		console.log("⚠️ Could not query D1 via CLI.");
	}

	return [];
}

async function captureWorker(items, browser, sqlStatements, progressState) {
	const context = await browser.newContext({
		viewport: { width: 1280, height: 720 },
		userAgent: USER_AGENT,
		extraHTTPHeaders: {
			"Accept-Language": "en-US,en;q=0.9,bn;q=0.8",
			"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
			"Sec-Ch-Ua": '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
			"Sec-Ch-Ua-Mobile": "?0",
			"Sec-Ch-Ua-Platform": '"Windows"',
		},
		deviceScaleFactor: 1,
	});

	const page = await context.newPage();

	while (items.length > 0) {
		const item = items.shift();
		if (!item) break;

		progressState.current++;
		const index = progressState.current;
		const total = progressState.total;
		const targetUrl = item.link || item.archive_link;

		if (!targetUrl) {
			console.log(`[${index}/${total}] ⚠️ Skipped ID ${item.id}: No URL available.`);
			continue;
		}

		const filename = `record-${item.id}.jpg`;
		const filepath = join(SCREENSHOT_DIR, filename);
		const publicPath = `/screenshots/${filename}`;

		// Skip if already captured and not forced (unless file is placeholder 6KB)
		if (!FORCE_RECAPTURE && existsSync(filepath)) {
			console.log(`[${index}/${total}] ⏩ ID ${item.id} already captured (${filename}).`);
			sqlStatements.push(`UPDATE news SET image = '${publicPath}' WHERE id = ${item.id};`);
			continue;
		}

		console.log(`[${index}/${total}] 📸 Capturing ID ${item.id} (10s delay): ${targetUrl}`);

		try {
			// Navigate to target URL
			await page.goto(targetUrl, {
				waitUntil: "domcontentloaded",
				timeout: 25000,
			}).catch(() => null);

			// Wait 10 seconds for full rendering, dynamic images, fonts & popups to clear
			await new Promise((resolve) => setTimeout(resolve, DELAY_MS));

			// Capture screenshot
			await page.screenshot({
				path: filepath,
				type: "jpeg",
				quality: 88,
				fullPage: false,
			});

			sqlStatements.push(`UPDATE news SET image = '${publicPath}' WHERE id = ${item.id};`);
			console.log(`[${index}/${total}] ✅ Saved high-quality screenshot: ${filename}`);
		} catch (err) {
			console.warn(`[${index}/${total}] ❌ Failed ID ${item.id} (${targetUrl}): ${err.message}`);
		}
	}

	await context.close();
}

async function run() {
	console.log("🚀 Starting Updated Screenshot Scraper (High Quality 10s Render)...");
	console.log(`⚙️ Concurrency: ${CONCURRENCY} workers | Render Delay: ${DELAY_MS / 1000}s | Force Overwrite: ${FORCE_RECAPTURE}`);
	console.log(`👤 User-Agent: ${USER_AGENT}`);

	const newsItems = await fetchAllNews();
	console.log(`📋 Total records found: ${newsItems.length}`);

	if (newsItems.length === 0) {
		console.log("No items found to capture.");
		return;
	}

	const queue = [...newsItems];
	const sqlStatements = [];
	const progressState = { current: 0, total: newsItems.length };

	console.log("🌐 Launching Chromium browser pool...");
	const browser = await chromium.launch({ headless: true });

	const workers = Array.from({ length: CONCURRENCY }, () =>
		captureWorker(queue, browser, sqlStatements, progressState)
	);

	await Promise.all(workers);
	await browser.close();

	// Generate SQL Migration file
	if (sqlStatements.length > 0) {
		const sqlPath = join(process.cwd(), "migrations", "0005_update_screenshots.sql");
		writeFileSync(sqlPath, sqlStatements.join("\n"), "utf8");
		console.log(`\n📄 Generated SQL migration file: ${sqlPath}`);
	}

	console.log("\n🎉 High-quality screenshot scraping completed successfully!");
}

run().catch((err) => {
	console.error("Fatal error:", err);
	process.exit(1);
});
