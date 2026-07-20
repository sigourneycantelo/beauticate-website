import type { Metadata } from 'next'
import Link from 'next/link'
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

const BG = '#FFFFFF'
const BG_ALT = '#F9F6F2'

const decades: Decade[] = [
  {
    title: 'Teens & Tweens',
    intro: 'These are the best years of your skin\'s life from a collagen perspective — enjoy them. This is the time to begin good habits: daily cleansing, non-negotiable sunscreen and a few targeted treatments if breakouts show up.',
    products: [
      { number: 1, nickname: 'A Lightweight Moisturiser', image: '/content/beauty-style/skin-care/top-50-skincare-products/Moisturiser.png', name: 'GO-TO Skincare Very Lightweight Moisturiser', price: '$55', brand: 'GO-TO', url: 'https://gotoskincare.com/products/very-lightweight-moisturiser', description: 'This gel cream gives a lovely matte finish and zero residue — an absolute dreamboat of a moisturiser for people who hate wearing moisturiser.' },
      { number: 2, nickname: 'An Affordable Sunscreen', image: '/content/beauty-style/skin-care/top-50-skincare-products/sunscreen.png', name: 'La Roche-Posay Anthelios Invisible Fluid SPF 50+', price: '$38.95', brand: 'La Roche-Posay', url: 'https://adorebeauty.prf.hn/click/camref:1011lfsKr/destination:https%3A%2F%2Fwww.adorebeauty.com.au%2Fp%2Fla-roche-posay%2Fla-roche-posay-anthelios-invisible-fluid-facial-sunscreen-spf-50.html', description: 'This cult sunscreen for all ages is light and easy to wear, which is key when you use it every day. Purse-friendly, too.' },
      { number: 3, nickname: 'A Clarifying Cleanser', image: '/content/beauty-style/skin-care/top-50-skincare-products/CLEANSER.png', name: 'CeraVe Blemish Control Cleanser', price: '$24.99', brand: 'CeraVe', url: 'https://www.adorebeauty.com.au/p/cerave/cerave-blemish-control-cleanser-473ml.html?clickref=1101lBMcWx2A&utm_source=partnerize&utm_medium=affiliate&utm_content=affiliate&utm_campaign=beauticate', description: 'This spot-seeking oil-buster contains ceramides, niacinamide, salicylic acid and purifying clay to help deeply clean and minimise future breakouts.' },
      { number: 4, nickname: 'Blemish Patches', image: '/content/beauty-style/skin-care/top-50-skincare-products/BLEMISH.png', name: 'The Breakout Hack Patch It Up Pimple Patches', price: '$19.95', brand: 'The Breakout Hack', url: 'https://adorebeauty.prf.hn/click/camref:1011lfsKr/destination:https%3A%2F%2Fwww.adorebeauty.com.au%2Fp%2Fthe-breakout-hack%2Ftbh-skincare-patch-it-up-everyday-pimple-patches.html', description: 'A game-changer for breakouts. These contain Ascorbic Acid, Salicylic Acid, Tea Tree Oil and Niacinamide to nix breakouts fast.' },
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
      { number: 12, nickname: 'The Lazy-Girl\'s Cleanser', image: '/content/beauty-style/skin-care/top-50-skincare-products/THE-LAZY-GIRLS-CLEANSER.png', name: 'Bioderma Sensibio H2O Micellar Water', price: '$22.99', brand: 'Bioderma', url: 'https://adorebeauty.prf.hn/click/camref:1011lfsKr/destination:https%3A%2F%2Fwww.adorebeauty.com.au%2Fp%2Fbioderma%2Fsensibio-h2o-micellar-cleanser-250ml.html', description: 'For those nights when you can barely be bothered to remove your makeup, keep this bottle and some reusable pads stashed on your night stand.' },
      { number: 13, nickname: 'The Sun Protecting CC Cream', image: '/content/beauty-style/skin-care/top-50-skincare-products/THE-SUN-PROTECTING-CC-CREAMS.png', name: 'It Cosmetics Your Skin But Better CC+ Cream', price: '$82', brand: 'It Cosmetics', url: 'https://adorebeauty.prf.hn/click/camref:1011lfsKr/destination:https%3A%2F%2Fwww.adorebeauty.com.au%2Fp%2Fit-cosmetics%2Fit-cosmetics-your-skin-but-better-cc-cream-spf50.html', description: 'Another cult product that delivers a flawless complexion with SPF 50+ and skincare properties.' },
      { number: 14, nickname: 'The Cult Vitamin C', image: '/content/beauty-style/skin-care/top-50-skincare-products/THE-CULT-VITAMIN-C.png', name: 'SkinCeuticals CE Ferulic Serum', price: '$249', brand: 'SkinCeuticals', url: 'https://adorebeauty.prf.hn/click/camref:1011lfsKr/destination:https%3A%2F%2Fwww.adorebeauty.com.au%2Fp%2Fskinceuticals%2Fskinceuticals-c-e-ferulic-serum.html', description: 'I still use this daily and I notice when I don\'t. It truly does deliver bright, glowing skin in a bottle. You should use this at every age.' },
      { number: 15, nickname: 'The Do-Everything Cream', image: '/content/beauty-style/skin-care/top-50-skincare-products/Embryolisse.png', name: 'Embryolisse Lait-Crème Concentré', price: '$48', brand: 'Embryolisse', url: 'https://adorebeauty.prf.hn/click/camref:1011lfsKr/destination:https%3A%2F%2Fwww.adorebeauty.com.au%2Fp%2Fembryolisse%2Fembryolisse-lait-creme-concentrate-moisturiser.html', description: 'The ultimate makeup artist\'s moisturiser — it primes perfectly for foundation and can also be used as a masque or cleanser.' },
      { number: 16, nickname: 'Cleansing Pads', image: '/content/beauty-style/skin-care/top-50-skincare-products/CLEANSING-PAD.png', name: 'The Inkey List Double Sided Cleansing Pads', price: '$20', brand: 'The Inkey List', url: 'https://go.skimresources.com/?id=265664X1750758&xs=1&url=https%3A%2F%2Fwww.sephora.com.au%2Fproducts%2Fthe-inkey-list-reusable-double-sided-cleansing-pads%2Fv%2Fdefault', description: 'If you wear a lot of makeup these are a genius and sustainable way to remove it, along with sunscreen.' },
      { number: 17, nickname: 'The Date Night Mask', image: '/content/beauty-style/skin-care/top-50-skincare-products/THE-DATE-NIGHT-MASK.png', name: 'Kora Organics Turmeric Brightening & Exfoliating Mask', price: '$29', brand: 'Kora Organics', url: 'https://adorebeauty.prf.hn/click/camref:1011lfsKr/destination:https%3A%2F%2Fwww.adorebeauty.com.au%2Fp%2Fkora-organics%2Fkora-organics-turmeric-brightening-exfoliating-mask-2-in-1.html', description: 'This deliciously peppermint-scented yellow concoction uses rosehip seeds, turmeric and papaya enzymes to brighten and energize dull or sleepy skin.' },
      { number: 18, nickname: 'The Dolphin Skin Hyaluronic', image: '/content/beauty-style/skin-care/top-50-skincare-products/THE-DOLPHIN-SKIN-HYALURONIC.png', name: 'PCA Skin Hyaluronic Acid Boosting Serum', price: '$240', brand: 'PCA Skin', url: 'https://adorebeauty.prf.hn/click/camref:1011lfsKr/destination:https%3A%2F%2Fwww.adorebeauty.com.au%2Fp%2Fpca-skin%2Fpca-skin-hyaluronic-acid-boosting-serum-28g.html', description: 'This clinical strength elixir works on surface hydration while also quenching more deeply with varying sized hyaluronic acid spheres, niacinamide and ceramides.' },
      { number: 19, nickname: 'The Do-Everything Balm', image: '/content/beauty-style/skin-care/top-50-skincare-products/THE-DOEVERYTHING-BALM.png', name: 'Lanolips 101 Ointment Multipurpose Superbalm', price: '$18.95', brand: 'Lanolips', url: 'https://adorebeauty.prf.hn/click/camref:1011lfsKr/destination:https%3A%2F%2Fwww.adorebeauty.com.au%2Fp%2Flanolips%2Flanolips-101-ointment.html', description: 'Almost every handbag of mine contains a tube of this superstar. Soothe parched pouts, hydrate cuticles, heal abrasions, tame brows and flyaways.' },
      { number: 20, nickname: 'The Brightening Eye Cream', image: '/content/beauty-style/skin-care/top-50-skincare-products/THE-BRIGHTENING-EYE-CREAM.png', name: 'Ole Henriksen Banana Bright+ Eye Crème', price: '$64', brand: 'Ole Henriksen', url: 'https://go.skimresources.com/?id=265664X1750758&xs=1&url=https%3A%2F%2Fwww.sephora.com.au%2Fproducts%2Fole-henriksen-banana-bright-eye-creme', description: 'This yellow-tinted creamy concoction instantly sparks up tired, dehydrated eyes and helps disguise dark circles.' },
    ],
  },
  {
    title: 'Thirties',
    intro: 'This is the decade to start addressing the first signs of ageing while maintaining everything you\'ve built. Introduce targeted products — retinols, preventative LED — and double down on hydration and sun protection.',
    products: [
      { number: 21, nickname: 'The Express LED Mask', image: '/content/beauty-style/skin-care/top-50-skincare-products/THE-EXPRESS-LED-MASK.png', name: 'Qure Rejuvalite LED Mask', price: '$499', brand: 'Qure', url: 'https://adorebeauty.prf.hn/click/camref:1011lfsKr/destination:https%3A%2F%2Fwww.adorebeauty.com.au%2Fp%2Fqure%2Fqure-rejuvalite-led-mask.html', description: 'This mask is customisable so you can use different light wavelengths for different areas of the face. Plus it\'s only 3 minutes a day.' },
      { number: 22, nickname: 'Ease Into Retinal', image: '/content/beauty-style/skin-care/top-50-skincare-products/EASE-INTO-RETINAL.png', name: 'Medik8 Crystal Retinal 6', price: '$135', brand: 'Medik8', url: 'https://adorebeauty.prf.hn/click/camref:1011lfsKr/destination:https%3A%2F%2Fwww.adorebeauty.com.au%2Fp%2Fmedik8%2Fmedik8-crystal-retinal-6.html', description: 'The Crystal retinal (a form of vitamin A) line is perfect for first-time users. It resurfaces, fades acne scars and fine lines.' },
      { number: 23, nickname: 'A Clever Cleansing Oil', image: '/content/beauty-style/skin-care/top-50-skincare-products/A-CLEVER-CLEANSING-OIL.png', name: 'Kiehl\'s Midnight Recovery Botanical Cleansing Oil', price: '$76', brand: 'Kiehl\'s', url: 'https://adorebeauty.prf.hn/click/camref:1011lfsKr/destination:https%3A%2F%2Fwww.adorebeauty.com.au%2Fp%2Fkiehls%2Fkiehls-midnight-recovery-botanical-cleansing-oil-175ml.html', description: 'This decadent oil melts makeup and strips away sunscreen residue, transforming into a silky milk on rinsing.' },
      { number: 24, nickname: 'The DIY Daily Peel', image: '/content/beauty-style/skin-care/top-50-skincare-products/THE-DIY-DAILY-PEEL.png', name: 'Dr Dennis Gross Alpha Beta Universal Daily Peel', price: '$36 – $264', brand: 'Dr Dennis Gross', url: 'https://go.skimresources.com/?id=265664X1750758&xs=1&url=https%3A%2F%2Fwww.sephora.com.au%2Fproducts%2Fdr-dennis-gross-alpha-beta-universal-daily-peel', description: 'Single-use pads — step 1 has five AHA/BHAs to boost radiance, target pores and diminish fine lines while step 2 neutralises and hydrates.' },
      { number: 25, nickname: 'A Very Wearable Sunscreen', image: '/content/beauty-style/skin-care/top-50-skincare-products/A-VERY-WEARABLE-SUNSCREEN.png', name: 'SkinCeuticals Ultra Defense Facial Sunscreen SPF 50', price: '$69', brand: 'SkinCeuticals', url: 'https://adorebeauty.prf.hn/click/camref:1011lfsKr/destination:https%3A%2F%2Fwww.adorebeauty.com.au%2Fp%2Fskinceuticals%2Fskinceuticals-ultra-facial-defense-spf50-50ml.html', description: 'This is one of the most comfortable sunscreens you\'ll find — light, fragrance-free and beautiful under makeup.' },
      { number: 26, nickname: 'The Hydrating Microneedling Device', image: '/content/beauty-style/skin-care/top-50-skincare-products/THE-HYDRATING-MICRONEEDLING-DEVICE.png', name: 'Qure Micro-Infusion System', brand: 'Qure', url: 'https://adorebeauty.prf.hn/click/camref:1011lfsKr/destination:https%3A%2F%2Fwww.adorebeauty.com.au%2Fp%2Fqure%2Fqure-micro-infusion-system.html', description: 'This at-home needling device was a total game-changer for my skin. You stamp the serum into skin to deliver it to the lower layers.' },
      { number: 27, nickname: 'The Brightening Elixir', image: '/content/beauty-style/skin-care/top-50-skincare-products/THE-BRIGHTENING-ELIXIR.png', name: 'SK-II Facial Treatment Essence', price: '$139', brand: 'SK-II', url: 'https://adorebeauty.prf.hn/click/camref:1011lfsKr/destination:https%3A%2F%2Fwww.adorebeauty.com.au%2Fp%2Fsk-ii%2Fsk-ii-facial-treatment-essence-75ml.html', description: 'A cult product for good reason — over 90% Pitera, containing 50+ micro-nutrients to brighten, smooth and hydrate.' },
      { number: 28, nickname: 'The Barrier Repairer', image: '/content/beauty-style/skin-care/top-50-skincare-products/THE-BARRIER-REPAIRER.png', name: 'Avène Cicalfate+ Restorative Protective Cream', price: '$39.99', brand: 'Avène', url: 'https://adorebeauty.prf.hn/click/camref:1011lfsKr/destination:https%3A%2F%2Fwww.adorebeauty.com.au%2Fp%2Favene%2Favene-cicalfate-restorative-skin-cream-100ml.html', description: 'A godsend for when the skin\'s natural moisture barrier is impaired — soothing, nourishing cream with signature thermal water.' },
      { number: 29, nickname: 'The Neck and Déc LED', image: '/content/beauty-style/skin-care/top-50-skincare-products/THE-NECK-AND-DEC-LED-1.png', name: 'Qure Neck & Décolletage LED Light Therapy Device', price: '$499', brand: 'Qure', url: 'https://adorebeauty.prf.hn/click/camref:1011lfsKr/destination:https%3A%2F%2Fwww.adorebeauty.com.au%2Fp%2Fqure%2Fqure-neck-decolletage-led.html', description: 'Once you\'re into a routine with your face LED, add a neck and déc to your treatment plan. Now is the time to prevent aging in this area.' },
      { number: 30, nickname: 'A Top Rated Niacinamide', image: '/content/beauty-style/skin-care/top-50-skincare-products/NIACINAMIDE.png', name: 'SKIN1004 Niacinamide 10% Boosting Shot Ampoule', price: '$17.95', brand: 'SKIN1004', url: 'https://adorebeauty.prf.hn/click/camref:1011lfsKr/destination:https%3A%2F%2Fwww.adorebeauty.com.au%2Fp%2Fskin1004%2Fskin1004-niacinamide-10-boosting-shot-ampoule.html', description: 'If niacinamide isn\'t already in your routine, consider this your sign. A skin-smoothing 10% hit to minimise pores and diffuse redness.' },
    ],
  },
  {
    title: 'Forties',
    intro: 'Collagen production slows, pigmentation and fine lines become more visible — but the right products make a real difference. This is where high-tech treatments, peptides and targeted serums earn their keep.',
    products: [
      { number: 31, nickname: 'The Hydrating Cleanser', image: '/content/beauty-style/skin-care/top-50-skincare-products/THE-HYDRATING-CLEANSER.png', name: 'CeraVe Hydrating Cream-to-Foam Cleanser', price: '$24.99', brand: 'CeraVe', url: 'https://go.skimresources.com/?id=265664X1750758&xs=1&url=https%3A%2F%2Fwww.adorebeauty.com.au%2Fp%2Fcerave%2Fcerave-hydrating-cream-to-foam-cleanser-236ml.html', description: 'Gloriously quenching yet satisfyingly effective at whisking away dirt, makeup and sunscreen. Beautifully priced, too.' },
      { number: 32, nickname: 'The Pigment Preventing SPF', image: '/content/beauty-style/skin-care/top-50-skincare-products/THE-PIGMENT-PREVENTING-SPF.png', name: 'Mesoestetic Mesoprotech Melan 130', price: '$76.50', brand: 'Mesoestetic', url: 'https://adorebeauty.prf.hn/click/camref:1011lfsKr/destination:https%3A%2F%2Fwww.adorebeauty.com.au%2Fp%2Fmesoestetic%2Fmesoestetic-mesoprotech-melan-130-pigment-control-50ml.html', description: 'So many derms I\'ve interviewed recommend this — it not only protects but helps prevent new pigment forming. Great for melasma.' },
      { number: 33, nickname: 'The Glycolic Exfoliant', image: '/content/beauty-style/skin-care/top-50-skincare-products/THE-GLYCOLIC-EXFOLIANT.png', name: 'Alpha-H Liquid Gold', price: '$76.95', brand: 'Alpha-H', url: 'https://adorebeauty.prf.hn/click/camref:1011lfsKr/destination:https%3A%2F%2Fwww.adorebeauty.com.au%2Fp%2Falpha-h%2Falpha-h-liquid-gold.html', description: 'Swipe off dead skin cells and wipe on radiance with this potent exfoliating lotion — 5% Glycolic Acid and liquorice extract.' },
      { number: 34, nickname: 'The Pigment Knockout', image: '/content/beauty-style/skin-care/top-50-skincare-products/THE-PIGMENT-KNOCKOUT.png', name: 'Aspect Pigment Punch', price: '$155', brand: 'Aspect', url: 'https://adorebeauty.prf.hn/click/camref:1011lfsKr/destination:https%3A%2F%2Fwww.adorebeauty.com.au%2Fp%2Faspect%2Faspect-pigment-punch-30ml.html', description: 'L-Ascorbic Acid, a derivative of hydroquinone, Niacinamide and Lactic acid to seek and destroy pesky dark spots.' },
      { number: 35, nickname: 'The Serious Night Cream', image: '/content/beauty-style/skin-care/top-50-skincare-products/THE-SERIOUS-NIGHT-CREAM.png', name: 'Rationale #6 The Night Cream', price: '$110', brand: 'Rationale', url: 'https://rationale.com/collections/fine-lines-wrinkles/products/6-the-night-creme', description: 'I\'m a huge fan of the whole Rationale Essential Six. This night cream features their exclusive Vitamin A complex in a gorgeous hydrating formula.' },
      { number: 36, nickname: 'The Dermastamping Serum', image: '/content/beauty-style/skin-care/top-50-skincare-products/THE-DERMASTAMPING-SERUM.png', name: 'Qure EGF Serum', brand: 'Qure', url: 'https://adorebeauty.prf.hn/click/camref:1011lfsKr/destination:https%3A%2F%2Fwww.adorebeauty.com.au%2Fp%2Fqure%2Fqure-egf-serum.html', description: 'Step up your at-home microneedling with this Epidermal Growth Factor Serum. I do this before any big event and at least once a month.' },
      { number: 37, nickname: 'The Big Guns LED Mask', image: '/content/beauty-style/skin-care/top-50-skincare-products/THE-BIG-GUNS-LED-MASK.png', name: 'San Lueur Advanced LED Light Therapy Mask', price: '$795', brand: 'San Lueur', url: 'https://adorebeauty.prf.hn/click/camref:1011lfsKr/destination:https%3A%2F%2Fwww.adorebeauty.com.au%2Fp%2Fsan-lueur%2Fsan-lueur-advanced-led-light-therapy-mask.html', description: 'The gold standard — more lights and strength than most on the market, plus red for rejuvenation and blue for breakouts.' },
      { number: 38, nickname: 'Dry Skin Saviour', image: '/content/beauty-style/skin-care/top-50-skincare-products/DRY-SKIN-SAVIOUR.png', name: 'Weleda Skin Food', price: '$29.95', brand: 'Weleda', url: 'https://adorebeauty.prf.hn/click/camref:1011lfsKr/destination:https%3A%2F%2Fwww.adorebeauty.com.au%2Fp%2Fweleda%2Fweleda-skin-food.html', description: 'One for moisture-sapping climates — this gloriously scented balm is 100% certified natural with Sunflower Seed Oil and Lanolin.' },
      { number: 39, nickname: 'The Collagen Conserver', image: '/content/beauty-style/skin-care/top-50-skincare-products/THE-COLLAGEN-CONSERVER.png', name: 'Dermalogica Pro-Collagen Banking Serum', price: '$152', brand: 'Dermalogica', url: 'https://adorebeauty.prf.hn/click/camref:1011lfsKr/destination:https%3A%2F%2Fwww.adorebeauty.com.au%2Fp%2Fdermalogica%2Fdermalogica-pro-collagen-banking-serum.html', description: 'Futureproof your skin with Collagen Amino Acids, Carnosine Dipeptide, and Antioxidants. I noticed a real change in hydration.' },
      { number: 40, nickname: 'The Nightly Elixir', image: '/content/beauty-style/skin-care/top-50-skincare-products/THE-NIGHTLY-ELIXIR.png', name: 'Estée Lauder Advanced Night Repair', price: '$139', brand: 'Estée Lauder', url: 'https://go.skimresources.com/?id=265664X1750758&xs=1&url=https%3A%2F%2Fwww.adorebeauty.com.au%2Fp%2Festee-lauder%2Festee-lauder-advanced-night-repair-synchronized-multi-recovery-complex-30ml.html', description: 'This iconic serum targets fine lines, wrinkles, dullness and uneven tone in one pump. A nightstand staple for good reason.' },
    ],
  },
  {
    title: 'Fifties & Beyond',
    intro: 'Skincare meets self-care. Rich moisturisers, luxe oils and targeted treatments do the heavy lifting — slower, richer and entirely on your own terms.',
    products: [
      { number: 41, nickname: 'The Cult Cream', image: '/content/beauty-style/skin-care/top-50-skincare-products/THE-CULT-CREAM.png', name: 'Augustinus Bader The Rich Cream', price: '$153 – $859', brand: 'Augustinus Bader', url: 'https://go.skimresources.com/?id=265664X1750758&xs=1&url=https%3A%2F%2Fwww.mecca.com%2Fen-au%2Faugustinus-bader%2Fthe-rich-cream-V-060052%2F', description: 'Supremely luxurious — Argan, Avocado and Evening Primrose Oils with the patented TFC8 technology that supports skin\'s own renewal.' },
      { number: 42, nickname: 'A Hydrating SPF', image: '/content/beauty-style/skin-care/top-50-skincare-products/A-HYDRATING-SPF.png', name: 'Ultra Violette Supreme Screen SPF 50', price: '$52', brand: 'Ultra Violette', url: 'https://adorebeauty.prf.hn/click/camref:1011lfsKr/destination:https%3A%2F%2Fwww.adorebeauty.com.au%2Fp%2Fultra-violette%2Fultra-violette-supreme-screen-spf-50-hydrating-facial-sunscreen-75ml.html', description: 'A skin-quenching SPF with glycerin and vitamin C-pumped kakadu plum. It\'s a joy to wear, which means you WILL wear it.' },
      { number: 43, nickname: 'The Ritualistic Cream Cleanser', image: '/content/beauty-style/skin-care/top-50-skincare-products/THE-RITUALISTIC-CREAM-CLEANSER.png', name: 'Eve Lom Cleanser', price: '$46 – $224', brand: 'Eve Lom', url: 'https://go.skimresources.com/?id=265664X1750758&xs=1&url=https%3A%2F%2Fwww.mecca.com%2Fen-au%2Feve-lom%2Fcleanser-V-007964%2F', description: 'A new age take on the old-school cold cream cleanser — use with a warm muslin and inhale clove, eucalyptus and camomile oils.' },
      { number: 44, nickname: 'The Classic All-Rounder Balm', image: '/content/beauty-style/skin-care/top-50-skincare-products/THE-CLASSIC-ALLROUNDER-BALM.png', name: 'Elizabeth Arden Eight Hour Cream', price: '$37', brand: 'Elizabeth Arden', url: 'https://adorebeauty.prf.hn/click/camref:1011lfsKr/destination:https%3A%2F%2Fwww.adorebeauty.com.au%2Fp%2Felizabeth-arden%2Felizabeth-arden-original-eight-hour-cream-skin-protectant.html', description: 'From soothing sore lips to hydrating chapped hands and feet — the cure for all manner of beauty sins.' },
      { number: 45, nickname: 'The Melanin Regulating Toner', image: '/content/beauty-style/skin-care/top-50-skincare-products/THE-MELANIN-REGULATING-TONER.png', name: 'Biologique Recherche Lotion P50', price: '$260', brand: 'Biologique Recherche', url: 'https://mybr-australia.com/products/lotion-p50', description: 'Do believe the hype. Known as a \'facial in a bottle\' — glycolic and lactic acid for gentle exfoliation that lightens dark spots.' },
      { number: 46, nickname: 'The Spa-Scented Mist', image: '/content/beauty-style/skin-care/top-50-skincare-products/THE-SPA-SCENTED-MIST.png', name: 'Caudalie Beauty Elixir', price: '$93', brand: 'Caudalie', url: 'https://go.skimresources.com/?id=265664X1750758&xs=1&url=https%3A%2F%2Fwww.sephora.com.au%2Fproducts%2Fcaudalie-beauty-elixir%2Fv%2F100ml', description: 'Sublimely fragranced mist adored worldwide for its tightening yet hydrating properties. Perfect for setting makeup and refreshing through the day.' },
      { number: 47, nickname: 'The Repair-All Cream', image: '/content/beauty-style/skin-care/top-50-skincare-products/THE-REPAIRALL-CREAM.png', name: 'La Roche-Posay Cicaplast Baume B5+', price: '$42.95', brand: 'La Roche-Posay', url: 'https://adorebeauty.prf.hn/click/camref:1011lfsKr/destination:https%3A%2F%2Fwww.adorebeauty.com.au%2Fp%2Fla-roche-posay%2Fla-roche-posay-cicaplast-baume-b5.html', description: 'For sensitised or damaged skin — loaded with hydrating and repairing ingredients to soothe and reduce redness. Great post-procedure.' },
      { number: 48, nickname: 'The Triple Strength Hydrator', image: '/content/beauty-style/skin-care/top-50-skincare-products/THE-TRIPLE-STRENGTH-HYDRATOR-1.png', name: 'SkinCeuticals Triple Lipid Restore 2:4:2', price: '$215', brand: 'SkinCeuticals', url: 'https://adorebeauty.prf.hn/click/camref:1011lfsKr/destination:https%3A%2F%2Fwww.adorebeauty.com.au%2Fp%2Fskinceuticals%2Fskinceuticals-triple-lipid-restore-2-4-2.html', description: 'Slips onto the skin like a balm and melts in like a dream — fatty acids, ceramides, and natural cholesterol.' },
      { number: 49, nickname: 'The Luxe Lifting Serum', image: '/content/beauty-style/skin-care/top-50-skincare-products/THE-LUXE-LIFTING-SERUM.png', name: 'La Prairie Skin Caviar Liquid Lift', price: '$1,175', brand: 'La Prairie', url: 'https://go.skimresources.com/?id=265664X1750758&xs=1&url=https%3A%2F%2Fwww.davidjones.com%2Fproduct%2Fla-prairie-skin-caviar-liquid-lift-50ml-27319652', description: 'If you have the budget, La Prairie is the crème de la crème. Caviar extracts with biomolecules, peptides, and minerals in a silky serum that lifts.' },
      { number: 50, nickname: 'The Rolls Royce of Moisturisers', image: '/content/beauty-style/skin-care/top-50-skincare-products/THE-ROLLS-ROYCE-OF-MOISTURISERS.png', name: 'Crème de la Mer', price: '$189 – $955', brand: 'La Mer', url: 'https://go.skimresources.com/?id=265664X1750758&xs=1&url=https%3A%2F%2Fwww.davidjones.com%2Fproduct%2Fla-mer-creme-de-la-mer-60ml', description: 'Still one of the world\'s most luxurious creams — the signature Miracle Broth improves barrier function and accelerates cell regeneration.' },
    ],
  },
]

function SpreadHeader({ label }: { label: 'Skin Staples' | 'Superstars' }) {
  return (
    <div className="relative mb-6 md:mb-8">
      <p
        className="hidden md:block absolute top-0 right-0 font-sans text-[10px] tracking-[0.35em] uppercase font-medium"
        style={{ opacity: 0.4 }}
      >
        beauticate.
      </p>
      <div className="text-center md:text-left">
        <p className="font-serif italic text-xl md:text-2xl mb-1" style={{ color: '#8B7355' }}>
          Shop The Edit:
        </p>
        <h3
          className="font-sans tracking-[0.15em] uppercase font-medium"
          style={{ fontSize: 'clamp(28px, 4vw, 42px)' }}
        >
          {label}
        </h3>
        <p className="font-sans text-[11px] mt-3" style={{ opacity: 0.4 }}>
          Every product is shoppable — just click the image or use the shop button (don&apos;t forget to use the codes).
        </p>
      </div>
    </div>
  )
}

interface PlacedProduct {
  imgTop: string; imgLeft: string; imgW: string; imgZ: number
  txtTop: string; txtLeft: string; txtW: string
  txtAlign?: 'left' | 'right' | 'center'
}

const COLLAGE_A: PlacedProduct[] = [
  { imgTop: '0%',  imgLeft: '22%', imgW: '28%', imgZ: 3, txtTop: '0%',  txtLeft: '52%', txtW: '28%', txtAlign: 'left'  },
  { imgTop: '20%', imgLeft: '12%', imgW: '20%', imgZ: 2, txtTop: '18%', txtLeft: '0%',  txtW: '20%', txtAlign: 'center' },
  { imgTop: '10%', imgLeft: '42%', imgW: '26%', imgZ: 5, txtTop: '8%',  txtLeft: '65%', txtW: '28%', txtAlign: 'left'  },
  { imgTop: '60%', imgLeft: '15%', imgW: '18%', imgZ: 3, txtTop: '58%', txtLeft: '0%',  txtW: '22%', txtAlign: 'left'  },
  { imgTop: '58%', imgLeft: '48%', imgW: '22%', imgZ: 4, txtTop: '58%', txtLeft: '67%', txtW: '28%', txtAlign: 'left'  },
]

const COLLAGE_B: PlacedProduct[] = [
  { imgTop: '4%',  imgLeft: '18%', imgW: '18%', imgZ: 3, txtTop: '0%',  txtLeft: '0%',  txtW: '22%', txtAlign: 'left'  },
  { imgTop: '0%',  imgLeft: '36%', imgW: '24%', imgZ: 5, txtTop: '0%',  txtLeft: '60%', txtW: '28%', txtAlign: 'left'  },
  { imgTop: '42%', imgLeft: '14%', imgW: '22%', imgZ: 4, txtTop: '40%', txtLeft: '0%',  txtW: '20%', txtAlign: 'left'  },
  { imgTop: '62%', imgLeft: '18%', imgW: '18%', imgZ: 3, txtTop: '60%', txtLeft: '0%',  txtW: '24%', txtAlign: 'left'  },
  { imgTop: '48%', imgLeft: '52%', imgW: '28%', imgZ: 5, txtTop: '50%', txtLeft: '72%', txtW: '26%', txtAlign: 'left'  },
]

function ProductOnSpread({ product, pos }: { product: Product; pos: PlacedProduct }) {
  return (
    <>
      {/* Image — floats independently */}
      <Link
        href={product.url}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="absolute block group"
        style={{ top: pos.imgTop, left: pos.imgLeft, width: pos.imgW, zIndex: pos.imgZ }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-auto object-contain drop-shadow-lg transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </Link>
      {/* Number + text block — positioned separately */}
      <div
        className="absolute"
        style={{
          top: pos.txtTop, left: pos.txtLeft, width: pos.txtW,
          zIndex: pos.imgZ + 1,
          textAlign: pos.txtAlign || 'left',
        }}
      >
        <span
          className="block font-serif leading-[0.85] select-none"
          style={{ fontSize: 'clamp(48px, 6.5vw, 96px)', color: '#8B7355', opacity: 0.8 }}
          aria-hidden
        >
          {product.number}.
        </span>
        <h4
          className="font-sans text-[11px] tracking-[0.06em] uppercase font-bold leading-snug mt-1 mb-1"
          style={{ color: '#1C1A17' }}
        >
          {product.nickname}
        </h4>
        <p className="font-serif text-[11px] leading-[1.5] mb-1.5" style={{ opacity: 0.7, color: '#1C1A17' }}>
          {product.description}
        </p>
        <p className="font-serif text-[10.5px] mb-1" style={{ opacity: 0.55, color: '#1C1A17' }}>
          <span className="underline">{product.name}</span>
          {product.price ? `, ${product.price}` : ''}
        </p>
        <Link
          href={product.url}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="inline-flex items-center font-sans text-[9px] tracking-[0.12em] uppercase font-bold px-3 py-1.5 border transition-colors hover:bg-charcoal hover:text-white"
          style={{ borderColor: '#1C1A17', color: '#1C1A17' }}
        >
          shop
        </Link>
      </div>
    </>
  )
}

function CollageSpreads({ products, variant }: { products: Product[]; variant: 'a' | 'b' }) {
  const positions = variant === 'a' ? COLLAGE_A : COLLAGE_B
  return (
    <div className="hidden md:block relative" style={{ paddingBottom: '110%' }}>
      {products.map((product, i) => (
        <ProductOnSpread key={product.number} product={product} pos={positions[i]} />
      ))}
    </div>
  )
}

function MobileProduct({ product }: { product: Product }) {
  const r = retailerFromUrl(product.url)
  return (
    <div className="flex flex-col">
      <span
        className="font-serif leading-none select-none"
        style={{ fontSize: '48px', color: '#8B7355', opacity: 0.7 }}
        aria-hidden
      >
        {product.number}.
      </span>
      <Link
        href={product.url}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="block group -mt-2 mb-3"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-auto object-contain drop-shadow-md transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </Link>
      <h4 className="font-sans text-[11px] tracking-[0.06em] uppercase font-bold leading-snug mb-1.5">
        {product.nickname}
      </h4>
      <p className="font-serif text-[12px] leading-relaxed mb-2" style={{ opacity: 0.7 }}>
        {product.description}
      </p>
      <p className="font-serif text-[11px] mb-1" style={{ opacity: 0.5 }}>
        <span className="underline">{product.name}</span>
        {product.price ? `, ${product.price}` : ''}
      </p>
      <Link
        href={product.url}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="inline-flex items-center font-sans text-[9px] tracking-[0.12em] uppercase font-bold px-3 py-1.5 border mt-1.5 transition-colors hover:bg-charcoal hover:text-white self-start"
        style={{ borderColor: '#1C1A17', color: '#1C1A17' }}
      >
        shop{r ? ` via ${r}` : ''}
      </Link>
    </div>
  )
}

export default function Top50SkincarePage() {
  return (
    <main style={{ background: BG, color: '#1C1A17' }}>
      {/* ─── Cover ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: '#2A2622', minHeight: '60vh' }}>
        <div className="absolute inset-0 flex items-end justify-center pb-16 md:pb-24">
          <div className="text-center text-white px-6">
            <p
              className="font-serif italic text-sm md:text-base tracking-wide mb-3"
              style={{ opacity: 0.7 }}
            >
              top 50
            </p>
            <h1
              className="font-sans uppercase tracking-[0.08em] font-medium leading-[1.1] mb-6"
              style={{ fontSize: 'clamp(32px, 6vw, 64px)' }}
            >
              Skincare<br />Products
            </h1>
            <p className="font-sans text-[11px] tracking-[0.35em] uppercase font-medium" style={{ opacity: 0.6 }}>
              beauticate.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Welcome / Intro ──────────────────────────────────── */}
      <section className="max-w-xl mx-auto px-6 py-10 md:py-16">
        <p className="font-sans text-[10px] tracking-[0.3em] uppercase font-medium text-center mb-4" style={{ opacity: 0.4 }}>
          beauticate.
        </p>
        <p className="font-serif italic text-2xl md:text-3xl text-center mb-8" style={{ color: '#8B7355' }}>
          Shop The Edit:
        </p>
        <h2 className="font-serif text-2xl md:text-3xl font-normal leading-snug mb-8">
          Welcome to Beauticate's exclusive Skincare Shopping Guide
        </h2>
        <div className="font-serif text-[15px] leading-relaxed space-y-5" style={{ opacity: 0.8 }}>
          <p>
            Welcome to Beauticate's Skincare Edit — your ultimate guide to <strong>50 expert-approved</strong> products
            that deliver <strong>real results</strong>. After years of testing and interviewing experts as a magazine
            beauty director, I've cherry-picked the best in skincare.
          </p>
          <p>
            Each decade includes <strong>5 skin staples + 5 superstars</strong>, but don't feel restricted — mix and
            match to find what works for you. Simply <strong>click any shop button or product picture to buy</strong>.
          </p>
          <p>
            Many of these links are affiliates so when you shop via this guide, you're supporting Beauticate at no
            extra cost to you.
          </p>
          <p>
            Most products can be used at any age — this is simply a springboard to inspire your next skincare upgrade.
          </p>
        </div>
      </section>

      {/* ─── Discount Codes ─────────────────────────────────── */}
      <section className="py-10 md:py-14" style={{ background: BG }}>
        <div className="max-w-2xl mx-auto px-6">
          <p className="font-sans text-[10px] tracking-[0.35em] uppercase font-medium text-center mb-2" style={{ opacity: 0.4 }}>
            beauticate.
          </p>
          <h2
            className="font-sans tracking-[0.12em] uppercase font-medium text-center mb-6"
            style={{ fontSize: 'clamp(24px, 3.5vw, 36px)' }}
          >
            Discount Codes
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
              <thead>
                <tr style={{ background: BG_ALT }}>
                  <th className="font-sans text-[10px] tracking-[0.15em] uppercase font-bold px-4 py-3">Brand</th>
                  <th className="font-sans text-[10px] tracking-[0.15em] uppercase font-bold px-4 py-3">Offer</th>
                  <th className="font-sans text-[10px] tracking-[0.15em] uppercase font-bold px-4 py-3">How to Redeem</th>
                </tr>
              </thead>
              <tbody className="font-serif text-[13px]" style={{ opacity: 0.8 }}>
                <tr className="border-b" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                  <td className="px-4 py-4"><span className="underline">Adore Beauty</span></td>
                  <td className="px-4 py-4">$25 off orders over $120</td>
                  <td className="px-4 py-4">Enter code: <strong>PARBEAUTICATE</strong> at checkout</td>
                </tr>
                <tr className="border-b" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                  <td className="px-4 py-4"><span className="underline">San Lueur LED</span></td>
                  <td className="px-4 py-4">10% Off</td>
                  <td className="px-4 py-4">Code: <strong>BEAUTICATE10</strong> at checkout</td>
                </tr>
                <tr className="border-b" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                  <td className="px-4 py-4"><span className="underline">Qure Devices</span></td>
                  <td className="px-4 py-4">10% Off</td>
                  <td className="px-4 py-4">Discount applies automatically via link</td>
                </tr>
                <tr className="border-b" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                  <td className="px-4 py-4"><span className="underline">JS Health</span></td>
                  <td className="px-4 py-4">15% Off</td>
                  <td className="px-4 py-4">Code: <strong>SIGOURNEY15</strong> at checkout</td>
                </tr>
                <tr>
                  <td className="px-4 py-4"><span className="underline">Infraredi</span></td>
                  <td className="px-4 py-4">10% Off</td>
                  <td className="px-4 py-4">Code: <strong>BEAUTICATE10</strong> at checkout</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ─── Decade Sections ──────────────────────────────────── */}
      {decades.map((decade) => {
        const staples = decade.products.slice(0, 5)
        const superstars = decade.products.slice(5, 10)
        return (
          <section key={decade.title}>
            {/* Decade opener */}
            <div style={{ background: BG_ALT }}>
              <div className="max-w-3xl mx-auto px-6 py-10 md:py-14">
                <h2
                  className="font-sans uppercase tracking-[0.06em] font-medium leading-none mb-6"
                  style={{ fontSize: 'clamp(36px, 6vw, 72px)' }}
                >
                  {decade.title}
                </h2>
                <p className="font-serif text-[15px] leading-relaxed" style={{ opacity: 0.75, maxWidth: '52ch' }}>
                  {decade.intro}
                </p>
              </div>
            </div>

            {/* Skin Staples spread */}
            <div className="max-w-6xl mx-auto px-6 py-8 md:py-12" style={{ background: BG }}>
              <SpreadHeader label="Skin Staples" />
              <CollageSpreads products={staples} variant="a" />
              {/* Mobile: 2-col grid */}
              <div className="grid grid-cols-2 gap-x-5 gap-y-8 md:hidden">
                {staples.map((product) => (
                  <MobileProduct key={product.number} product={product} />
                ))}
              </div>
            </div>

            {/* Superstars spread */}
            <div className="max-w-6xl mx-auto px-6 py-8 md:py-12" style={{ background: BG }}>
              <SpreadHeader label="Superstars" />
              <CollageSpreads products={superstars} variant="b" />
              {/* Mobile: 2-col grid */}
              <div className="grid grid-cols-2 gap-x-5 gap-y-8 md:hidden">
                {superstars.map((product) => (
                  <MobileProduct key={product.number} product={product} />
                ))}
              </div>
            </div>
          </section>
        )
      })}

      {/* ─── Closing ──────────────────────────────────────────── */}
      <section className="py-10 md:py-16 text-center" style={{ background: BG_ALT }}>
        <div className="max-w-xl mx-auto px-6">
          <div className="font-serif text-[15px] leading-relaxed space-y-5" style={{ opacity: 0.75 }}>
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
      <div className="max-w-xl mx-auto px-6 py-10 text-center" style={{ background: BG }}>
        <p className="font-sans text-[11px]" style={{ opacity: 0.3 }}>
          This is an affiliate edit — when you shop via these links, you're supporting Beauticate at no extra cost to you.
        </p>
      </div>
    </main>
  )
}
