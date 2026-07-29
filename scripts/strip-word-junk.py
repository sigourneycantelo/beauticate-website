#!/usr/bin/env python3
"""Strip MS-Word paste junk (mso-* CSS, table.MsoNormalTable, Normal/0/false/
EN-US/X-NONE metadata dumps) from migrated MDX bodies, salvaging any real prose
glued after a closing ';}'. Dry-run by default; --apply writes.

Safety: prints every dropped line that looks like real prose (long alpha run not
matching a known junk token) so a human can confirm nothing real is removed."""
import io, re, sys

APPLY = '--apply' in sys.argv
files = [a for a in sys.argv[1:] if not a.startswith('--')]

JUNK = re.compile(r'''^(
    Normal(\.dotm)? | \d+ | \d+\.\d+ | \d+\s?pt |
    false | true | EN-[A-Z]{2} | JA | X-NONE |
    /\\+\*\s*Style\ Definitions\s*\\+\*/ |
    table\.MsoNormalTable | \{?mso-[^\n]* |
    font-(family|size):[^\n]* | \} | Sigourney\ Cantelo
)$''', re.X)

WORDISH = ('mso-', 'MsoNormalTable', 'Style Definitions', 'X-NONE')

def salvage(st):
    """If a wordish line ends with ';}' + real content, return the real tail."""
    m = re.search(r';\}\s*(.+)$', st)
    if m and re.search(r'[A-Za-z]', m.group(1)) and 'mso-' not in m.group(1):
        return m.group(1).strip()
    return None

def classify(line):
    st = line.strip()
    if st == '':
        return ('blank', line)
    wordish = any(w in st for w in WORDISH)
    if wordish:
        tail = salvage(st)
        return ('salvage', tail) if tail else ('drop', line)
    if JUNK.match(st):
        return ('drop', line)
    return ('keep', line)

for f in files:
    L = io.open(f, encoding='utf-8').read().split('\n')
    out, dropped, salvaged, suspicious = [], 0, 0, []
    for line in L:
        kind, val = classify(line)
        if kind == 'keep' or kind == 'blank':
            out.append(val)
        elif kind == 'salvage':
            out.append(val); salvaged += 1
        else:  # drop
            dropped += 1
            # flag anything that looks like real prose (4+ letter word, not pure junk token)
            st = line.strip()
            if re.search(r'[A-Za-z]{4,}', st) and not any(w in st for w in WORDISH) \
               and not re.match(r'^(Normal(\.dotm)?|false|true|EN-[A-Z]{2}|JA|Sigourney Cantelo)$', st):
                suspicious.append(st[:100])
    # collapse 3+ blank lines to 1
    txt = re.sub(r'\n{3,}', '\n\n', '\n'.join(out))
    print(f"\n{f.split('content/')[1]}")
    print(f"  dropped {dropped}, salvaged {salvaged} real tails")
    if suspicious:
        print(f"  ⚠ SUSPICIOUS dropped lines (verify!):")
        for s in suspicious: print(f"      | {s}")
    if APPLY:
        io.open(f, 'w', encoding='utf-8').write(txt.rstrip('\n') + '\n')
