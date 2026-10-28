// Source for /shop/collections/goodie-bag: what went home in the Beauticate
// Collective lunch gift bags. Price, image and stock are read live from Shopify
// by handle, so nothing here is a price. `variant` pins a colourway so the tile
// shows and links to that one (see lib/shop-variant.ts).

export interface GoodieBagItem {
  handle: string
  variant?: string
  /** One-line note under the tile. */
  note: string
}

export interface GoodieBagGroup {
  title: string
  items: GoodieBagItem[]
  /** Large line set between this group and the next. */
  quote?: string
}

export const GOODIE_BAG_GROUPS: GoodieBagGroup[] = [
  {
    title: 'The hair duo',
    quote: 'Heat damage is a tax. This brush lowers it.',
    items: [
      { handle: 'infrared-thermal-brush', note: 'Your shape with less heat. Start low, go up only if you need to.' },
      { handle: 'the-mask-200ml-tub', note: 'A weekly treat for hair that has been through colour and heat.' },
    ],
  },
  {
    title: 'The glow duo',
    quote: 'A glow that looks like a good night’s sleep.',
    items: [
      { handle: 'liquid-glow-drops', note: 'Cheekbones, brow bones, Cupid’s bow. Start with less than you think.' },
      { handle: 'collagen-lips-6a74103536ae01253cc6f808', variant: '90\'s Nude', note: '90’s Nude is your lips but better. It works with everything.' },
    ],
  },
  {
    title: 'The brush duo',
    quote: 'Pink holder, blue brushes.',
    items: [
      { handle: 'luxury-10-piece-vegan-brush-set', note: 'Ten vegan brushes. Everything covered.' },
      { handle: 'blush-pink-makeup-brush-holder-69320164541cad1b4f33df6d', variant: 'Pink', note: 'A quilted roll that keeps bristles clean and safe.' },
    ],
  },
  {
    title: 'The scent duo',
    quote: 'Intimate, not announcing you from the lift.',
    items: [
      { handle: 'embrace-oil', note: 'A perfume oil with tuberose, rose and sandalwood. Narcotic.' },
      { handle: 'tuscan-fig-candle', note: 'Late summer under a fig tree. About 80 hours of burn.' },
    ],
  },
  {
    title: 'The bag and the BB',
    quote: 'The bag you keep long after what’s inside runs out.',
    items: [
      { handle: 'pink-homee-medium-makeup-bag-designer-cosmetic-case-69320164541cad1b4f33df92', variant: 'Pink', note: 'Quilted vegan leather. The pink is the one we fell for.' },
      { handle: 'excellent-bb-cream', note: 'Medium, buildable coverage with SPF 30. Free Bloody Delicious illuminator on BOOIE orders over $45 while stocks last.' },
    ],
  },
  {
    title: 'The body duo',
    quote: 'A breast cream I’ve been quietly evangelising.',
    items: [
      { handle: 'the-uplifter', note: 'buj is a brand made entirely for breast skincare.' },
      { handle: 'instant-self-tan-mousse-250ml-summer-in-santorini', note: 'A violet base keeps it away from orange.' },
    ],
  },
  {
    title: 'The wellness duo',
    items: [
      { handle: 'lean-powder-formula', variant: 'Lean+ Powder Formula - 30 Day Supply', note: 'Creatine made for women, in a 30-day tub.' },
      { handle: 'ayurvedic-body-oil-unwind', note: 'Lavender, chamomile and neroli for the end of the day.' },
    ],
  },
]

export const GOODIE_BAG_HANDLES = GOODIE_BAG_GROUPS.flatMap(g => g.items.map(i => i.handle))
