// Some Shopify product titles carry a stray leading dash/bullet that leaks in from
// the source data (e.g. "- You're Welcome Mascara", "- 15% Vitamin C Serum"). Strip
// a single leading dash/bullet + following whitespace for display only — this never
// mutates the Shopify record, so the fix is safe and reversible.
export function cleanProductTitle(title: string | undefined | null): string {
  if (!title) return ''
  return title.replace(/^\s*[-–—•·]+\s+/, '').trimStart()
}
