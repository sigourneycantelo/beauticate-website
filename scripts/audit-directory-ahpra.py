#!/usr/bin/env python3
"""
AHPRA / TGA audit for the destinations directory listings.

The article archive is covered by scripts/audit-testimonials.mjs, which looks
for testimonials and efficacy claims about THERAPEUTIC GOODS (supplements,
patches, LED devices). This script covers the other half of the exposure:
testimonials about REGULATED HEALTH SERVICES in the clinics/salons/spas
directory.

Why they need separate detectors: the goods test asks "is a restricted product
named near a personal-use claim". The services test asks "does this listing
read as a first-hand account of a treatment with a clinical aspect" — the
product may never be named at all. Section 133(1)(c) of the National Law
catches a *purported* testimonial, meaning anything that "appears to be a
testimonial, whether provided in the first or third person", so the trigger is
the narrated experience itself, not a named good.

Rationale and sources: docs/ask-sig-compliance.md (Rule 4).

Output: docs/audit/directory-ahpra.csv + a summary on stdout.
Nothing here is a legal determination. Every hit needs a human read.
"""

import csv
import json
import os
import re
import sys

ROOT = os.path.join(os.getcwd(), "content", "destinations")
OUT_DIR = os.path.join(os.getcwd(), "docs", "audit")
SCREENED_PATH = os.path.join(OUT_DIR, "directory-ahpra-screened.json")

# Services with a "clinical aspect" in AHPRA's sense — performed by, or under
# the supervision of, a registered health practitioner. This is the test that
# pulls a listing into s133 scope at all.
#
# Split into two tiers because they carry different consequences. STRONG is the
# AHPRA question: is this a regulated health service, so is a testimonial about
# it prohibited outright. DEVICE is the TGA question: is a therapeutic good in
# play, so does the claims layer apply. A listing can be caught by one and not
# the other.
#
# Deliberately NOT in this list: bare "peel" (matches fruit, peel-off masks and
# "I peel myself off the bed"), bare "filler", and a bare "Dr X" name — all
# three produced false positives on beauty salons filed under clinics/ in the
# first pass. Chemical/skin peels and named practitioners are still caught, by
# the longer forms below.
CLINICAL_STRONG = re.compile(
    "|".join([
        r"injectable", r"\banti[\s-]?wrinkle\b", r"\bwrinkle relaxer", r"\bbotox\b",
        r"dermal filler", r"lip filler", r"\bthread lift\b", r"\bcosmetic inject",
        r"skin needling", r"microneedling", r"micro-needling", r"\brf needling\b",
        r"\bprp\b", r"platelet[\s-]?rich", r"bio[\s-]?remodelling", r"profhilo",
        r"\biv (?:drip|therapy|infusion)", r"\bvitamin (?:c|b) (?:drip|infusion)",
        r"\blaser\b", r"\bipl\b", r"\bbbl\b", r"fraxel", r"\bco2 laser",
        r"clear\s?\+\s?brilliant", r"picosure", r"\bfotona\b",
        r"chemical peel", r"skin peel", r"\btca peel", r"medium[\s-]depth peel",
        r"coolsculpt", r"fat dissolv", r"cryolipo", r"\bultherapy\b", r"\bhifu\b",
        r"\bsculptra\b", r"\bmesotherapy\b", r"skin booster",
        r"cosmetic (?:medicine|physician|surgeon|nurse|doctor|practitioner)",
        r"dermatologis", r"plastic surge", r"\bregistered nurse\b",
        r"nurse injector", r"medical director", r"\bparamedical\b",
        r"prescription[\s-](?:skincare|strength|only)", r"\bcosmeceutical prescri",
    ]),
    re.I,
)

# Therapeutic devices — TGA territory rather than AHPRA. Kept separate so a
# listing that only mentions an LED bed is not miscounted as a regulated health
# service.
DEVICE = re.compile(
    "|".join([
        r"\bhealite\b", r"\bled (?:mask|therapy|treatment|light|bed)",
        r"light therapy", r"red light", r"\binfrared\b", r"\bomnilux\b",
        r"\bdermalux\b", r"\bcelluma\b",
    ]),
    re.I,
)

CLINICAL = re.compile(CLINICAL_STRONG.pattern + "|" + DEVICE.pattern, re.I)

# First-person narration of an experience. Deliberately broad — a purported
# testimonial does not have to say "I recommend".
FIRST_PERSON = re.compile(
    "|".join([
        r"\bI\s+(?:am|'m|was|arrive|arrived|walk|walked|book|booked|had|have|having|"
        r"head|headed|leave|left|feel|felt|find|found|notice|noticed|sink|sank|"
        r"lie|lay|settle|settled|emerge|emerged|float|floated|sit|sat|step|stepped|"
        r"go|went|see|saw|meet|met|try|tried|love|loved|expect|expected|wake|woke)\b",
        r"\bmy (?:skin|face|therapist|appointment|treatment|consultation|"
        r"practitioner|session|visit|results?|complexion|concerns?|brows?|lips?)\b",
        r"\bI'?(?:ve|d|ll|m)\b",
    ]),
    re.I,
)

# Bare "me" is a first-person signal, but only in lower case. Case-insensitive
# matching hit the venue name in "Me Skin & Body, South Yarra", so this clause
# is deliberately cased while everything above stays case-insensitive.
FIRST_PERSON_CASED = re.compile(r"\bme\b(?=[^.]*(?:treatment|skin|face|therapist))")

# Someone else's first-hand account being relayed — equally caught by s133.
THIRD_PARTY = re.compile(
    "|".join([
        r"\bclients?\s+(?:rave|swear|say|report|love|come back)",
        r"\bpatients?\s+(?:rave|swear|say|report|love|come back)",
        r"\ba (?:client|patient) (?:told|said)",
        r"\bregulars? (?:swear|say|rave)",
        r"\breviews? (?:say|rave)",
        r"\btestimonial",
    ]),
    re.I,
)

# Efficacy language — the TGA Code claims layer, and AHPRA's parallel ban on
# claims of superiority or guaranteed outcome.
CLAIM = re.compile(
    "|".join([
        r"\bcures?\b", r"\btreats?\b", r"\bheals?\b", r"\bfix(?:es)?\b",
        r"\beliminat", r"\berases?\b", r"\bremoves? (?:wrinkles|lines|scars)",
        r"\breverses?\b", r"\bprevents?\b", r"\bboosts? (?:collagen|immunity)",
        r"\bstimulates? collagen", r"\bpromotes? (?:wound )?healing",
        r"\bimproves? healing", r"\bguarantee", r"\bpainless\b",
        r"\bno (?:down\s?time|downtime)\b", r"\brisk[\s-]free\b",
        r"\bbest (?:in|clinic|treatment)", r"\bmiracle\b", r"\blife[\s-]?changing\b",
        r"\byears? younger\b", r"\bturn back the clock\b",
        r"\bresults? (?:are )?(?:guaranteed|instant|immediate)",
        r"\bsafe(?:ly)? and effective", r"\bmedical[\s-]grade\b",
    ]),
    re.I,
)


def split_frontmatter(raw):
    if not raw.startswith("---"):
        return "", raw
    end = raw.find("\n---", 3)
    if end == -1:
        return "", raw
    return raw[3:end], raw[end + 4 :]


def fm_value(fm, key):
    m = re.search(rf"^{key}:\s*(.+)$", fm, re.M)
    if not m:
        return ""
    return m.group(1).strip().strip("'\"")


def strip_markdown(body):
    body = re.sub(r"!\[[^\]]*\]\([^)]*\)", " ", body)   # images
    body = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", body)  # links
    body = re.sub(r"^#{1,6}\s*", "", body, flags=re.M)    # headings
    return body


def sentences(text):
    return [s.strip() for s in re.split(r"(?<=[.!?])\s+", text) if s.strip()]


def audit_file(path):
    raw = open(path, encoding="utf-8").read()
    fm, body = split_frontmatter(raw)
    plain = strip_markdown(body)

    subcategory = fm_value(fm, "subcategory") or path.split(os.sep)[-3]
    # lib/content.ts publishes on `published !== false`, so a listing with no
    # `published` key at all is LIVE. Mirror that here rather than reading a
    # missing key as a draft, which would sort a live breach down the list.
    published = fm_value(fm, "published")
    is_live = published != "false"
    rec = {
        "file": os.path.relpath(path, os.getcwd()),
        "title": fm_value(fm, "title"),
        "subcategory": subcategory,
        "published": published or "(unset, live)",
        "is_live": is_live,
        "author": fm_value(fm, "author"),
        "date": fm_value(fm, "date_published"),
        "words": len(plain.split()),
    }

    fp_hits, tp_hits, claim_hits, fp_clinical = [], [], [], []
    for s in sentences(plain):
        if FIRST_PERSON.search(s) or FIRST_PERSON_CASED.search(s):
            fp_hits.append(s)
            # The sharpest hit: the narrated experience IS the clinical service,
            # rather than the listing merely naming one on the treatment menu
            # elsewhere. This is what separates a purported testimonial about a
            # regulated health service from a facial review at a clinic that
            # also does laser.
            if CLINICAL.search(s):
                fp_clinical.append(s)
        if THIRD_PARTY.search(s):
            tp_hits.append(s)
        if CLAIM.search(s):
            claim_hits.append(s)

    haystack = fm + " " + plain
    strong = sorted({m.group(0).lower() for m in CLINICAL_STRONG.finditer(haystack)})
    device = sorted({m.group(0).lower() for m in DEVICE.finditer(haystack)})
    clinical = strong + device
    rec["strong_terms"] = "; ".join(strong[:12])
    rec["device_terms"] = "; ".join(device[:8])

    rec["clinical_terms"] = "; ".join(clinical[:12])
    rec["n_clinical"] = len(clinical)
    rec["n_first_person"] = len(fp_hits)
    rec["n_third_party"] = len(tp_hits)
    rec["n_claim"] = len(claim_hits)
    rec["n_fp_clinical"] = len(fp_clinical)
    rec["fp_clinical_sample"] = fp_clinical[0][:200] if fp_clinical else ""
    rec["first_person_sample"] = fp_hits[0][:180] if fp_hits else ""
    rec["third_party_sample"] = tp_hits[0][:180] if tp_hits else ""
    rec["claim_sample"] = claim_hits[0][:180] if claim_hits else ""

    # Priority. The ordering is by legal exposure, not by how much work each is.
    if strong and fp_hits:
        rec["priority"] = "P1"
        rec["reason"] = "First-person account of a regulated health service — s133(1)(c) purported testimonial"
    elif device and fp_hits:
        rec["priority"] = "P2"
        rec["reason"] = "First-person account of a therapeutic device — TGA Code Part 6 testimonial"
    elif clinical and tp_hits:
        rec["priority"] = "P2"
        rec["reason"] = "Third-party account of a clinical service — s133(1)(c) testimonial"
    elif clinical and claim_hits:
        rec["priority"] = "P3"
        rec["reason"] = "Efficacy / superiority claim about a clinical service"
    elif fp_hits or tp_hits:
        rec["priority"] = "P4"
        rec["reason"] = "First-person or relayed account, no clinical service detected — check for therapeutic goods"
    else:
        rec["priority"] = "OK"
        rec["reason"] = ""
    return rec


def load_screened():
    """Listings already read in full and cleared, with the reason why.

    The detector is high-recall by design, so the same false positives surface
    on every run. Recording the decision here keeps them out of the working
    list without loosening a regex and losing real hits somewhere else.
    """
    if not os.path.exists(SCREENED_PATH):
        return {}
    data = json.load(open(SCREENED_PATH, encoding="utf-8"))
    return {k: v for k, v in data.items() if not k.startswith("_")}


def main():
    screened = load_screened()
    rows = []
    for dirpath, _dirs, files in os.walk(ROOT):
        for f in files:
            if f.endswith(".mdx"):
                rows.append(audit_file(os.path.join(dirpath, f)))

    for r in rows:
        r["screened"] = screened.get(r["file"], "")
        if r["screened"] and r["priority"] != "OK":
            r["priority"] = "SCREENED"

    order = {"P1": 0, "P2": 1, "P3": 2, "P4": 3, "SCREENED": 4, "OK": 5}
    # Live listings first inside each band. The TGA's position is that every
    # day a contravention stays up may be a fresh contravention, so a published
    # breach is the urgent one; a draft is exposure that has not started
    # running. (Draft status here is editorial and sticky — see CLAUDE.md — so
    # this only orders the work, it never changes `published`.)
    rows.sort(key=lambda r: (order[r["priority"]],
                             0 if r["is_live"] else 1,
                             -r.get("n_fp_clinical", 0),
                             -r["n_first_person"], r["subcategory"], r["file"]))

    os.makedirs(OUT_DIR, exist_ok=True)
    out = os.path.join(OUT_DIR, "directory-ahpra.csv")
    cols = ["priority", "reason", "subcategory", "title", "published", "author",
            "date", "is_live", "words", "n_clinical", "strong_terms", "device_terms",
            "clinical_terms", "n_fp_clinical", "fp_clinical_sample", "n_first_person",
            "screened",
            "n_third_party", "n_claim", "first_person_sample",
            "third_party_sample", "claim_sample", "file"]
    with open(out, "w", newline="", encoding="utf-8") as fh:
        w = csv.DictWriter(fh, fieldnames=cols)
        w.writeheader()
        for r in rows:
            w.writerow({c: r.get(c, "") for c in cols})

    from collections import Counter
    print(f"{len(rows)} directory listings scanned")
    for p, n in sorted(Counter(r["priority"] for r in rows).items()):
        print(f"  {p}: {n}")
    print()
    for p in ("P1", "P2", "P3"):
        hits = [r for r in rows if r["priority"] == p]
        if not hits:
            continue
        print(f"--- {p} ({len(hits)}) ---")
        for r in hits:
            print(f"  [{r['subcategory']:14}] {r['title'][:44]:44} "
                  f"fp+clin={r.get('n_fp_clinical', 0):3} fp={r['n_first_person']:3} "
                  f"claim={r['n_claim']:2}  {'LIVE ' if r['is_live'] else 'draft'}")
        print()
    print(f"wrote {out}")


if __name__ == "__main__":
    sys.exit(main())
