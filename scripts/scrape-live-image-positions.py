#!/usr/bin/env python3
"""
Scrape live beauticate.com pages to extract accurate inline image positions.

Requires internet access and:
    pip install requests beautifulsoup4

Usage (from repo root):
    python3 scripts/scrape-live-image-positions.py [output.json]

Default output: data/live-image-positions.json

The script finds every pre-migration MDX article where all images are
dumped at the footer, fetches the live WordPress page, and records
each image's position relative to the paragraph structure.

Output shape (same as data/wp-image-positions.json):
{
  "<slug>": {
    "source_url": "https://www.beauticate.com/...",
    "images": [
      {
        "order":      1,
        "filename":   "foo.jpg",
        "alt":        "alt text",
        "after_para": 2,      // 0-indexed paragraphs completed before this image
        "src":        "https://..."
      }
    ]
  }
}

The script saves incrementally every 10 articles so it's safe to interrupt
and resume — already-scraped slugs are skipped automatically.
"""

import json
import re
import sys
import time
from pathlib import Path
from urllib.parse import urlparse

try:
    import requests
    from bs4 import BeautifulSoup, Tag
except ImportError:
    sys.exit("ERROR: pip install requests beautifulsoup4")

BASE = "https://www.beauticate.com"
DELAY = 0.4          # seconds between requests (be polite)
TIMEOUT = 20         # request timeout in seconds
HEADERS = {"User-Agent": "Mozilla/5.0 Beauticate-migration/1.0"}

# Try these CSS selectors in order to find the article body
CONTENT_SELECTORS = [
    ".entry-content",
    ".post-content",
    "article .prose",
    ".article-body",
    "main article",
    "article",
]


# ---------------------------------------------------------------------------
# Step 1: find footer-dumped MDX files
# ---------------------------------------------------------------------------

def find_footer_dumped():
    """
    Return list of dicts for every pre-migration MDX article where ALL images
    appear after ALL body text (footer-dump pattern).
    """
    articles = []
    for f in sorted(Path("content").rglob("*.mdx")):
        if "pages" in f.parts:
            continue
        text = f.read_text()
        parts = text.split("---", 2)
        if len(parts) < 3:
            continue
        fm, body = parts[1], parts[2].strip()

        # Only pre-migration articles
        m = re.search(r'date_published:\s*["\']?(\d{4}-\d{2}-\d{2})', fm)
        if not m or m.group(1) >= "2026-06-18":
            continue

        lines = body.split("\n")
        img_lines     = [i for i, l in enumerate(lines) if re.match(r"\s*!\[", l)]
        content_lines = [i for i, l in enumerate(lines)
                         if l.strip() and not re.match(r"\s*!\[", l)]

        if not img_lines or not content_lines:
            continue
        if img_lines[0] <= content_lines[-1]:
            continue  # images are already inline

        slug = re.search(r'slug:\s*["\']?([^\n"\'\']+)', fm)
        cat  = re.search(r'category:\s*["\']?([^\n"\'\']+)', fm)
        sub  = re.search(r'subcategory:\s*["\']?([^\n"\'\']+)', fm)

        articles.append({
            "slug":   (slug.group(1).strip() if slug else f.stem),
            "cat":    (cat.group(1).strip()  if cat  else ""),
            "sub":    (sub.group(1).strip()  if sub  else ""),
            "path":   str(f),
            "n_imgs": len(img_lines),
        })
    return articles


# ---------------------------------------------------------------------------
# Step 2: fetch the live page
# ---------------------------------------------------------------------------

def fetch_article(slug, cat, sub, session):
    """
    Try URL variants in priority order.
    Returns (final_url, html) or (None, None) on failure.
    """
    candidates = []
    if cat and sub:
        candidates.append(f"{BASE}/{cat}/{sub}/{slug}/")
    if cat:
        candidates.append(f"{BASE}/{cat}/{slug}/")
    candidates.append(f"{BASE}/{slug}/")

    for url in candidates:
        try:
            r = session.get(url, headers=HEADERS, timeout=TIMEOUT,
                            allow_redirects=True)
            if r.status_code == 200:
                return r.url, r.text
            if r.status_code not in (301, 302, 404):
                print(f"    HTTP {r.status_code}: {url}", file=sys.stderr)
        except Exception as e:
            print(f"    Error: {e}", file=sys.stderr)
    return None, None


# ---------------------------------------------------------------------------
# Step 3: parse image positions from HTML
# ---------------------------------------------------------------------------

def _img_info(img_tag):
    src = (img_tag.get("src")
           or img_tag.get("data-src")
           or img_tag.get("data-lazy-src")
           or "")
    src = src.split("?")[0]
    alt = (img_tag.get("alt") or "").strip()
    filename = Path(urlparse(src).path).name
    return {"filename": filename, "alt": alt, "src": src}


def walk_content(element):
    """
    Recursively walk a BeautifulSoup element and return an ordered list of:
      ('p',   text_snippet)
      ('img', info_dict)
    Headings and non-content tags are skipped.
    """
    items = []
    for child in element.children:
        if not isinstance(child, Tag):
            continue
        tag = child.name.lower()

        if tag in ("h1", "h2", "h3", "h4", "h5", "h6",
                   "hr", "script", "style", "noscript", "svg"):
            pass  # not paragraphs

        elif tag == "p":
            img = child.find("img")
            if img:
                info = _img_info(img)
                if info["filename"] and "." in info["filename"]:
                    items.append(("img", info))
            else:
                text = child.get_text(strip=True)
                if text:
                    items.append(("p", text[:100]))

        elif tag == "figure":
            img = child.find("img")
            if img:
                info = _img_info(img)
                if info["filename"] and "." in info["filename"]:
                    items.append(("img", info))

        elif tag == "img":
            info = _img_info(child)
            if info["filename"] and "." in info["filename"]:
                items.append(("img", info))

        elif tag == "a":
            img = child.find("img")
            if img:
                info = _img_info(img)
                if info["filename"] and "." in info["filename"]:
                    items.append(("img", info))

        elif tag in ("div", "section", "article", "main",
                     "blockquote", "ul", "ol", "li", "aside"):
            items.extend(walk_content(child))

    return items


def parse_images(html):
    """
    Given article HTML, locate the content area and return a list of image
    dicts with after_para positions.  Returns None if no content area found.
    """
    soup = BeautifulSoup(html, "html.parser")

    content = None
    for sel in CONTENT_SELECTORS:
        content = soup.select_one(sel)
        if content:
            break
    if not content:
        return None

    # Strip known non-editorial elements
    for el in content.select(
        ".sharedaddy, .jp-relatedposts, .post-tags, "
        ".post-navigation, .author-box, .wpcf7, .widget"
    ):
        el.decompose()

    raw = walk_content(content)

    images = []
    para_count = 0
    order = 0

    for kind, data in raw:
        if kind == "p":
            para_count += 1
        elif kind == "img":
            fn = data["filename"]
            if fn and not fn.startswith("data"):
                order += 1
                images.append({
                    "order":      order,
                    "filename":   fn,
                    "alt":        data["alt"],
                    "after_para": para_count,
                    "src":        data["src"],
                })

    return images


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    out_path = (Path(sys.argv[1]) if len(sys.argv) > 1
                else Path("data/live-image-positions.json"))

    # Load existing results for resumability
    existing = {}
    if out_path.exists():
        existing = json.loads(out_path.read_text())
        print(f"Resuming: {len(existing)} slugs already done", file=sys.stderr)

    articles = find_footer_dumped()
    print(f"Found {len(articles)} footer-dumped pre-migration articles",
          file=sys.stderr)

    results = dict(existing)
    session = requests.Session()
    done = skipped = failed = 0

    for i, art in enumerate(articles):
        slug = art["slug"]

        if slug in existing:
            skipped += 1
            continue

        print(f"[{i+1}/{len(articles)}] {slug} ({art['n_imgs']} imgs) ...",
              end=" ", file=sys.stderr, flush=True)

        url, html = fetch_article(slug, art["cat"], art["sub"], session)
        if not html:
            print("FETCH FAILED", file=sys.stderr)
            failed += 1
            time.sleep(DELAY)
            continue

        images = parse_images(html)
        if images is None:
            print("NO CONTENT FOUND", file=sys.stderr)
            failed += 1
        elif not images:
            print("0 images parsed", file=sys.stderr)
            results[slug] = {"source_url": url, "images": []}
            done += 1
        else:
            paras = sorted(set(img["after_para"] for img in images))
            varied = len(paras) > 1
            print(
                f"{len(images)} imgs  paras={paras[:6]}{'…' if len(paras)>6 else ''}"
                f"  {'✓ varied' if varied else '— all at 0'}",
                file=sys.stderr,
            )
            results[slug] = {"source_url": url, "images": images}
            done += 1

        # Save incrementally every 10 articles
        if (done + failed) % 10 == 0:
            out_path.parent.mkdir(parents=True, exist_ok=True)
            out_path.write_text(
                json.dumps(results, indent=2, ensure_ascii=False) + "\n"
            )

        time.sleep(DELAY)

    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(results, indent=2, ensure_ascii=False) + "\n")

    size_kb = out_path.stat().st_size // 1024
    print(
        f"\nDone: {done} scraped, {skipped} skipped (already done), "
        f"{failed} failed",
        file=sys.stderr,
    )
    print(f"Written → {out_path}  ({size_kb} KB)", file=sys.stderr)


if __name__ == "__main__":
    main()
