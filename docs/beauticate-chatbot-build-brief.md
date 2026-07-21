# Beauticate "Ask Sig" Chatbot — Build Brief

## Purpose
A conversational AI that lets visitors talk directly to Sig, in her voice, about beauty, wellness, fashion and lifestyle — the same questions people ask her in real life. Not a generic support bot. Not a search box. A friend who happens to be a beauty and wellness expert.

## Data sources to ingest
1. **All migrated articles** — full text, pulled from the repo. Already available; no upload needed.
2. **WordPress XML export** — as supplementary context where useful (article intros, older content not yet fully migrated).
3. **Podcast transcripts (Beautiful Inside)** — status TBC, flag if these need sourcing before ingestion.
4. **Sig's voice document** — 2 to 3 pages Sig will write separately covering her philosophy on beauty, wellness and fashion, how she'd advise a friend, tone and phrases she actually uses. This is the piece that makes the bot sound like her rather than generic. Build the ingestion pipeline to accept this as a discrete file so it can be added or updated later without a full rebuild.

## Functional requirements
- Chat interface powered by Claude API (Anthropic), using the above sources as context/retrieval rather than fine-tuning.
- Conversational memory within a session (should feel like one continuous chat, not stateless Q&A).
- Fallback handling for questions outside scope (medical advice, anything requiring a professional) — bot should redirect gracefully, in Sig's voice, rather than guess.
- Should be able to reference and link out to specific Beauticate articles and shop products where relevant to an answer.

## Placement and UX
- Floating launcher, bottom-right, present on every page. Small circular avatar using a warm candid photo of Sig, wine (#7a2733) background ring.
- Expands into a slide-up panel (not a full navigation to a new page) so the visitor never leaves the article or shop page they were on.
- Panel header repeats Sig's photo and a short greeting line in EB Garamond (e.g. "Ask me anything").
- Message bubbles: Hanken Grotesk. User messages in wine (#7a2733) with white text. Sig's responses in greige with chocolate (#3a2a22) text. Background cooled near-white.
- Mobile: launcher shrinks slightly, panel opens as a bottom sheet rather than side panel.

## Naming
Working name "Ask Sig." Confirm before final copy pass.

## Explicitly out of scope for this build
- No off-the-shelf chat vendor (Intercom, Drift, Zendesk). This is fully custom, built into the Next.js site.
- No e-commerce transactions inside the chat (no checkout, no cart actions) at this stage — recommendations and links only.
- No dedicated /chat page for v1. Site-wide floating panel only.

## Open questions for Sig before/during build
- Are Beautiful Inside podcast transcripts available as text somewhere, or do they need transcribing first?
- Confirm final name ("Ask Sig" vs alternatives) before it's wired into copy.
