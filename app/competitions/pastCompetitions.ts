export type PastCompetition = {
  /** Archive page slug, e.g. 'beauty-expo-australia-2026' */
  slug: string
  name: string
  /** Human-readable run window, e.g. 'July 2026' */
  period: string
  /** When the winner was drawn, e.g. '3 August 2026' */
  drawn: string
}

/**
 * Ended competitions, newest first.
 *
 * When a competition finishes and a new one takes its place on
 * /competitions/terms, archive the ending one:
 *   1. Snapshot its full terms to app/competitions/archive/<slug>/page.tsx
 *      (a frozen copy — this is the record of exactly what entrants agreed to).
 *   2. Add an entry to this array.
 * The "Past competitions" link and the archive index appear automatically
 * once this array has at least one entry.
 */
export const pastCompetitions: PastCompetition[] = [
  {
    slug: 'beauty-expo-australia-2026',
    name: 'Beauticate x Beauty Expo Australia 2026 Giveaway',
    period: 'July 2026',
    drawn: '3 August 2026',
  },
]
