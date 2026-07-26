// ─── Idempotency claim for webhook processing ──────────────────────────────────
//
// Shopify can deliver the same webhook more than once. We must never email a
// warehouse twice for one order. Three layers, strongest first:
//
//   1. KV atomic claim (optional). If KV_REST_API_URL + KV_REST_API_TOKEN are set
//      (Vercel KV / Upstash Redis), we do `SET key val NX EX ttl` — a genuine
//      cross-instance, race-free claim. This is the recommended production setup.
//   2. Order-tag guard (always on). The handler also checks the order's own
//      `gift-processed` tag before acting and adds it after. Durable across
//      instances and restarts; covers Shopify's normal (spaced-out) retries even
//      without KV.
//   3. In-memory in-flight set. Guards a burst of duplicates hitting the same warm
//      instance in the same tick.
//
// Without KV, there is a small residual window where two *simultaneous* duplicate
// deliveries on two cold instances could both pass — set the KV env vars to close it.

const KV_URL = process.env.KV_REST_API_URL
const KV_TOKEN = process.env.KV_REST_API_TOKEN
const CLAIM_TTL_SECONDS = 60 * 60 * 24 * 7 // keep the claim a week — well past any retry window

const inFlight = new Set<string>()

export function kvConfigured(): boolean {
  return Boolean(KV_URL && KV_TOKEN)
}

/**
 * Try to claim `key` exactly once. Returns true if THIS caller won the claim (and
 * should process), false if it was already claimed (duplicate — skip).
 *
 * `key` should be a stable per-delivery/per-order id, e.g. `order:<id>`.
 */
export async function claimOnce(key: string): Promise<boolean> {
  // Layer 3: same-instance in-flight guard.
  if (inFlight.has(key)) return false
  inFlight.add(key)

  // Layer 1: KV atomic SET NX (if configured).
  if (kvConfigured()) {
    try {
      // Upstash REST: SET key value NX EX ttl → returns {"result":"OK"} on success,
      // {"result":null} if the key already existed.
      const res = await fetch(`${KV_URL}/set/${encodeURIComponent(key)}/1`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${KV_TOKEN}` },
        body: JSON.stringify(['NX', 'EX', CLAIM_TTL_SECONDS]),
        cache: 'no-store',
      })
      const json = await res.json().catch(() => ({}))
      const won = json?.result === 'OK'
      if (!won) inFlight.delete(key) // not ours; let the winner keep its in-flight slot
      return won
    } catch (err) {
      console.warn('[gift] KV claim failed, falling back to tag/in-memory guard:', err)
      // Fall through: rely on the order-tag guard in the handler.
      return true
    }
  }

  // No KV: the handler's order-tag guard is the durable layer. We return true and
  // let it decide based on the `gift-processed` tag.
  return true
}

/** Release the in-flight slot (call in `finally`). Does not release the KV/tag
 *  claim — those are intentionally durable. */
export function releaseInFlight(key: string): void {
  inFlight.delete(key)
}
