import asyncio
import json
import os
import re
import sys
import urllib.request
from pathlib import Path

"""
Parallel Screenshot Scraping Script in Python (using Playwright Async)
- Parses URLs from database/migrations or API
- Opens pages with Playwright in parallel
- Waits 2 seconds after load
- Saves screenshots to public/screenshots/record-<id>.jpg
- Creates SQL migration file for DB featured images
"""

SCREENSHOT_DIR = Path.cwd() / "public" / "screenshots"
CONCURRENCY = int(os.getenv("CONCURRENCY", "5"))
DELAY_SECONDS = 2.0  # 2-second wait per prompt requirement

SCREENSHOT_DIR.mkdir(parents=True, exist_ok=True)

def fetch_all_news():
    print("🔍 Loading article URLs...")

    # 1. Parse from migrations/0003_auto_ingest_news.sql if exists
    sql_path = Path.cwd() / "migrations" / "0003_auto_ingest_news.sql"
    if sql_path.exists():
        records = []
        with open(sql_path, "r", encoding="utf-8") as f:
            for idx, line in enumerate(f, start=1):
                if "VALUES" not in line:
                    continue
                matches = re.findall(r"'([^'\\]*(?:\\.[^'\\]*)*)'", line)
                if len(matches) >= 4:
                    title = matches[0].replace("''", "'")
                    link = matches[1]
                    archive_link = matches[3]
                    records.append({"id": idx, "title": title, "link": link, "archive_link": archive_link})
        if records:
            print(f"✅ Loaded {len(records)} records from migration SQL file.")
            return records

    # 2. Fallback to API
    api_url = os.getenv("API_ENDPOINT", "https://the-inquilab.minar-svn.workers.dev/api/news?limit=1000&page=1")
    try:
        req = urllib.request.Request(api_url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            return data.get("data", [])
    except Exception as e:
        print(f"⚠️ API fetch failed: {e}")
        return []

async def worker(queue, browser, sql_statements, total_count, progress_counter):
    context = await browser.new_context(
        viewport={"width": 1280, "height": 720},
        user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
    )
    page = await context.new_page()

    while not queue.empty():
        item = await queue.get()
        progress_counter[0] += 1
        idx = progress_counter[0]
        
        target_url = item.get("link") or item.get("archive_link")
        item_id = item.get("id")

        if not target_url or not item_id:
            queue.task_done()
            continue

        filename = f"record-{item_id}.jpg"
        filepath = SCREENSHOT_DIR / filename
        public_path = f"/screenshots/{filename}"

        if filepath.exists():
            print(f"[{idx}/{total_count}] ⏩ ID {item_id} already exists.")
            sql_statements.append(f"UPDATE news SET image = '{public_path}' WHERE id = {item_id};")
            queue.task_done()
            continue

        print(f"[{idx}/{total_count}] 📸 Capturing ID {item_id}: {target_url}")
        try:
            try:
                await page.goto(target_url, wait_until="domcontentloaded", timeout=20000)
            except Exception:
                pass

            # Wait 2 seconds for render as requested
            await asyncio.sleep(DELAY_SECONDS)

            await page.screenshot(path=str(filepath), type="jpeg", quality=85)
            sql_statements.append(f"UPDATE news SET image = '{public_path}' WHERE id = {item_id};")
            print(f"[{idx}/{total_count}] ✅ Saved: {filename}")
        except Exception as err:
            print(f"[{idx}/{total_count}] ❌ Failed ID {item_id}: {err}")
        finally:
            queue.task_done()

    await context.close()

async def main():
    try:
        from playwright.async_api import async_playwright
    except ImportError:
        print("⚠️ Playwright for Python is not installed. Install it via:")
        print("   pip install playwright && playwright install chromium")
        sys.exit(1)

    print("🚀 Starting Parallel Python Screenshot Scraper...")
    items = fetch_all_news()
    total_count = len(items)
    print(f"📋 Total records: {total_count}")

    if not items:
        print("No items found.")
        return

    queue = asyncio.Queue()
    for item in items:
        await queue.put(item)

    sql_statements = []
    progress_counter = [0]

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        workers = [
            asyncio.create_task(worker(queue, browser, sql_statements, total_count, progress_counter))
            for _ in range(CONCURRENCY)
        ]

        await queue.join()
        for w in workers:
            w.cancel()
        await browser.close()

    if sql_statements:
        sql_path = Path.cwd() / "migrations" / "0005_update_screenshots.sql"
        sql_path.parent.mkdir(parents=True, exist_ok=True)
        with open(sql_path, "w", encoding="utf-8") as f:
            f.write("\n".join(sql_statements))
        print(f"\n📄 Saved SQL migration: {sql_path}")

    print("🎉 All screenshots captured!")

if __name__ == "__main__":
    asyncio.run(main())
