#!/usr/bin/env python3
"""
Parse the Beauticate WordPress WXR export and produce a per-slug image-position map.

The output JSON tells the cloud-side repositioning script exactly which image
(by filename) appeared after which paragraph in the original WordPress HTML,
so images can be placed correctly in MDX files.

Usage (run from repo root on your Mac):
    python3 scripts/parse-wp-image-positions.py \\
        migration/beauticate.WordPress.2026-06-23.xml \\
        data/wp-image-positions.json

Then commit data/wp-image-positions.json and push — the cloud script uses it.

Output shape:
{
  "<slug>": {
    "images": [
      {
        "order": 1,           // 1-indexed position in the post body
        "filename": "foo.jpg",
        "alt": "alt text",
        "after_para": 2       // 0-indexed paragraph this image follows in WP HTML
                              // (0 = before any paragraph = top of article)
      },
      ...
    ]
  },
  ...
}
"""

import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path
import xml.etree.ElementTree as ET

# WordPress WXR namespaces
NS = {
    'content': 'http://purl.org/rss/1.0/modules/content/',
    'wp':      'http://wordpress.org/export/1.2/',
}


class WPContentParser(HTMLParser):
    """
    Pull paragraphs and images from WordPress post HTML in document order.

    We count non-empty <p> tags as paragraph indices.  Each <img> is
    associated with the paragraph count at the moment it appears, so
    after_para=2 means "this image came after the third paragraph (0-indexed)."
    An image that appears before any paragraph gets after_para=0.
    """

    def __init__(self):
        super().__init__()
        self._in_p = False
        self._p_buf = []
        self._para_count = 0     # paragraphs completed so far
        self.items = []          # ('p', idx, text) | ('img', after_para, filename, alt)

    def handle_starttag(self, tag, attrs):
        t = tag.lower()
        if t == 'p':
            self._in_p = True
            self._p_buf = []
        elif t == 'img':
            ad = dict(attrs)
            src = (ad.get('src') or '').split('?')[0]   # strip query string
            alt = (ad.get('alt') or '').strip()
            filename = Path(src).name
            if filename and '.' in filename:
                self.items.append(('img', self._para_count, filename, alt))

    def handle_endtag(self, tag):
        if tag.lower() == 'p':
            text = ''.join(self._p_buf).strip()
            # Only count paragraphs that contain visible text
            visible = re.sub(r'<[^>]+>', '', text).strip()
            if visible:
                self.items.append(('p', self._para_count, text[:120]))
                self._para_count += 1
            self._in_p = False
            self._p_buf = []

    def handle_data(self, data):
        if self._in_p:
            self._p_buf.append(data)

    def handle_entityref(self, name):
        if self._in_p:
            self._p_buf.append(f'&{name};')

    def handle_charref(self, name):
        if self._in_p:
            self._p_buf.append(f'&#{name};')


def parse_wxr(xml_path: str) -> dict:
    print(f'Loading {xml_path} …', file=sys.stderr)
    try:
        tree = ET.parse(xml_path)
    except ET.ParseError as e:
        sys.exit(f'XML parse error: {e}')

    root = tree.getroot()
    channel = root.find('channel')
    if channel is None:
        sys.exit('ERROR: No <channel> element found — is this a WXR/WordPress export file?')

    result = {}
    posts_scanned = 0
    posts_with_images = 0

    for item in channel.findall('item'):
        # Only published or draft posts (skip pages, attachments, etc.)
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

        html = content_el.text
        if '<img' not in html:
            continue   # fast-path: skip posts with no images

        posts_scanned += 1

        parser = WPContentParser()
        try:
            parser.feed(html)
        except Exception as e:
            print(f'  WARN HTML parse error for {slug}: {e}', file=sys.stderr)
            continue

        # Filter image items before unpacking (paragraph items are 3-tuples, image items 4-tuples)
        images = [(item[1], item[2], item[3])
                  for item in parser.items
                  if item[0] == 'img']

        if not images:
            continue

        posts_with_images += 1
        image_list = [
            {
                'order':     order,
                'filename':  filename,
                'alt':       alt,
                'after_para': after_para,
            }
            for order, (after_para, filename, alt) in enumerate(images, 1)
        ]

        result[slug] = {'images': image_list}

    print(
        f'Scanned {posts_scanned} published posts, '
        f'{posts_with_images} have images → {len(result)} entries written.',
        file=sys.stderr,
    )
    return result


def main():
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)

    xml_path  = sys.argv[1]
    out_path  = Path(sys.argv[2])

    if not Path(xml_path).exists():
        sys.exit(f'ERROR: XML not found: {xml_path}')

    data = parse_wxr(xml_path)

    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + '\n')
    print(f'Written → {out_path}  ({out_path.stat().st_size // 1024} KB)', file=sys.stderr)


if __name__ == '__main__':
    main()
