# Beauticate — About Page Build Brief (full)
## For Claude Code

### Scope
The complete set of About page updates: the founder letter section, the full-width bio panel, the press band, the "Our Story" timeline and the page order. Australian spelling and no em dashes throughout. This is house style and non-negotiable.

### Page order (top to bottom)
1. Masthead and nav (existing)
2. Founder letter (portrait left, letter right)
3. Full-width bio panel
4. Press band ("As seen in")
5. Our Story timeline
6. The Collective
7. The team
8. FAQ
9. Work with Beauticate
10. Footer

---

### 1. Founder letter

**Eyebrow.** Change the eyebrow above the headline from "ABOUT" to "FROM THE FOUNDER". The old eyebrow echoed the "About Beauticate" headline directly beneath it. The new one frames the section as a personal note.

**Layout.** Unchanged. Portrait left, letter right.

**Pull quote.** Lift one line from the letter and set it as a large EB Garamond pull quote, placed roughly mid-letter. This breaks the long single column, which matters most on mobile where the letter currently reads as a wall of text. Suggested line: "Real beauty has never been just about what you put on your skin." Treat it as a visual lift from the body copy, not a duplicate paragraph.

**Portrait CTA.** Keep the link under the portrait. Label it "Explore Sigourney's Edit →". It points to Sigourney's Edit, her column-style articles in her own voice. Confirm the route against the live nav.

---

### 2. Full-width bio panel

The grey bio panel currently sits only under the right (letter) column. Change it to span the full content width, ruled off beneath both the portrait and the letter, as a closing band before the press band. Keep the warm beige-grey background and the smaller serif treatment.

Do not hyperlink the whole panel. It is a credentials block, so a whole-block link has no clear affordance and hurts accessibility. Instead add one inline text link at the end of the panel: "Read Sigourney's magazine work →", pointing to the live "From the Archive" page (her Vogue and freelance work from her magazine days). This sits naturally beneath the prose about her bylines. Confirm the route.

Cleaned panel copy (em dashes removed to match house style):

> Sigourney Cantelo is the founder and publisher of Beauticate. With over 25 years across print, digital and broadcast, including her tenure as Beauty & Health Director at Vogue Australia and regular appearances on Sunrise and the Today show as a beauty and style commentator, she is one of Australia's most recognised voices in beauty, health and wellness media. Her work has appeared in Body + Soul, marie claire, Sunday Life and numerous Australian and international publications. She is a six-time Star Beauty Award winner and a five-time Jasmine Award recipient, including twice winning the Jasmine Award for Journalistic Excellence.
>
> She founded Beauticate in 2014 as an independent editorial platform, with the depth and rigour of a major masthead and the freedom of something entirely her own. Today it reaches 3.1 million monthly touchpoints across editorial, podcast, newsletter, Instagram and e-commerce.

---

### 3. Press band — "As seen in"

A press page is already live, and the shop already has a press band component. Reuse both. Do not source or rebuild logos from scratch.

Add a compact press band directly after the bio panel. A single understated row of the existing press logos, with the band linking through to the full live press page. Label it "As seen in" in the eyebrow style.

The press page is coverage of Sigourney and Beauticate over the years (others writing about them). The "From the Archive" page is Sigourney's own bylines. These are two different things, so the labels must keep them distinct. "As seen in" reads as coverage. "Read Sigourney's magazine work" reads as her bylines. Do not let the two blur. If you prefer something more explicit than "As seen in", "Beauticate in the press" also works.

Treatment: small, muted or single-colour logos with generous whitespace. Understated. A row of loud full-colour logos reads as a startup landing page, which is the opposite of the brand.

---

### 4. Our Story timeline

**Intent.** Rebuild the existing timeline graphic as a real, responsive, crawlable HTML component. It tells the Beauticate story from 2014 to 2026 and doubles as an internal-linking device, with each milestone linking to the section it references (Interviews, Living, Destinations, the Directory, Podcast, Shop).

Critical: the current version is a flat exported image, so none of its copy is readable by Google or AI search and it does not scale on mobile. Rebuild it as actual text and markup. As real HTML, every milestone becomes crawlable, AI-readable content on a page already doing heavy E-E-A-T and AEO lifting.

**Responsive behaviour.** Two behaviours, one set of content. Same DOM, no duplicated markup.

Desktop and tablet landscape: a horizontal rail the user scrolls or drags through left to right. Use native CSS scroll-snap (`scroll-snap-type: x proximity` on the track, `scroll-snap-align: start` on each milestone). No carousel library. Show a soft fade or subtle arrow at the right edge so people know it continues.

Mobile (mobile-first): the same milestones reflow into a clean vertical timeline that reveals as the user scrolls down. The connecting rail runs top to bottom. No horizontal swipe inside a vertically scrolling page. It fights the scroll and confuses people.

Drive this with a single breakpoint that flips `flex-direction` from row (desktop) to column (mobile).

**Markup.** Semantic and accessible. Ordered list, since this is a sequence. Real anchors, not onClick handlers.

```html
<section class="story" aria-labelledby="story-heading">
  <p class="eyebrow">OUR STORY</p>
  <h2 id="story-heading">A decade in the making</h2>
  <ol class="story-track">
    <li class="milestone">
      <time datetime="2014">2014</time>
      <p>While at Vogue, Sigourney starts Beauticate as a side project. Rapid growth sees her leave to go all in.</p>
    </li>
    <li class="milestone">
      <time datetime="2015">2015</time>
      <p>The GO-TOs Spa and Salon Directory launches and the travel vertical grows.</p>
      <a href="/directory">Explore the Directory →</a>
    </li>
    <!-- ...remaining milestones... -->
  </ol>
</section>
```

**Milestones (copy + links).** Copy is final and in house style. Confirm years and routes against the live build.

- **2014** — While at Vogue, Sigourney starts Beauticate as a side project. Rapid growth sees her leave to go all in. → no link (origin)
- **2015** — The GO-TOs Spa and Salon Directory launches and the travel vertical grows. → Directory (also Destinations)
- **2016** — The WHOs series takes off. Polished at-home shoots blend beauty, interiors and the lives of industry insiders. → Interviews
- **2017** — The Top 100 best beauty buys lands, expertly curated. → Top 100 edit
- **2019** — Top 100 Products of All Time cements Beauticate as where readers shop from trusted edits. → Shop / the edit
- **2019** — The Interiors section launches and Beauticate becomes a full lifestyle platform. → Living
- **2022** — Beautiful Inside, the video podcast, launches and debuts at #3 on Apple. → Podcast
- **2024** — GO-TOs expands into wellness and aesthetics, profiling leading clinics and practitioners. → Wellness (also Directory)
- **2025** — Podcast reach triples to 3.1 million a month. → Podcast
- **2026** — The Beauticate Shop launches. → Shop

Wire each link to the live nav route. If a route is not ready, leave the line as plain text rather than pointing at a stub.

**Type and colour.** From the locked token set. Year numerals large in EB Garamond, milestone copy in Hanken Grotesk. Background can carry the warm beige-grey used elsewhere on the page so the section reads as a distinct beat. No new colours.

**The line and the badges.** The connecting line draws itself in as the section enters the viewport. Robust, cheap approach: a pseudo-element or thin SVG path whose `scaleX` (desktop) or `scaleY` (mobile) animates 0 to 1, driven by an IntersectionObserver, or a CSS scroll-driven animation (`animation-timeline: scroll()`) where supported with a static fallback. If JS is off or reduced-motion is set, the line renders in full. Legibility must never depend on the animation.

Reuse the existing circular stamps (TOP 100 and GO-TOs badges) as punctuation on the line at their milestones. Mark them decorative (`aria-hidden="true"`), since the year and copy already carry the meaning.

**Motion.** A soft fade and rise on each milestone as it enters, nothing more. No parallax. No autoplay. Wrap all motion in a `prefers-reduced-motion` guard.

**Accessibility and SEO.** Real text, real `<a>` links, an `<ol>` for the sequence, `<time datetime>` on each year. The desktop rail must be reachable and scrollable by keyboard, with tab focus moving along the milestone links. Reduced-motion respected.

**Do not.** Do not ship it as an image. Do not add a carousel library. Do not autoplay. Do not use horizontal swipe on mobile. Do not link a milestone to a stub route.

---

### What NOT to put on this page
No Editors' Essential Edits, and no product or commerce strip of any kind. About is the trust and story page. A "shop these" strip splits intent and dents credibility. Those product edits belong on the homepage and category pages where buying is the job.
