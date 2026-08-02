# WordPress Image Cleanup Brief

## The Problem

The WordPress migration imported **thumbnail-sized images** (mostly 300x450px) instead of the full-size originals. These images look fuzzy/pixelated on the live site, especially on retina displays.

**172 tiny images** across **~40 articles**, mostly in Destinations (clinics, salons, spas, travel reviews).

## Status: Wolgan Valley (DONE)

The Wolgan Valley article was the first one fixed. Sigourney had the original hi-res photos in Dropbox, so all 9 body images + hero were replaced with 1600px web-optimized versions. Commit: `02bb59879`.

---

## Affected Articles

### Priority 1 — Travel & Spa Reviews (reader-facing editorial)

These are the most visible articles with fuzzy body images.

| Article | Tiny images | Section |
|---------|------------|---------|
| Gaia Byron Bay | 8 | travel |
| Saffire Coles Bay | 2 | travel |
| Hepburn Spa & Bathhouse, Daylesford | 5 | spas-retreats |
| Como Shambhala Urban Escape | 3 | spas-retreats |
| Southern Spa, Southern Ocean Lodge | 4 | spas-retreats |
| Spa Q, QT Resort Gold Coast | 4 | spas-retreats |
| Stephanie's Vintage Spa, Cleveland | 5 | spas-retreats |
| Five Star Day Spa, Erina | 3 | spas-retreats |
| Waldheim Spa, Cradle Mountain Lodge | 2 | spas-retreats |
| The Girl You Love, Glebe | 2 | spas-retreats |
| Serene Day Spa, WA | 4 | spas-retreats |
| L'Occitane Petit Spa, Subiaco | 4 | spas-retreats |

### Priority 2 — Clinics & Salons (directory-style listings)

| Article | Tiny images | Section |
|---------|------------|---------|
| Wildlife Studio, McMahons Point | 5 | clinics |
| Wildlife Origin, Milsons Point | 5 | clinics |
| Edwards & Co, Melbourne | 4 | clinics |
| Edwards & Co, Surry Hills | 4 | clinics |
| The Parlour Room | 5 | clinics |
| Headcase Hair, Paddington | 3 (x2 copies in salons) | clinics/salons |
| Skinologie, Albert Park | 4 | clinics |
| Tan Temple, Bondi | 4 | clinics |
| Dr Anh Clinic | 3 | clinics |
| Vaia Beauty, Darlinghurst | 5 | clinics |
| Realskin Clinic, Hamilton | 5 | clinics |
| La Belle Peau, North Perth | 4 | clinics |
| All Saints Skin Clinic, Double Bay | 3 | clinics |
| Djurra Salon, Fremantle | 3 | clinics |
| Amy Jean Eye Couture, Sydney | 4 | clinics |
| Dessange, Paddington | 2 | clinics |
| The Nail Lab, Darlinghurst | 3 | clinics |
| Oscar Oscar, Paddington | 2 (x2 copies in salons) | clinics/salons |
| Valonz, Paddington | 2 (x2 copies in salons) | clinics/salons |
| Academy Face & Body, Subiaco | 2 | clinics |
| Aesop, Paddington | 2 | clinics |
| Assure Cosmetic Centre, Subiaco | 2 | clinics |
| Wieselmann, South Yarra | 1 | clinics |
| The Victorian Dermal Group, Melbourne | 2 | clinics |
| Love Those Lashes, Paddington | 2 | clinics |
| Paddington Beauty Room | 3 | clinics |
| Ella Bache, Bondi Junction | 2 | clinics |
| Skin Brilliance, Brighton | 2 | clinics |
| Zucci, St James | 2 | clinics |

### Priority 3 — Beauty & Style articles

| Article | Tiny images | Notes |
|---------|------------|-------|
| Top 50 Skincare Products | ~20 | Product shots — various tiny sizes. These are de-etched product PNGs, probably need re-sourcing from brand press kits rather than WordPress |
| Damaged Hair Repair Tips | 4 | Body images at 300x450 |
| Italian Hair Products & Secrets | 1 | Monica Bellucci photo at 300x450 |
| Fine But Frizzy Hair | 1 | Elasticizer product shot |
| Chic Sunscreens & Hats | 1 | Product shot |

### Priority 4 — Vodcast

| Article | Tiny images | Notes |
|---------|------------|-------|
| Pip Edwards | 1 | Body image 300x450 |
| Leigh Campbell | 1 | Body image 400x400 |

---

## Fix Method

For each article:

1. **Check WordPress original** — fetch `https://www.beauticate.com/<category>/<subcategory>/<slug>/` and inspect the `<img>` `src` attributes. WordPress usually stores full-size originals alongside thumbnails (the `-300x450` suffix is the thumbnail; the unsuffixed version is the original).

2. **Download the full-size image** — try stripping the dimension suffix from the filename (e.g., `image-300x450.jpg` → `image.jpg`). If that doesn't exist, the 300x450 may be the original (some were phone photos).

3. **Resize to 1600px** max dimension, JPEG quality 85%, and replace the thumbnail in the content directory.

4. **Update MDX references** if filenames change.

5. **Commit and push** to both the cleanup branch and `main`.

## Notes

- The **Top 50 Skincare Products** article is a special case — those are product pack shots that need to be re-sourced or re-downloaded at higher resolution from brand websites, not from WordPress.
- Some clinics/salons may have **duplicate image sets** (e.g., Headcase Hair appears in both `clinics/` and `salons/`).
- Articles with `date_published` before 2026-06-18 are WordPress-origin (per CLAUDE.md).

---

## Family & Friends Feedback

_Use this section to log image quality issues spotted during testing._

| Date | Reporter | Article / Page | Issue | Status |
|------|----------|---------------|-------|--------|
| 2026-07-24 | Sigourney | Wolgan Valley | All body images fuzzy/low-res | FIXED |
| | | | | |
| | | | | |
