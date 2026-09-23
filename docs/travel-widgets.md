# Travel widgets — how to add one

A travel widget is a live hotel or flight search box inside an article. A reader
searches, books on the partner's site, and Beauticate earns commission through
Travelpayouts. They belong on travel stories and destination listings, not on
interviews that happen to mention Paris.

## Adding one

One line in the article body, wherever it should sit:

```
<TravelWidget type="hotel_search" city="Sydney" />
```

That's the whole job. No URL, no dashboard, no code.

### The types

| `type` | What the reader sees | Status |
|---|---|---|
| `hotel_search` | Agoda search form — destination, dates, Search | **Live** |
| `tours` | GetYourGuide card — city, copy, photo, "Find Things to Do" | **Live** |
| `flights` | Flight search form | Not configured — renders nothing |
| `map` | — | Not configured; Travelpayouts has no hotel map widget |
| `calendar` | — | Not configured; the calendar widgets are for tours, not hotels |

### Hotels or tours? One or the other, never both

**Only one Travelpayouts widget renders reliably per page** — see the hard limit
below. So this is a choice, not a stack:

| | Rate | Cookie |
|---|---|---|
| `hotel_search` (Agoda) | 6% | **1 day** |
| `tours` (GetYourGuide) | 8% | **31 days** |

- **A review of one hotel → `hotel_search`**, pointed at that hotel. Nothing
  converts better than the exact property the reader just read about.
- **A destination guide → `tours`.** Better rate, and a cookie 31 times longer,
  which matters because almost nobody books a trip the day they read about it.

`tours` also needs the city to be one GetYourGuide actually covers — see below.

`hotel_search` uses Agoda rather than Booking.com. Agoda pays 6% against
Booking's 3–5%, and — the deciding factor — Booking's widget offers no colour
or destination options at all, so it can only render as a blue box that opens
on an empty search.

### `city` — look it up, never type it

**Always run the resolver first:**

```bash
node scripts/resolve-travel-destination.mjs "Byron Bay"
```

Use one of the strings it prints, verbatim. Then check the whole site still
resolves:

```bash
node scripts/resolve-travel-destination.mjs --check
```

This is not belt-and-braces. The widget passes your string to Agoda, which
matches it against its own place list — and **a string Agoda doesn't recognise
does not error.** It quietly resolves to whatever is nearest. Real examples from
building this rollout, every one of which would have shipped a perfectly
good-looking widget:

| Typed | Reader would have got |
|---|---|
| Salt at Shoal Bay | Salta, **Argentina** |
| Bells at Killcare | Belfast, **United Kingdom** |
| QT Port Douglas | QT **Perth** |
| Santa Monica CA | Santa Mónica, **Uruguay** |
| Kerala, India | Kochi (Agoda has no Kerala) |

Two rules that fall out of it:

- **Shorter is often righter.** `"Nusa Lembongan"` resolves to the area;
  `"Nusa Lembongan, Indonesia"` resolves to a hotel *inside* it. The resolver
  tells you which.
- **If the venue isn't on Agoda, use the town.** Bells at Killcare isn't listed,
  so that article uses `"Killcare"`. Honest, and it still converts.

Point at the most specific thing that is genuinely right: the **hotel** for a
hotel review, the **area or city** for a destination guide. Never a Landmark —
that's a monument, not somewhere to sleep.

### `city` for `tours` — it must be on the list

Tours are addressed by **IATA city code**, not by name, and the component maps
your `city` through `TOURS_CITIES` in `lib/travelpayouts.ts`. A city that isn't
on that list renders **nothing at all**, deliberately.

That list is explicit because **an airport code is not proof of coverage.**
Mudgee has a code (DGE) and no GetYourGuide tours whatsoever: the widget falls
back to a generic "View activities at GetYourGuide" panel with a blurry stock
photo and no button. It looks broken and earns nothing.

To add a city:

```bash
node scripts/resolve-travel-destination.mjs --iata "Lisbon"
```

Then **render it and look at it** before adding it to `TOURS_CITIES`. If the card
shows the city's own name, its own copy and a "Find Things to Do" button, it's
good. If it shows the generic GetYourGuide panel, it isn't — use `hotel_search`
for that article instead.

### Optional extras

```
<TravelWidget type="hotel_search" city="Ubud" caption="Where we stayed in Ubud" />
```

- `caption` — the line under the widget. It defaults to something sensible and
  knows the difference between a hotel and a place: a three-part destination is
  a hotel, so it reads *"Check availability at Saffire Freycinet"*, while a
  place reads *"Search hotels in Ubud"*. Only set it if you want other words.
- `subid` — a label for reporting, so Travelpayouts shows which article earned
  what. Defaults to the city. Set it when one article carries several widgets.
- `height` — reserved height in px. Rarely needed; the defaults are tuned per type.

## Where to put it

Mid-article, after the section that makes the reader want to go — usually just
after the hotel or neighbourhood you've described. Not in the intro, before
they're sold, and not stranded at the very end.

**One per page — this is a hard limit, not taste, and it applies across types.**
Two widgets on one page race each other. Two `hotel_search` widgets and
*neither* renders. A `hotel_search` and a `tours` together is worse: on one load
the hotel widget silently failed and only the tours card appeared; on a reload
of the identical page, both appeared. Same page, different outcome.

An intermittent failure is worse than a clean one — it passes review and breaks
for some readers — so put **one** widget on a page and choose which. If a guide
covers two cities, pick the one the reader is most likely to book and link the
other in prose.

## If it doesn't show up

It renders nothing on purpose when it can't render properly. That's the design:
a missing widget is invisible, never a broken empty box. The two causes:

1. **No marker set.** `NEXT_PUBLIC_TRAVELPAYOUTS_MARKER` isn't in the
   environment — normal in local dev. It works on the live site.
2. **That widget type isn't configured yet.** Its `promoId` in
   `lib/travelpayouts.ts` is still blank — true today of `map`, `calendar` and
   `flights`. Fill it from the dashboard embed code.
3. **There's already a widget on the page.** See the one-per-page limit above.

Both are silent by design, so if you've added a widget and see nothing on the
live site, check `lib/travelpayouts.ts` before assuming it's a layout bug.

## Colours

Only `hotel_search` is themeable. `tours` is a GetYourGuide-branded editorial
card with no colour parameters at all, so it keeps their look — which is fine,
because it reads as a piece of content rather than a form.

Out of the box the hotel widget is Travelpayouts blue — blue button, blue border,
blue calendar icons, rounded corners. `THEME` in `lib/travelpayouts.ts` maps
them onto the house palette instead: wine button and icons, soft greige border,
square corners, eucalypt focus ring. The accent is a single `ACCENT` constant at
the top of `THEME` — change that one line and every widget on the site changes
at once. (Ink, `#2a2621`, is the quieter alternative if wine proves too loud.)
Never restyle one widget in an article.

The brand's own logo keeps its colours — that part isn't ours to change.

## Disclosure

These are affiliate placements, so an article carrying one **must** have
`affiliate_disclosure: true` in its frontmatter, which prints the standard line
at the foot of the page. Adding the widget and leaving the flag at `false` is a
disclosure failure, not an oversight — four articles in the first rollout had
`affiliate_disclosure: false` and had to be flipped.
