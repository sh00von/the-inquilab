import { execSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "playwright";

/**
 * Parallel Screenshot Generator for Bangladesh July Revolution Archive
 * Scrapes news source URLs, waits 2s for page render, and saves featured images.
 */

const SCREENSHOT_DIR = join(process.cwd(), "public", "screenshots");
const CONCURRENCY = parseInt(process.env.CONCURRENCY || "5", 10);
const DELAY_MS = 2000; // 2 seconds delay before screenshot as requested

if (!existsSync(SCREENSHOT_DIR)) {
	mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function fetchAllNews() {
	console.log("🔍 Loading article URLs...");

	// 1. Try parsing from migrations/0003_auto_ingest_news.sql first (Fast & offline)
	const sqlPath = join(process.cwd(), "migrations", "0003_auto_ingest_news.sql");
	if (existsSync(sqlPath)) {
		const sqlContent = readFileSync(sqlPath, "utf8");
		const lines = sqlContent.split("\n");
		const records = [];
		let id = 1;

		for (const line of lines) {
			if (!line.includes("VALUES")) continue;
			// Extract single-quoted parameters
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
		userAgent:
			"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
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

		// Skip if already captured
		if (existsSync(filepath)) {
			console.log(`[${index}/${total}] ⏩ ID ${item.id} already captured (${filename}).`);
			sqlStatements.push(`UPDATE news SET image = '${publicPath}' WHERE id = ${item.id};`);
			continue;
		}

		console.log(`[${index}/${total}] 📸 Capturing ID ${item.id}: ${targetUrl}`);

		try {
			// Navigate to target URL with timeout fallback
			await page.goto(targetUrl, {
				waitUntil: "domcontentloaded",
				timeout: 20000,
			}).catch(() => null);

			// Wait 2 seconds for full rendering/images/animations as requested
			await new Promise((resolve) => setTimeout(resolve, DELAY_MS));

			// Capture screenshot
			await page.screenshot({
				path: filepath,
				type: "jpeg",
				quality: 85,
				fullPage: false,
			});

			sqlStatements.push(`UPDATE news SET image = '${publicPath}' WHERE id = ${item.id};`);
			console.log(`[${index}/${total}] ✅ Saved screenshot: ${filename}`);
		} catch (err) {
			console.warn(`[${index}/${total}] ❌ Failed ID ${item.id} (${targetUrl}): ${err.message}`);
		}
	}

	await context.close();
}

async function run() {
	console.log("🚀 Starting Parallel Screenshot Scraping Script...");
	console.log(`⚙️ Concurrency: ${CONCURRENCY} parallel workers | Render Delay: ${DELAY_MS / 1000}s`);

	const newsItems = await fetchAllNews();
	console.log(`📋 Total records found: ${newsItems.length}`);

	if (newsItems.length === 0) {
		console.log("No items found to capture.");
		return;
	}

	const queue = [...newsItems];
	const sqlStatements = [];
	const progressState = { current: 0, total: newsItems.length };

	console.log("🌐 Launching Chromium browser instance...");
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
		console.log("💡 You can execute this migration on D1 using:");
		console.log("   npx wrangler d1 execute DB --local --file=migrations/0005_update_screenshots.sql");
		console.log("   npx wrangler d1 execute DB --remote --file=migrations/0005_update_screenshots.sql");
	}

	console.log("\n🎉 Screenshot scraping task completed successfully!");
}

run().catch((err) => {
	console.error("Fatal error:", err);
	process.exit(1);
});
