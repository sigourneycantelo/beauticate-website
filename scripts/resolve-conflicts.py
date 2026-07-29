#!/usr/bin/env python3
"""Resolve committed git-merge-conflict markers left in MDX bodies.
Per-file decision: keep HEAD or the incoming (batch delimiter-fix) side, chosen
by whichever side preserved proper paragraph/heading structure and closed bold.
Only touches WELL-FORMED conflicts (<<<<<<< / ======= / >>>>>>>). The 5 files
with orphaned/partial markers are handled separately by hand."""
import sys, io

BASE = "content"
# slug substring -> side to KEEP
DECISION = {
    "traditional-chinese-medicine-body-clock": "HEAD",
    "how-to-model-workout": "HEAD",
    "how-to-green-up-your-workspace-for-optimal-health": "HEAD",
    "how-to-create-an-inspirational-workspace-with-hayley-bonham": "HEAD",
    "skin-temple-melbourne": "INC",
    "the-parlour-room": "INC",
    "paddington-beauty-room-paddington": "INC",
    "clear-skincare-clinic-clarence-street-sydney": "INC",
    "tan-temple-bondi": "INC",
    "your-ultimate-guide-to-mini-bags-10-mini-bags-to-elevate-your-style": "HEAD",
    "4-makeup-artist-approved-tricks-to-brighten-up-tired-eyes": "HEAD",
    "blue-eyeshadow-its-back-and-artier-than-ever": "HEAD",
    "systeme-bio-plus-oil-serum-review": "INC",
    "how-can-i-stop-chlorine-ruining-my-hair": "HEAD",
    "three-meadows": "HEAD",
    "pages/about.mdx": "INC",
    "teresa-cutter-chef-and-nutritionist-1": "HEAD",
    "katrina-lawrence-author": "HEAD",
}

def resolve(path, keep):
    with io.open(path, "r", encoding="utf-8") as f:
        lines = f.read().split("\n")
    out, state, head, inc = [], 0, [], []
    n = 0
    for ln in lines:
        if ln.startswith("<<<<<<<"):
            state, head, inc = 1, [], []
            continue
        if ln.startswith("=======") and state == 1 and len(ln.strip()) == 7:
            state = 2
            continue
        if ln.startswith(">>>>>>>") and state in (1, 2):
            out.extend(head if keep == "HEAD" else inc)
            state, n = 0, n + 1
            continue
        if state == 1:
            head.append(ln)
        elif state == 2:
            inc.append(ln)
        else:
            out.append(ln)
    with io.open(path, "w", encoding="utf-8") as f:
        f.write("\n".join(out))
    return n

if __name__ == "__main__":
    files = [l.strip() for l in open("/tmp/conflict-files.txt") if l.strip()]
    total = 0
    for path in files:
        key = next((k for k in DECISION if k in path), None)
        if not key:
            continue
        c = resolve(path, DECISION[key])
        if c:
            print(f"  resolved {c} conflict(s) [{DECISION[key]}]  {path.split('content/')[1]}")
            total += c
    print(f"\nTotal well-formed conflicts resolved: {total}")
