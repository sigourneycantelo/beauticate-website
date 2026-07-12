#!/bin/bash
# Full-site audit scraper — scrapes both WP and Vercel pages via Firecrawl
# Usage: bash scripts/audit-full-site-scrape.sh [start_index] [batch_size]
#
# Reads data/audit-urls.json and scrapes each article from both WordPress
# and Vercel, saving markdown+links JSON to .firecrawl/wp/ and .firecrawl/vercel/.
# Resumable: skips articles that already have output files.

set -e

cd "$(dirname "$0")/.."

START=${1:-0}
BATCH=${2:-20}
TOTAL=$(python3 -c "import json; print(len(json.load(open('data/audit-urls.json'))))")

echo "=== Full Site Audit Scrape ==="
echo "Total articles: $TOTAL"
echo "Starting from: $START"
echo "Batch size: $BATCH"
echo ""

mkdir -p .firecrawl/wp .firecrawl/vercel

# Generate batch URLs
python3 << PYEOF
import json, sys

with open('data/audit-urls.json') as f:
    articles = json.load(f)

start = $START
batch = $BATCH
end = min(start + batch, len(articles))

wp_urls = []
vercel_urls = []
skipped = 0

for i in range(start, end):
    a = articles[i]
    slug = a['slug']
    wp_out = f".firecrawl/wp/{slug}.json"
    vercel_out = f".firecrawl/vercel/{slug}.json"

    import os
    if os.path.exists(wp_out) and os.path.exists(vercel_out):
        skipped += 1
        continue

    if not os.path.exists(wp_out):
        wp_urls.append((a['wp_url'], wp_out))
    if not os.path.exists(vercel_out):
        vercel_urls.append((a['vercel_url'], vercel_out))

print(f"Batch {start}-{end}: {len(wp_urls)} WP + {len(vercel_urls)} Vercel scrapes ({skipped} already done)")

# Write URL lists for shell to process
with open('/tmp/audit-wp-urls.txt', 'w') as f:
    for url, out in wp_urls:
        f.write(f"{url}\t{out}\n")

with open('/tmp/audit-vercel-urls.txt', 'w') as f:
    for url, out in vercel_urls:
        f.write(f"{url}\t{out}\n")
PYEOF

# Scrape WP URLs
if [ -s /tmp/audit-wp-urls.txt ]; then
    echo "Scraping WordPress pages..."
    WP_URLS=$(cut -f1 /tmp/audit-wp-urls.txt | tr '\n' ' ')
    firecrawl scrape $WP_URLS --only-main-content --format markdown,links 2>&1 | tail -3

    # Move outputs to correct filenames
    # firecrawl saves to .firecrawl/ with auto-generated names, we need to rename
fi

# Scrape Vercel URLs
if [ -s /tmp/audit-vercel-urls.txt ]; then
    echo "Scraping Vercel pages..."
    VERCEL_URLS=$(cut -f1 /tmp/audit-vercel-urls.txt | tr '\n' ' ')
    firecrawl scrape $VERCEL_URLS --only-main-content --format markdown,links 2>&1 | tail -3
fi

echo ""
echo "Next batch: bash scripts/audit-full-site-scrape.sh $((START + BATCH)) $BATCH"
