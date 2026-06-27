#!/usr/bin/env python3
"""
Beauticate body image restoration — Mac-side script.

For each pending article in .claude/body-image-queue.json:
  1. Find MDX image refs whose files are missing from public/content/
  2. Download them from beauticate.com/wp-content/uploads/YYYY/MM/<filename>
     (tries a window of months around the article's publication date)
  3. Falls back to scraping the live WordPress page if direct URL doesn't work
  4. Saves images to public/content/<category>/<subcategory>/<slug>/
  5. Marks article done in queue, commits and pushes in batches

Usage:
  pip3 install requests beautifulsoup4          # one-time setup
  cd ~/path/to/beauticate-website               # must run from repo root
  python3 scripts/restore-body-images-mac.py   # process up to MAX_PER_RUN articles
  python3 scripts/restore-body-images-mac.py --dry-run   # preview without downloading
  python3 scripts/restore-body-images-mac.py --max 50    # override article cap
  python3 scripts/restore-body-images-mac.py --no-push   # download only, no git push
"""

import json
import os
import re
import sys
import time
import subprocess
from datetime import datetime, timedelta
from pathlib import Path
from urllib.parse import urlparse, urljoin

try:
    import requests
except ImportError:
    sys.exit("Missing dep: pip3 install requests beautifulsoup4")

try:
    from bs4 import BeautifulSoup
    HAS_BS4 = True
except ImportError:
    HAS_BS4 = False
    print("Warning: beautifulsoup4 not installed — page-scrape fallback disabled")
    print("  pip3 install beautifulsoup4")

# ── Config ──────────────────────────────────────────────────────────────────

REPO_ROOT      = Path(__file__).parent.parent.resolve()
QUEUE_FILE     = REPO_ROOT / '.claude' / 'body-image-queue.json'
PUBLIC_CONTENT = REPO_ROOT / 'public' / 'content'
CONTENT_DIR    = REPO_ROOT / 'content'
WP_BASE        = 'https://www.beauticate.com'
WP_UPLOADS     = f'{WP_BASE}/wp-content/uploads'

BATCH_SIZE     = 15       # articles per git commit
MAX_PER_RUN    = 200      # safety cap; override with --max N
MONTH_WINDOW   = 3        # try ±N months around article date
REQUEST_DELAY  = 0.4      # seconds between HTTP requests (be polite)
TIMEOUT        = 25       # seconds per request
MIN_IMAGE_BYTES = 2000    # reject anything smaller (HTML error pages, etc.)

DRY_RUN  = '--dry-run'  in sys.argv
NO_PUSH  = '--no-push'  in sys.argv
VERBOSE  = '--verbose'  in sys.argv

for i, arg in enumerate(sys.argv[1:], 1):
    if arg == '--max' and i < len(sys.argv) - 1:
        MAX_PER_RUN = int(sys.argv[i + 1])

HEADERS = {
    'User-Agent': (
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) '
        'AppleWebKit/537.36 (KHTML, like Gecko) '
        'Chrome/125.0.0.0 Safari/537.36'
    ),
    'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
    'Accept-Language': 'en-AU,en;q=0.9',
    'Referer': WP_BASE + '/',
}

PAGE_HEADERS = {**HEADERS, 'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'}

# ── Helpers ──────────────────────────────────────────────────────────────────

def log(msg, indent=0):
    print('  ' * indent + msg)

def load_queue():
    return json.loads(QUEUE_FILE.read_text())

def save_queue(queue):
    QUEUE_FILE.write_text(json.dumps(queue, indent=2) + '\n')

def get_missing_refs(mdx_path: Path):
    """Return list of (local_url_path, public_dest_path) for image refs without files."""
    text = mdx_path.read_text(encoding='utf-8', errors='replace')
    # Only scan the body (after second ---)
    body_start = text.find('\n---', 3)
    body = text[body_start:] if body_start != -1 else text

    seen = set()
    missing = []
    for m in re.finditer(
        r'(/content/[^\s"\')\]]+\.(?:jpe?g|png|gif|webp))',
        body, re.IGNORECASE
    ):
        url_path = m.group(1)
        if url_path in seen:
            continue
        seen.add(url_path)
        public_path = REPO_ROOT / 'public' / url_path.lstrip('/')
        if not public_path.exists():
            missing.append((url_path, public_path))
    return missing

def candidate_urls(filename: str, article_date: str) -> list:
    """Build a list of CDN URLs to try for a given filename."""
    urls = []
    try:
        dt = datetime.strptime(article_date, '%Y-%m-%d')
    except (ValueError, TypeError):
        dt = datetime.now()

    # Try months in a window around the article date
    for delta_months in range(0, MONTH_WINDOW + 1):
        for sign in ([0] if delta_months == 0 else [1, -1]):
            offset = delta_months * sign
            target = dt + timedelta(days=30 * offset)
            year, month = target.year, target.month
            urls.append(f'{WP_UPLOADS}/{year}/{month:02d}/{filename}')

    # Also try without month prefix (some themes use flat uploads)
    urls.append(f'{WP_UPLOADS}/{filename}')
    return urls

def try_download(url: str, dest: Path) -> bool:
    """Attempt to download url to dest. Returns True if saved successfully."""
    try:
        resp = requests.get(url, headers=HEADERS, timeout=TIMEOUT, stream=True)
        if resp.status_code != 200:
            return False
        content_type = resp.headers.get('content-type', '')
        if 'text/html' in content_type:
            return False  # got an error page

        data = b''.join(resp.iter_content(8192))
        if len(data) < MIN_IMAGE_BYTES:
            return False  # too small — probably a 404 page

        if not DRY_RUN:
            dest.parent.mkdir(parents=True, exist_ok=True)
            dest.write_bytes(data)
        return True
    except Exception:
        return False

def scrape_wp_images(wp_url: str) -> list:
    """Fetch the live WordPress page and return all image URLs found in the body."""
    if not HAS_BS4:
        return []
    try:
        resp = requests.get(wp_url, headers=PAGE_HEADERS, timeout=TIMEOUT)
        resp.raise_for_status()
    except Exception as e:
        log(f'scrape failed: {e}', 2)
        return []

    soup = BeautifulSoup(resp.text, 'html.parser')
    body = (soup.find('article') or
            soup.find(class_=re.compile(r'entry-content|post-content')) or
            soup)

    urls = []
    for img in body.find_all('img'):
        for attr in ('src', 'data-src', 'data-lazy-src', 'data-original'):
            val = img.get(attr, '')
            if val and ('wp-content' in val or 'beauticate' in val):
                urls.append(val)
                break
        srcset = img.get('srcset', '') or img.get('data-srcset', '')
        for part in srcset.split(','):
            part = part.strip().split()[0]
            if part and 'wp-content' in part:
                urls.append(part)

    return list(dict.fromkeys(urls))

def find_url_by_filename(wp_images: list, target_filename: str):
    """Match a missing filename against a list of WordPress CDN URLs."""
    target_lower = target_filename.lower()
    # Normalize: strip size suffixes like -1024x768
    target_base = re.sub(r'-\d+x\d+', '', target_lower)
    # Strip the leading date part if present (e.g. 2022/04/)
    def normalize(url):
        bn = os.path.basename(urlparse(url).path).lower()
        return re.sub(r'-\d+x\d+', '', bn)

    exact = [u for u in wp_images if normalize(u) == target_base]
    if exact:
        # Prefer URLs without size suffix (likely originals)
        no_size = [u for u in exact if not re.search(r'-\d+x\d+', u)]
        return (no_size or exact)[0]
    return None

def current_branch() -> str:
    try:
        return subprocess.check_output(
            ['git', 'rev-parse', '--abbrev-ref', 'HEAD'],
            cwd=REPO_ROOT
        ).strip().decode()
    except Exception:
        return 'unknown'

def git_add_commit_push(files: list, message: str) -> bool:
    """Stage, commit, and push to origin/main. files is a list of Path objects."""
    rel_files = [str(f.relative_to(REPO_ROOT)) for f in files]
    branch = current_branch()
    try:
        subprocess.run(['git', 'add', '--'] + rel_files, cwd=REPO_ROOT, check=True)
        subprocess.run(['git', 'commit', '-m', message], cwd=REPO_ROOT, check=True)

        if NO_PUSH:
            log('  (--no-push: skipping git push)', 1)
            return True

        if branch in ('main', 'master'):
            # Direct push
            subprocess.run(['git', 'push', 'origin', branch], cwd=REPO_ROOT, check=True)
        else:
            # Push current branch, then cherry-pick to main
            subprocess.run(['git', 'push', '-u', 'origin', branch], cwd=REPO_ROOT, check=True)

            commit_hash = subprocess.check_output(
                ['git', 'rev-parse', 'HEAD'], cwd=REPO_ROOT
            ).strip().decode()

            subprocess.run(
                ['git', 'fetch', 'origin', 'main'],
                cwd=REPO_ROOT, check=True, capture_output=True
            )
            subprocess.run(
                ['git', 'checkout', '-b', '_tmp_img_main', 'origin/main'],
                cwd=REPO_ROOT, check=True, capture_output=True
            )
            subprocess.run(['git', 'cherry-pick', commit_hash], cwd=REPO_ROOT, check=True)
            subprocess.run(
                ['git', 'push', 'origin', '_tmp_img_main:main'],
                cwd=REPO_ROOT, check=True
            )
            subprocess.run(['git', 'checkout', branch], cwd=REPO_ROOT, capture_output=True)
            subprocess.run(
                ['git', 'branch', '-D', '_tmp_img_main'],
                cwd=REPO_ROOT, capture_output=True
            )
            log(f'  Pushed to origin/{branch} and origin/main', 1)

        return True
    except subprocess.CalledProcessError as e:
        # Clean up temp branch if it exists
        subprocess.run(
            ['git', 'checkout', branch], cwd=REPO_ROOT, capture_output=True
        )
        subprocess.run(
            ['git', 'branch', '-D', '_tmp_img_main'], cwd=REPO_ROOT, capture_output=True
        )
        log(f'Git error: {e}', 1)
        return False

# ── Main ─────────────────────────────────────────────────────────────────────

def process_article(entry: dict) -> tuple[list, bool]:
    """
    Download missing images for one article.
    Returns (downloaded_files, any_remaining_missing).
    """
    slug = entry['slug']
    mdx_rel = entry['mdx']
    wp_url = entry['wp_url']
    article_date = entry.get('date', '')

    mdx_path = REPO_ROOT / mdx_rel
    if not mdx_path.exists():
        log(f'MDX not found: {mdx_rel}', 2)
        return [], False

    missing = get_missing_refs(mdx_path)
    if not missing:
        return [], False

    log(f'Missing {len(missing)} file(s):', 2)

    downloaded = []
    wp_images_cache = None  # lazy-load page scrape

    for url_path, dest_path in missing:
        filename = Path(url_path).name
        log(f'  {filename}', 2)

        # Strategy 1: try direct CDN URL by date
        found = False
        for cdn_url in candidate_urls(filename, article_date):
            if VERBOSE:
                log(f'    trying {cdn_url}', 3)
            time.sleep(REQUEST_DELAY)
            if try_download(cdn_url, dest_path):
                size = dest_path.stat().st_size if not DRY_RUN else 0
                log(f'    ✓ direct  ({size//1024}KB)  {cdn_url.split("/wp-content/")[-1]}', 2)
                downloaded.append(dest_path)
                found = True
                break

        if found:
            continue

        # Strategy 2: scrape live page, find matching URL
        if wp_images_cache is None:
            log(f'  Scraping {wp_url} ...', 2)
            time.sleep(REQUEST_DELAY)
            wp_images_cache = scrape_wp_images(wp_url)
            log(f'  Found {len(wp_images_cache)} images on page', 2)

        matched_url = find_url_by_filename(wp_images_cache, filename)
        if matched_url:
            time.sleep(REQUEST_DELAY)
            if try_download(matched_url, dest_path):
                size = dest_path.stat().st_size if not DRY_RUN else 0
                log(f'    ✓ scraped ({size//1024}KB)  {filename}', 2)
                downloaded.append(dest_path)
                found = True

        if not found:
            log(f'    ✗ NOT FOUND: {filename}', 2)

    remaining_missing = len(downloaded) < len(missing)
    return downloaded, remaining_missing


def main():
    if not REPO_ROOT.joinpath('.git').exists():
        sys.exit(f'ERROR: Run this from the repo root. Current dir: {Path.cwd()}')

    queue = load_queue()
    pending = [e for e in queue if e.get('status') == 'pending']

    log(f'Queue:    {len(pending)} pending / {len(queue)} total')
    log(f'Mode:     {"DRY RUN — no files written, no commits" if DRY_RUN else "LIVE"}')
    log(f'Cap:      up to {MAX_PER_RUN} articles this run')
    log(f'Batching: commit every {BATCH_SIZE} articles')
    if not HAS_BS4:
        log('Warning:  no beautifulsoup4 — page-scrape fallback disabled')
    log('')

    processed_slugs = []
    all_downloaded = []
    skipped = 0
    total_images = 0

    for entry in pending[:MAX_PER_RUN]:
        slug = entry['slug']
        log(f'▶ {slug}')

        downloaded, still_missing = process_article(entry)
        total_images += len(downloaded)

        if not still_missing:
            entry['status'] = 'done'
        else:
            entry['status'] = 'partial'

        processed_slugs.append(slug)
        all_downloaded.extend(downloaded)

        # Commit batch
        if len(processed_slugs) >= BATCH_SIZE:
            log(f'\n── Committing batch of {len(processed_slugs)} articles ({len(all_downloaded)} images) ──')
            save_queue(queue)
            if not DRY_RUN:
                files = [QUEUE_FILE] + all_downloaded
                msg = (
                    f'restore body images: {len(processed_slugs)} articles, '
                    f'{len(all_downloaded)} images\n\n'
                    + '\n'.join(f'  {s}' for s in processed_slugs)
                )
                git_add_commit_push(files, msg)
            processed_slugs = []
            all_downloaded = []
            log('')

    # Final partial batch
    if processed_slugs:
        log(f'\n── Final batch: {len(processed_slugs)} articles, {len(all_downloaded)} images ──')
        save_queue(queue)
        if not DRY_RUN:
            files = [QUEUE_FILE] + all_downloaded
            msg = (
                f'restore body images: {len(processed_slugs)} articles, '
                f'{len(all_downloaded)} images\n\n'
                + '\n'.join(f'  {s}' for s in processed_slugs)
            )
            git_add_commit_push(files, msg)

    remaining = sum(1 for e in queue if e.get('status') == 'pending')
    partial   = sum(1 for e in queue if e.get('status') == 'partial')

    log('')
    log(f'Done.')
    log(f'  Images downloaded: {total_images}')
    log(f'  Articles pending:  {remaining}')
    log(f'  Articles partial:  {partial}')
    if partial:
        log(f'  Re-run to retry partial articles (some images not found this pass)')
    if DRY_RUN:
        log('')
        log('DRY RUN complete — no files written. Remove --dry-run to apply.')


if __name__ == '__main__':
    main()
