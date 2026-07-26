// ─── Per-brand gift state (Vercel Blob) ────────────────────────────────────────
//
// After each gift we write a small JSON doc per brand to Vercel Blob. This is the
// "flag the storefront can later read" from the brief: phase two's remaining-count
// API + banner read this (or recompute from Admin) to show "X of 20 remaining" and
// to mark a brand's gift as claimed once the cap is hit.
//
// Blob path: gift-state/<brand.key>.json  (public, tiny). We overwrite in place.

import { put } from '@vercel/blob'
import type { GiftBrand } from './gift-campaign'
import { capFor } from './gift-campaign'

export type GiftState = {
  brand: string // key
  label: string
  sent: number // gifts dispatched so far
  cap: number
  remaining: number // max(cap - sent, 0)
  claimed: boolean // true once sent >= cap
  updatedAt: string // ISO
}

const pathFor = (brand: GiftBrand) => `gift-state/${brand.key}.json`

/** Write the current state for a brand. Never throws — a Blob failure must not
 *  block the gift email or order tag (those are the source of truth). */
export async function writeGiftState(brand: GiftBrand, sent: number): Promise<void> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    // Blob not configured in this environment — state is optional for the core loop.
    return
  }
  const cap = capFor(brand)
  const state: GiftState = {
    brand: brand.key,
    label: brand.label,
    sent,
    cap,
    remaining: Math.max(cap - sent, 0),
    claimed: sent >= cap,
    updatedAt: new Date().toISOString(),
  }
  try {
    await put(pathFor(brand), JSON.stringify(state, null, 2), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
      allowOverwrite: true,
    })
  } catch (err) {
    console.warn('[gift] writeGiftState failed (non-fatal):', err)
  }
}
