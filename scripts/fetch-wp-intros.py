#!/usr/bin/env python3
"""
Fetch intro paragraphs for Beauticate articles directly from the live WordPress site.

Run this on your local Mac (where beauticate.com is accessible):

    python3 scripts/fetch-wp-intros.py

It reads the list of articles needing intros from the MDX files, fetches each
WordPress page, extracts the intro text (all content before the first <h2>),
and saves results to data/wp-live-intros.json.

Resumable: already-fetched slugs are skipped. Safe to interrupt and re-run.
Rate-limited: ~1 request/second to be polite to the server.
"""

import html as html_mod
import json
import re
import sys
import time
import urllib.request
import urllib.error
from pathlib import Path
from typing import Optional

CONTENT_DIR = Path(__file__).parent.parent / 'content'
OUT_FILE = Path(__file__).parent.parent / 'data' / 'wp-live-intros.json'
BASE_URL = 'https://www.beauticate.com'
DELAY = 1.0   # seconds between requests
TIMEOUT = 15  # seconds per request

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    'Accept': 'text/html,application/xhtml+xml',
}


def find_articles():
    """Return list of dicts for all pre-migration articles missing intro text."""
    articles = []
    for mdx in sorted(CONTENT_DIR.rglob('*.mdx')):
        if 'pages/' in str(mdx):
            continue
        text = mdx.read_text(encoding='utf-8', errors='replace')
        parts = text.split('---', 2)
        if len(parts) < 3:
            continue
        fm, body = parts[1], parts[2].strip()

        dm = re.search(r'date_published:\s*"?(\d{4}-\d{2}-\d{2})', fm)
        if not dm or dm.group(1) >= '2026-06-18':
            continue
        if not (body.startswith('#') or body.startswith('\n#')):
            continue  # already has intro

        slug_m = re.search(r'slug:\s*"?([^"\n]+)', fm)
        cat_m  = re.search(r'category:\s*"?([^"\n]+)', fm)
        sub_m  = re.search(r'subcategory:\s*"?([^"\n]+)', fm)
        exc_m  = re.search(r'excerpt:\s*"([^"]*)', fm)
        if not slug_m:
            continue

        articles.append({
            'slug':        slug_m.group(1).strip(),
            'category':    cat_m.group(1).strip() if cat_m else '',
            'subcategory': sub_m.group(1).strip() if sub_m else '',
            'excerpt':     exc_m.group(1).strip() if exc_m else '',
        })
    return articles


def fetch_html(url: str) -> Optional[str]:
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=TIMEOUT) as r:
            charset = 'utf-8'
            ct = r.headers.get_content_charset()
            if ct:
                charset = ct
            return r.read().decode(charset, errors='replace')
    except urllib.error.HTTPError as e:
        if e.code == 404:
            return None
        print(f'  HTTP {e.code}', file=sys.stderr)
        return None
    except Exception as e:
        print(f'  Error: {e}', file=sys.stderr)
        return None


def extract_intro(html: str) -> str:
    """
    Extract intro text from rendered WordPress HTML.
    Returns all readable text before the first <h2> or <h3>.
    """
    content = html

    # Narrow to article body if we can
    for pattern in [
        r'<div[^>]+class="[^"]*entry-content[^"]*"[^>]*>(.*?)</div>\s*</article',
        r'<article[^>]*>(.*?)</article>',
        r'<div[^>]+class="[^"]*post-content[^"]*"[^>]*>(.*?)</div>',
    ]:
        m = re.search(pattern, html, re.DOTALL | re.IGNORECASE)
        if m:
            content = m.group(1)
            break

    # Find first h2/h3
    heading_m = re.search(r'<h[23][\s>]', content, re.IGNORECASE)
    if heading_m:
        before = content[:heading_m.start()]
    else:
        # No heading — try to get just the first 2 paragraphs
        paras_all = re.findall(r'<p[^>]*>(.*?)</p>', content, re.IGNORECASE | re.DOTALL)
        before = '\n'.join(f'<p>{p}</p>' for p in paras_all[:2])

    # Extract <p> text
    paras = re.findall(r'<p[^>]*>(.*?)</p>', before, re.IGNORECASE | re.DOTALL)
    parts = []
    for p in paras:
        t = re.sub(r'<[^>]+>', ' ', p)
        t = html_mod.unescape(t)
        t = re.sub(r'\s+', ' ', t).strip()
        if len(t) > 30:
            parts.append(t)

    if not parts:
        t = re.sub(r'<[^>]+>', ' ', before)
        t = html_mod.unescape(t)
        t = re.sub(r'\s+', ' ', t).strip()
        if len(t) > 30:
            parts = [t]

    return '\n\n'.join(parts)


def best_excerpt(excerpt: str) -> str:
    """
    Clean up a truncated excerpt — trim to the last complete sentence.
    Returns empty string if nothing usable.
    """
    exc = excerpt.strip()
    if not exc:
        return ''
    if exc[-1] in '.!?':
        return exc  # already complete
    m = re.search(r'^(.*[.!?])\s', exc)
    if m:
        return m.group(1).strip()
    return ''  # single incomplete sentence — skip


def main():
    articles = find_articles()
    print(f'Found {len(articles)} articles needing intros.', file=sys.stderr)

    OUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    if OUT_FILE.exists():
        results = json.loads(OUT_FILE.read_text())
        print(f'Loaded {len(results)} existing results — will skip those slugs.', file=sys.stderr)
    else:
        results = {}

    fetched = 0
    fell_back = 0
    skipped = 0
    failed = 0
    total = len(articles)

    for i, art in enumerate(articles, 1):
        slug     = art['slug']
        category = art['category']
        subcat   = art['subcategory']
        excerpt  = art['excerpt']

        if slug in results:
            skipped += 1
            continue

        url = f'{BASE_URL}/{category}/{subcat}/{slug}/'
        print(f'[{i}/{total}] {slug}', end=' ', flush=True)

        html = fetch_html(url)
        if html:
            intro = extract_intro(html)
            if intro:
                results[slug] = {'source': 'live', 'text': intro}
                fetched += 1
                print(f'✓ ({len(intro)} chars)', flush=True)
            else:
                exc_clean = best_excerpt(excerpt)
                if exc_clean:
                    results[slug] = {'source': 'excerpt', 'text': exc_clean}
                    fell_back += 1
                    print(f'~ excerpt fallback', flush=True)
                else:
                    results[slug] = {'source': 'none', 'text': ''}
                    failed += 1
                    print(f'✗ no intro found', flush=True)
        else:
            exc_clean = best_excerpt(excerpt)
            if exc_clean:
                results[slug] = {'source': 'excerpt', 'text': exc_clean}
                fell_back += 1
                print(f'~ excerpt (fetch failed)', flush=True)
            else:
                results[slug] = {'source': 'none', 'text': ''}
                failed += 1
                print(f'✗ fetch failed, no excerpt', flush=True)

        if i % 10 == 0:
            OUT_FILE.write_text(json.dumps(results, indent=2, ensure_ascii=False) + '\n')

        time.sleep(DELAY)

    OUT_FILE.write_text(json.dumps(results, indent=2, ensure_ascii=False) + '\n')

    print(f'\nDone.', file=sys.stderr)
    print(f'  Live fetched:    {fetched}', file=sys.stderr)
    print(f'  Excerpt fallback:{fell_back}', file=sys.stderr)
    print(f'  Nothing found:   {failed}', file=sys.stderr)
    print(f'  Previously done: {skipped}', file=sys.stderr)
    print(f'  Output: {OUT_FILE}', file=sys.stderr)
    print(f'\nNext step: git add data/wp-live-intros.json && git commit -m "data: live wp intros" && git push', file=sys.stderr)


if __name__ == '__main__':
    main()
