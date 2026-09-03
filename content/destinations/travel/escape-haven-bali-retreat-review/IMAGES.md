# Escape Haven Bali — image handoff

The article is written, the SEO is done and the layout now follows Sig's brief:
**professional landscapes full width, Sig's own portraits in pairs throughout.**
It is waiting on the photograph files themselves.

## Where the photos are, and why they are not here yet

They are in Google Drive:
https://drive.google.com/open?id=1OpA_O_qsFVod2WAqp7xvwxWbw0wNNzSC
36 images — Sig's 30 phone shots plus 6 supplied by Escape Haven.

Google Drive is blocked by the egress policy on the machine Claude runs on. Not
a permissions problem: the proxy refuses the connection to drive.google.com
outright, so sharing settings make no difference. The Drive connector can list
the folder and read the file names, and returns image files empty.

## Getting them across

Drive for Desktop already syncs this folder to the Mac, so no download is
needed. In Finder, open the Google Drive folder, select all 36, and drag them
onto:

https://github.com/sigourneycantelo/beauticate-website/upload/claude/escape-haven-images-raw/content/destinations/travel/escape-haven-bali-retreat-review

Commit to `claude/escape-haven-images-raw`, the branch already selected. Claude
then picks, names, crops, compresses and writes the alt text from what is
actually in each frame.

`claude/escape-haven-images-raw` is never merged, so the camera originals stay
out of main's history. Delete it once the article is live.

## The running order the MDX already expects

Landscape, then a pair, then landscape, then a pair, the whole way down.

| # | File | Shape | Source |
|---|---|---|---|
| — | `hero.jpg` | landscape | `Bali-Interoirs-Escape-Haven-Day-2-53_High.jpg` (Sig's pick) |
| — | `featured-frangipani-welcome.jpg` | portrait | the petals shot, for grid cards site-wide |
| 1 | `arrival-pool-night.jpg` | landscape | `BaliInteriors-EscapeHavenNightShoot-17` |
| 2–3 | `welcome-coconut` + `frangipani-petals-bed` | **pair** | Sig |
| 4 | `goddess-room.jpg` | landscape | `escape-haven-rooms-7` or `escape-haven-bali-accommodation` |
| 5–6 | `massage-treatment-room` + `one-on-one-yoga` | **pair** | Sig |
| 7–8 | `ayurveda-consultation` + `coriander-fennel-flask` | **pair** | Sig |
| 9 | `floating-breakfast.jpg` | landscape | Sig |
| 10–11 | `therapeutic-chef-lunch` + `pool-daybed` | **pair** | Sig |
| 12 | `fire-pit-balcony.jpg` | landscape | `Fire-pit-and-micro-view-from-balcony.jpg` |
| 13–14 | `janine-founder` + `garden-detail` | **pair** | Sig / pro |
| 15 | `rice-paddy-sunrise.jpg` | landscape | Sig |
| 16 | `pool-dusk.jpg` | landscape | pro |

Paired images share a two-up grid, so each pair wants a matching portrait crop.

## Three things Claude checks on arrival

1. **Hero resolution.** `hero.jpg` runs full-bleed and wants ~2400px wide.
   `BaliInteriors-EscapeHavenNightShoot-17-1024x683` is only 1024px, so it
   cannot be the hero. If the chosen hero is also short, `hero_max_width` caps
   the display width rather than letting it upscale and go soft.
2. **Rotation baked in.** Phone shots carry an EXIF orientation flag that gets
   stripped in transit, leaving portraits stored as sideways landscapes. Every
   file goes through `PIL.ImageOps.exif_transpose` and gets looked at.
3. **Format and size.** Four of the supplied shots are `.webp`; the MDX
   references `.jpg`, so those get converted or the references updated.
   `featured_image` over 2MB fails the build's own editorial check, and the
   phone originals run to 7MB, so they all get compressed.

## When the images are in

Set `published: true`, delete `draft_reason`, delete this file, and decide
whether it takes the home page hero from the Coogee review.
