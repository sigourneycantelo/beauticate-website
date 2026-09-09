import { GWP_OFFERS, cartQualifiesFor, amountToGiftFor, brandSubtotalFor } from '@/lib/gwp'

const offer = GWP_OFFERS[0]
const line = (vendor: string, productId: string, price: string, qty = 1, variantId = 'v' + Math.random()) => ({
  id: 'line-' + Math.random(), quantity: qty,
  cost: { amountPerQuantity: { amount: price, currencyCode: 'AUD' }, totalAmount: { amount: String(+price * qty), currencyCode: 'AUD' } },
  merchandise: { id: variantId, title: 'Default Title', price: { amount: price, currencyCode: 'AUD' },
    selectedOptions: [], product: { id: productId, handle: 'h', title: 't', vendor, featuredImage: null } },
}) as any
const cart = (...lines: any[]) => ({ id: 'c', checkoutUrl: '', totalQuantity: lines.length,
  cost: { subtotalAmount: { amount: '0', currencyCode: 'AUD' }, totalAmount: { amount: '0', currencyCode: 'AUD' } },
  lines: { nodes: lines } }) as any

const BOOIE = 'BOOIE Beauty'
const P = (n: string) => 'gid://shopify/Product/' + n
const GIFTCARD = 'gid://shopify/Product/8095275155525'
const giftLine = line(BOOIE, offer.giftProductId, '0.01', 1, offer.giftVariantId)

const cases: [string, any, boolean][] = [
  ['$21 brow gel alone',                      cart(line(BOOIE, P('1'), '21.00')), false],
  ['$39 Bloody Delicious alone',              cart(line(BOOIE, P('2'), '39.00')), false],
  ['$42 Smooth Operator alone',               cart(line(BOOIE, P('3'), '42.00')), false],
  ['$45 BB Cream alone',                      cart(line(BOOIE, P('4'), '45.00')), true],
  ['$45 BB Cream + gift already in cart',     cart(line(BOOIE, P('4'), '45.00'), giftLine), true],
  ['$31 mascara + $21 brow = $52',            cart(line(BOOIE, P('5'), '31.00'), line(BOOIE, P('1'), '21.00')), true],
  ['$28 x2 = $56',                            cart(line(BOOIE, P('6'), '28.00', 2)), true],
  ['$72 other brand + $21 BOOIE',             cart(line('Lumira', P('9'), '72.00'), line(BOOIE, P('1'), '21.00')), false],
  ['$200 BOOIE gift card alone',              cart(line(BOOIE, GIFTCARD, '200.00')), false],
  ['gift card $200 + $21 brow gel',           cart(line(BOOIE, GIFTCARD, '200.00'), line(BOOIE, P('1'), '21.00')), false],
  ['sold-out BOOIE line (qty 0) at $45',      cart(line(BOOIE, P('4'), '45.00', 0)), false],
]

let fail = 0
for (const [label, c, expected] of cases) {
  const got = cartQualifiesFor(offer, c)
  const ok = got === expected
  if (!ok) fail++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label.padEnd(38)} subtotal $${brandSubtotalFor(offer, c).toFixed(2).padStart(6)}  gift: ${got ? 'YES' : 'no'}${ok ? '' : `  ← expected ${expected ? 'YES' : 'no'}`}`)
}
console.log(`\nshortfall shown to a $31 basket: $${amountToGiftFor(offer, cart(line(BOOIE, P('5'), '31.00'))).toFixed(2)}`)
console.log(`minSpend in config: $${offer.minSpend}   excluded: ${offer.excludedProductIds?.length ?? 0} product(s)`)
console.log(fail === 0 ? '\nAll cases pass.' : `\n${fail} FAILED`)
