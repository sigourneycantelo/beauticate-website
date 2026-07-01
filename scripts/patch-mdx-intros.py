#!/usr/bin/env python3
"""
Patch MDX article files with intro paragraphs fetched from the live WordPress site.

Run from repo root AFTER data/wp-live-intros.json has been committed and pulled:

    python3 scripts/patch-mdx-intros.py [--dry-run]

Reads data/wp-live-intros.json (produced by fetch-wp-intros.py) and inserts
the intro text at the top of each article body that is currently missing one.

Only patches articles where:
  - date_published is before 2026-06-18 (pre-migration)
  - body starts with a heading (no intro currently)
  - wp-live-intros.json has a non-empty intro for this slug
"""

import re
import sys
import json
from pathlib import Path

CONTENT_DIR = Path(__file__).parent.parent / 'content'
INTROS_FILE = Path(__file__).parent.parent / 'data' / 'wp-live-intros.json'

DRY_RUN = '--dry-run' in sys.argv


def main():
    if not INTROS_FILE.exists():
        sys.exit(f'ERROR: {INTROS_FILE} not found. Run fetch-wp-intros.py first.')

    intros = json.loads(INTROS_FILE.read_text())
    usable = {slug: d['text'] for slug, d in intros.items() if d.get('text', '').strip()}
    print(f'Loaded {len(usable)} usable intros from {INTROS_FILE.name}')

    patched = 0
    skipped_no_intro = 0
    skipped_already_has = 0

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
        if not (body.startswith('#') or body.startswith('\n#')):
            skipped_already_has += 1
            continue

        slug_m = re.search(r'slug:\s*"?([^"\n]+)', fm)
        if not slug_m:
            continue
        slug = slug_m.group(1).strip()

        intro = usable.get(slug, '').strip()
        if not intro:
            skipped_no_intro += 1
            continue

        new_text = f'---{fm}---\n\n{intro}\n\n{body}\n'

        if DRY_RUN:
            print(f'[DRY] Would patch: {mdx.name}')
            print(f'      Intro: {intro[:100]}...')
        else:
            mdx.write_text(new_text, encoding='utf-8')
            patched += 1
            if patched <= 5 or patched % 100 == 0:
                print(f'  Patched [{patched}]: {slug}')

    suffix = ' (dry run)' if DRY_RUN else ''
    print(f'\nDone{suffix}.')
    print(f'  Patched:          {patched}')
    print(f'  Already has intro:{skipped_already_has}')
    print(f'  No intro in JSON: {skipped_no_intro}')


if __name__ == '__main__':
    main()
