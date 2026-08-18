Subject: Entity audit on beauticate.com — one finding you'll want

Hi Doug,

We ran a first pass at consolidating my entity on beauticate.com, using the method
from your disambiguation case study. Nine defects found and fixed. One of them
isn't in the playbook and I think you'll find it interesting.

**The starting position was different to yours.** There's no name collision to
solve — "Sigourney Cantelo" is effectively unique. So the problem was
consolidation rather than disambiguation: 25 years of work scattered across
vogue.com.au, marieclaire.com.au, beauticate.com, Spotify, YouTube and LinkedIn,
with nothing asserting it belongs to one person.

I also already have the anchor your case study ends on — live Wikidata items for
both the person (Q139644159) and the company (Q139643093).

**The finding worth passing on: next/script silently withholds JSON-LD from the
HTML.**

Our sitewide entity graph — Organization with the Wikidata ID, the Person node,
the WebSite SearchAction — was emitted through Next.js's next/script component
with strategy="beforeInteractive". It looked completely correct in source.

It wasn't in the served HTML at all. next/script queues the tag for client-side
injection, so the markup shipped as an escaped string inside a JavaScript payload
rather than as a real <script type="application/ld+json"> element.

Homepage: 0 ld+json elements in served HTML. After the fix: 1, carrying
Organization + Person + WebSite.

Google executes JavaScript and would have resolved it eventually. GPTBot,
ClaudeBot, PerplexityBot and CCBot largely don't. So the entire graph was
invisible to precisely the systems the work is meant to reach — while passing
every source-level review, because the markup itself was perfect.

It's the same shape as your managed-robots block: flawless structured data
sitting behind something that stops the crawler ever reading it. Different layer,
same failure. What made it detectable was checking the output rather than the
file — reading layout.tsx showed correct schema, only curl on the rendered page
showed there was none.

**The other eight, briefly.** A dead Instagram profile sitting in sameAs (and in
the visible byline of 58 published articles, and in the schema snippets pasted
into our Shopify store). Three Instagram handles and two LinkedIn URLs across
four Person blocks. A canonical pointing at a URL that 301s back to itself.
Eleven redirect hops in schema including every article's author node.
Contradictory founding years. A subjectOf anchor that didn't exist.

Your "broken sameAs breaks the chain silently" point was exactly right, and worse
than I expected in practice — Instagram returns HTTP 200 for profiles that don't
exist, so reachability testing alone would have passed the dead one. What caught
it was cross-checking against the Wikidata item, which also turned up a Facebook
profile and a YouTube channel ID our codebase didn't know about. We've automated
that check so it can't drift again.

**Where we're stuck:** my 6 Jasmine and 6 Star Beauty Awards can't go on
Wikidata. P166 needs an item value and neither award exists as a Wikidata item —
both would have to be created and independently sourced first. Carrying them in
the site's own Person schema for now.

Nothing's deployed yet — it's all verified against a local build and waiting on
review, so none of it has reached a crawler. Taking a cold baseline across
Google, ChatGPT, Perplexity and AI Mode before it ships.

Next up is sigourneycantelo.com itself (both domains registered), then rebuilding
27 magazine clips that currently sit as PDF links on a single URL into individual
indexed pages, then the cross-domain bridge so the two sites read as one entity
rather than two competitors for my name.

Thanks for writing the case study — the crawler-access section in particular is
what made us check the output instead of trusting the source.

Sigourney
