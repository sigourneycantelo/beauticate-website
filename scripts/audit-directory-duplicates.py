#!/usr/bin/env python3
"""
Find directory listings (content/destinations/{clinics,salons,spas-retreats,
bathhouses,wellness}) that describe the same venue under different paths.

This happens when a listing gets re-filed to a new subcategory (e.g.
clinics/ -> salons/) by copying the file instead of moving it, leaving a
stale duplicate behind. Run before any bulk publish/unpublish pass on
directory listings — see "Directory listings" in CLAUDE.md.

Usage: python3 scripts/audit-directory-duplicates.py
"""
import glob
import itertools
import re
from collections import defaultdict

SUBCATEGORIES = ['clinics', 'salons', 'spas-retreats', 'bathhouses', 'wellness']


def normalize(title: str) -> str:
    return re.sub(r'[^a-z0-9]', '', title.lower())


def main():
    files = list(itertools.chain.from_iterable(
        glob.glob(f'content/destinations/{d}/**/*.mdx', recursive=True)
        for d in SUBCATEGORIES
    ))

    by_title = defaultdict(list)
    for f in files:
        with open(f, encoding='utf-8', errors='replace') as fh:
            content = fh.read()
        title_match = re.search(r"^title:\s*['\"]?(.+?)['\"]?\s*$", content, re.MULTILINE)
        pub_match = re.search(r'^published:\s*(true|false)', content, re.MULTILINE)
        if not title_match:
            continue
        title = title_match.group(1)
        published = pub_match.group(1) if pub_match else 'true (default)'
        by_title[normalize(title)].append((f, title, published))

    dupes = {k: v for k, v in by_title.items() if len(v) > 1}

    if not dupes:
        print('No duplicate listings found.')
        return

    live_dupes = 0
    print(f'Found {len(dupes)} duplicate listing groups:\n')
    for entries in dupes.values():
        both_live = all(e[2] == 'true' or e[2] == 'true (default)' for e in entries)
        if both_live:
            live_dupes += 1
        marker = '  *** LIVE ON SITE TWICE ***' if both_live else ''
        print(f'--- {entries[0][1]}{marker} ---')
        for f, _title, pub in entries:
            print(f'  [{pub:>15}] {f}')
        print()

    print(f'{live_dupes} of {len(dupes)} groups are currently published twice — fix these first.')


if __name__ == '__main__':
    main()
