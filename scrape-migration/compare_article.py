#!/usr/bin/env python3
"""
compare_article.py

Pilot script for the Beauticate migration. Scrapes ONE article from the
old site and the same article on the new Vercel site, matches images
between the two versions, flags anything missing, and flags layout
differences like size and alignment. Output is a report.json file that
Claude Code reads to fix the new article.

Image matching happens in stages, cheapest first, to keep this fast at
scale and to avoid downloading images we don't need to.

  Stage 1, position: if old and new have the same number of images,
  assume matching position means matching image. Still scores each pair
  on alt text, filename and dimensions, purely so a genuinely poor score
  gets flagged for a manual look, in case an image was swapped without
  changing the count.

  Stage 2, weighted signals: used when the counts differ, since position
  can't be trusted there. Combines fuzzy alt text, fuzzy filename and
  matching dimensions into one score per candidate pair. This catches
  images that were renamed for SEO but are otherwise the same photo.

  Stage 3, visual: for anything still unresolved, download just those
  images from both versions and compare them by actual pixel content
  using a perceptual hash. Slowest, most certain, used only where needed.

Run this from a normal terminal, not inside Claude Code, unless you've
confirmed Claude Code has real internet access via the Firecrawl skill.

ONE-TIME SETUP
    pip install firecrawl-py requests pillow imagehash beautifulsoup4

USAGE
    export FIRECRAWL_API_KEY="fc-your-key-here"
    python3 compare_article.py \
        --old-url "https://beauticate.com/some-article/" \
        --new-url "https://your-vercel-site.com/some-article/" \
        --slug "some-article"

OUTPUT (all inside ./scraped-content/<slug>/)
    old.json            Full Firecrawl result for the old article
    new.json             Full Firecrawl result for the new article
    old/images/           Only the images downloaded for visual checking
    new/images/            Only the images downloaded for visual checking
    report.json          The comparison Claude Code will act on
"""

import argparse
import json
import os
import re
from difflib import SequenceMatcher
from pathlib import Path
from urllib.parse import urlparse

import requests
from bs4 import BeautifulSoup
from PIL import Image
import imagehash
from firecrawl import Firecrawl

MIN_ALT_LENGTH = 4               # alt text shorter than this is too unreliable to score
CHEAP_MATCH_THRESHOLD = 0.55     # minimum weighted score to accept a stage 2 match
LOW_CONFIDENCE_THRESHOLD = 0.3   # stage 1 position matches below this get flagged for review
DEFAULT_HASH_THRESHOLD = 8       # max perceptual hash distance still counted as the same image

ALT_WEIGHT = 0.45
FILENAME_WEIGHT = 0.35
DIMENSION_WEIGHT = 0.20


def scrape_article(app, url):
    """Scrape one URL and return the full Firecrawl result."""
    return app.scrape(url, formats=["markdown", "html", "rawHtml", "links", "screenshot"])


def slugify(text):
    text = re.sub(r"[^a-zA-Z0-9]+", "-", text).strip("-").lower()
    return text or "image"


def normalize_alt(text):
    return re.sub(r"\s+", " ", (text or "")).strip().lower()


def normalize_filename(src):
    """
    Turn an image URL into something comparable across a rename.
    Strips the extension, WordPress-style size suffixes like -1024x683,
    and long hash-like strings that SEO renaming tools tend to add,
    then turns separators into spaces for a fuzzy text comparison.
    """
    path = urlparse(src).path
    name = os.path.splitext(os.path.basename(path))[0]
    name = re.sub(r"-\d{2,5}x\d{2,5}$", "", name)          # WordPress thumbnail size suffix
    name = re.sub(r"\b[0-9a-f]{6,}\b", "", name)             # long hash-like fragments
    name = re.sub(r"[-_]+", " ", name)
    return re.sub(r"\s+", " ", name).strip().lower()


def dimensions_match(old_img, new_img):
    """
    Returns True/False if both images have explicit width and height to
    compare, or None if one or both are missing that information.
    """
    ow, oh = old_img.get("width"), old_img.get("height")
    nw, nh = new_img.get("width"), new_img.get("height")
    if not (ow and oh and nw and nh):
        return None
    return str(ow) == str(nw) and str(oh) == str(nh)


def score_pair(old_img, new_img):
    """
    Score how likely two image tags are the same photo, using alt text,
    filename and dimensions. Returns (score, signals_dict) so the report
    can show its working, not just a final verdict.
    """
    old_alt, new_alt = normalize_alt(old_img["alt"]), normalize_alt(new_img["alt"])
    if len(old_alt) >= MIN_ALT_LENGTH and len(new_alt) >= MIN_ALT_LENGTH:
        alt_sim = SequenceMatcher(None, old_alt, new_alt).ratio()
    else:
        alt_sim = 0.0

    fname_sim = SequenceMatcher(None, normalize_filename(old_img["src"]), normalize_filename(new_img["src"])).ratio()

    dims = dimensions_match(old_img, new_img)
    dims_score = 1.0 if dims else 0.0

    score = (alt_sim * ALT_WEIGHT) + (fname_sim * FILENAME_WEIGHT) + (dims_score * DIMENSION_WEIGHT)

    signals = {
        "alt_similarity": round(alt_sim, 3),
        "filename_similarity": round(fname_sim, 3),
        "dimensions_match": dims,
    }
    return score, signals


LAZY_PATTERNS = re.compile(r"lazy[_-]placeholder|data:image/|spacer\.gif|blank\.gif|pixel\.gif", re.I)

JUNK_SRC_PATTERNS = re.compile(
    r"gravatar\.com|"
    r"wp-content/plugins/|"
    r"wp-includes/images/|"
    r"favicon|"
    r"logo\b|"
    r"icon[_-]|"
    r"emoji|"
    r"smilies/",
    re.I,
)

EXCLUDED_SECTIONS_WP = re.compile(
    r"\b(?:"
    r"related[-_]?posts|relatedposts|read-next|you-may-also-like|also-like|"
    r"comments?-area|comments?-section|respond|"
    r"faq(?:s)?(?:-section)?|"
    r"site-footer|footer-widgets|"
    r"sidebar|widget_block|widget\b|"
    r"site-header|masthead|"
    r"main-nav|primary-nav|"
    r"div-gpt-ad|"
    r"shopify|woocommerce-cart"
    r")\b",
    re.I,
)

EXCLUDED_SECTIONS_VERCEL = re.compile(
    r"\b(?:"
    r"related[-_]?posts|you-may-also-like|also-like|"
    r"faq(?:s)?(?:-section)?|"
    r"site-footer|"
    r"site-header|"
    r"main-nav|primary-nav|"
    r"comments?-area|comments?-section"
    r")\b",
    re.I,
)

EXCLUDED_TAG_NAMES = {"header", "footer", "nav", "aside"}


def _is_inside_excluded_section(tag, pattern):
    for parent in tag.parents:
        if parent.name is None:
            continue
        if parent.name in EXCLUDED_TAG_NAMES and parent.name != "body":
            return True
        parent_id = parent.get("id") or ""
        parent_class = " ".join(parent.get("class") or [])
        combined = f"{parent_id} {parent_class}"
        if pattern.search(combined):
            return True
    return False


def _resolve_src(img):
    src = img.get("src") or ""
    data_src = img.get("data-src") or img.get("data-lazy-src") or img.get("data-original") or ""
    if LAZY_PATTERNS.search(src) and data_src:
        src = data_src
    elif not src and data_src:
        src = data_src
    if src.startswith("//"):
        src = "https:" + src
    return src


def _wp_alignment(img):
    """
    Walk up from an <img> inside WPBakery markup and return the editorial
    alignment ('center', 'left', 'right', 'full') and column fraction.
    """
    alignment = None
    col_fraction = None
    size_class = None

    for cls in (img.get("class") or []):
        if cls.startswith("attachment-"):
            size_class = cls.replace("attachment-", "")

    for parent in img.parents:
        if parent.name is None:
            continue
        pcls = parent.get("class") or []
        for c in pcls:
            if c.startswith("vc_align_") and alignment is None:
                alignment = c.replace("vc_align_", "")
            if c.startswith("vc_col-sm-") and col_fraction is None:
                num = c.replace("vc_col-sm-", "")
                try:
                    col_fraction = int(num) / 12
                except ValueError:
                    pass

    return alignment or "left", col_fraction or 1.0, size_class or "full"


def _orientation(width, height):
    try:
        w, h = int(width), int(height)
    except (TypeError, ValueError):
        return "unknown"
    if w > h:
        return "landscape"
    elif h > w:
        return "portrait"
    return "square"


def extract_images_with_layout(html, site="old"):
    """
    Pull <img> tags from the article body only, skipping nav, footer,
    related posts, FAQs, comments, ads, lazy-load placeholders, and
    <noscript> duplicates.
    """
    soup = BeautifulSoup(html, "html.parser")

    for noscript in soup.find_all("noscript"):
        noscript.decompose()

    excluded_pattern = EXCLUDED_SECTIONS_WP if site == "old" else EXCLUDED_SECTIONS_VERCEL

    images = []
    seen_srcs = set()
    order = 0
    for img in soup.find_all("img"):
        src = _resolve_src(img)
        if not src:
            continue
        if LAZY_PATTERNS.search(src):
            continue
        if JUNK_SRC_PATTERNS.search(src):
            continue
        if _is_inside_excluded_section(img, excluded_pattern):
            continue

        base_src = re.sub(r"-\d{2,5}x\d{2,5}(?=\.\w+$)", "", urlparse(src).path)
        if base_src in seen_srcs:
            continue
        seen_srcs.add(base_src)

        w = img.get("width")
        h = img.get("height")

        record = {
            "order": order,
            "src": src,
            "alt": img.get("alt", ""),
            "width": w,
            "height": h,
            "orientation": _orientation(w, h),
            "class": img.get("class"),
            "style": img.get("style"),
            "local_path": None,
            "hash": None,
        }

        if site == "old":
            alignment, col_fraction, size_class = _wp_alignment(img)
            record["wp_alignment"] = alignment
            record["wp_column_fraction"] = col_fraction
            record["wp_size_class"] = size_class

        images.append(record)
        order += 1
    return images


PRODUCT_LINK_DOMAINS = re.compile(
    r"(?:"
    r"rstyle\.me|shopstyle\.|ltkapp\.com|"
    r"mecca\.com\.au|sephora\.com|adorebeauty\.com\.au|"
    r"beauticate\.shop|"
    r"net-a-porter\.com|theiconic\.com\.au|"
    r"davidjones\.com|priceline\.com\.au|"
    r"chemistwarehouse\.com\.au|"
    r"asos\.com|nordstrom\.com|"
    r"booktopia\.com|amazon\.com|"
    r"bit\.ly|amzn\.to|go\.skimresources|linksynergy\.com|"
    r"shopify\.com|myshopify\.com|"
    r"click\.linksynergy|"
    r"lush\.com|ethique\.com|"
    r"loreperfumery\.com|"
    r"nopong\.com|beebeauty\.com|"
    r"qureskin\.com|moogoo\.com|"
    r"booie\.com|bystorm\.com"
    r")",
    re.I,
)

SKIP_LINK_PATTERNS = re.compile(
    r"(?:"
    r"beauticate\.com(?!/shop)|"
    r"instagram\.com|facebook\.com|twitter\.com|pinterest\.com|"
    r"youtube\.com|tiktok\.com|"
    r"linkedin\.com|"
    r"#|mailto:|tel:"
    r")",
    re.I,
)


def extract_product_links(html):
    """
    Extract product/affiliate links from the WP article body.
    Returns a list of dicts with url, text, domain, and position order.
    """
    soup = BeautifulSoup(html, "html.parser")

    for noscript in soup.find_all("noscript"):
        noscript.decompose()

    links = []
    seen_urls = set()
    order = 0

    for a in soup.find_all("a", href=True):
        href = a["href"]
        if not href or href.startswith("#") or href.startswith("mailto:"):
            continue
        if SKIP_LINK_PATTERNS.search(href):
            continue
        if _is_inside_excluded_section(a, EXCLUDED_SECTIONS_WP):
            continue

        text = a.get_text(strip=True)
        if not text or len(text) < 2:
            continue

        parsed = urlparse(href)
        domain = parsed.netloc.replace("www.", "")

        is_product = PRODUCT_LINK_DOMAINS.search(href)
        is_likely_product = bool(re.search(
            r"/product|/shop|/collections?/|/buy|/item|/p/|/dp/",
            parsed.path, re.I
        ))

        if not is_product and not is_likely_product:
            continue

        norm_url = f"{parsed.netloc}{parsed.path}".lower().rstrip("/")
        if norm_url in seen_urls:
            continue
        seen_urls.add(norm_url)

        links.append({
            "order": order,
            "url": href,
            "text": text,
            "domain": domain,
            "is_affiliate": bool(re.search(
                r"rstyle|shopstyle|ltkapp|bit\.ly|amzn\.to|skimresources|linksynergy",
                href, re.I
            )),
        })
        order += 1

    return links


def extract_body_content(html):
    """
    Extract the article body content from WP HTML, stripping sidebar,
    nav, footer, related posts, ads, and other non-article elements.
    Returns cleaned HTML string containing only the article body.
    """
    soup = BeautifulSoup(html, "html.parser")

    for noscript in soup.find_all("noscript"):
        noscript.decompose()
    for script in soup.find_all("script"):
        script.decompose()
    for style in soup.find_all("style"):
        style.decompose()

    for tag_name in EXCLUDED_TAG_NAMES:
        for el in soup.find_all(tag_name):
            el.decompose()

    for el in soup.find_all(True):
        el_id = el.get("id") or ""
        el_class = " ".join(el.get("class") or [])
        combined = f"{el_id} {el_class}"
        if EXCLUDED_SECTIONS_WP.search(combined):
            el.decompose()

    body = soup.find("div", class_=re.compile(
        r"entry-content|post-content|article-content|"
        r"elementor-widget-theme-post-content"
    ))
    if not body:
        body = soup.find("article") or soup.find("main") or soup

    return str(body)


def extract_body_text(html):
    """
    Extract plain text from the article body, excluding sidebar and
    non-article elements. Returns the text as a string.
    """
    cleaned_html = extract_body_content(html)
    soup = BeautifulSoup(cleaned_html, "html.parser")
    return soup.get_text(separator="\n", strip=True)


def extract_intro(html):
    """
    Extract the editorial intro from a WP article.
    The intro is the text between the hero/excerpt area and the first
    interview heading or quote block. Returns the intro text as a string,
    or empty string if none found.
    """
    cleaned = extract_body_content(html)
    soup = BeautifulSoup(cleaned, "html.parser")

    intro_parts = []
    for el in soup.children:
        if hasattr(el, 'name') and el.name is None:
            continue
        if not hasattr(el, 'name'):
            text = str(el).strip()
            if text:
                intro_parts.append(text)
            continue

        tag = el.name
        text = el.get_text(strip=True)

        if not text:
            continue

        if tag in ('h1', 'h2', 'h3', 'h4', 'h5', 'h6'):
            break

        if tag == 'blockquote':
            break

        if tag in ('p', 'div'):
            if text.startswith(('“', '"', '‘', "'")):
                if len(text) > 50:
                    break

            if re.match(r'^###?\s', text):
                break

            classes = " ".join(el.get("class") or [])
            if re.search(r'wp-block-quote|pullquote|interview-q', classes):
                break

            intro_parts.append(text)

    intro = "\n\n".join(intro_parts).strip()

    if len(intro) < 20:
        return ""

    return intro


def download_image(url, dest_folder):
    """Download one image and return its local path, or None on failure."""
    try:
        resp = requests.get(url, timeout=20)
        resp.raise_for_status()
    except Exception as e:
        print(f"  Could not download {url}: {e}")
        return None

    ext = os.path.splitext(urlparse(url).path)[1] or ".jpg"
    filename = slugify(os.path.basename(urlparse(url).path)) + ext
    dest_path = Path(dest_folder) / filename
    dest_path.parent.mkdir(parents=True, exist_ok=True)
    with open(dest_path, "wb") as f:
        f.write(resp.content)
    return str(dest_path)


def phash_of(path):
    """Return a perceptual hash for an image file, or None if it can't be read."""
    try:
        with Image.open(path) as img:
            return imagehash.phash(img)
    except Exception as e:
        print(f"  Could not hash {path}: {e}")
        return None


def layout_flags(old_img, new_img):
    """
    Compare size, alignment and orientation between a matched pair.
    Returns a dict of differences — empty if they line up.
    """
    flags = {}

    if old_img.get("width") and new_img.get("width") and str(old_img["width"]) != str(new_img["width"]):
        flags["width"] = {"old": old_img["width"], "new": new_img["width"]}
    if old_img.get("height") and new_img.get("height") and str(old_img["height"]) != str(new_img["height"]):
        flags["height"] = {"old": old_img["height"], "new": new_img["height"]}

    old_orient = old_img.get("orientation", "unknown")
    new_orient = new_img.get("orientation", "unknown")
    if old_orient != new_orient and old_orient != "unknown" and new_orient != "unknown":
        flags["orientation"] = {"old": old_orient, "new": new_orient}

    return flags


WP_MEDIUM_MAX = 350
VERCEL_SCALE_FACTOR = 1.3

def recommend_vercel_component(old_img):
    """
    Based on WP image metadata, recommend the right Vercel MDX component
    and sizing. Returns a dict with component, width, height, and rationale.
    """
    orientation = old_img.get("orientation", "unknown")
    size_class = old_img.get("wp_size_class", "full")
    w = old_img.get("width")
    h = old_img.get("height")

    try:
        wi, hi = int(w), int(h)
    except (TypeError, ValueError):
        return {"component": "unknown", "rationale": "missing dimensions"}

    is_medium = size_class == "medium" or (wi <= WP_MEDIUM_MAX and hi <= WP_MEDIUM_MAX)

    if is_medium or (orientation == "portrait" and wi <= WP_MEDIUM_MAX):
        is_thumbnail = "-" in str(w) and "x" in str(w)  # e.g. 231x300 in filename
        if is_thumbnail or size_class == "medium":
            return {
                "component": "InlineImage",
                "width": wi,
                "height": hi,
                "align": "left",
                "rationale": f"WP {size_class} thumbnail ({wi}x{hi}), use at original size (never upscale)",
                "check_source_dimensions": True,
            }
        scaled_w = min(round(wi * VERCEL_SCALE_FACTOR), wi)
        scaled_h = min(round(hi * VERCEL_SCALE_FACTOR), hi)
        return {
            "component": "InlineImage",
            "width": scaled_w,
            "height": scaled_h,
            "align": "left",
            "rationale": f"WP {size_class} ({wi}x{hi}), capped at original dimensions",
        }

    if orientation == "portrait":
        return {
            "component": "Portrait",
            "rationale": f"Full-size portrait ({wi}x{hi}), use Portrait with alternating sides",
        }

    return {
        "component": "markdown_image",
        "rationale": f"Full-size landscape ({wi}x{hi}), standard ![alt](src) is fine",
    }


def build_match_record(old_img, new_img, matched_by, score, signals):
    rec = recommend_vercel_component(old_img)
    record = {
        "old_src": old_img["src"],
        "old_filename": None,
        "new_src": new_img["src"],
        "new_filename": None,
        "matched_by": matched_by,
        "match_confidence": round(score, 3),
        "signals": signals,
        "old_order": old_img["order"],
        "new_order": new_img["order"],
        "old_dimensions": {"width": old_img.get("width"), "height": old_img.get("height"), "orientation": old_img.get("orientation")},
        "new_dimensions": {"width": new_img.get("width"), "height": new_img.get("height"), "orientation": new_img.get("orientation")},
        "wp_alignment": old_img.get("wp_alignment"),
        "wp_column_fraction": old_img.get("wp_column_fraction"),
        "wp_size_class": old_img.get("wp_size_class"),
        "layout_flags": layout_flags(old_img, new_img),
        "recommended_component": rec,
    }
    if matched_by == "position" and score < LOW_CONFIDENCE_THRESHOLD:
        record["needs_manual_check"] = True
    return record


def cheap_match(old_images, new_images):
    """
    Stages 1 and 2. Returns (matches, unmatched_old, unmatched_new).
    No downloads happen in this function.
    """
    if len(old_images) == len(new_images):
        # Stage 1: trust position, but still score each pair for QA.
        matches = []
        for old_img, new_img in zip(old_images, new_images):
            score, signals = score_pair(old_img, new_img)
            matches.append(build_match_record(old_img, new_img, "position", score, signals))
        return matches, [], []

    # Stage 2: counts differ, position isn't safe, use weighted best match.
    matches = []
    unmatched_old = []
    used_new_orders = set()

    for old_img in old_images:
        best_new, best_score, best_signals = None, 0.0, None
        for new_img in new_images:
            if new_img["order"] in used_new_orders:
                continue
            score, signals = score_pair(old_img, new_img)
            if score > best_score:
                best_score, best_new, best_signals = score, new_img, signals

        if best_new is not None and best_score >= CHEAP_MATCH_THRESHOLD:
            matches.append(build_match_record(old_img, best_new, "weighted_signals", best_score, best_signals))
            used_new_orders.add(best_new["order"])
        else:
            unmatched_old.append(old_img)

    unmatched_new = [img for img in new_images if img["order"] not in used_new_orders]
    return matches, unmatched_old, unmatched_new


def visual_match(unmatched_old, unmatched_new, old_dir, new_dir, threshold):
    """
    Stage 3. For images the cheap stages couldn't resolve, download only
    those images from both versions and match by visual content.
    """
    if not unmatched_old:
        return [], []

    print(f"  {len(unmatched_old)} old image(s) still unresolved, downloading for a visual check...")
    for img in unmatched_old:
        img["local_path"] = download_image(img["src"], old_dir)
        img["hash"] = phash_of(img["local_path"]) if img["local_path"] else None

    for img in unmatched_new:
        img["local_path"] = download_image(img["src"], new_dir)
        img["hash"] = phash_of(img["local_path"]) if img["local_path"] else None

    matches = []
    still_unmatched = []

    for old_img in unmatched_old:
        if old_img["hash"] is None:
            still_unmatched.append(old_img)
            continue

        best_match, best_distance = None, None
        for new_img in unmatched_new:
            if new_img["hash"] is None:
                continue
            distance = old_img["hash"] - new_img["hash"]
            if best_distance is None or distance < best_distance:
                best_distance, best_match = distance, new_img

        if best_match and best_distance is not None and best_distance <= threshold:
            matches.append({
                "old_src": old_img["src"],
                "old_filename": os.path.basename(old_img["local_path"]) if old_img["local_path"] else None,
                "new_src": best_match["src"],
                "new_filename": os.path.basename(best_match["local_path"]) if best_match["local_path"] else None,
                "matched_by": "visual_hash",
                "hash_distance": best_distance,
                "old_order": old_img["order"],
                "new_order": best_match["order"],
                "layout_flags": layout_flags(old_img, best_match),
            })
        else:
            still_unmatched.append(old_img)

    return matches, still_unmatched


def main():
    parser = argparse.ArgumentParser(description="Compare one old vs new Beauticate article.")
    parser.add_argument("--old-url", required=True)
    parser.add_argument("--new-url", required=True)
    parser.add_argument("--slug", required=True, help="Short folder name, eg 'best-retinol-serums'")
    parser.add_argument("--threshold", type=int, default=DEFAULT_HASH_THRESHOLD,
                         help="Visual match strictness for stage 3, lower is stricter")
    args = parser.parse_args()

    api_key = os.environ.get("FIRECRAWL_API_KEY")
    if not api_key:
        raise SystemExit("Set FIRECRAWL_API_KEY before running this script.")

    app = Firecrawl(api_key=api_key)

    base_dir = Path("scraped-content") / args.slug
    old_dir, new_dir = base_dir / "old", base_dir / "new"
    old_dir.mkdir(parents=True, exist_ok=True)
    new_dir.mkdir(parents=True, exist_ok=True)

    print(f"Scraping old article: {args.old_url}")
    old_result = scrape_article(app, args.old_url)
    old_dict = old_result.model_dump() if hasattr(old_result, "model_dump") else old_result
    (base_dir / "old.json").write_text(json.dumps(old_dict, default=str, indent=2))

    print(f"Scraping new article: {args.new_url}")
    new_result = scrape_article(app, args.new_url)
    new_dict = new_result.model_dump() if hasattr(new_result, "model_dump") else new_result
    (base_dir / "new.json").write_text(json.dumps(new_dict, default=str, indent=2))

    old_html = getattr(old_result, "raw_html", None) or getattr(old_result, "html", None) or ""
    new_html = getattr(new_result, "raw_html", None) or getattr(new_result, "html", None) or ""

    old_body_text = extract_body_text(old_html)
    old_body_html = extract_body_content(old_html)
    (base_dir / "old_body.html").write_text(old_body_html)
    (base_dir / "old_body.txt").write_text(old_body_text)

    old_images = extract_images_with_layout(old_html, site="old")
    new_images = extract_images_with_layout(new_html, site="new")

    old_product_links = extract_product_links(old_html)
    old_intro = extract_intro(old_html)

    print(f"Found {len(old_images)} image(s) on old, {len(new_images)} on new.")
    print(f"Body text: {len(old_body_text.split())} words (sidebar excluded).")
    if old_intro:
        print(f"Editorial intro found ({len(old_intro)} chars).")
    same_count = len(old_images) == len(new_images)
    print("Stage 1 and 2: matching by position, alt text, filename and dimensions, no downloads...")
    cheap_matches, unmatched_old, unmatched_new = cheap_match(old_images, new_images)
    low_confidence = [m for m in cheap_matches if m.get("needs_manual_check")]
    print(f"  Matched {len(cheap_matches)} image(s) without downloading anything.")
    if same_count:
        print(f"  ({len(low_confidence)} of those were matched by position but scored low, worth a manual look.)")

    print("Stage 3: visual check for anything still unresolved...")
    visual_matches, still_unmatched = visual_match(
        unmatched_old, unmatched_new, old_dir / "images", new_dir / "images", args.threshold
    )

    all_matches = cheap_matches + visual_matches

    report = {
        "slug": args.slug,
        "old_url": args.old_url,
        "new_url": args.new_url,
        "old_word_count_full": len((getattr(old_result, "markdown", None) or "").split()),
        "old_word_count_body": len(old_body_text.split()),
        "new_word_count": len((getattr(new_result, "markdown", None) or "").split()),
        "old_image_count": len(old_images),
        "new_image_count": len(new_images),
        "images_matched_by_position": len([m for m in cheap_matches if m["matched_by"] == "position"]),
        "images_matched_by_weighted_signals": len([m for m in cheap_matches if m["matched_by"] == "weighted_signals"]),
        "images_matched_by_visual_check": len(visual_matches),
        "images_downloaded": len(unmatched_old) + len(unmatched_new),
        "matches_needing_manual_check": low_confidence,
        "image_matches": all_matches,
        "images_missing_from_new_site": [
            {"src": img["src"], "alt": img["alt"], "order": img["order"], "local_path": img.get("local_path")}
            for img in still_unmatched
        ],
        "layout_differences": [m for m in all_matches if m["layout_flags"]],
        "intro": old_intro,
        "intro_length": len(old_intro),
        "product_links": old_product_links,
        "product_link_count": len(old_product_links),
        "affiliate_link_count": len([l for l in old_product_links if l["is_affiliate"]]),
        "component_recommendations": [
            {
                "order": m["old_order"],
                "old_src": m["old_src"],
                "recommended": m["recommended_component"],
            }
            for m in all_matches if m.get("recommended_component")
        ],
    }

    report_path = base_dir / "report.json"
    report_path.write_text(json.dumps(report, indent=2))

    print(f"\nDone. Report saved to {report_path}")
    print(f"Matched by position: {report['images_matched_by_position']}")
    print(f"Matched by weighted signals: {report['images_matched_by_weighted_signals']}")
    print(f"Matched by visual check (downloaded): {len(visual_matches)}")
    print(f"Low confidence, worth a manual look: {len(low_confidence)}")
    print(f"Images missing from new site: {len(still_unmatched)}")
    print(f"Images with layout differences: {len(report['layout_differences'])}")
    print(f"Product links found: {report['product_link_count']} ({report['affiliate_link_count']} affiliate)")
    if report["intro"]:
        print(f"Editorial intro: {report['intro_length']} chars")
        print(f"  Preview: {report['intro'][:120]}...")
    else:
        print("Editorial intro: NONE FOUND (may be missing from article)")

    recs = report.get("component_recommendations", [])
    if recs:
        print(f"\nComponent recommendations ({len(recs)} images):")
        for r in recs:
            comp = r["recommended"]
            tag = comp.get("component", "?")
            dims = f' width="{comp["width"]}" height="{comp["height"]}"' if "width" in comp else ""
            print(f"  [{r['order']}] {tag}{dims} — {comp.get('rationale', '')}")

    print("\nNext step: open Claude Code, point it at this folder, and ask it")
    print("to fix the new article using report.json as its instructions.")


if __name__ == "__main__":
    main()
