#!/usr/bin/env python3
"""
Scan all articles for product placement opportunities.
Matches against the Beauticate shop catalog by:
  A) Brand name mentions
  B) Product type / ingredient mentions
  C) Contextual / thematic matches (travel, entertaining, routines, etc.)

Outputs data/product-placement-opportunities.json
"""

import json, os, re, glob
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CONTENT = ROOT / "content"
CATALOG = ROOT / "data" / "shop-catalog.json"
OUT = ROOT / "data" / "product-placement-opportunities.json"

with open(CATALOG) as f:
    catalog = json.load(f)

# ── Brand aliases (lowercase → canonical brand name) ─────────────────────────
BRAND_ALIASES = {}
for p in catalog:
    b = p["brand"]
    # Full name
    BRAND_ALIASES[b.lower()] = b
    # Common short forms
    if b == "Archer Farrar Perfume Atelier":
        BRAND_ALIASES["archer farrar"] = b
    elif b == "Basics by B":
        BRAND_ALIASES["basics by b"] = b
    elif b == "JSHealth Vitamins":
        for a in ["jshealth", "js health", "jessica sepel"]:
            BRAND_ALIASES[a] = b
    elif b == "Christophe Robin":
        BRAND_ALIASES["christophe robin"] = b
    elif b == "Maison Balzac":
        BRAND_ALIASES["maison balzac"] = b
    elif b == "Mukti Organics":
        for a in ["mukti organics", "mukti"]:
            BRAND_ALIASES[a] = b
    elif b == "Subtle Energies":
        BRAND_ALIASES["subtle energies"] = b
    elif b == "Tulita Parfum":
        for a in ["tulita parfum", "tulita"]:
            BRAND_ALIASES[a] = b
    elif b == "Booie Beauty":
        for a in ["booie beauty", "booie"]:
            BRAND_ALIASES[a] = b
    elif b == "La Mav":
        for a in ["la mav", "lamav"]:
            BRAND_ALIASES[a] = b
    elif b == "Lash Armour":
        BRAND_ALIASES["lash armour"] = b
    elif b == "Eir Women":
        BRAND_ALIASES["eir women"] = b
        BRAND_ALIASES["eir"] = b
    elif b == "BonPatch":
        for a in ["bonpatch", "bon patch"]:
            BRAND_ALIASES[a] = b
    elif b == "Innour":
        BRAND_ALIASES["innour"] = b
    elif b == "Chiquita":
        BRAND_ALIASES["chiquita"] = b
    elif b == "Estetika":
        BRAND_ALIASES["estetika"] = b
    elif b == "Kiicity":
        BRAND_ALIASES["kiicity"] = b
    elif b == "Les huilettes":
        for a in ["les huilettes", "les huilette"]:
            BRAND_ALIASES[a] = b
    elif b == "Lumira":
        for a in ["lumira", "atelier lumira"]:
            BRAND_ALIASES[a] = b

# Sort by length descending so longer matches take priority
BRAND_PATTERNS = sorted(BRAND_ALIASES.keys(), key=len, reverse=True)

# Build brand regex (word-boundary matching)
brand_re = re.compile(
    r'\b(' + '|'.join(re.escape(b) for b in BRAND_PATTERNS) + r')\b',
    re.IGNORECASE
)

# ── Product type keywords → suggested products ──────────────────────────────
# Maps article keywords to product categories/types
PRODUCT_TYPE_MATCHES = {
    # Skincare
    "cleanser": {"categories": ["Skincare"], "types": ["Cleanser", "Hand & Body Wash"]},
    "moisturiser": {"categories": ["Skincare"], "types": ["Skincare", "Masque", "Dry & Dehydration"]},
    "moisturizer": {"categories": ["Skincare"], "types": ["Skincare", "Masque"]},
    "serum": {"categories": ["Skincare", "Hair"], "types": ["Skincare", "Hair Serum"]},
    "eye cream": {"categories": ["Skincare"], "types": ["Eye & Lip Care"]},
    "sunscreen": {"categories": ["Skincare"], "types": ["Skincare"]},
    "spf": {"categories": ["Skincare"], "types": ["Skincare"]},
    "sun protection": {"categories": ["Skincare"], "types": ["Skincare"]},
    "exfoliant": {"categories": ["Skincare"], "types": ["Acne Prone", "Skincare"]},
    "face mask": {"categories": ["Skincare"], "types": ["Masque"]},
    "facial": {"categories": ["Skincare"], "types": ["Skincare", "Masque"]},
    "anti-aging": {"categories": ["Skincare"], "types": ["Skincare", "Collagen Supplement"]},
    "anti-ageing": {"categories": ["Skincare"], "types": ["Skincare", "Collagen Supplement"]},
    "collagen": {"categories": ["Skincare", "Wellness"], "types": ["Collagen Supplement", "Collagen"]},
    "retinol": {"categories": ["Skincare"], "types": ["Skincare", "Pigmentation & uneven skin tone"]},
    "vitamin a": {"categories": ["Skincare"], "types": ["Skincare"]},
    "vitamin c": {"categories": ["Skincare"], "types": ["Skincare", "Pigmentation & uneven skin tone"]},
    "acne": {"categories": ["Skincare"], "types": ["Acne Prone", "Skincare"]},
    "pigmentation": {"categories": ["Skincare"], "types": ["Pigmentation & uneven skin tone"]},
    "body oil": {"categories": ["Body", "Fragrance"], "types": ["Body Oil"]},

    # Hair
    "shampoo": {"categories": ["Hair"], "types": ["Shampoo", "Pre-Shampoo Treatment"]},
    "conditioner": {"categories": ["Hair"], "types": ["Conditioner", "Conditioners"]},
    "hair mask": {"categories": ["Hair"], "types": ["Masque", "Hair Care"]},
    "hair oil": {"categories": ["Hair"], "types": ["Hair Serum"]},
    "scalp": {"categories": ["Hair"], "types": ["Shampoo", "Hair Care"]},
    "hair loss": {"categories": ["Hair", "Wellness"], "types": ["Haircare", "Vitamin"]},
    "thinning hair": {"categories": ["Hair", "Wellness"], "types": ["Haircare", "Vitamin"]},
    "volumis": {"categories": ["Hair"], "types": ["Hair Care", "Mist"]},  # volumise/volumising
    "dry hair": {"categories": ["Hair"], "types": ["Conditioner", "Hair Care"]},
    "frizz": {"categories": ["Hair"], "types": ["Hair Serum", "Hair Care", "Leave-in"]},
    "blow dry": {"categories": ["Hair"], "types": ["Hair Care"]},
    "hair vitamin": {"categories": ["Wellness"], "types": ["Vitamin", "Haircare"]},

    # Makeup
    "foundation": {"categories": ["Makeup"], "types": ["BB Cream"]},
    "concealer": {"categories": ["Makeup"], "types": ["Concealer"]},
    "mascara": {"categories": ["Makeup"], "types": ["Mascara"]},
    "lipstick": {"categories": ["Makeup"], "types": ["Lipstick"]},
    "lip gloss": {"categories": ["Makeup"], "types": ["Lipgloss"]},
    "eyeliner": {"categories": ["Makeup"], "types": ["Eyeliner"]},
    "eyeshadow": {"categories": ["Makeup"], "types": ["Eyeshadow"]},
    "brow": {"categories": ["Makeup"], "types": ["Eyebrow Tint and Gel", "Eyebrow Pencil"]},
    "blush": {"categories": ["Makeup"], "types": ["Multi-Use Tint"]},
    "highlighter": {"categories": ["Makeup"], "types": ["Illuminator"]},
    "bronzer": {"categories": ["Makeup"], "types": ["Body Glow"]},
    "tinted moisturiser": {"categories": ["Makeup"], "types": ["BB Cream"]},
    "bb cream": {"categories": ["Makeup"], "types": ["BB Cream"]},
    "makeup bag": {"categories": ["Accessories"], "types": ["Vanity Toiletry Cosmetic bags"]},
    "beauty bag": {"categories": ["Accessories"], "types": ["Vanity Toiletry Cosmetic bags"]},
    "false lash": {"categories": ["Makeup"], "types": []},
    "fake lash": {"categories": ["Makeup"], "types": []},
    "magnetic lash": {"categories": ["Makeup"], "types": []},
    "lash": {"categories": ["Makeup"], "types": []},

    # Fragrance
    "perfume": {"categories": ["Fragrance"], "types": ["Perfume", "Eau de Parfum", "Perfume Oil", "Solid Perfume"]},
    "fragrance": {"categories": ["Fragrance"], "types": ["Eau de Parfum", "Perfume", "Cologne"]},
    "cologne": {"categories": ["Fragrance"], "types": ["Cologne"]},
    "scented candle": {"categories": ["Home"], "types": ["Candle", "Candles"]},
    "candle": {"categories": ["Home"], "types": ["Candle", "Candles"]},
    "incense": {"categories": ["Home"], "types": ["Incense & Holders"]},
    "room spray": {"categories": ["Home"], "types": ["Room Spray"]},
    "diffuser": {"categories": ["Home"], "types": ["Essential Oils & Burners"]},
    "essential oil": {"categories": ["Home"], "types": ["Essential Oils & Burners"]},

    # Wellness
    "vitamin": {"categories": ["Wellness"], "types": ["Vitamin", "Nutrition"]},
    "supplement": {"categories": ["Wellness"], "types": ["Vitamin", "Nutrition", "Supplement Powder"]},
    "magnesium": {"categories": ["Wellness"], "types": ["Vitamin", "Supplement Powder"]},
    "sleep": {"categories": ["Wellness", "Home"], "types": ["Supplement Powder", "Sleep Mask", "Candle"]},
    "insomnia": {"categories": ["Wellness"], "types": ["Supplement Powder"]},
    "protein powder": {"categories": ["Wellness"], "types": ["Nutrition"]},
    "protein": {"categories": ["Wellness"], "types": ["Nutrition"]},
    "creatine": {"categories": ["Wellness"], "types": ["Nutrition"]},
    "greens powder": {"categories": ["Wellness"], "types": ["Nutrition"]},
    "probiotics": {"categories": ["Wellness"], "types": ["Nutrition"]},
    "gut health": {"categories": ["Wellness"], "types": ["Nutrition", "Vitamin"]},
    "massage": {"categories": ["Wellness"], "types": ["Massager", "Acupressure Mat"]},
    "foam roller": {"categories": ["Wellness"], "types": ["Foam Roller"]},
    "cupping": {"categories": ["Wellness"], "types": ["Massager"]},
    "acupressure": {"categories": ["Wellness"], "types": ["Acupressure Mat"]},
    "period pain": {"categories": ["Wellness"], "types": ["Period Relief Device"]},
    "menstrual": {"categories": ["Wellness"], "types": ["Period Relief Device"]},
    "perimenopause": {"categories": ["Wellness", "Skincare"], "types": ["Nutrition", "Vitamin"]},
    "menopause": {"categories": ["Wellness", "Skincare"], "types": ["Nutrition", "Vitamin"]},
    "blue light": {"categories": ["Accessories"], "types": ["Bluelight"]},
    "screen time": {"categories": ["Accessories"], "types": ["Bluelight"]},

    # Body
    "hand cream": {"categories": ["Body"], "types": ["Hand Cream", "Hand & Body Cream"]},
    "body lotion": {"categories": ["Body"], "types": ["Hand & Body Lotion"]},
    "hand wash": {"categories": ["Body"], "types": ["Hand & Body Wash", "Hand Wash"]},
    "body wash": {"categories": ["Body"], "types": ["Hand & Body Wash"]},

    # Home / Lifestyle
    "wine glass": {"categories": ["Home & Lifestyle"], "types": ["Glassware"]},
    "cocktail": {"categories": ["Home & Lifestyle"], "types": ["Glassware"]},
    "entertaining": {"categories": ["Home & Lifestyle"], "types": ["Glassware", "Serveware"]},
    "dinner party": {"categories": ["Home & Lifestyle"], "types": ["Glassware", "Serveware"]},
    "table setting": {"categories": ["Home & Lifestyle"], "types": ["Glassware", "Serveware"]},
    "vase": {"categories": ["Home & Lifestyle"], "types": ["Vase", "Vases"]},
    "flowers": {"categories": ["Home & Lifestyle"], "types": ["Vase", "Vases"]},
    "water bottle": {"categories": ["Home & Lifestyle"], "types": ["Water Bottle"]},
    "interiors": {"categories": ["Home & Lifestyle", "Home"], "types": ["Candle", "Candles", "Vase"]},
}

# ── Contextual / thematic matches ────────────────────────────────────────────
THEMATIC_MATCHES = [
    {
        "theme": "bali",
        "patterns": [r"\bbali\b", r"\bbalinese\b", r"\bubud\b", r"\bseminyak\b"],
        "suggestion": "Lumira Balinese Ylang Ylang range (candle, wash, lotion) — Bali connection",
        "brand": "Lumira",
        "handles": ["balinese-ylang-ylang-candle", "balinese-ylang-ylang-hand-body-lotion", "balinese-ylang-ylang-hand-body-wash"],
    },
    {
        "theme": "cuba",
        "patterns": [r"\bcuba\b", r"\bcuban\b", r"\bhavana\b"],
        "suggestion": "Lumira Cuban Tobacco Parfum — Cuba connection",
        "brand": "Lumira",
        "handles": ["cuban-tobacco-eau-de-parfum"],
    },
    {
        "theme": "morocco",
        "patterns": [r"\bmorocco\b", r"\bmoroccan\b", r"\bmarrakech\b"],
        "suggestion": "Lumira Moroccan Mint Tea Candle — Morocco connection",
        "brand": "Lumira",
        "handles": ["moroccan-mint-tea-candle"],
    },
    {
        "theme": "persian_rose",
        "patterns": [r"\bpersia\b", r"\bpersian\b", r"\biran\b", r"\brose garden\b"],
        "suggestion": "Lumira Persian Rose Candle — Persian/rose connection",
        "brand": "Lumira",
        "handles": ["persian-rose-candle"],
    },
    {
        "theme": "italy_hair",
        "patterns": [r"\bitalian hair\b", r"\bitaly.*hair\b", r"\bitalian beauty\b"],
        "suggestion": "Les Huilettes Hair Serum — Italian hair secrets editorial match",
        "brand": "Les huilettes",
        "handles": ["les-huilette-hair-serum-50ml"],
    },
    {
        "theme": "travel",
        "patterns": [r"\btravel\b.*\b(?:beauty|skin|pack|essentials)\b", r"\b(?:beauty|skin|pack|essentials)\b.*\btravel\b", r"\btravel.size\b", r"\bholiday packing\b", r"\bwhat to pack\b"],
        "suggestion": "Travel-size products from the shop (Christophe Robin 75ml, Mukti travel sizes, Lumira travel candle)",
        "brand": "multiple",
        "handles": ["cleansing-purifying-scrub-with-sea-salt-75ml", "cleansing-volumising-paste-pure-with-rose-extracts-75ml"],
    },
    {
        "theme": "pool_beach",
        "patterns": [r"\bpool\b", r"\bbeach\b.*\b(?:beauty|skin|routine)\b", r"\b(?:beauty|skin|routine)\b.*\bbeach\b", r"\bswimming\b", r"\bsummer skin\b"],
        "suggestion": "Sun/outdoor products — SPF, body glow, self-tan",
        "brand": "multiple",
        "handles": ["daily-moisturiser-with-sunscreen-solar-veil-spf30-100ml"],
    },
    {
        "theme": "morning_routine",
        "patterns": [r"\bmorning routine\b", r"\bam routine\b", r"\bmorning ritual\b", r"\bmorning skincare\b"],
        "suggestion": "Morning skincare edit — Mukti moisturiser, La Mav, Basics by B",
        "brand": "multiple",
        "handles": ["marigold-hydrating-creme-100g"],
    },
    {
        "theme": "evening_routine",
        "patterns": [r"\bevening routine\b", r"\bnight routine\b", r"\bpm routine\b", r"\bbedtime\b.*\britual\b", r"\bwind down\b", r"\bevening ritual\b"],
        "suggestion": "Evening wind-down edit — Lumira candle, Subtle Energies, sleep supplements",
        "brand": "multiple",
        "handles": ["advanced-sleep-powder"],
    },
    {
        "theme": "self_care",
        "patterns": [r"\bself.care\b", r"\bselfcare\b", r"\bpamper\b", r"\bspa\b.*\bhome\b", r"\bhome\b.*\bspa\b", r"\bbath\b.*\britual\b"],
        "suggestion": "Self-care edit — candles, body oil, bath products",
        "brand": "multiple",
        "handles": [],
    },
    {
        "theme": "gift_guide",
        "patterns": [r"\bgift\b", r"\bchristmas\b.*\b(?:beauty|present|shopping)\b", r"\bmother'?s day\b", r"\bvalentine\b", r"\bbest present\b"],
        "suggestion": "Gift sets and curated bundles from the shop",
        "brand": "multiple",
        "handles": [],
    },
    {
        "theme": "hosting_entertaining",
        "patterns": [r"\bhost\b", r"\bentertaining\b", r"\bdinner party\b", r"\btable\b.*\bset\b", r"\bcheese board\b", r"\bcocktail party\b"],
        "suggestion": "Maison Balzac glassware, serveware, candles",
        "brand": "Maison Balzac",
        "handles": [],
    },
    {
        "theme": "fitness",
        "patterns": [r"\bworkout\b", r"\bgym\b", r"\bfitness\b", r"\bexercis\b", r"\bpilates\b", r"\byoga\b", r"\bstrength training\b"],
        "suggestion": "Eir Women Fuel Creatine, JSHealth protein, Kiicity recovery tools",
        "brand": "multiple",
        "handles": ["fuel-100-pure-creatine-monohydrate"],
    },
    {
        "theme": "burnout_stress",
        "patterns": [r"\bburnout\b", r"\bstress\b.*\b(?:manage|relief|reduc)\b", r"\bmental health\b", r"\banxiety\b.*\b(?:manage|help|reduc)\b"],
        "suggestion": "BonPatch wellness patches, Kiicity massage tools, JSHealth stress vitamins",
        "brand": "multiple",
        "handles": [],
    },
    {
        "theme": "bathroom_interiors",
        "patterns": [r"\bbathroom\b", r"\bbath\b.*\b(?:design|style|reno|makeover)\b", r"\bensuite\b"],
        "suggestion": "Lumira hand wash/lotion, Maison Balzac soap dishes",
        "brand": "multiple",
        "handles": [],
    },
]

# Compile thematic patterns
for t in THEMATIC_MATCHES:
    t["compiled"] = [re.compile(p, re.IGNORECASE) for p in t["patterns"]]

# ── Products by brand for quick lookup ───────────────────────────────────────
products_by_brand = defaultdict(list)
for p in catalog:
    products_by_brand[p["brand"]].append(p)

def find_products_for_type_match(keyword):
    """Find the best products for a product-type keyword match."""
    info = PRODUCT_TYPE_MATCHES.get(keyword, {})
    cats = info.get("categories", [])
    types = info.get("types", [])
    matches = []
    for p in catalog:
        if p["category"] in cats or p["product_type"] in types:
            score = 0
            if p["product_type"] in types:
                score += 2
            if p["category"] in cats:
                score += 1
            matches.append((score, p))
    matches.sort(key=lambda x: -x[0])
    # Return top 3 unique products
    seen = set()
    result = []
    for _, p in matches:
        if p["handle"] not in seen:
            seen.add(p["handle"])
            result.append(p)
            if len(result) >= 3:
                break
    return result


def extract_frontmatter(text):
    """Extract frontmatter as dict from MDX text."""
    if not text.startswith("---"):
        return {}
    end = text.find("---", 3)
    if end == -1:
        return {}
    fm_text = text[3:end]
    fm = {}
    for line in fm_text.split("\n"):
        if ":" in line and not line.strip().startswith("-"):
            key, _, val = line.partition(":")
            fm[key.strip()] = val.strip().strip('"').strip("'")
    return fm


def get_context_snippet(text, match_start, match_end, window=120):
    """Get surrounding text for a match."""
    start = max(0, match_start - window)
    end = min(len(text), match_end + window)
    snippet = text[start:end].replace("\n", " ").strip()
    if start > 0:
        snippet = "..." + snippet
    if end < len(text):
        snippet = snippet + "..."
    return snippet


def already_has_product(body, brand_name, handle=None):
    """Check if article already has this brand/product placed."""
    lower = body.lower()
    if handle and handle in lower:
        return True
    # Check for ShopItem with this brand
    if f'brand="{brand_name}"' in body:
        return True
    return False


# ── Scan all articles ────────────────────────────────────────────────────────
opportunities = []
articles_scanned = 0
articles_with_matches = 0

for mdx_path in sorted(glob.glob(str(CONTENT / "**/*.mdx"), recursive=True)):
    # Skip non-article pages
    rel = os.path.relpath(mdx_path, CONTENT)
    if rel.startswith("pages/"):
        continue

    articles_scanned += 1

    with open(mdx_path, "r", encoding="utf-8", errors="replace") as f:
        text = f.read()

    fm = extract_frontmatter(text)
    title = fm.get("title", os.path.basename(os.path.dirname(mdx_path)))
    category = fm.get("category", rel.split("/")[0])
    subcategory = fm.get("subcategory", rel.split("/")[1] if "/" in rel else "")
    slug = os.path.basename(os.path.dirname(mdx_path))
    is_interview = "interview" in category.lower() or "vodcast" in category.lower()

    # Get body text (after frontmatter)
    body_start = text.find("---", 3)
    body = text[body_start + 3:] if body_start != -1 else text
    body_lower = body.lower()

    article_matches = []

    # ── Tier A: Brand name matches ───────────────────────────────────────
    for m in brand_re.finditer(body):
        brand_key = m.group(0).lower()
        brand = BRAND_ALIASES.get(brand_key)
        if not brand:
            continue
        # Skip if already placed
        if already_has_product(body, brand):
            continue
        snippet = get_context_snippet(body, m.start(), m.end())
        prods = products_by_brand.get(brand, [])
        suggested = prods[:3] if prods else []
        article_matches.append({
            "tier": "A",
            "match_type": "brand_mention",
            "matched_text": m.group(0),
            "snippet": snippet,
            "brand": brand,
            "suggested_products": [
                {"name": p["full_name"], "handle": p["handle"], "price": p["price"], "type": p["product_type"]}
                for p in suggested
            ],
            "placement": "ShopItem" if is_interview else "ShopItem or EditorNote",
            "note": "Interview — brand mentioned by guest, can add product card" if is_interview else "",
        })

    # ── Tier B: Product type mentions ────────────────────────────────────
    seen_types = set()
    for keyword, info in PRODUCT_TYPE_MATCHES.items():
        pattern = re.compile(r'\b' + re.escape(keyword) + r'\w*\b', re.IGNORECASE)
        match = pattern.search(body_lower)
        if match:
            # Avoid duplicates (e.g., "moisturiser" and "moisturizer")
            type_key = tuple(sorted(info.get("types", [])))
            if type_key in seen_types:
                continue
            seen_types.add(type_key)

            prods = find_products_for_type_match(keyword)
            if not prods:
                continue
            # Skip if any of these products already placed
            if any(already_has_product(body, p["brand"], p["handle"]) for p in prods):
                continue

            snippet = get_context_snippet(body, match.start(), match.end())
            article_matches.append({
                "tier": "B",
                "match_type": "product_type",
                "matched_text": match.group(0),
                "snippet": snippet,
                "keyword": keyword,
                "suggested_products": [
                    {"name": p["full_name"], "handle": p["handle"], "price": p["price"], "type": p["product_type"], "brand": p["brand"]}
                    for p in prods
                ],
                "placement": "EditorNote" if is_interview else "ShopItem or EditorNote",
                "note": "Interview — guest mentions product type, can add editor recommendation" if is_interview else "",
            })

    # ── Tier C: Thematic / contextual matches ────────────────────────────
    for theme in THEMATIC_MATCHES:
        for pat in theme["compiled"]:
            match = pat.search(body)
            if match:
                snippet = get_context_snippet(body, match.start(), match.end())
                article_matches.append({
                    "tier": "C",
                    "match_type": "thematic",
                    "matched_text": match.group(0),
                    "snippet": snippet,
                    "theme": theme["theme"],
                    "suggestion": theme["suggestion"],
                    "brand": theme["brand"],
                    "handles": theme["handles"],
                    "placement": "EditorNote",
                    "note": theme["suggestion"],
                })
                break  # One match per theme per article

    if article_matches:
        articles_with_matches += 1
        # Deduplicate: keep unique by (tier, brand/keyword/theme)
        seen_keys = set()
        deduped = []
        for m in article_matches:
            if m["tier"] == "A":
                key = ("A", m["brand"])
            elif m["tier"] == "B":
                key = ("B", m.get("keyword", ""))
            else:
                key = ("C", m.get("theme", ""))
            if key not in seen_keys:
                seen_keys.add(key)
                deduped.append(m)

        opportunities.append({
            "article": {
                "title": title,
                "slug": slug,
                "category": category,
                "subcategory": subcategory,
                "path": rel,
                "is_interview": is_interview,
            },
            "matches": deduped,
            "match_count": len(deduped),
            "tiers": sorted(set(m["tier"] for m in deduped)),
        })

# Sort: Tier A first, then by match count
opportunities.sort(key=lambda x: (
    0 if "A" in x["tiers"] else (1 if "B" in x["tiers"] else 2),
    -x["match_count"]
))

# ── Summary stats ────────────────────────────────────────────────────────────
tier_counts = defaultdict(int)
for o in opportunities:
    for m in o["matches"]:
        tier_counts[m["tier"]] += 1

summary = {
    "articles_scanned": articles_scanned,
    "articles_with_opportunities": articles_with_matches,
    "total_opportunities": sum(len(o["matches"]) for o in opportunities),
    "by_tier": {
        "A_brand_mention": tier_counts["A"],
        "B_product_type": tier_counts["B"],
        "C_thematic": tier_counts["C"],
    },
    "top_brands_mentioned": {},
}

# Count brand mentions
brand_counts = defaultdict(int)
for o in opportunities:
    for m in o["matches"]:
        if m["tier"] == "A":
            brand_counts[m["brand"]] += 1
summary["top_brands_mentioned"] = dict(sorted(brand_counts.items(), key=lambda x: -x[1]))

output = {
    "summary": summary,
    "opportunities": opportunities,
}

with open(OUT, "w") as f:
    json.dump(output, f, indent=2, ensure_ascii=False)

print(f"\nScan complete!")
print(f"  Articles scanned: {articles_scanned}")
print(f"  Articles with opportunities: {articles_with_matches}")
print(f"  Total opportunities: {summary['total_opportunities']}")
print(f"\nBy tier:")
print(f"  A (brand mention):  {tier_counts['A']}")
print(f"  B (product type):   {tier_counts['B']}")
print(f"  C (thematic):       {tier_counts['C']}")
print(f"\nTop brands mentioned in articles:")
for b, c in sorted(brand_counts.items(), key=lambda x: -x[1])[:10]:
    print(f"  {b}: {c} articles")
print(f"\nResults saved to: {OUT}")
