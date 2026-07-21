#!/usr/bin/env python3
"""
Parse the Beauticate WordPress WXR export and extract the intro paragraph(s)
for every post — i.e. the text that appears before the first <h2> section
heading in the original WordPress HTML.

Usage (run from repo root on your Mac):
    python3 scripts/extract-wp-intros.py \\
        migration/beauticate.WordPress.2026-06-23.xml \\
        data/wp-intros.json

Then commit data/wp-intros.json and push — the cloud-side patch script uses it.

Output shape:
{
  "<slug>": "Full intro paragraph text, complete sentence(s).",
  ...
}
"""

import html
import json
import re
import sys
from pathlib import Path
import xml.etree.ElementTree as ET

# WordPress WXR namespaces
NS = {
    'content': 'http://purl.org/rss/1.0/modules/content/',
    'wp':      'http://wordpress.org/export/1.2/',
}


def html_to_text(fragment: str) -> str:
    """Strip HTML tags and decode entities from a small HTML fragment."""
    # Remove HTML tags
    text = re.sub(r'<[^>]+>', ' ', fragment)
    # Decode HTML entities
    text = html.unescape(text)
    # Collapse whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    return text


def extract_intro(wp_html: str) -> str:
    """
    Return the plain-text intro: all content before the first <h2> (or <h3>).
    Returns empty string if there is no intro text.
    """
    # Find position of first section heading
    heading_match = re.search(r'<h[23][\s>]', wp_html, re.IGNORECASE)
    if heading_match:
        before = wp_html[:heading_match.start()]
    else:
        # No headings — entire content is potentially intro; skip (too long)
        return ''

    # Pull out text from <p> tags in the intro block
    paras = re.findall(r'<p[^>]*>(.*?)</p>', before, re.IGNORECASE | re.DOTALL)
    parts = []
    for p in paras:
        text = html_to_text(p)
        if text:
            parts.append(text)

    # If no <p> tags, fall back to stripping all tags from the raw block
    if not parts:
        text = html_to_text(before)
        if text:
            parts = [text]

    return '\n\n'.join(parts)


def parse_wxr(xml_path: str) -> dict:
    print(f'Loading {xml_path} …', file=sys.stderr)
    try:
        tree = ET.parse(xml_path)
    except ET.ParseError as e:
        sys.exit(f'XML parse error: {e}')

    root = tree.getroot()
    channel = root.find('channel')
    if channel is None:
        sys.exit('ERROR: No <channel> element — is this a WXR/WordPress export?')

    result = {}
    scanned = 0
    found = 0
    skipped_no_intro = 0

    for item in channel.findall('item'):
        post_type_el = item.find('wp:post_type', NS)
        if post_type_el is None or post_type_el.text != 'post':
            continue

        status_el = item.find('wp:status', NS)
        if status_el is None or status_el.text not in ('publish', 'private', 'draft'):
            continue

        slug_el = item.find('wp:post_name', NS)
        if slug_el is None or not (slug_el.text or '').strip():
            continue
        slug = slug_el.text.strip()

        content_el = item.find('content:encoded', NS)
        if content_el is None or not content_el.text:
            continue

        scanned += 1
        intro = extract_intro(content_el.text)

        if not intro:
            skipped_no_intro += 1
            continue

        result[slug] = intro
        found += 1

    print(
        f'Scanned {scanned} posts → {found} have intros '
        f'({skipped_no_intro} had no intro before first heading).',
        file=sys.stderr,
    )
    return result


def main():
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)

    xml_path = sys.argv[1]
    out_path = Path(sys.argv[2])

    if not Path(xml_path).exists():
        sys.exit(f'ERROR: XML not found: {xml_path}')

    data = parse_wxr(xml_path)

    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + '\n')
    print(f'Written → {out_path}  ({out_path.stat().st_size // 1024} KB)', file=sys.stderr)


if __name__ == '__main__':
    main()
