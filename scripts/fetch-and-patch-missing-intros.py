#!/usr/bin/env python3
"""
Second-pass intro fetcher + patcher for the ~396 articles that still start
with an h2 heading (first pass either failed to fetch or captured full-page HTML).

Run on your local Mac (where beauticate.com is accessible):

    python3 scripts/fetch-and-patch-missing-intros.py [--dry-run]

For each article still missing an intro it:
  1. Fetches the live WordPress page
  2. Extracts ONLY the first 1-3 paragraphs before the first h2/h3 (strict)
  3. Falls back to the MDX excerpt field if no clean text found
  4. Patches the MDX file with the intro
  5. Also checks for body images missing locally and downloads them

Commit after: git add content/ && git commit -m "feat: second-pass intros" && git push
"""

import html as html_mod
import json
import os
import re
import sys
import time
import urllib.request
import urllib.error
from pathlib import Path
from typing import Optional

CONTENT_DIR = Path(__file__).parent.parent / 'content'
BASE_URL = 'https://www.beauticate.com'
DELAY = 1.0
TIMEOUT = 15
DRY_RUN = '--dry-run' in sys.argv
MAX_INTRO_CHARS = 600   # hard cap — anything longer is a bad capture
MAX_PARAS = 3           # take at most 3 paragraphs

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    'Accept': 'text/html,application/xhtml+xml',
}


# ── helpers ────────────────────────────────────────────────────────────────────────────

def fetch_html(url: str) -> Optional[str]:
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=TIMEOUT) as r:
            charset = r.headers.get_content_charset() or 'utf-8'
            return r.read().decode(charset, errors='replace')
    except urllib.error.HTTPError as e:
        if e.code == 404:
            return None
        print(f'  HTTP {e.code}', file=sys.stderr)
        return None
    except Exception as e:
        print(f'  Error: {e}', file=sys.stderr)
        return None


def narrow_to_body(html: str) -> str:
    """Return just the article body HTML, or full HTML if nothing matched."""
    for pattern in [
        r'<div[^>]+class="[^"]*entry-content[^"]*"[^>]*>(.*?)</div>\s*</article',
        r'<div[^>]+class="[^"]*post-content[^"]*"[^>]*>(.*?)</div>',
        r'<article[^>]*>(.*?)</article>',
    ]:
        m = re.search(pattern, html, re.DOTALL | re.IGNORECASE)
        if m:
            return m.group(1)
    return html


def extract_intro_strict(html: str) -> str:
    """
    Extract at most MAX_PARAS short paragraphs before the first h2/h3.
    Returns '' if nothing usable found.
    """
    body = narrow_to_body(html)

    # Cut off at first h2 or h3
    heading_m = re.search(r'<h[23][\s>]', body, re.IGNORECASE)
    if heading_m:
        before = body[:heading_m.start()]
    else:
        before = body

    # Extract <p> text only (no captions, no divs)
    raw_paras = re.findall(r'<p[^>]*>(.*?)</p>', before, re.IGNORECASE | re.DOTALL)
    parts = []
    for p in raw_paras[:MAX_PARAS * 2]:   # look at a few extra to skip empties
        t = re.sub(r'<[^>]+>', ' ', p)
        t = html_mod.unescape(t)
        t = re.sub(r'\s+', ' ', t).strip()
        # Skip navigation crumbs, short labels, cookie notices, etc.
        if len(t) < 40:
            continue
        # Skip lines that look like nav/UI text (all-caps short phrases)
        if re.match(r'^[A-Z\s/]{2,40}$', t):
            continue
        parts.append(t)
        if len(parts) >= MAX_PARAS:
            break

    result = '\n\n'.join(parts)
    if len(result) > MAX_INTRO_CHARS:
        # Still too long — take only the first paragraph
        result = parts[0] if parts else ''
    if len(result) > MAX_INTRO_CHARS:
        result = ''   # give up rather than insert junk
    return result.strip()


def clean_excerpt(excerpt: str) -> str:
    """Trim a truncated excerpt to the last complete sentence."""
    exc = excerpt.strip()
    if not exc:
        return ''
    if exc[-1] in '.!?':
        return exc
    m = re.search(r'^(.*[.!?])\s', exc)
    if m:
        return m.group(1).strip()
    return ''


def find_body_images(html: str, local_dir: Path) -> list:
    """
    Find <img> src URLs in the article body that are NOT already present locally.
    Returns list of (url, local_filename) for images to download.
    """
    body = narrow_to_body(html)
    srcs = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', body, re.IGNORECASE)
    to_download = []
    for src in srcs:
        if '/wp-content/uploads/' not in src and 'beauticate.com' not in src:
            continue
        filename = src.split('/')[-1].split('?')[0]
        if not filename or '.' not in filename:
            continue
        local_path = local_dir / filename
        if not local_path.exists():
            to_download.append((src, filename))
    return to_download


def download_image(url: str, dest: Path) -> bool:
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=TIMEOUT) as r:
            dest.write_bytes(r.read())
        return True
    except Exception as e:
        print(f'    Download error {url}: {e}', file=sys.stderr)
        return False


# ── find articles still missing intros ─────────────────────────────────────────────

def find_targets():
    targets = []
    for mdx in sorted(CONTENT_DIR.rglob('*.mdx')):
        if 'pages/' in str(mdx):
            continue
        text = mdx.read_text(encoding='utf-8')
        parts = text.split('---', 2)
        if len(parts) < 3:
            continue
        fm, body = parts[1], parts[2].strip()

        dm = re.search(r'date_published:\s*"?(\d{4}-\d{2}-\d{2})', fm)
        if not dm or dm.group(1) >= '2026-06-18':
            continue
        if not (body.startswith('## ') or body.startswith('\n## ')):
            continue  # already has intro

        slug_m   = re.search(r'slug:\s*"?([^"\n]+)', fm)
        cat_m    = re.search(r'category:\s*"?([^"\n]+)', fm)
        sub_m    = re.search(r'subcategory:\s*"?([^"\n]+)', fm)
        exc_m    = re.search(r'excerpt:\s*"([^"]*)', fm)
        if not slug_m:
            continue

        targets.append({
            'mdx':       mdx,
            'fm':        fm,
            'body':      body,
            'slug':      slug_m.group(1).strip(),
            'category':  cat_m.group(1).strip() if cat_m else '',
            'subcat':    sub_m.group(1).strip() if sub_m else '',
            'excerpt':   exc_m.group(1).strip() if exc_m else '',
        })
    return targets


# ── main ───────────────────────────────────────────────────────────────────────────────

def main():
    targets = find_targets()
    print(f'Found {len(targets)} articles still missing intros.')

    patched = 0
    fallback = 0
    skipped = 0
    imgs_downloaded = 0

    for i, art in enumerate(targets, 1):
        slug    = art['slug']
        cat     = art['category']
        subcat  = art['subcat']
        mdx     = art['mdx']
        fm      = art['fm']
        body    = art['body']

        url = f'{BASE_URL}/{cat}/{subcat}/{slug}/'
        print(f'[{i}/{len(targets)}] {slug}', end=' ', flush=True)

        html = fetch_html(url)
        intro = ''
        source = 'none'

        if html:
            intro = extract_intro_strict(html)
            if intro:
                source = 'live'
                print(f'✓ ({len(intro)} chars)', end='', flush=True)
            else:
                print(f'~ no live intro', end='', flush=True)

            # Check for missing body images
            content_dir = mdx.parent
            to_dl = find_body_images(html, content_dir)
            if to_dl and not DRY_RUN:
                print(f' | {len(to_dl)} imgs', end='', flush=True)
                for img_url, filename in to_dl:
                    ok = download_image(img_url, content_dir / filename)
                    if ok:
                        imgs_downloaded += 1
        else:
            print(f'✗ fetch failed', end='', flush=True)

        # Fallback to excerpt if no live intro
        if not intro:
            exc_clean = clean_excerpt(art['excerpt'])
            if exc_clean:
                intro = exc_clean
                source = 'excerpt'
                print(f' → excerpt fallback', end='', flush=True)

        print()

        if intro:
            new_text = f'---{fm}---\n\n{intro}\n\n{body}\n'
            if not DRY_RUN:
                mdx.write_text(new_text, encoding='utf-8')
            if source == 'live':
                patched += 1
            else:
                fallback += 1
        else:
            skipped += 1

        time.sleep(DELAY)

    suffix = ' (dry run)' if DRY_RUN else ''
    print(f'\nDone{suffix}.')
    print(f'  Live intros patched:   {patched}')
    print(f'  Excerpt fallbacks:     {fallback}')
    print(f'  Still no intro:        {skipped}')
    print(f'  Body images downloaded:{imgs_downloaded}')
    if not DRY_RUN:
        print(f'\nNext: git add content/ && git commit -m "feat: second-pass intros and body images" && git push')


if __name__ == '__main__':
    main()
