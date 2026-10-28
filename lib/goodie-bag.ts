// Source for /shop/collections/goodie-bag: what went home in the Beauticate
// Collective lunch gift bags. Price, image and stock are read live from Shopify
// by handle, so nothing here is a price. `variant` pins a colourway so the tile
// shows and links to that one (see lib/shop-variant.ts).

export interface GoodieBagItem {
  handle: string
  variant?: string
  /** One-line note under the tile. */
  note: string
  /** Use this image instead of the listing's own, as the only shot. For listings
   *  whose photos carry award medals or NEW badges. Must be a de-etched pack shot. */
  image?: string
}

export interface GoodieBagPhoto {
  src: string
  alt: string
  /** First names only, small grey caps, as on the story. */
  caption: string
}

export interface GoodieBagGroup {
  title: string
  items: GoodieBagItem[]
  /** Large line set between this group and the next. */
  quote?: string
  /** Lunch photos shown under the products, so the reader sees them being used. */
  photos?: GoodieBagPhoto[]
}

const LUNCH = '/content/sigourneys-edit/edit/beauticate-collective-lunch-lua-sydney-fish-market'
const photo = (file: string, alt: string, caption: string): GoodieBagPhoto => ({ src: `${LUNCH}/${file}`, alt, caption })

/** The strip at the top. Kate leads. */
export const GOODIE_BAG_LEAD: GoodieBagPhoto[] = [
  photo('collective-member-with-estetika-bag.jpg', 'Kate holding a blush pink quilted Estetika makeup bag at Lua', 'Kate with her Estetika bag'),
  photo('lua-table-set-with-estetika-makeup-bags.jpg', 'The table at Lua set with pink quilted makeup bags at every place', 'Estetika bags at every place'),
  photo('estetika-makeup-bag-detail.jpg', 'A pink quilted Estetika makeup bag with its leather zip pull on a green marble table', 'The Estetika makeup bag'),
  photo('guest-unpacking-gift-bag.jpg', 'Shentel unpacking her gift bag at the table at Lua', 'Shentel unpacking hers'),
]

export const GOODIE_BAG_GROUPS: GoodieBagGroup[] = [
  {
    title: 'The hair duo',
    photos: [
      photo('st-louis-says-tote-of-gifts.jpg', 'A St. Louis Says tote filled with gifts from the shop brands beside a pink quilted bag', 'St. Louis Says in the tote'),
    ],
    quote: 'Heat damage is a tax. This brush lowers it.',
    items: [
      { handle: 'infrared-thermal-brush', note: 'Your shape with less heat. Start low, go up only if you need to.' },
      { handle: 'the-mask-200ml-tub', note: 'A weekly treat for hair that has been through colour and heat.' },
    ],
  },
  {
    title: 'The glow duo',
    photos: [
      photo('guest-in-navy-velvet-trying-makeup.jpg', 'Elle in a navy velvet blazer trying a makeup product from her gift bag', 'Elle swatching BOOIE'),
      photo('two-guests-talking-at-table.jpg', 'Jocelyn talking at the table at Lua with a pink bag in the foreground', 'Jocelyn, bag within reach'),
    ],
    quote: 'A glow that looks like a good night’s sleep.',
    items: [
      {
        handle: 'liquid-glow-drops',
        image: 'https://cdn.shopify.com/s/files/1/0682/9713/0053/files/Untitled_design_42_63e38cdd-b7d3-42ec-99de-0d810c6726ca.png?v=1773795196',
        note: 'Cheekbones, brow bones, Cupid’s bow. Start with less than you think.',
      },
      {
        handle: 'collagen-lips-6a74103536ae01253cc6f808',
        variant: '90\'s Nude',
        image: '/content/shop/goodie-bag/imbibe-collagen-lips-90s-nude.jpg',
        note: '90’s Nude is your lips but better. It works with everything.',
      },
    ],
  },
  {
    title: 'The brush duo',
    photos: [
      photo('guest-trying-products-at-table.jpg', 'Shentel at the long table going through her makeup bag', 'Shentel lining up her Basics By B brushes'),
      photo('place-setting-mirror-and-menu.jpg', 'A small mirror and menu at a place setting on the table at Lua', 'One of the little mirrors'),
    ],
    quote: 'Blush holder, blue brushes.',
    items: [
      { handle: 'luxury-10-piece-vegan-brush-set', note: 'Ten vegan brushes. Everything covered.' },
      { handle: 'blush-pink-makeup-brush-holder-69320164541cad1b4f33df6d', variant: 'Blush Pink', note: 'A quilted roll that keeps bristles clean and safe.' },
    ],
  },
  {
    title: 'The scent duo',
    photos: [
      photo('cocktail-and-pink-makeup-bag-on-table.jpg', 'A cocktail garnished with an orange flower beside a pink quilted bag and a Lua menu', 'Cocktails and pink bags'),
      photo('archer-farrar-and-buj-gifts.jpg', 'A hand holding an Archer Farrar fragrance box and buj packaging over a St. Louis Says tote', 'Archer Farrar and buj, fresh from the bag'),
    ],
    quote: 'Intimate, not announcing you from the lift.',
    items: [
      {
        handle: 'embrace-oil',
        image: 'https://cdn.shopify.com/s/files/1/0682/9713/0053/files/Embrace-Oil.webp?v=1780970210',
        note: 'A perfume oil with tuberose, rose and sandalwood. Narcotic.',
      },
      { handle: 'tuscan-fig-candle', note: 'Late summer under a fig tree. About 80 hours of burn.' },
    ],
  },
  {
    title: 'The bag and the BB',
    photos: [
      photo('open-estetika-makeup-bag-with-products.jpg', 'An open pink Estetika makeup bag on the table, filled with products', 'Inside the Estetika bags'),
      photo('guest-at-lua-entrance-with-gift-bags.jpg', 'Michelle holding a pink quilted bag and a tote of gifts at the entrance of Lua', 'Michelle'),
    ],
    quote: 'The bag you keep long after what’s inside runs out.',
    items: [
      { handle: 'pink-homee-medium-makeup-bag-designer-cosmetic-case-69320164541cad1b4f33df92', variant: 'Blush Pink', note: 'Quilted vegan leather. The blush pink is the one we fell for.' },
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
    photos: [
      photo('lamav-cc-cream-and-makeup-brushes.jpg', 'A LAMAV BB cream, a concealer and makeup brushes laid out in front of a pink quilted bag', 'LAMAV and brushes, laid out'),
      photo('hand-holding-lamav-concealer-estetika-bag.jpg', 'A hand holding a LAMAV concealer above a pink Estetika bag', 'A LAMAV concealer'),
    ],
    items: [
      {
        handle: 'lean-powder-formula',
        variant: 'Lean+ Powder Formula - 30 Day Supply',
        image: '/content/shop/goodie-bag/jshealth-lean-plus.jpg',
        note: 'Creatine made for women, in a 30-day tub.',
      },
      { handle: 'ayurvedic-body-oil-unwind', note: 'Lavender, chamomile and neroli for the end of the day.' },
    ],
  },
]

export const GOODIE_BAG_HANDLES = GOODIE_BAG_GROUPS.flatMap(g => g.items.map(i => i.handle))
