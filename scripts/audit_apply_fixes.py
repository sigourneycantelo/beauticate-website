#!/usr/bin/env python3
"""
Applies the approved ACTION fixes from scripts/audit_build_sheet.py to the MDX.

Matching is whitespace-tolerant: the offending sentences were captured with
whitespace collapsed, but the source has line breaks inside them, so an exact
string match fails on roughly half. Tokens are joined with \\s+ instead.

Three kinds of fix:
  REPLACE  swap the sentence for the approved wording
  DELETE   remove the sentence and tidy the whitespace it leaves behind
  MANUAL   "REMOVE the section" and similar. Reported, never auto-applied,
           because deciding where a section ends is an editorial judgement.

Nothing is written unless --write is passed. Run it dry first.

  python3 scripts/audit_apply_fixes.py          # dry run
  python3 scripts/audit_apply_fixes.py --write
"""

import json, pathlib, re, sys, importlib.util
import yaml

ROOT = pathlib.Path(__file__).resolve().parent.parent
WRITE = "--write" in sys.argv

spec = importlib.util.spec_from_file_location("sheet", ROOT / "scripts" / "audit_build_sheet.py")
sheet = importlib.util.module_from_spec(spec)
sys.modules["sheet"] = sheet
spec.loader.exec_module(sheet)

rows = json.loads((ROOT / "docs" / "audit" / "lines-to-fix.json").read_text())


def flexible(sentence: str) -> re.Pattern:
    """Match the sentence regardless of how it wraps in the source."""
    toks = [re.escape(t) for t in sentence.split()]
    return re.compile(r"\s+".join(toks))


def trim_quotes(text: str, start: int, end: int) -> tuple[int, int]:
    """
    Shrink a match so it can never swallow a string delimiter.

    Frontmatter values are quoted YAML strings, and the captured sentences
    sometimes include the closing quote. Replacing that span with unquoted prose
    leaves an unterminated scalar and breaks the whole file. First run of this
    script did exactly that to 12 articles.
    """
    while start < end and text[start] in "\"'":
        start += 1
    while end > start and text[end - 1] in "\"'":
        end -= 1
    return start, end


def frontmatter_ok(text: str) -> bool:
    m = re.match(r"^---\n(.*?)\n---\n", text, re.S)
    if not m:
        return True  # no frontmatter to break
    try:
        yaml.safe_load(m.group(1))
        return True
    except Exception:
        return False


applied, missing, manual, skipped = [], [], [], []

for idx, (verdict, fix, note) in sorted(sheet.DECISIONS.items()):
    if verdict != sheet.A:
        continue
    r = rows[idx]
    path = ROOT / r["file"]
    if not path.exists():
        missing.append((idx, r, "file not found"))
        continue

    text = path.read_text(encoding="utf-8")
    pat = flexible(r["sentence"])
    m = pat.search(text)

    if fix.startswith("REMOVE"):
        manual.append((idx, r, fix))
        continue

    if not m:
        # Already handled in an earlier commit, or the wording moved.
        missing.append((idx, r, "sentence not found (already fixed?)"))
        continue

    start, end = trim_quotes(text, *m.span())

    if fix.startswith("DELETE"):
        # Tidy ONLY at the join, never file-wide. A global whitespace collapse
        # flattens YAML indentation and breaks the frontmatter of every article
        # it touches, which is what the first version of this did.
        head, tail = text[:start], text[end:]
        head = re.sub(r"[ \t]+$", "", head)
        tail = re.sub(r"^[ \t]+", "", tail)
        if head.endswith("\n\n\n"):
            head = head.rstrip("\n") + "\n\n"
        joiner = "" if (head.endswith("\n") or tail.startswith("\n") or not tail) else " "
        new = head + joiner + tail
    else:
        new = text[:start] + fix + text[end:]

    # Never leave a file worse than we found it.
    if not frontmatter_ok(new):
        missing.append((idx, r, "WOULD BREAK YAML - needs a human"))
        continue

    if new != text:
        if WRITE:
            path.write_text(new, encoding="utf-8")
        applied.append((idx, r, fix))
    else:
        skipped.append((idx, r, "no change"))

mode = "APPLIED" if WRITE else "DRY RUN"
print(f"=== {mode} ===")
print(f"applied : {len(applied)}")
print(f"manual  : {len(manual)}  (need a human, reported below)")
print(f"missing : {len(missing)}")
print(f"skipped : {len(skipped)}")
print(f"files   : {len(set(a[1]['file'] for a in applied))}")

if manual:
    print("\n--- MANUAL, not applied ---")
    for idx, r, fix in manual:
        print(f"  [{idx}] {r['title'][:52]}\n        {fix}\n        {r['file']}")

if missing:
    print("\n--- NOT FOUND ---")
    for idx, r, why in missing:
        print(f"  [{idx}] {r['title'][:52]} - {why}")
        print(f"        {r['sentence'][:100]}")
