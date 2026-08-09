import { readFileSync, writeFileSync, existsSync } from "node:fs";

/**
 * Automated Bulk News Ingestion Script for the-inquilab
 */

const API_ENDPOINT = process.env.API_ENDPOINT || "http://127.0.0.1:8787/api/news";

function escapeSql(v) {
	if (v == null) return "NULL";
	return `'${String(v).replace(/'/g, "''")}'`;
}

function cleanHtmlText(str) {
	if (!str) return "";
	let text = String(str);

	// Decode HTML entities
	text = text
		.replace(/&amp;/gi, "&")
		.replace(/&lt;/gi, "<")
		.replace(/&gt;/gi, ">")
		.replace(/&quot;/gi, '"')
		.replace(/&#39;/gi, "'")
		.replace(/&nbsp;/gi, " ")
		.replace(/&rsquo;/gi, "'")
		.replace(/&lsquo;/gi, "'")
		.replace(/&rdquo;/gi, '"')
		.replace(/&ldquo;/gi, '"')
		.replace(/&ndash;/gi, "-")
		.replace(/&mdash;/gi, "—");

	// Strip raw HTML tags (e.g. <a href=...>, <font...>)
	text = text.replace(/<[^>]+>/g, "");

	// Collapse extra whitespace
	text = text.replace(/\s+/g, " ").trim();

	return text;
}

function detectIsKilled(title, description) {
	const text = `${title} ${description}`.toLowerCase();
	const keywords = [
		"killed", "death", "died", "fatality", "fatalities", "dead", "slain",
		"shot dead", "martyr", "bodies", "murdered", "casualty", "casualties",
		"নিহত", "মৃত্যু", "লাশ", "গুলিবিদ্ধ", "শহীদ", "প্রাণহানি", "মৃত", "হত্যা"
	];
	return keywords.some((k) => text.includes(k));
}

function extractDateFromUrlOrText(url, html, getMeta) {
	const rawDate =
		getMeta("article:published_time") ||
		getMeta("date") ||
		getMeta("pubdate") ||
		getMeta("og:pubdate");

	if (rawDate) {
		const match = rawDate.match(/(\d{4}-\d{2}-\d{2})/);
		if (match) return match[1];
	}

	const urlMatch = url.match(/\/(2024[-/]\d{2}[-/]\d{2})\//) || url.match(/(2024-\d{2}-\d{2})/);
	if (urlMatch) {
		return urlMatch[1].replace(/\//g, "-");
	}

	const jsonLdMatch = html.match(/"datePublished"\s*:\s*"(\d{4}-\d{2}-\d{2})/i);
	if (jsonLdMatch) return jsonLdMatch[1];

	return new Date().toISOString().split("T")[0];
}

async function fetchMetadata(url) {
	try {
		console.log(`🔍 Processing: ${url}`);
		const res = await fetch(url, {
			headers: {
				"User-Agent":
					"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
			},
		});

		if (!res.ok) {
			console.warn(`⚠️ Failed to fetch ${url}: HTTP ${res.status}`);
			return null;
		}

		const html = await res.text();

		const getMeta = (property) => {
			const match =
				html.match(
					new RegExp(
						`<meta\\s+(?:property|name)=["']${property}["']\\s+content=["'](.*?)["']`,
						"i",
					),
				) ||
				html.match(
					new RegExp(
						`<meta\\s+content=["'](.*?)["']\\s+(?:property|name)=["']${property}["']`,
						"i",
					),
				);
			return match ? match[1].trim() : null;
		};

		const rawTitle =
			getMeta("og:title") ||
			getMeta("twitter:title") ||
			html.match(/<title>(.*?)<\/title>/i)?.[1]?.trim() ||
			"";

		const title = cleanHtmlText(
			rawTitle
				.replace(/\s*\|.*$/, "")
				.replace(/\s*- (Prothom Alo|The Daily Star|BBC News|Al Jazeera|Dhaka Tribune|The Business Standard|New Age|The Daily Campus).*$/i, ""),
		);

		const image = getMeta("og:image") || getMeta("twitter:image") || "";
		const description = cleanHtmlText(
			getMeta("og:description") || getMeta("description") || "",
		);

		const published = extractDateFromUrlOrText(url, html, getMeta);
		const is_killed = detectIsKilled(title, description);

		const archive_link = `https://web.archive.org/save/${url}`;

		return {
			title,
			link: url,
			description,
			archive_link,
			image,
			is_killed,
			approved: true,
			published,
		};
	} catch (err) {
		console.error(`❌ Error processing ${url}:`, err.message);
		return null;
	}
}

async function parseRssFeed(feedUrl) {
	console.log(`📡 Fetching RSS Feed: ${feedUrl}`);
	try {
		const res = await fetch(feedUrl, {
			headers: {
				"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
			},
		});
		if (!res.ok) {
			console.warn(`Failed to fetch RSS: HTTP ${res.status}`);
			return [];
		}
		const xml = await res.text();

		const itemMatches = xml.match(/<item>[\s\S]*?<\/item>/gi) || [];
		const items = [];

		for (const itemXml of itemMatches) {
			const getXmlTag = (tag) => {
				const match = itemXml.match(new RegExp(`<${tag}>(.*?)</${tag}>`, "is"));
				return match ? match[1].replace(/<!\[CDATA\[(.*?)\]\]>/gs, "$1").trim() : "";
			};

			const rawTitle = cleanHtmlText(getXmlTag("title"));
			const link = getXmlTag("link");
			const rawDesc = getXmlTag("description");
			const description = cleanHtmlText(rawDesc);
			const pubDate = getXmlTag("pubDate");
			const imageMatch = itemXml.match(/url=["'](.*?\.(?:jpg|jpeg|png|webp))["']/i) || itemXml.match(/src=["'](.*?\.(?:jpg|jpeg|png|webp))["']/i);
			const image = imageMatch ? imageMatch[1] : "";

			// Clean title from source name suffix
			const title = rawTitle.replace(/\s*- [^-]+$/, "").trim();

			if (title && link) {
				let published = new Date().toISOString().split("T")[0];
				if (pubDate) {
					try {
						published = new Date(pubDate).toISOString().split("T")[0];
					} catch {
						published = new Date().toISOString().split("T")[0];
					}
				}

				items.push({
					title,
					link,
					description: description || title,
					archive_link: `https://web.archive.org/save/${link}`,
					image,
					is_killed: detectIsKilled(title, description),
					approved: true,
					published,
				});
			}
		}
		console.log(`  └─ Extracted ${items.length} items from RSS Feed`);
		return items;
	} catch (err) {
		console.error(`Error parsing RSS feed ${feedUrl}:`, err.message);
		return [];
	}
}

async function saveToSqlMigration(items, filename = "migrations/0003_auto_ingest_news.sql") {
	// Deduplicate by title
	const uniqueMap = new Map();
	for (const item of items) {
		if (item.title && !uniqueMap.has(item.title.toLowerCase())) {
			uniqueMap.set(item.title.toLowerCase(), item);
		}
	}
	const uniqueItems = Array.from(uniqueMap.values());

	const lines = uniqueItems.map(
		(item) =>
			`INSERT OR IGNORE INTO news (title, link, description, archive_link, image, is_killed, approved, published) VALUES (${escapeSql(
				item.title,
			)}, ${escapeSql(item.link)}, ${escapeSql(item.description)}, ${escapeSql(
				item.archive_link,
			)}, ${escapeSql(item.image)}, ${item.is_killed ? 1 : 0}, ${
				item.approved ? 1 : 0
			}, ${escapeSql(item.published)});`,
	);

	writeFileSync(filename, lines.join("\n") + "\n", "utf8");
	console.log(`\n✅ Generated SQL migration with ${uniqueItems.length} unique news items: ${filename}`);
	return uniqueItems;
}

async function postToApi(items) {
	let successCount = 0;
	for (const item of items) {
		try {
			const res = await fetch(API_ENDPOINT, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(item),
			});
			if (res.ok) successCount++;
		} catch (err) {
			console.error(`Failed to post to API: ${err.message}`);
		}
	}
	console.log(`\n🚀 Successfully posted ${successCount}/${items.length} news items to API (${API_ENDPOINT})`);
}

async function main() {
	const args = process.argv.slice(2);
	const items = [];

	if (args.includes("--presets")) {
		console.log("🌐 Running Preset Multi-RSS Feed Ingestion for Bangladesh July Uprising...\n");
		const feeds = [
			"https://news.google.com/rss/search?q=Bangladesh+July+uprising+protest&hl=en-US&gl=US&ceid=US:en",
			"https://news.google.com/rss/search?q=Bangladesh+quota+protest+martyr+killed&hl=en-US&gl=US&ceid=US:en",
			"https://news.google.com/rss/search?q=Bangladesh+Awami+League+arrest+minister&hl=en-US&gl=US&ceid=US:en",
			"https://news.google.com/rss/search?q=Bangladesh+Aynaghar+detention+center&hl=en-US&gl=US&ceid=US:en",
			"https://news.google.com/rss/search?q=International+Crimes+Tribunal+Sheikh+Hasina&hl=en-US&gl=US&ceid=US:en",
			"https://news.google.com/rss/search?q=Bangladesh+Muhammad+Yunus+interim+government&hl=en-US&gl=US&ceid=US:en"
		];

		for (const feed of feeds) {
			const feedItems = await parseRssFeed(feed);
			items.push(...feedItems);
		}
	} else if (args.includes("--rss")) {
		const rssIndex = args.indexOf("--rss");
		const feedUrl = args[rssIndex + 1];
		if (feedUrl) {
			const rssItems = await parseRssFeed(feedUrl);
			items.push(...rssItems);
		}
	} else {
		let urls = args.filter((arg) => arg.startsWith("http"));

		if (urls.length === 0 && existsSync("links.txt")) {
			console.log("Reading URLs from links.txt...");
			urls = readFileSync("links.txt", "utf8")
				.split(/\r?\n/)
				.map((l) => l.trim())
				.filter((l) => l.startsWith("http") && !l.startsWith("#"));
		}

		if (urls.length === 0) {
			console.log("Usage:");
			console.log("  1. Preset Bulk Feeds: node scripts/ingest-news.mjs --presets");
			console.log("  2. Parse Single RSS Feed: node scripts/ingest-news.mjs --rss <feed-url>");
			console.log("  3. Pass URLs directly: node scripts/ingest-news.mjs <url1> <url2> ...");
			process.exit(0);
		}

		console.log(`Starting automated ingestion for ${urls.length} URLs...\n`);

		for (const url of urls) {
			const meta = await fetchMetadata(url);
			if (meta && meta.title) items.push(meta);
		}
	}

	if (items.length > 0) {
		const uniqueItems = await saveToSqlMigration(items);

		if (args.includes("--post")) {
			await postToApi(uniqueItems);
		}
	} else {
		console.log("No valid news items extracted.");
	}
}

main();
