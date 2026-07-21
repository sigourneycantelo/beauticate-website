#!/usr/bin/env python3
"""
Reposition footer-dumped images in pre-migration MDX articles.

For each article where ALL images appear after ALL body text (the "footer-dump"
pattern from the WordPress migration), this script moves images inline:

  1. If data/live-image-positions.json has scraped positions for the slug,
     use those (after_para values from the live WordPress page).
  2. If there are section headers (## ...), distribute images one-per-section
     right after each header, with any extras after the last section.
  3. Otherwise, distribute images evenly among paragraphs.

Usage:
    python3 scripts/apply-image-positions.py              # dry-run (default)
    python3 scripts/apply-image-positions.py --apply      # actually write files
    python3 scripts/apply-image-positions.py --slug foo   # single article

Dry-run prints what would change without modifying any files.
"""

import json
import re
import sys
from pathlib import Path

APPLY   = "--apply" in sys.argv
SLUG_FILTER = None
if "--slug" in sys.argv:
    idx = sys.argv.index("--slug")
    SLUG_FILTER = sys.argv[idx + 1] if idx + 1 < len(sys.argv) else None

MIGRATION_DATE = "2026-06-18"


def load_live_positions():
    p = Path("data/live-image-positions.json")
    if p.exists():
        data = json.loads(p.read_text())
        return {k: v for k, v in data.items() if v.get("images")}
    return {}


def load_wp_positions():
    p = Path("data/wp-image-positions.json")
    if p.exists():
        data = json.loads(p.read_text())
        useful = {}
        for slug, info in data.items():
            imgs = info.get("images", [])
            if imgs and any(img["after_para"] > 0 for img in imgs):
                useful[slug] = info
        return useful
    return {}


def find_footer_dumped():
    """Find MDX articles where all images are after all body text."""
    articles = []
    for f in sorted(Path("content").rglob("*.mdx")):
        if "pages" in f.parts:
            continue
        text = f.read_text()
        parts = text.split("---", 2)
        if len(parts) < 3:
            continue
        fm, body = parts[1], parts[2]

        dm = re.search(r'date_published:\s*["\']?(\d{4}-\d{2}-\d{2})', fm)
        if not dm or dm.group(1) >= MIGRATION_DATE:
            continue

        slug_m = re.search(r'slug:\s*["\']?([^\n"\']+)', fm)
        if not slug_m:
            continue
        slug = slug_m.group(1).strip()

        if SLUG_FILTER and slug != SLUG_FILTER:
            continue

        body_stripped = body.strip()
        lines = body_stripped.split("\n")
        img_lines = [i for i, l in enumerate(lines) if re.match(r"\s*!\[", l)]
        content_lines = [i for i, l in enumerate(lines)
                         if l.strip() and not re.match(r"\s*!\[", l)]

        if not img_lines or not content_lines:
            continue
        if img_lines[0] <= content_lines[-1]:
            continue

        articles.append({
            "slug": slug,
            "path": str(f),
            "frontmatter": fm,
            "body": body,
            "img_lines": img_lines,
            "n_imgs": len(img_lines),
        })
    return articles


def extract_images_from_body(body):
    """Extract image markdown lines from the body, return (clean_body, images).

    clean_body has all image lines removed (plus trailing blank lines).
    images is a list of image markdown strings.
    """
    lines = body.split("\n")
    images = []
    clean_lines = []
    for line in lines:
        if re.match(r"\s*!\[", line):
            images.append(line.strip())
        else:
            clean_lines.append(line)

    # Remove trailing blank lines from clean body
    while clean_lines and not clean_lines[-1].strip():
        clean_lines.pop()

    return "\n".join(clean_lines), images


def count_paragraphs(lines):
    """Count non-empty, non-heading text paragraphs."""
    count = 0
    for line in lines:
        stripped = line.strip()
        if stripped and not stripped.startswith("#") and not stripped.startswith("!"):
            count += 1
    return count


def find_section_headers(lines):
    """Find indices of ## section headers in the lines.

    Only short header-like lines count. Long ### lines that are really
    intro paragraphs (common in WP migration) are excluded.
    """
    headers = []
    for i, line in enumerate(lines):
        stripped = line.strip()
        m = re.match(r"^(#{2,3})\s+(.+)", stripped)
        if not m:
            continue
        level = len(m.group(1))
        text = m.group(2).strip()
        # Skip ### lines that look like full paragraphs (>80 chars)
        if level == 3 and len(text) > 80:
            continue
        headers.append(i)
    return headers


def find_paragraph_positions(lines):
    """Find line indices where paragraphs end (non-empty content lines)."""
    positions = []
    for i, line in enumerate(lines):
        stripped = line.strip()
        if stripped and not stripped.startswith("#"):
            positions.append(i)
    return positions


def reposition_with_live_data(clean_body, images, position_data):
    """Use scraped live positions (after_para values) to place images."""
    lines = clean_body.split("\n")

    # Count paragraphs and track their line positions
    para_end_lines = []  # line index where each paragraph ends
    for i, line in enumerate(lines):
        stripped = line.strip()
        if stripped and not stripped.startswith("#") and not stripped.startswith("!["):
            para_end_lines.append(i)

    pos_images = position_data.get("images", [])

    # Build insertion map: line_index -> [image_markdowns]
    insertions = {}
    used_images = set()

    for pi in sorted(pos_images, key=lambda x: x["order"]):
        after_para = pi["after_para"]
        fn = pi.get("filename", "").lower()

        # Find best matching image by filename
        best_idx = None
        best_score = -1
        for idx, img_md in enumerate(images):
            if idx in used_images:
                continue
            img_fn = re.search(r"!\[.*?\]\(.*?/([^/]+)\)", img_md)
            if img_fn:
                img_filename = img_fn.group(1).lower()
                # Score: exact match > partial match > order match
                if img_filename == fn:
                    best_idx = idx
                    best_score = 100
                    break
                elif fn and fn.split(".")[0] in img_filename:
                    if best_score < 50:
                        best_idx = idx
                        best_score = 50

        if best_idx is None:
            # Use next unused image
            for idx in range(len(images)):
                if idx not in used_images:
                    best_idx = idx
                    break

        if best_idx is None:
            continue

        used_images.add(best_idx)

        # Determine insertion line
        if after_para == 0:
            insert_after = -1  # before first line
        elif after_para <= len(para_end_lines):
            insert_after = para_end_lines[after_para - 1]
        else:
            insert_after = para_end_lines[-1] if para_end_lines else len(lines) - 1

        insertions.setdefault(insert_after, []).append(images[best_idx])

    # Place any remaining images at the end
    for idx, img_md in enumerate(images):
        if idx not in used_images:
            end = len(lines) - 1
            insertions.setdefault(end, []).append(img_md)

    return apply_insertions(lines, insertions)


def reposition_by_sections(clean_body, images):
    """Place images after section headers (##). First image goes before first section."""
    lines = clean_body.split("\n")
    headers = find_section_headers(lines)

    if not headers:
        return reposition_evenly(clean_body, images)

    # Strategy: first image at top, then one image per section header
    insertions = {}
    img_idx = 0

    # If there's content before the first header, put first image at the top
    first_content = -1
    for i, line in enumerate(lines):
        if line.strip() and not line.strip().startswith("#"):
            first_content = i
            break

    if first_content >= 0 and first_content < headers[0] and img_idx < len(images):
        # Place first image after the first content paragraph before sections
        insertions.setdefault(first_content, []).append(images[img_idx])
        img_idx += 1

    # One image per section header
    for h_idx, h_line in enumerate(headers):
        if img_idx >= len(images):
            break

        # Find the end of the header's intro text (next non-empty line after header)
        # Place image right after the header line
        insertions.setdefault(h_line, []).append(images[img_idx])
        img_idx += 1

    # Any remaining images: distribute after the last section's paragraphs
    if img_idx < len(images):
        remaining = images[img_idx:]
        last_header = headers[-1] if headers else 0

        # Find paragraphs after the last header
        paras_after = []
        for i in range(last_header + 1, len(lines)):
            stripped = lines[i].strip()
            if stripped and not stripped.startswith("#") and not stripped.startswith("!["):
                paras_after.append(i)

        if paras_after and len(remaining) <= len(paras_after):
            # Distribute remaining evenly among paragraphs after last header
            step = max(1, len(paras_after) // (len(remaining) + 1))
            for r_idx, img in enumerate(remaining):
                pos = min((r_idx + 1) * step, len(paras_after) - 1)
                insertions.setdefault(paras_after[pos], []).append(img)
        else:
            # Just append at the end
            end_line = len(lines) - 1
            for img in remaining:
                insertions.setdefault(end_line, []).append(img)

    return apply_insertions(lines, insertions)


def reposition_evenly(clean_body, images):
    """Distribute images evenly among paragraphs."""
    lines = clean_body.split("\n")
    paras = find_paragraph_positions(lines)

    if not paras:
        # No paragraphs, just put images at the end
        return clean_body + "\n\n" + "\n\n".join(images) + "\n"

    insertions = {}
    n_imgs = len(images)

    if n_imgs == 1:
        # Single image: put after first paragraph
        insertions[paras[0]] = [images[0]]
    else:
        # Distribute evenly
        step = max(1, len(paras) / (n_imgs + 1))
        for i, img in enumerate(images):
            pos_idx = min(int((i + 1) * step) - 1, len(paras) - 1)
            pos_idx = max(0, pos_idx)
            insertions.setdefault(paras[pos_idx], []).append(img)

    return apply_insertions(lines, insertions)


def apply_insertions(lines, insertions):
    """Apply image insertions into lines. Returns new body text."""
    if not insertions:
        return "\n".join(lines)

    result = []
    for i, line in enumerate(lines):
        result.append(line)
        if i in insertions:
            for img in insertions[i]:
                result.append("")
                result.append(img)
                result.append("")

    # Special case: insertions at -1 go before everything
    if -1 in insertions:
        prefix = []
        for img in insertions[-1]:
            prefix.append(img)
            prefix.append("")
        result = prefix + result

    # Clean up multiple consecutive blank lines
    cleaned = []
    prev_blank = False
    for line in result:
        is_blank = not line.strip()
        if is_blank and prev_blank:
            continue
        cleaned.append(line)
        prev_blank = is_blank

    return "\n".join(cleaned)


def main():
    live_positions = load_live_positions()
    wp_positions = load_wp_positions()
    articles = find_footer_dumped()

    print(f"Found {len(articles)} footer-dumped articles", file=sys.stderr)
    print(f"Live position data: {len(live_positions)} slugs", file=sys.stderr)
    print(f"WP position data (varied): {len(wp_positions)} slugs", file=sys.stderr)
    if not APPLY:
        print("DRY RUN — pass --apply to write files\n", file=sys.stderr)

    modified = 0
    skipped = 0
    by_method = {"live": 0, "wp": 0, "sections": 0, "even": 0}

    for art in articles:
        slug = art["slug"]
        filepath = Path(art["path"])
        body = art["body"]

        clean_body, images = extract_images_from_body(body)

        if not images:
            skipped += 1
            continue

        method = None
        if slug in live_positions:
            new_body = reposition_with_live_data(clean_body, images, live_positions[slug])
            method = "live"
        elif slug in wp_positions:
            new_body = reposition_with_live_data(clean_body, images, wp_positions[slug])
            method = "wp"
        else:
            # Heuristic: check for section headers
            clean_lines = clean_body.split("\n")
            headers = find_section_headers(clean_lines)
            if headers and len(headers) >= 2:
                new_body = reposition_by_sections(clean_body, images)
                method = "sections"
            else:
                new_body = reposition_evenly(clean_body, images)
                method = "even"

        # Reconstruct full file
        original = filepath.read_text()
        parts = original.split("---", 2)
        new_content = f"---{parts[1]}---{new_body}\n"

        if new_content == original:
            skipped += 1
            continue

        by_method[method] += 1
        modified += 1
        print(f"  [{method:8s}] {slug} ({len(images)} imgs)", file=sys.stderr)

        if APPLY:
            filepath.write_text(new_content)

    print(f"\nResults:", file=sys.stderr)
    print(f"  Modified: {modified}", file=sys.stderr)
    print(f"  Skipped:  {skipped}", file=sys.stderr)
    print(f"  By method: {by_method}", file=sys.stderr)
    if not APPLY and modified > 0:
        print(f"\nRun with --apply to write changes.", file=sys.stderr)


if __name__ == "__main__":
    main()
