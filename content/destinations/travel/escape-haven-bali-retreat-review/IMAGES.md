# Escape Haven Bali — images still needed

The article MDX in this folder is finished and references the 14 files below.
Google Drive is blocked by the egress policy on the machine that wrote this
article, so the shots could not be pulled from
https://drive.google.com/open?id=1OpA_O_qsFVod2WAqp7xvwxWbw0wNNzSC
(30 JPEGs, IMG_7102 to IMG_7278).

Save each shot into **this folder** under the exact filename below, then set
`published: true` and delete `draft_reason` in the .mdx. Delete this file once
the images are in.

## Required — the article will not publish without these two

| Filename | Shape | What it should be |
|---|---|---|
| `hero.jpg` | **Landscape ~2:1** | The holding shot. The pool and gardens wide, or the rice paddy sunrise. Full-bleed on the home page and at the top of the article, so it must be wide. |
| `featured-frangipani-welcome.jpg` | **Portrait ~3:4** | "Welcome Sigourney" spelled in frangipani petals on the bed. This is the thumbnail on every grid card site-wide, and it is the most shareable frame in the set. Keep it under 2MB or the build warns. |

## Body images, in order of appearance

| Filename | Shape | What it should be |
|---|---|---|
| `arrival-pool-night.jpg` | Landscape | Arrival at night, the lit pool and gardens |
| `goddess-room.jpg` | Landscape | The room, soft green walls, palm fronds, shell light fitting |
| `massage-treatment-room.jpg` | Portrait | Treatment room set for a massage |
| `one-on-one-yoga.jpg` | Portrait | Yoga in the shala |
| `ayurveda-consultation.jpg` | Portrait | Dr Raj's consulting room, herbs and oils |
| `floating-breakfast.jpg` | Landscape | The floating breakfast on the pool |
| `therapeutic-chef-lunch.jpg` | Portrait | A plated lunch or dessert |
| `pool-daybed.jpg` | Portrait | A daybed beside the pool |
| `janine-founder.jpg` | Portrait | Janine, the founder |
| `rice-paddy-sunrise.jpg` | Landscape | The sunrise bike ride through the paddies |
| `pool-dusk.jpg` | Landscape | The pool at dusk, closing shot |

`therapeutic-chef-lunch.jpg` and `pool-daybed.jpg` sit side by side in a two-up
grid, so give them a matching portrait crop.

## Two things to check on every file

1. **Rotation baked in.** Phone shots carry an EXIF orientation flag that gets
   stripped in transit, which leaves portraits stored as sideways landscapes.
   Run each file through `PIL.ImageOps.exif_transpose` (or open and re-save in
   Preview) and confirm every portrait is taller than it is wide.
2. **File size.** Keep `featured-frangipani-welcome.jpg` under 2MB. The Drive
   originals run 1.4MB to 7MB, so most need compressing.

Alt text is already written into the MDX for all 14 and does not need changing.
