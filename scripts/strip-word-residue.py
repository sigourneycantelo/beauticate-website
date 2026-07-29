#!/usr/bin/env python3
"""Remove leftover MS-Word metadata residue tokens sitting as standalone lines in
migrated MDX bodies (author initials 'nic', 'JA', 'X-NONE', 'EN-US', Word font
metrics like '14.0'/'18 pt', and empty '###' headings). These are the remnants
in files that did NOT carry the full mso-* CSS block (already handled separately).

Dry-run by default; --apply writes. Only touches the body (after frontmatter).
Borderline words (Normal/false/true) are FLAGGED, not auto-removed, unless
--include-words is passed."""
import io, glob, re, sys

APPLY = '--apply' in sys.argv
INCLUDE_WORDS = '--include-words' in sys.argv

CERTAIN = re.compile(r'^(nic|JA|X-NONE|EN-[A-Z]{2}|\d+\.\d+|\d+\s?pt|Normal\.dotm)$')
EMPTY_H = re.compile(r'^#{1,6}\s*$')
WORDS = re.compile(r'^(Normal|false|true)$')

def split_fm(t):
    if t.startswith('---\n'):
        p = t.split('\n---\n', 1)
        if len(p) == 2:
            return p[0] + '\n---\n', p[1]
    return '', t

total_removed, total_flagged, changed = 0, 0, 0
for f in sorted(glob.glob('content/**/*.mdx', recursive=True)):
    t = io.open(f, encoding='utf-8').read()
    fm, body = split_fm(t)
    out, removed, flagged = [], 0, 0
    for l in body.split('\n'):
        s = l.strip()
        if CERTAIN.match(s) or EMPTY_H.match(s):
            removed += 1; continue
        if WORDS.match(s):
            flagged += 1
            if INCLUDE_WORDS:
                removed += 1; continue
        out.append(l)
    if removed:
        newbody = re.sub(r'\n{3,}', '\n\n', '\n'.join(out))
        if APPLY:
            io.open(f, 'w', encoding='utf-8').write(fm + newbody.rstrip('\n') + '\n')
        changed += 1
        total_removed += removed
    total_flagged += flagged
    if flagged and not INCLUDE_WORDS:
        for l in body.split('\n'):
            if WORDS.match(l.strip()):
                print(f"  FLAG {f.split('content/')[1]}: [{l.strip()}]")

print(f"\n{'APPLIED' if APPLY else 'DRY RUN'}: removed {total_removed} tokens from {changed} files; {total_flagged} Normal/false/true flagged")
