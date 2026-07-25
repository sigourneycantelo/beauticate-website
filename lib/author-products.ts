export interface AuthorProduct {
  name: string
  brand: string
  price?: string
  image: string
  handle?: string   // Beauticate shop product → links to /shop/products/{handle}
  url?: string       // affiliate/external → opens in new tab
}

const WINTER_EDIT = '/content/beauty-style/beauty-tips/beauticate-team-winter-edit'
const BIOHACKING = '/content/wellness/biohacking/wellness-tech-red-light-sauna-sleep-tracker-review'
const LA_EFFECT = '/content/beauty-style/beauty-tips/the-la-effect-beverly-hills-style-lessons'

export const AUTHOR_PRODUCTS: Record<string, AuthorProduct[]> = {
  'kate-waterhouse': [
    { brand: 'Forever New', name: 'Felled Scarf Coat', price: '$279.99', image: `${WINTER_EDIT}/emily-felled-scarf-coat.png`, url: 'https://bit.ly/4fO4oQ4' },
    { brand: 'Henne', name: 'Carr Top', price: '$49.99', image: `${WINTER_EDIT}/carr_top_cream_1_768x.webp`, url: 'https://bit.ly/3PSdgJX' },
    { brand: 'Maison Balzac', name: 'Sainte T Room Spray', price: '$59', image: `${WINTER_EDIT}/maisonbalzac_scentedwater_saintet.webp`, handle: 'sainte-t-room-spray' },
    { brand: 'Henne', name: 'Soraia Long Sleeve Dress', price: '$399', image: `${LA_EFFECT}/henne-soraia-dress.jpg`, url: 'https://bit.ly/4ox7j2b' },
    { brand: 'Ysso', name: 'Whisper of the Wind Gold-Plated Earrings', price: '£320', image: `${LA_EFFECT}/ysso-whisper-earrings.jpg`, url: 'https://bit.ly/4eg2rel' },
  ],
  'rae-morris': [
    { brand: 'July', name: 'Juliette Suede Work Tote', price: '$495', image: `${WINTER_EDIT}/pdp_juliette_suede_work_tote_chestnut_1_142a9ebbda.png`, url: 'https://bit.ly/4fxTInc' },
    { brand: 'Frédéric Malle', name: 'Jurassic Flower Room Spray', price: '$331', image: `${WINTER_EDIT}/editionsdeparfumsbyfredericmalle-perfumegunjurassicflower.webp`, url: 'https://www.mecca.com/en-au/editions-de-parfums-by-frederic-malle/perfume-gun-jurassic-flower-I-043528/' },
    { brand: 'Rae Morris', name: 'Invisible Mattifier', image: `${WINTER_EDIT}/rae-morris-invisible-mattifier-2_992x.webp`, url: 'https://raemorris.com/products/invisible-mattifier' },
    { brand: 'Desert Rose', name: 'SPF 50+ Hydrating Face Serum', price: '$48', image: `${WINTER_EDIT}/desert-rose-spf50.webp`, url: 'https://desertroseaustralia.com/products/spf-50-hydrating-face-serum' },
    { brand: 'Muji', name: 'Aroma Stone', price: '$12.95', image: `${WINTER_EDIT}/muji-aroma-stone.jpg`, url: 'https://muji.com.au/products/aroma-stone-white' },
  ],
  'monique-mcmahon': [
    { brand: 'Hourglass', name: 'Unlocked Instant Extensions Mascara in Espresso', price: '$58', image: `${WINTER_EDIT}/hourglass-mascara-espresso.png`, url: 'https://bit.ly/4vMb4E6' },
    { brand: 'Bec + Bridge', name: 'Laurent Shirt in Woodgrain Choc', price: '$320', image: `${WINTER_EDIT}/bec-bridge-laurent-shirt.jpg`, url: 'https://bit.ly/41KYoj7' },
    { brand: 'The Ikarian', name: 'Body Oil — Clary Sage, Oakmoss & Cassis', price: '$69', image: `${WINTER_EDIT}/ikarian-body-oil.png`, url: 'https://bit.ly/4cVZe2J' },
    { brand: 'Christophe Robin', name: 'Fortifying Scalp Serum', image: `${WINTER_EDIT}/screenshot-2026-04-19-060612.png`, handle: 'christophe-robin-fortifying-scalp-serum-with-amaranth-peptides-50ml' },
    { brand: 'Maison Balzac', name: "J'ai Soif Carafe & Glass in Green", image: `${WINTER_EDIT}/screenshot-2026-04-19-060612.png`, handle: 'jai-soif-carafe-glass-green' },
  ],
  'michelle-bridges': [
    { brand: 'JS Health', name: 'Vanilla Protein + Probiotics', price: '$49.99', image: `${WINTER_EDIT}/screenshot-2026-04-19-042943.png`, handle: 'protein-probiotics-vanilla-bean' },
    { brand: 'Goldfield & Banks', name: 'Silky Woods EDP', price: '$368', image: `${WINTER_EDIT}/screenshot-2026-04-19-044410.png`, url: 'https://t.cfjump.com/68150/t/90704?Url=https%3a%2f%2fwww.goldfieldandbanks.com%2fproducts%2fsilky-woods' },
    { brand: 'The Upside', name: "Levi's x The Upside Reversible Quilted Jacket", price: '$249.99', image: `${WINTER_EDIT}/screenshot-2026-04-19-045016.png`, url: 'https://bit.ly/4mqnhKv' },
    { brand: 'Amazon', name: 'Rubber Hex Dumbbell Set', image: `${WINTER_EDIT}/screenshot-2026-04-19-042336.png`, url: 'https://amzn.to/425CxTn' },
    { brand: 'Whoop', name: 'Whoop 5.0 + SuperKnit Luxe Band', image: `${WINTER_EDIT}/screenshot-2026-04-19-044043.png`, url: 'https://amzn.to/3OvPnaw' },
  ],
  'jacqueline-alwill': [
    { brand: 'Vrg Girl', name: 'Lennon Bomber Jacket', price: '$259', image: `${WINTER_EDIT}/screenshot-2026-04-19-052057.png`, url: 'https://bit.ly/4vucoes' },
    { brand: 'Adidas', name: 'Originals Firebird Track Pants', price: '$120', image: `${WINTER_EDIT}/screenshot-2026-04-19-052800.png`, url: 'https://bit.ly/4cu50r7' },
    { brand: 'Nook', name: 'Core 1 Person Sauna', price: '$2,499', image: `${WINTER_EDIT}/screenshot-2026-04-19-053010.png`, url: 'https://nooksaunas.com.au/BEAUTICATE' },
    { brand: 'Basics by b', name: 'Liquid Glow Drops in Tulum', price: '$40', image: `${WINTER_EDIT}/screenshot-2026-04-19-053434.png`, handle: 'liquid-glow-drops' },
    { brand: 'The Beauty Chef', name: 'Collagen Boost', price: '$49', image: `${WINTER_EDIT}/screenshot-2026-04-19-053907.png`, url: 'https://bit.ly/4805T9m' },
  ],
  'camilla-thompson': [
    { brand: 'Assembly Label', name: 'Laurie Cashmere Knit in Merlot', price: '$300', image: `${WINTER_EDIT}/screenshot-2026-04-18-233852.png`, url: 'https://int.assemblylabel.com/products/laurie-cashmere-knit-merlot' },
    { brand: 'Cultiver', name: 'Linen Duvet Cover Natural', price: '$380', image: `${WINTER_EDIT}/screenshot-2026-04-18-234318.png`, url: 'https://cultiver.com/products/linen-duvet-cover-set-natural' },
    { brand: 'Bon Charge', name: 'Red Light Therapy Device', price: '$799', image: `${WINTER_EDIT}/bon-charge-demi-red-light-therapy-device.jpg`, url: 'https://boncharge.com/products/max-red-light-device' },
    { brand: 'Subtle Energies', name: 'Aura Protection Mist', price: '$45', image: `${WINTER_EDIT}/screenshot-2026-04-19-032748.png`, url: 'https://www.subtleenergies.com.au/products/aura-protection-body-mist?variant=31806653530159' },
    { brand: 'Eir', name: 'Women Fuel Creatine', price: '$39', image: `${WINTER_EDIT}/screenshot-2026-04-19-034205.png`, handle: 'fuel-100-pure-creatine-monohydrate' },
    { brand: 'Nook', name: 'Core 1 Person Infrared Sauna', price: '$2,499', image: `${BIOHACKING}/3.png`, url: 'https://nooksaunas.com.au/BEAUTICATE' },
    { brand: 'Ultrahuman', name: 'Ring AIR', price: '$599', image: `${BIOHACKING}/2.png`, url: 'https://ultrahumanhealthcare.pxf.io/o4A6Ao' },
  ],
  'dr-amy-chahal': [
    { brand: 'Sézane', name: 'Gaspard Cardigan', price: '$230', image: `${WINTER_EDIT}/tbptfdhaymeusm5uj8r4wk-768-80.jpg`, url: 'https://www.sezane.com/en-en/product/gaspard-cardigan/ecru#size-XXS' },
    { brand: 'Rationale', name: 'No.3 Tinted Serum SPF50', price: '$204', image: `${WINTER_EDIT}/screenshot-2026-04-19-035954.png`, url: 'https://bit.ly/4t8BeiF' },
    { brand: 'Alohas', name: 'Suede Sneakers', price: '$349', image: `${WINTER_EDIT}/screenshot-2026-04-19-040336.png`, url: 'https://bit.ly/4mrSGMu' },
    { brand: 'Lumira', name: 'Cuban Tobacco Parfum', price: '$159', image: `${WINTER_EDIT}/screenshot-2026-04-19-041105.png`, handle: 'cuban-tobacco-eau-de-parfum' },
    { brand: 'Maison Balzac', name: 'Bordeaux Wine Glasses', price: '$199', image: `${WINTER_EDIT}/screenshot-2026-04-19-041714.png`, handle: '2-bordeaux-wine-glasses-clear-amber' },
  ],
  'dr-leanne-girgis': [
    { brand: 'Victoria Beckham', name: 'Bitten Lip Tint', price: '$58', image: `${WINTER_EDIT}/vb-bitten-lip-tint.webp`, url: 'https://victoriabeckhambeauty.com/products/bitten-lip-tint' },
    { brand: 'Scanlan Theodore', name: 'Crepe Knit Barrel Trouser', price: '$750', image: `${WINTER_EDIT}/scanlan-theodore-barrel-trouser.jpg`, url: 'https://www.scanlantheodore.com/au/products/crepe-knit-barrel-trouser-1' },
    { brand: 'Saint Louve', name: '15% Vitamin C Lustrum Serum', price: '$129.95', image: `${WINTER_EDIT}/saint-louve-vitamin-c.png`, url: 'https://saintlouve.com.au/products/15-vitamin-c-lustrum-serum' },
    { brand: 'Innour', name: 'Natural Marine Collagen', price: '$70', image: `${WINTER_EDIT}/innour-marine-collagen.jpg`, url: 'https://innour.com.au/products/natural-marine-collagen-natural-150g' },
    { brand: 'Tulita', name: 'Agati EDP', price: '$290', image: `${WINTER_EDIT}/tulita-agati.webp`, url: 'https://www.cityperfume.com.au/tulita-agati-edp-50ml' },
  ],
  'kerrie-gentle': [
    { brand: 'Elemis', name: 'Pro Collagen Cleansing Balm', price: '$98', image: `${WINTER_EDIT}/screenshot-2026-04-19-055731.png`, url: 'https://bit.ly/41xMN6N' },
    { brand: 'Basics By B', name: 'Face Palette', price: '$65', image: `${WINTER_EDIT}/screenshot-2026-04-19-055434.png`, handle: 'basics-by-b-face-palette' },
    { brand: 'Cable Melbourne', name: 'Brushed Cashwool V Jumper', price: '$359', image: `${WINTER_EDIT}/screenshot-2026-04-19-060223.png`, url: 'https://www.cablemelbourne.com/products/brushed-cashwool-v-jumper-parchment-caw26119' },
    { brand: 'Maison Balzac', name: 'Le Bois Candle', price: '$85', image: `${WINTER_EDIT}/screenshot-2026-04-19-060612.png`, handle: 'le-bois-mini-scented-candle' },
    { brand: 'Sodashi', name: 'Enzyme Face Polish', price: '$119', image: `${WINTER_EDIT}/screenshot-2026-04-19-061250.png`, url: 'https://sodashi.com.au/products/enzyme-face-polish?variant=50478821769531' },
  ],
  'jayde-balderston': [
    { brand: 'Lumira', name: 'Persian Rose Candle', price: '$85', image: `${WINTER_EDIT}/screenshot-2026-04-18-224327.png`, handle: 'persian-rose-candle' },
    { brand: 'Acne Studios', name: 'Fringed Wool-Blend Scarf', price: '$640', image: `${WINTER_EDIT}/screenshot-2026-04-18-224648.png`, url: 'https://www.net-a-porter.com/en-au/shop/product/acne-studios/accessories/scarves/fringed-checked-wool-blend-scarf/46376663162904423' },
    { brand: 'Nike', name: 'Cortez Leather & Suede Sneakers', price: '$155', image: `${WINTER_EDIT}/screenshot-2026-04-18-225137.png`, url: 'https://www.net-a-porter.com/en-au/shop/product/nike/shoes/low-top/cortez-leather-suede-and-canvas-sneakers/46376663162986382' },
    { brand: 'Chanel', name: 'Rouge Allure Lipstick in Indépendante', price: '$75', image: `${WINTER_EDIT}/screenshot-2026-04-18-230637.png`, url: 'https://www.davidjones.com/product/chanel-rouge-allure-luminous-intense-lip-colour-20699831' },
  ],
  'kristin-rawson': [
    { brand: 'Elka Collective', name: 'Tyler Pant', price: '$229', image: `${WINTER_EDIT}/emily-felled-scarf-coat.png`, url: 'https://bit.ly/3OdDbLu' },
    { brand: 'Henne', name: 'Carr Top', price: '$380', image: `${WINTER_EDIT}/carr_top_cream_1_768x.webp`, url: 'https://bit.ly/3PSdgJX' },
    { brand: 'Eir', name: 'Women Fuel Creatine', price: '$39', image: `${WINTER_EDIT}/screenshot-2026-04-19-034205.png`, handle: 'fuel-100-pure-creatine-monohydrate' },
  ],
}
