# Escape Haven Bali — image handoff

The article is written and the SEO work is done. It is waiting on photographs.

Google Drive is blocked by the egress policy on the machine Claude runs on, so
the 30 shots at
https://drive.google.com/open?id=1OpA_O_qsFVod2WAqp7xvwxWbw0wNNzSC
could not be fetched, and the Drive connector returns image files empty.

## How the pictures get here

**Nobody renames anything.** Upload the 30 originals as they are, and Claude
does the selection, renaming, cropping, compressing and alt text.

1. In Drive, open the folder, select all, download. Drive returns a zip.
2. Unzip it.
3. Go to
   https://github.com/sigourneycantelo/beauticate-website/upload/claude/escape-haven-images-raw/content/destinations/travel/escape-haven-bali-retreat-review
4. Drag all 30 JPEGs onto the page. Commit to `claude/escape-haven-images-raw`,
   the branch already selected.
5. Tell Claude they are up.

Claude then looks at all 30, picks the strongest 14, names them to match the
slots already written into the MDX, rewrites any alt text that does not match
what is actually in the frame, compresses them for web, and commits those 14 to
`claude/escape-haven-bali-seo-edefgh`.

## Why two branches

`claude/escape-haven-images-raw` carries the full-size originals and is **never
merged**. Delete it once the article is live. Only the 14 optimised files reach
`main`, so roughly 100MB of camera originals stay out of the repo's history for
good.

## The 14 slots the MDX already references

Two are load-bearing. `hero.jpg` must be **landscape** (~2:1) because it runs
full-bleed on the home page and at the top of the article.
`featured-frangipani-welcome.jpg` must be **portrait** (~3:4) because it is the
card image on every grid site-wide, and it wants to be the petals shot.

The other twelve: `arrival-pool-night`, `goddess-room`,
`massage-treatment-room`, `one-on-one-yoga`, `ayurveda-consultation`,
`floating-breakfast`, `therapeutic-chef-lunch`, `pool-daybed`, `janine-founder`,
`rice-paddy-sunrise`, `pool-dusk`. `therapeutic-chef-lunch` and `pool-daybed`
sit side by side in a two-up grid and want matching portrait crops.

## Two checks Claude runs on every file

1. **Rotation baked in.** Phone shots carry an EXIF orientation flag that gets
   stripped in transit, leaving portraits stored as sideways landscapes.
   Every file goes through `PIL.ImageOps.exif_transpose` and gets eyeballed.
2. **File size.** `featured_image` over 2MB fails the build's own editorial
   check. The Drive originals run 1.4MB to 7MB, so all of them get compressed.

## When the images are in

Set `published: true` and delete `draft_reason` in the .mdx, delete this file,
and decide whether it takes the home page hero from the Coogee review.
