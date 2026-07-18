import type { Metadata } from 'next'
import Link from 'next/link'
import ProductTile from '@/components/shared/ProductTile'
import { retailerFromUrl } from '@/lib/retailer'

export const metadata: Metadata = {
  title: 'Top 50 Skincare Products for Every Age | Beauticate',
  description:
    'The formulas I genuinely rate — organised by decade as a helpful starting point. Tested, trusted, and curated by Sigourney Cantelo.',
  openGraph: {
    title: 'Top 50 Skincare Products for Every Age | Beauticate',
    description:
      'A curated edit of the 50 best skincare products for every age — from teens to fifties and beyond.',
    url: 'https://www.beauticate.com/top-50-skincare',
    type: 'website',
  },
}

interface Product {
  number: number
  nickname: string
  image: string
  name: string
  price?: string
  brand: string
  url: string
  description: string
}

interface Decade {
  title: string
  intro: string
  products: Product[]
}

const decades: Decade[] = [
  {
    title: 'Teens & Tweens',
    intro: 'These are the best years of your skin\'s life from a collagen perspective — enjoy them. This is the time to begin good habits: daily cleansing, non-negotiable sunscreen and a few targeted treatments if breakouts show up.',
    products: [
      { number: 1, nickname: 'A Lightweight Moisturiser', image: '/content/beauty-style/skin-care/top-50-skincare-products/Moisturiser.png', name: 'GO-TO Skincare Very Lightweight Moisturiser', price: '$55', brand: 'GO-TO', url: 'https://gotoskincare.com/products/very-lightweight-moisturiser', description: 'This gel cream gives a lovely matte finish and zero residue — an absolute dreamboat of a moisturiser for people who hate wearing moisturiser.' },
      { number: 2, nickname: 'An Affordable Sunscreen', image: '/content/beauty-style/skin-care/top-50-skincare-products/sunscreen.png', name: 'La Roche-Posay Anthelios Invisible Fluid Facial Sunscreen SPF 50+', price: '$38.95', brand: 'La Roche-Posay', url: 'https://adorebeauty.prf.hn/click/camref:1011lfsKr/destination:https%3A%2F%2Fwww.adorebeauty.com.au%2Fp%2Fla-roche-posay%2Fla-roche-posay-anthelios-invisible-fluid-facial-sunscreen-spf-50.html', description: 'This cult sunscreen for all ages is light and easy to wear, which is key when you use it every day. Purse-friendly, too.' },
      { number: 3, nickname: 'A Clarifying Cleanser', image: '/content/beauty-style/skin-care/top-50-skincare-products/CLEANSER.png', name: 'CeraVe Blemish Control Cleanser', price: '$24.99', brand: 'CeraVe', url: 'https://www.adorebeauty.com.au/p/cerave/cerave-blemish-control-cleanser-473ml.html?clickref=1101lBMcWx2A&utm_source=partnerize&utm_medium=affiliate&utm_content=affiliate&utm_campaign=beauticate', description: 'This spot-seeking oil-buster contains ceramides, niacinamide, salicylic acid and purifying clay to help deeply clean and minimise future breakouts.' },
      { number: 4, nickname: 'Blemish Patches', image: '/content/beauty-style/skin-care/top-50-skincare-products/BLEMISH.png', name: 'The Breakout Hack Patch It Up – Everyday Pimple Patches', price: '$19.95', brand: 'The Breakout Hack', url: 'https://adorebeauty.prf.hn/click/camref:1011lfsKr/destination:https%3A%2F%2Fwww.adorebeauty.com.au%2Fp%2Fthe-breakout-hack%2Ftbh-skincare-patch-it-up-everyday-pimple-patches.html', description: 'A game-changer for breakouts. These contain Ascorbic Acid, Salicylic Acid, Tea Tree Oil and Niacinamide to nix breakouts fast.' },
      { number: 5, nickname: 'A Skin-Sloughing Exfoliant', image: '/content/beauty-style/skin-care/top-50-skincare-products/EXFOLIANT.png', name: 'Paula\'s Choice 2% BHA Liquid Exfoliant', price: '$54', brand: 'Paula\'s Choice', url: 'https://adorebeauty.prf.hn/l/550gaoZ/', description: 'Swipe on this award-winning lotion any time your skin is feeling too oily or clogged up to prevent breakouts and brighten.' },
      { number: 6, nickname: 'A Glow Serum', image: '/content/beauty-style/skin-care/top-50-skincare-products/serum.png', name: 'Glow Recipe Watermelon Glow Niacinamide Dew Drops', price: '$35', brand: 'Glow Recipe', url: 'https://go.skimresources.com/?id=265664X1750758&xs=1&url=https%3A%2F%2Fwww.sephora.com.au%2Fproducts%2Fglow-recipe-watermelon-glow-niacinamide-dew-drops', description: 'Who doesn\'t want luminosity? This skincare-makeup hybrid delivers in spades and is a firm favourite among anyone chasing that lit-from-within finish.' },
      { number: 7, nickname: 'A Drying Lotion', image: '/content/beauty-style/skin-care/top-50-skincare-products/drying-lotion.png', name: 'Mario Badescu Drying Lotion', price: '$31', brand: 'Mario Badescu', url: 'https://adorebeauty.prf.hn/click/camref:1011lfsKr/destination:https%3A%2F%2Fwww.adorebeauty.com.au%2Fp%2Fmario-badescu%2Fmario-badescu-drying-lotion.html', description: 'I can\'t count the number of times this little pink lotion has saved my bacon. Often it dries pimples out overnight.' },
      { number: 8, nickname: 'A Clay Mask', image: '/content/beauty-style/skin-care/top-50-skincare-products/clay-mask.png', name: 'Kiehl\'s Rare Earth Deep Pore Cleansing Clay Mask', price: '$73', brand: 'Kiehl\'s', url: 'https://adorebeauty.prf.hn/click/camref:1011lfsKr/destination:https%3A%2F%2Fwww.adorebeauty.com.au%2Fp%2Fkiehls%2Fkiehls-rare-earth-deep-pore-cleansing-masque.html', description: 'For those days when a breakout is imminent, apply this detoxifying mask to problem areas to draw out oil and bacteria.' },
      { number: 9, nickname: 'A Non-Oily Oil', image: '/content/beauty-style/skin-care/top-50-skincare-products/face-hero.png', name: 'Go-To Skincare Face Hero', price: '$45', brand: 'Go-To', url: 'https://adorebeauty.prf.hn/click/camref:1011lfsKr/destination:https%3A%2F%2Fwww.adorebeauty.com.au%2Fp%2Fgo-to-skincare%2Fgo-to-face-hero.html', description: 'This somehow balances oily skin, quenches dry skin, and doubles as a beautiful primer for makeup. Go-To\'s products are en pointe.' },
      { number: 10, nickname: 'A Cleansing Tool', image: '/content/beauty-style/skin-care/top-50-skincare-products/foreo.png', name: 'Foreo Luna 3 for Combination Skin', price: '$302.29', brand: 'Foreo', url: 'https://adorebeauty.prf.hn/click/camref:1011lfsKr/destination:https%3A%2F%2Fwww.adorebeauty.com.au%2Fp%2Fforeo%2Fforeo-luna-3-for-combination-skin.html', description: 'Tools take your cleansing to the next level and will help minimise blackheads and breakouts.' },
    ],
  },
  {
    title: 'Twenties',
    intro: 'Your twenties are about learning what your skin loves and protecting it before you ever think you need to. Daily sunscreen (yes, I know I harp on), thorough cleansing and antioxidants to protect and prevent premature ageing.',
    products: [
      { number: 11, nickname: 'The \'Clean\' Sunscreen', image: '/content/beauty-style/skin-care/top-50-skincare-products/THE-\'CLEAN-SUNSCREEN.png', name: 'Ultra Violette Clean Screen', price: '$49', brand: 'Ultra Violette', url: 'https://adorebeauty.prf.hn/click/camref:1011lfsKr/destination:https%3A%2F%2Fwww.adorebeauty.com.au%2Fp%2Fultra-violette%2Fultra-violette-clean-screen-spf-30-mattifying-sunscreen.html', description: 'Some people worry about chemicals in their sunscreen. This one is delightfully low-tox and still nice to wear.' },
      { number: 12, nickname: 'The Lazy-Girl\'s Cleanser', image: '/content/beauty-style/skin-care/top-50-skincare-products/THE-LAZY-GIRLS-CLEANSER.png', name: 'Bioderma Sensibio H2O Micellar Water Makeup Remover', price: '$22.99', brand: 'Bioderma', url: 'https://adorebeauty.prf.hn/click/camref:1011lfsKr/destination:https%3A%2F%2Fwww.adorebeauty.com.au%2Fp%2Fbioderma%2Fsensibio-h2o-micellar-cleanser-250ml.html', description: 'For those nights when you can barely be bothered to remove your makeup, keep this bottle and some reusable pads stashed on your night stand.' },
      { number: 13, nickname: 'The Sun Protecting CC Cream', image: '/content/beauty-style/skin-care/top-50-skincare-products/THE-SUN-PROTECTING-CC-CREAMS.png', name: 'It Cosmetics Your Skin But Better CC+ Cream', price: '$82', brand: 'It Cosmetics', url: 'https://adorebeauty.prf.hn/click/camref:1011lfsKr/destination:https%3A%2F%2Fwww.adorebeauty.com.au%2Fp%2Fit-cosmetics%2Fit-cosmetics-your-skin-but-better-cc-cream-spf50.html', description: 'Another cult product that delivers a flawless complexion with SPF 50+ and skincare properties.' },
      { number: 14, nickname: 'The Cult Vitamin C', image: '/content/beauty-style/skin-care/top-50-skincare-products/THE-CULT-VITAMIN-C.png', name: 'SkinCeuticals CE Ferulic Serum', price: '$249', brand: 'SkinCeuticals', url: 'https://adorebeauty.prf.hn/click/camref:1011lfsKr/destination:https%3A%2F%2Fwww.adorebeauty.com.au%2Fp%2Fskinceuticals%2Fskinceuticals-c-e-ferulic-serum.html', description: 'I still use this daily and I notice when I don\'t. It truly does deliver bright, glowing skin in a bottle. You should use this at every age.' },
      { number: 15, nickname: 'The Do-Everything Cream', image: '/content/beauty-style/skin-care/top-50-skincare-products/Embryolisse.png', name: 'Embryolisse Lait-Crème Concentré', price: '$48', brand: 'Embryolisse', url: 'https://adorebeauty.prf.hn/click/camref:1011lfsKr/destination:https%3A%2F%2Fwww.adorebeauty.com.au%2Fp%2Fembryolisse%2Fembryolisse-lait-creme-concentrate-moisturiser.html', description: 'The ultimate makeup artist\'s moisturiser — it primes perfectly for foundation and can also be used as a masque or cleanser.' },
      { number: 16, nickname: 'Cleansing Pads', image: '/content/beauty-style/skin-care/top-50-skincare-products/CLEANSING-PAD.png', name: 'The Inkey List Double Sided Cleansing Pads', price: '$20', brand: 'The Inkey List', url: 'https://go.skimresources.com/?id=265664X1750758&xs=1&url=https%3A%2F%2Fwww.sephora.com.au%2Fproducts%2Fthe-inkey-list-reusable-double-sided-cleansing-pads%2Fv%2Fdefault', description: 'If you wear a lot of makeup these are a genius and sustainable way to remove it, along with sunscreen.' },
      { number: 17, nickname: 'The Date Night Mask', image: '/content/beauty-style/skin-care/top-50-skincare-products/THE-DATE-NIGHT-MASK.png', name: 'Kora Organics Turmeric Brightening & Exfoliating Mask', price: '$29', brand: 'Kora Organics', url: 'https://adorebeauty.prf.hn/click/camref:1011lfsKr/destination:https%3A%2F%2Fwww.adorebeauty.com.au%2Fp%2Fkora-organics%2Fkora-organics-turmeric-brightening-exfoliating-mask-2-in-1.html', description: 'This deliciously peppermint-scented yellow concoction uses rosehip seeds, turmeric and papaya enzymes to brighten and energize dull or sleepy skin.' },
      { number: 18, nickname: 'The Dolphin Skin Hyaluronic', image: '/content/beauty-style/skin-care/top-50-skincare-products/THE-DOLPHIN-SKIN-HYALURONIC.png', name: 'PCA Skin Hyaluronic Acid Boosting Serum', price: '$240', brand: 'PCA Skin', url: 'https://adorebeauty.prf.hn/click/camref:1011lfsKr/destination:https%3A%2F%2Fwww.adorebeauty.com.au%2Fp%2Fpca-skin%2Fpca-skin-hyaluronic-acid-boosting-serum-28g.html', description: 'This clinical strength elixir works on surface hydration while also quenching more deeply with varying sized hyaluronic acid spheres, niacinamide and ceramides leaving your skin porpoise-plumped.' },
      { number: 19, nickname: 'The Do-Everything Balm', image: '/content/beauty-style/skin-care/top-50-skincare-products/THE-DOEVERYTHING-BALM.png', name: 'Lanolips 101 Ointment Multipurpose Superbalm', price: '$18.95', brand: 'Lanolips', url: 'https://adorebeauty.prf.hn/click/camref:1011lfsKr/destination:https%3A%2F%2Fwww.adorebeauty.com.au%2Fp%2Flanolips%2Flanolips-101-ointment.html', description: 'Almost every handbag of mine contains a tube of this superstar. Soothe parched pouts, hydrate cuticles, heal abrasions, tame brows and flyaways and soothe rashes with this pure lanolin balm.' },
      { number: 20, nickname: 'The Brightening Eye Cream', image: '/content/beauty-style/skin-care/top-50-skincare-products/THE-BRIGHTENING-EYE-CREAM.png', name: 'Ole Henriksen Banana Bright+ Eye Crème', price: '$64', brand: 'Ole Henriksen', url: 'https://go.skimresources.com/?id=265664X1750758&xs=1&url=https%3A%2F%2Fwww.sephora.com.au%2Fproducts%2Fole-henriksen-banana-bright-eye-creme', description: 'Another skincare/makeup hybrid, this yellow-tinted creamy concoction instantly sparks up tired, dehydrated eyes and helps disguise dark circles.' },
    ],
  },
  {
    title: 'Thirties',
    intro: 'This is the decade to start addressing the first signs of ageing while maintaining everything you\'ve built. Introduce targeted products — retinols, preventative LED — and double down on hydration and sun protection.',
    products: [
      { number: 21, nickname: 'The Express LED Mask', image: '/content/beauty-style/skin-care/top-50-skincare-products/THE-EXPRESS-LED-MASK.png', name: 'Qure Rejuvalite LED Mask', price: '$499', brand: 'Qure', url: 'https://adorebeauty.prf.hn/click/camref:1011lfsKr/destination:https%3A%2F%2Fwww.adorebeauty.com.au%2Fp%2Fqure%2Fqure-rejuvalite-led-mask.html', description: 'This mask is customisable so you can use different light wavelengths for different areas of the face — I zone blue light for my hormonal chin breakouts and red anti-aging for the rest of the face. Plus it\'s only 3 minutes a day.' },
      { number: 22, nickname: 'Ease Into Retinal', image: '/content/beauty-style/skin-care/top-50-skincare-products/EASE-INTO-RETINAL.png', name: 'Medik8 Crystal Retinal 6', price: '$135', brand: 'Medik8', url: 'https://adorebeauty.prf.hn/click/camref:1011lfsKr/destination:https%3A%2F%2Fwww.adorebeauty.com.au%2Fp%2Fmedik8%2Fmedik8-crystal-retinal-6.html', description: 'The Crystal retinal (a form of vitamin A) line is perfect for first-time users of retinal and this is the middle step for non-sensitive skins. It resurfaces, fades acne scars and fine lines.' },
      { number: 23, nickname: 'A Clever Cleansing Oil', image: '/content/beauty-style/skin-care/top-50-skincare-products/A-CLEVER-CLEANSING-OIL.png', name: 'Kiehl\'s Midnight Recovery Botanical Cleansing Oil', price: '$76', brand: 'Kiehl\'s', url: 'https://adorebeauty.prf.hn/click/camref:1011lfsKr/destination:https%3A%2F%2Fwww.adorebeauty.com.au%2Fp%2Fkiehls%2Fkiehls-midnight-recovery-botanical-cleansing-oil-175ml.html', description: 'This decadent oil melts makeup and strips away sunscreen residue, transforming into a silky milk on rinsing and taking everything with it. Cue clean skin.' },
      { number: 24, nickname: 'The DIY Daily Peel', image: '/content/beauty-style/skin-care/top-50-skincare-products/THE-DIY-DAILY-PEEL.png', name: 'Dr Dennis Gross Alpha Beta Universal Daily Peel', price: '$36 – $264', brand: 'Dr Dennis Gross', url: 'https://go.skimresources.com/?id=265664X1750758&xs=1&url=https%3A%2F%2Fwww.sephora.com.au%2Fproducts%2Fdr-dennis-gross-alpha-beta-universal-daily-peel', description: 'Single-use pads — step 1 has five AHA/BHAs to boost radiance, target pores and diminish fine lines while step 2 neutralises and hydrates.' },
      { number: 25, nickname: 'A Very Wearable Sunscreen', image: '/content/beauty-style/skin-care/top-50-skincare-products/A-VERY-WEARABLE-SUNSCREEN.png', name: 'SkinCeuticals Ultra Defense Facial Sunscreen SPF 50', price: '$69', brand: 'SkinCeuticals', url: 'https://adorebeauty.prf.hn/click/camref:1011lfsKr/destination:https%3A%2F%2Fwww.adorebeauty.com.au%2Fp%2Fskinceuticals%2Fskinceuticals-ultra-facial-defense-spf50-50ml.html', description: 'This is one of the most comfortable sunscreens you\'ll find — light, fragrance-free and beautiful under makeup.' },
      { number: 26, nickname: 'The Hydrating Microneedling Device', image: '/content/beauty-style/skin-care/top-50-skincare-products/THE-HYDRATING-MICRONEEDLING-DEVICE.png', name: 'Qure Micro-Infusion System with Hydra Soothing Serum', brand: 'Qure', url: 'https://adorebeauty.prf.hn/click/camref:1011lfsKr/destination:https%3A%2F%2Fwww.adorebeauty.com.au%2Fp%2Fqure%2Fqure-micro-infusion-system.html', description: 'This at-home needling device was a total game-changer for my skin. You stamp the serum into skin to deliver it to the lower layers.' },
      { number: 27, nickname: 'The Brightening Elixir', image: '/content/beauty-style/skin-care/top-50-skincare-products/THE-BRIGHTENING-ELIXIR.png', name: 'SK-II Facial Treatment Essence', price: '$139', brand: 'SK-II', url: 'https://adorebeauty.prf.hn/click/camref:1011lfsKr/destination:https%3A%2F%2Fwww.adorebeauty.com.au%2Fp%2Fsk-ii%2Fsk-ii-facial-treatment-essence-75ml.html', description: 'A cult product for good reason, this water contains over 90% of the brand\'s famous Pitera — a natural bio-ingredient containing over 50 micro-nutrients to brighten, smooth and hydrate.' },
      { number: 28, nickname: 'The Barrier Repairer', image: '/content/beauty-style/skin-care/top-50-skincare-products/THE-BARRIER-REPAIRER.png', name: 'Avène Cicalfate+ Restorative Protective Cream', price: '$39.99', brand: 'Avène', url: 'https://adorebeauty.prf.hn/click/camref:1011lfsKr/destination:https%3A%2F%2Fwww.adorebeauty.com.au%2Fp%2Favene%2Favene-cicalfate-restorative-skin-cream-100ml.html', description: 'A godsend for when the skin\'s natural moisture barrier is impaired — this soothing, nourishing cream contains the brand\'s signature thermal water that leaves a protective film to preserve moisture.' },
      { number: 29, nickname: 'The Neck and Déc LED', image: '/content/beauty-style/skin-care/top-50-skincare-products/THE-NECK-AND-DEC-LED-1.png', name: 'Qure Neck & Décolletage LED Light Therapy Device', price: '$499', brand: 'Qure', url: 'https://adorebeauty.prf.hn/click/camref:1011lfsKr/destination:https%3A%2F%2Fwww.adorebeauty.com.au%2Fp%2Fqure%2Fqure-neck-decolletage-led.html', description: 'Once you\'re into a routine with your face LED, add a neck and déc to your treatment plan. Now is the time to start to prevent aging in this area.' },
      { number: 30, nickname: 'A Top Rated Niacinamide', image: '/content/beauty-style/skin-care/top-50-skincare-products/NIACINAMIDE.png', name: 'SKIN1004 Niacinamide 10% Boosting Shot Ampoule', price: '$17.95', brand: 'SKIN1004', url: 'https://adorebeauty.prf.hn/click/camref:1011lfsKr/destination:https%3A%2F%2Fwww.adorebeauty.com.au%2Fp%2Fskin1004%2Fskin1004-niacinamide-10-boosting-shot-ampoule.html', description: 'If niacinamide isn\'t already in your routine, consider this your sign. This Korean-made ampoule delivers a skin-smoothing 10% niacinamide hit to help minimise pores and diffuse redness.' },
    ],
  },
  {
    title: 'Forties',
    intro: 'Collagen production slows, pigmentation and fine lines become more visible — but the right products make a real difference. This is where high-tech treatments, peptides and targeted serums earn their keep.',
    products: [
      { number: 31, nickname: 'The Hydrating Cleanser', image: '/content/beauty-style/skin-care/top-50-skincare-products/THE-HYDRATING-CLEANSER.png', name: 'CeraVe Hydrating Cream-to-Foam Cleanser', price: '$24.99', brand: 'CeraVe', url: 'https://go.skimresources.com/?id=265664X1750758&xs=1&url=https%3A%2F%2Fwww.adorebeauty.com.au%2Fp%2Fcerave%2Fcerave-hydrating-cream-to-foam-cleanser-236ml.html', description: 'This cleanser is gloriously quenching yet satisfyingly effective at whisking away dirt, makeup and sunscreen. And it\'s beautifully priced, too.' },
      { number: 32, nickname: 'The Pigment Preventing SPF', image: '/content/beauty-style/skin-care/top-50-skincare-products/THE-PIGMENT-PREVENTING-SPF.png', name: 'Mesoestetic Mesoprotech Melan 130 Pigment Control', price: '$76.50', brand: 'Mesoestetic', url: 'https://adorebeauty.prf.hn/click/camref:1011lfsKr/destination:https%3A%2F%2Fwww.adorebeauty.com.au%2Fp%2Fmesoestetic%2Fmesoestetic-mesoprotech-melan-130-pigment-control-50ml.html', description: 'So many derms and doctors I\'ve interviewed have recommended this as a sunscreen that not only protects but helps prevent new pigment forming. Great for melasma.' },
      { number: 33, nickname: 'The Glycolic Exfoliant', image: '/content/beauty-style/skin-care/top-50-skincare-products/THE-GLYCOLIC-EXFOLIANT.png', name: 'Alpha-H Liquid Gold', price: '$76.95', brand: 'Alpha-H', url: 'https://adorebeauty.prf.hn/click/camref:1011lfsKr/destination:https%3A%2F%2Fwww.adorebeauty.com.au%2Fp%2Falpha-h%2Falpha-h-liquid-gold.html', description: 'Swipe off the dead skin cells that lead to breakouts and dullness and wipe on radiance with this potent exfoliating lotion.' },
      { number: 34, nickname: 'The Pigment Knockout', image: '/content/beauty-style/skin-care/top-50-skincare-products/THE-PIGMENT-KNOCKOUT.png', name: 'Aspect Pigment Punch', price: '$155', brand: 'Aspect', url: 'https://adorebeauty.prf.hn/click/camref:1011lfsKr/destination:https%3A%2F%2Fwww.adorebeauty.com.au%2Fp%2Faspect%2Faspect-pigment-punch-30ml.html', description: 'This powerful serum contains L-Ascorbic Acid, a derivative of hydroquinone, Niacinamide and Lactic acid to seek and destroy pesky pigment and dark spots.' },
      { number: 35, nickname: 'The Serious Night Cream', image: '/content/beauty-style/skin-care/top-50-skincare-products/THE-SERIOUS-NIGHT-CREAM.png', name: 'Rationale #6 The Night Cream', price: '$110', brand: 'Rationale', url: 'https://rationale.com/collections/fine-lines-wrinkles/products/6-the-night-creme', description: 'If you\'re looking for a full suite of products from one brand, I\'m a huge fan of the whole Rationale Essential Six. This night cream features their exclusive complex of Vitamin A.' },
      { number: 36, nickname: 'The Dermastamping Serum', image: '/content/beauty-style/skin-care/top-50-skincare-products/THE-DERMASTAMPING-SERUM.png', name: 'Qure EGF Serum', brand: 'Qure', url: 'https://adorebeauty.prf.hn/click/camref:1011lfsKr/destination:https%3A%2F%2Fwww.adorebeauty.com.au%2Fp%2Fqure%2Fqure-egf-serum.html', description: 'Step up your at-home microneedling game with this Epidermal Growth Factor Serum. I do this before any big event and at least once a month.' },
      { number: 37, nickname: 'The Big Guns LED Mask', image: '/content/beauty-style/skin-care/top-50-skincare-products/THE-BIG-GUNS-LED-MASK.png', name: 'San Lueur Advanced LED Light Therapy Mask', price: '$795', brand: 'San Lueur', url: 'https://adorebeauty.prf.hn/click/camref:1011lfsKr/destination:https%3A%2F%2Fwww.adorebeauty.com.au%2Fp%2Fsan-lueur%2Fsan-lueur-advanced-led-light-therapy-mask.html', description: 'The gold standard of masks with more lights and strength than most on the market, plus red for rejuvenation and blue light for breakouts.' },
      { number: 38, nickname: 'Dry Skin Saviour', image: '/content/beauty-style/skin-care/top-50-skincare-products/DRY-SKIN-SAVIOUR.png', name: 'Weleda Skin Food', price: '$29.95', brand: 'Weleda', url: 'https://adorebeauty.prf.hn/click/camref:1011lfsKr/destination:https%3A%2F%2Fwww.adorebeauty.com.au%2Fp%2Fweleda%2Fweleda-skin-food.html', description: 'One for moisture-sapping climates or dry skin moments — this gloriously scented balm is 100% certified natural with Sunflower Seed Oil and Lanolin.' },
      { number: 39, nickname: 'The Collagen Conserver', image: '/content/beauty-style/skin-care/top-50-skincare-products/THE-COLLAGEN-CONSERVER.png', name: 'Dermalogica Pro-Collagen Banking Serum', price: '$152', brand: 'Dermalogica', url: 'https://adorebeauty.prf.hn/click/camref:1011lfsKr/destination:https%3A%2F%2Fwww.adorebeauty.com.au%2Fp%2Fdermalogica%2Fdermalogica-pro-collagen-banking-serum.html', description: 'Futureproof your skin with a protective blend of Collagen Amino Acids, Carnosine Dipeptide, and Antioxidants.' },
      { number: 40, nickname: 'The Nightly Elixir', image: '/content/beauty-style/skin-care/top-50-skincare-products/THE-NIGHTLY-ELIXIR.png', name: 'Estée Lauder Advanced Night Repair', price: '$139', brand: 'Estée Lauder', url: 'https://go.skimresources.com/?id=265664X1750758&xs=1&url=https%3A%2F%2Fwww.adorebeauty.com.au%2Fp%2Festee-lauder%2Festee-lauder-advanced-night-repair-synchronized-multi-recovery-complex-30ml.html', description: 'This iconic serum targets fine lines, wrinkles, dullness and uneven tone in one pump. A nightstand staple for good reason.' },
    ],
  },
  {
    title: 'Fifties & Beyond',
    intro: 'Skincare meets self-care. Rich moisturisers, luxe oils and targeted treatments do the heavy lifting — slower, richer and entirely on your own terms.',
    products: [
      { number: 41, nickname: 'The Cult Cream', image: '/content/beauty-style/skin-care/top-50-skincare-products/THE-CULT-CREAM.png', name: 'Augustinus Bader The Rich Cream', price: '$153 – $859', brand: 'Augustinus Bader', url: 'https://go.skimresources.com/?id=265664X1750758&xs=1&url=https%3A%2F%2Fwww.mecca.com%2Fen-au%2Faugustinus-bader%2Fthe-rich-cream-V-060052%2F', description: 'Find out what all the fuss is about. This supremely luxurious hydrator employs Argan, Avocado and Evening Primrose Oils rich in omega-6 fatty acids.' },
      { number: 42, nickname: 'A Hydrating SPF', image: '/content/beauty-style/skin-care/top-50-skincare-products/A-HYDRATING-SPF.png', name: 'Ultra Violette Supreme Screen Hydrating Facial Sunscreen', price: '$52', brand: 'Ultra Violette', url: 'https://adorebeauty.prf.hn/click/camref:1011lfsKr/destination:https%3A%2F%2Fwww.adorebeauty.com.au%2Fp%2Fultra-violette%2Fultra-violette-supreme-screen-spf-50-hydrating-facial-sunscreen-75ml.html', description: 'A skin-quenching SPF with glycerin and vitamin C-pumped kakadu plum. It\'s a joy to wear, which means you WILL wear it.' },
      { number: 43, nickname: 'The Ritualistic Cream Cleanser', image: '/content/beauty-style/skin-care/top-50-skincare-products/THE-RITUALISTIC-CREAM-CLEANSER.png', name: 'Eve Lom Cleanser', price: '$46 – $224', brand: 'Eve Lom', url: 'https://go.skimresources.com/?id=265664X1750758&xs=1&url=https%3A%2F%2Fwww.mecca.com%2Fen-au%2Feve-lom%2Fcleanser-V-007964%2F', description: 'A new age take on the old-school cold cream cleanser, use this gorgeously sensual balm with a warm muslin and inhale clove, eucalyptus and camomile oils.' },
      { number: 44, nickname: 'The Classic All-Rounder Balm', image: '/content/beauty-style/skin-care/top-50-skincare-products/THE-CLASSIC-ALLROUNDER-BALM.png', name: 'Elizabeth Arden Eight Hour Cream', price: '$37', brand: 'Elizabeth Arden', url: 'https://adorebeauty.prf.hn/click/camref:1011lfsKr/destination:https%3A%2F%2Fwww.adorebeauty.com.au%2Fp%2Felizabeth-arden%2Felizabeth-arden-original-eight-hour-cream-skin-protectant.html', description: 'From soothing sore lips to hydrating chapped hands and feet, Eight Hour Cream is the cure for all manner of beauty sins.' },
      { number: 45, nickname: 'The Melanin Regulating Toner', image: '/content/beauty-style/skin-care/top-50-skincare-products/THE-MELANIN-REGULATING-TONER.png', name: 'Biologique Recherche Lotion P50', price: '$260', brand: 'Biologique Recherche', url: 'https://mybr-australia.com/products/lotion-p50', description: 'Do believe the hype. Known as a \'facial in a bottle\', this blend of glycolic and lactic acid brings about gentle exfoliation which gently lightens dark spots.' },
      { number: 46, nickname: 'The Spa-Scented Mist', image: '/content/beauty-style/skin-care/top-50-skincare-products/THE-SPA-SCENTED-MIST.png', name: 'Caudalie Beauty Elixir', price: '$93', brand: 'Caudalie', url: 'https://go.skimresources.com/?id=265664X1750758&xs=1&url=https%3A%2F%2Fwww.sephora.com.au%2Fproducts%2Fcaudalie-beauty-elixir%2Fv%2F100ml', description: 'This all-natural, sublimely fragranced mist is adored by those-in-the-know worldwide for its tightening yet hydrating properties. Perfect for setting makeup.' },
      { number: 47, nickname: 'The Repair-All Cream', image: '/content/beauty-style/skin-care/top-50-skincare-products/THE-REPAIRALL-CREAM.png', name: 'La Roche-Posay Cicaplast Baume B5+', price: '$42.95', brand: 'La Roche-Posay', url: 'https://adorebeauty.prf.hn/click/camref:1011lfsKr/destination:https%3A%2F%2Fwww.adorebeauty.com.au%2Fp%2Fla-roche-posay%2Fla-roche-posay-cicaplast-baume-b5.html', description: 'For any age or skin type that is sensitised, sensitive or damaged, this balm is loaded with hydrating and repairing ingredients to soothe troubled skin.' },
      { number: 48, nickname: 'The Triple Strength Hydrator', image: '/content/beauty-style/skin-care/top-50-skincare-products/THE-TRIPLE-STRENGTH-HYDRATOR-1.png', name: 'SkinCeuticals Triple Lipid Restore 2:4:2', price: '$215', brand: 'SkinCeuticals', url: 'https://adorebeauty.prf.hn/click/camref:1011lfsKr/destination:https%3A%2F%2Fwww.adorebeauty.com.au%2Fp%2Fskinceuticals%2Fskinceuticals-triple-lipid-restore-2-4-2.html', description: 'Another superior moisturiser that has a loyal following — it slips onto the skin like a balm and melts in like a dream.' },
      { number: 49, nickname: 'The Luxe Lifting Serum', image: '/content/beauty-style/skin-care/top-50-skincare-products/THE-LUXE-LIFTING-SERUM.png', name: 'La Prairie Skin Caviar Liquid Lift', price: '$1,175', brand: 'La Prairie', url: 'https://go.skimresources.com/?id=265664X1750758&xs=1&url=https%3A%2F%2Fwww.davidjones.com%2Fproduct%2Fla-prairie-skin-caviar-liquid-lift-50ml-27319652', description: 'If you have the budget, La Prairie products are the crème de la crème. Caviar extracts combined with biomolecules, lipids, peptides, amino acids, and minerals into a silky serum that lifts.' },
      { number: 50, nickname: 'The Rolls Royce of Moisturisers', image: '/content/beauty-style/skin-care/top-50-skincare-products/THE-ROLLS-ROYCE-OF-MOISTURISERS.png', name: 'Crème de la Mer', price: '$189 – $955', brand: 'La Mer', url: 'https://go.skimresources.com/?id=265664X1750758&xs=1&url=https%3A%2F%2Fwww.davidjones.com%2Fproduct%2Fla-mer-creme-de-la-mer-60ml', description: 'It\'s still one of the world\'s most luxurious creams with the signature Miracle Broth, to improve skin barrier function and accelerate cell regeneration.' },
    ],
  },
]

function ProductCard({ product }: { product: Product }) {
  const r = retailerFromUrl(product.url)
  return (
    <div className="flex flex-col">
      <Link
        href={product.url}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="block group"
      >
        <div className="relative aspect-[3/4] mb-4 overflow-hidden" style={{ background: '#F5F0E8' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <span
            className="absolute top-3 left-3 font-sans text-[10px] tracking-[0.2em] uppercase font-medium px-2.5 py-1"
            style={{ background: 'rgba(255,255,255,.85)', color: '#1C1A17' }}
          >
            No. {product.number}
          </span>
        </div>
      </Link>
      <p
        className="font-sans text-[10px] tracking-[0.25em] uppercase font-medium mb-1"
        style={{ opacity: 0.45 }}
      >
        {product.brand}
      </p>
      <h3 className="font-serif text-base leading-snug mb-1">
        {product.nickname}
      </h3>
      <p className="font-serif text-sm mb-2" style={{ opacity: 0.5 }}>
        {product.name}
      </p>
      {product.price && (
        <p className="font-sans text-[12px] font-medium mb-3" style={{ opacity: 0.6 }}>
          {product.price}
        </p>
      )}
      <p className="font-serif text-sm leading-relaxed mb-4" style={{ opacity: 0.7 }}>
        {product.description}
      </p>
      <Link
        href={product.url}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="font-sans text-[10px] tracking-[0.2em] uppercase font-medium transition-opacity hover:opacity-60 mt-auto"
        style={{ color: '#1C1A17' }}
      >
        {r ? `shop via ${r} ↗` : 'shop ↗'}
      </Link>
    </div>
  )
}

export default function Top50SkincarePage() {
  return (
    <main className="bg-white text-charcoal">
      {/* ─── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: '#F5F0E8' }}>
        <div className="max-w-5xl mx-auto px-6 py-24 md:py-36 text-center">
          <p
            className="font-sans text-[10px] tracking-[0.35em] uppercase font-medium mb-8"
            style={{ opacity: 0.45 }}
          >
            By Sigourney Cantelo, Founder of Beauticate
          </p>
          <h1 className="font-serif font-normal leading-[0.95] mb-4" style={{ fontSize: 'clamp(40px, 7vw, 80px)' }}>
            Top 50 Skincare Products
          </h1>
          <p className="font-serif font-normal mb-8" style={{ fontSize: 'clamp(20px, 3vw, 36px)', opacity: 0.3 }}>
            for Every Age
          </p>
          <div className="w-16 mx-auto mb-8" style={{ height: '1px', background: 'rgba(28,26,23,.2)' }} />
          <p className="font-serif italic text-lg md:text-xl" style={{ opacity: 0.7, maxWidth: '48ch', margin: '0 auto' }}>
            The formulas I genuinely rate — organised by decade as a helpful starting point, not a set of rules.
          </p>
        </div>
      </section>

      {/* ─── Why I Made The Top 50 ────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 py-16 md:py-24 text-center">
        <h2 className="font-serif text-2xl md:text-3xl font-normal mb-8" style={{ letterSpacing: '-.01em' }}>
          Why I Made The Top 50
        </h2>
        <div className="font-serif text-base md:text-lg leading-relaxed space-y-5" style={{ opacity: 0.75 }}>
          <p>
            After years of testing products, speaking with leading experts and watching trends come and go,
            these are the formulas I genuinely rate — the ones that deliver, earn a place in your routine and
            stand the test of time.
          </p>
          <p>
            I've organised them by decade as a helpful starting point, but most can be used at any age.
            Think of it as an invitation to refine, upgrade and enjoy your skincare routine a little more.
          </p>
        </div>
        <p className="font-serif italic text-base mt-8" style={{ opacity: 0.5 }}>
          — Sigourney x
        </p>
      </section>

      {/* ─── Decade Sections ──────────────────────────────────── */}
      {decades.map((decade, i) => (
        <section key={decade.title}>
          {/* Decade divider */}
          <div
            className="py-16 md:py-20 text-center"
            style={{ background: i % 2 === 0 ? '#F5F0E8' : '#EDE8DF' }}
          >
            <p
              className="font-sans text-[10px] tracking-[0.35em] uppercase font-medium mb-4"
              style={{ opacity: 0.4 }}
            >
              {decade.products[0].number} – {decade.products[decade.products.length - 1].number}
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-normal mb-6">
              {decade.title}
            </h2>
            <p className="font-serif text-base md:text-lg leading-relaxed mx-auto px-6" style={{ opacity: 0.7, maxWidth: '52ch' }}>
              {decade.intro}
            </p>
          </div>

          {/* Product grid */}
          <div className="max-w-6xl mx-auto px-6 py-14 md:py-20">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12 md:gap-x-8 md:gap-y-16">
              {decade.products.map(product => (
                <ProductCard key={product.number} product={product} />
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* ─── Closing ──────────────────────────────────────────── */}
      <section className="py-16 md:py-24 text-center" style={{ background: '#F5F0E8' }}>
        <div className="max-w-3xl mx-auto px-6">
          <div className="font-serif text-base md:text-lg leading-relaxed space-y-5" style={{ opacity: 0.75 }}>
            <p>
              Great skincare isn't about doing more — it's about understanding what works for you
              and returning to it consistently.
            </p>
            <p>
              Use this edit as a reference point: dip in when you're ready to upgrade, reassess,
              or simply remind yourself of the essentials that make the biggest difference.
            </p>
          </div>
          <p className="font-serif italic text-base mt-8" style={{ opacity: 0.5 }}>
            This is a living collection and it will continue to evolve. Thank you for being here.
          </p>
          <p className="font-serif italic text-base mt-2" style={{ opacity: 0.5 }}>
            — Sigourney
          </p>
        </div>
      </section>

      {/* ─── Affiliate disclosure ─────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-6 py-10 text-center">
        <p className="font-sans text-[11px]" style={{ opacity: 0.35 }}>
          This is an affiliate edit — when you shop via these links, you're supporting Beauticate at no extra cost to you.
        </p>
      </div>
    </main>
  )
}
