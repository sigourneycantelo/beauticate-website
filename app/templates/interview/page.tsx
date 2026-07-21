import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getArticleBySlug, getRelatedArticles } from '@/lib/content'
import { notFound } from 'next/navigation'
import AuthorByline from '@/components/article/AuthorByline'
import ShareButtons from '@/components/article/ShareButtons'
import FAQPanel from '@/components/shared/FAQPanel'
import SubscribeBand from '@/components/shared/SubscribeBand'
import ArticleGrid from '@/components/article/ArticleGrid'


export const metadata: Metadata = {
  title: 'Template: Interview — Rae Morris',
  robots: { index: false },
}

const h2Style = '[&>h2]:text-[clamp(18px,2.2vw,22px)] [&>h2]:font-sans [&>h2]:tracking-[0.06em] [&>h2]:uppercase [&>h2]:text-charcoal-light [&>h2]:font-medium [&>h2]:mb-5 [&>h2]:mt-2'

const imgDir = '/content/interviews/creatives/rae-morris-interview'

export default function InterviewTemplate() {
  const article = getArticleBySlug(['interviews', 'creatives', 'rae-morris-interview'])
  if (!article) notFound()

  const { frontmatter: f } = article
  const related = getRelatedArticles('rae-morris-interview', 'interviews', f.tags ?? [])

  return (
    <article className="pb-16 md:pb-0">

      {/* ── HERO ── */}
      <div className="hidden md:block max-w-[1200px] mx-auto">
        <div className="relative w-full aspect-[16/9]">
          <Image
            src={`${imgDir}/hero.jpg`}
            alt="Rae Morris at her desk applying makeup with brushes arranged around her"
            fill
            sizes="1200px"
            className="object-cover"
            priority
          />
        </div>
      </div>
      <div className="md:hidden relative w-full aspect-[3/4]">
        <Image
          src={`${imgDir}/hero.jpg`}
          alt="Rae Morris at her desk applying makeup with brushes arranged around her"
          fill
          sizes="100vw"
          className="object-cover object-top"
          priority
        />
      </div>

      {/* ── TITLE + STANDFIRST ── */}
      <div className="max-w-[1200px] mx-auto px-[clamp(20px,3vw,34px)]">
        <div className="max-w-[720px] mx-auto py-10">
          <nav className="text-[11.5px] font-sans font-medium tracking-[0.12em] uppercase text-charcoal-light mb-6 flex gap-2 flex-wrap">
            <Link href="/interviews" className="hover:text-charcoal transition-colors">interviews</Link>
            <span>/</span>
            <Link href="/interviews/creatives" className="hover:text-charcoal transition-colors">creatives</Link>
          </nav>

          <h1 className="mb-4">{f.title}</h1>
          {f.excerpt && (
            <p className="font-serif text-[18px] leading-[1.65] text-charcoal-light mb-6">{f.excerpt}</p>
          )}

          <AuthorByline
            name={f.author ?? 'Beauticate Editorial'}
            date={f.date_published}
            readingTime={f.reading_time}
          />

          <aside className="mt-8 mb-10 border border-line p-6 sm:p-8 bg-parchment">
            <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-wine mb-3">About the Guest</p>
            <h3 className="text-lg mb-2">Rae Morris</h3>
            <p className="font-serif text-[15px] leading-relaxed text-charcoal-light">
              International makeup artist, author and brush designer. Rae is self-taught, having started in hairdressing
              at 14 before a chance encounter with Naomi Campbell at a modelling pageant in Istanbul launched her career.
              She has worked with Pink, Kelly Rowland, Sarah Jessica Parker and Dita Von Teese, and designed her own
              magnetic brush range in collaboration with one of the world&rsquo;s oldest brush makers.
            </p>
          </aside>

          <div className="prose prose-lg max-w-none mb-12">
            <h4>Long one of the most globally recognisable names in makeup artistry, and renowned for her exquisitely refined eye for detail, it would be easy to presume perfection was <a href="https://raemorris.com/" target="_blank" rel="noopener noreferrer">Rae Morris&rsquo;</a> entire way of life. Not so. Rae gets honest and frank with us about her simple tomboy childhood, her physical and mental health challenges, and the sparkling career that she insists happened quite by accident &mdash; a glamorous one involving none other than Naomi Campbell.</h4>
            <p>Following mentorship by David Bowie&rsquo;s makeup artist, a healthy dose of innate creativity and talent was unleashed. Three decades on, her no-nonsense yet warm approach makes it clear why A-listers insist she be wielding the brush. Her exacting taste and balance are part of the reason one of the world&rsquo;s oldest brush makers (180 years and counting) chose her for their only collaboration. Her willingness to make mistakes and work through them, whether on set or in life, explains why she remains a stalwart in the fickle world of fashion.</p>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          PARALLAX 1 — Growing Up (portrait RIGHT)
          ══════════════════════════════════════════════════════════ */}
      <div className="max-w-[1200px] mx-auto px-[clamp(20px,3vw,34px)]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
          <div className={`prose prose-lg max-w-none ${h2Style} py-8 md:py-16`}>
            <h2>Growing Up with Dyslexia: How Childhood Shaped a Career in Beauty</h2>
            <p>My childhood was quite simple, and I was very much a tomboy. My younger brother and I grew up on acreage in Brisbane with typical working parents. School wasn&rsquo;t easy for me &mdash; I struggled academically, partly because of dyslexia and partly because of my health, and eventually failed.</p>
            <p>Looking back though, I&rsquo;m grateful to have grown up in the &rsquo;80s, because that era was filled with such bold influences in hair, makeup, and fashion. Being exposed to icons like Boy George, Duran Duran, and Kiss really planted the seed for what would become my lifelong passion for those worlds.</p>
          </div>
          <div className="md:sticky md:top-24 self-start">
            <div className="relative w-full max-w-[750px] aspect-[750/970]">
              <Image
                src={`${imgDir}/Rae-1-1.jpg`}
                alt="Rae Morris portrait in a dark blazer, looking directly at camera"
                fill
                sizes="(max-width: 768px) 100vw, 550px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Landscape break — rae-7b ── */}
      <div className="my-14 md:my-20 max-w-[1200px] mx-auto">
        <div className="relative w-full aspect-[2/1] overflow-hidden">
          <Image
            src={`${imgDir}/rae-7b.jpg`}
            alt="Rae Morris standing in a black blazer over a burgundy tee, adjusting her glasses beside a styled bookshelf"
            fill
            sizes="(max-width: 768px) 100vw, 1200px"
            className="object-cover"
          />
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          PARALLAX 2 — Health (portrait LEFT)
          ══════════════════════════════════════════════════════════ */}
      <div className="max-w-[1200px] mx-auto px-[clamp(20px,3vw,34px)]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
          <div className="md:sticky md:top-24 self-start order-2 md:order-1">
            <div className="relative w-full max-w-[750px] aspect-[750/946]">
              <Image
                src={`${imgDir}/Rae-3b.jpg`}
                alt="Rae Morris in a relaxed pose wearing glasses, natural light from a window"
                fill
                sizes="(max-width: 768px) 100vw, 550px"
                className="object-cover"
              />
            </div>
          </div>
          <div className={`prose prose-lg max-w-none ${h2Style} py-8 md:py-16 order-1 md:order-2`}>
            <h2>On Depression, Chronic Illness and Finding the Right Help</h2>
            <p>I&rsquo;ve had a few really tough chapters in my life of physical and mental health struggles.</p>
            <p>As a kid and teenager I had a rare neuropathy that affected my peripheral nerves. It meant having many surgeries, and I spent a lot of high school in hospital because of that.</p>
            <p>In my early twenties, I struggled with depression so severely that I was hospitalised. The turning point for me in finding my way through that was meeting the right therapist. I had tried medication, seen many doctors, and struggled for years, but eventually I found someone who really understood the severity of my depression.</p>
          </div>
        </div>
      </div>

      {/* ── Landscape break — rae-10 ── */}
      <div className="my-14 md:my-20 max-w-[1200px] mx-auto">
        <div className="relative w-full aspect-[2/1] overflow-hidden">
          <Image
            src={`${imgDir}/rae-10.jpg`}
            alt="Rae Morris seated in a black blazer, chin resting on her hand, with a black-and-white photograph behind her"
            fill
            sizes="(max-width: 768px) 100vw, 1200px"
            className="object-cover"
          />
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          PARALLAX 3 — Postnatal Depression (portrait RIGHT)
          ══════════════════════════════════════════════════════════ */}
      <div className="max-w-[1200px] mx-auto px-[clamp(20px,3vw,34px)]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
          <div className={`prose prose-lg max-w-none ${h2Style} py-8 md:py-16`}>
            <h2>Postnatal Depression: Why Asking &ldquo;Are You Okay?&rdquo; Matters</h2>
            <p>The hardest time of all came after the birth of my beautiful daughter. When I became pregnant with her, my therapist helped to prepare me for what may come next. I wasn&rsquo;t truly ready for what followed, but I can see therapy did help guide me through it all. I went through extreme postnatal depression; I had never imagined things could feel so dark.</p>
            <p>Thankfully, I reached out for help and received this amazing therapy, which pulled me through. Now, when I reflect back on that period, I can see it was absolutely the darkest time of my life, but also one that gave me the resilience and empathy that I carry with me today.</p>
            <p>I also learned that I shouldn&rsquo;t have suffered in silence. Shame kept me from reaching out to the people around me, but when I finally opened up, I discovered so many other women had been through the same thing. Now, whenever I meet a new mum, the first thing I ask her is, &ldquo;are you okay?&rdquo; I was never asked that, and I think it could have made a big difference.</p>
          </div>
          <div className="md:sticky md:top-24 self-start">
            <div className="relative w-full max-w-[750px] aspect-[750/997]">
              <Image
                src={`${imgDir}/Rae-5.jpg`}
                alt="Rae Morris in a contemplative moment, wearing a burgundy top"
                fill
                sizes="(max-width: 768px) 100vw, 550px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Landscape break — rae-3a (brush detail) ── */}
      <div className="my-14 md:my-20 max-w-[1200px] mx-auto">
        <div className="relative w-full aspect-[2/1] overflow-hidden">
          <Image
            src={`${imgDir}/rae-3a.jpg`}
            alt="Close-up of hands dipping a fine makeup brush into a small pot of dark gel liner"
            fill
            sizes="(max-width: 768px) 100vw, 1200px"
            className="object-cover"
          />
        </div>
      </div>

      {/* ── Pull Quote 1 ── */}
      <div className="max-w-[1200px] mx-auto px-[clamp(20px,3vw,34px)]">
        <blockquote className="max-w-[420px] mx-auto my-20 md:my-28">
          <p
            className="font-serif italic text-chocolate leading-[1.1] tracking-[-0.015em] text-center"
            style={{ fontSize: 'clamp(36px, 5vw, 62px)' }}
          >
            &ldquo;My career as a makeup artist really happened by accident&rdquo;
          </p>
        </blockquote>
      </div>

      {/* ══════════════════════════════════════════════════════════
          PARALLAX 4 — Career (portrait LEFT)
          ══════════════════════════════════════════════════════════ */}
      <div className="max-w-[1200px] mx-auto px-[clamp(20px,3vw,34px)]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
          <div className="md:sticky md:top-24 self-start order-2 md:order-1">
            <div className="relative w-full max-w-[750px] aspect-[750/978]">
              <Image
                src={`${imgDir}/Rae-8a.jpg`}
                alt="Rae Morris with her hair tucked behind her ear, wearing a dark top"
                fill
                sizes="(max-width: 768px) 100vw, 550px"
                className="object-cover"
              />
            </div>
          </div>
          <div className={`prose prose-lg max-w-none ${h2Style} py-8 md:py-16 order-1 md:order-2`}>
            <h2>How Rae Morris Became a Makeup Artist</h2>
            <p>I often say it was two seconds of Naomi Campbell&rsquo;s life that completely changed mine.</p>
            <p>At the time I was working as a hairdresser backstage in Istanbul, and Naomi needed her makeup touched up. I popped some lipgloss on her, and that moment happened to be photographed.</p>
            <p>From then on I was suddenly booked as an international makeup artist, even though I had no formal makeup training at the time. I think because of my background in doing hair, makeup felt like a natural extension.</p>
            <p>Fate played a hand in my development again when I met the late <a href="https://raemorris.com/" target="_blank" rel="noopener noreferrer">Richard Sharah</a>, David Bowie&rsquo;s makeup artist, who mentored me. That chance encounter and early guidance truly set me on the path to what I do today.</p>
          </div>
        </div>
      </div>

      {/* ── Landscape break — rae-4 (overhead kit) ── */}
      <div className="my-14 md:my-20 max-w-[1200px] mx-auto">
        <div className="relative w-full aspect-[2/1] overflow-hidden">
          <Image
            src={`${imgDir}/rae-4.jpeg`}
            alt="Overhead view of a professional makeup kit with neatly organised lipsticks, foundations and skincare"
            fill
            sizes="(max-width: 768px) 100vw, 1200px"
            className="object-cover"
          />
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          PARALLAX 5 — Fashion World (portrait RIGHT)
          ══════════════════════════════════════════════════════════ */}
      <div className="max-w-[1200px] mx-auto px-[clamp(20px,3vw,34px)]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
          <div className={`prose prose-lg max-w-none ${h2Style} py-8 md:py-16`}>
            <h2>What Working in Fashion Is Really Like</h2>
            <p>I absolutely love the spontaneity of my work; no one day is ever the same as the next. I&rsquo;m surrounded by incredibly creative people &mdash; actors, singers, photographers, fashion designers, artists &mdash; and I feel lucky to be a part of a community where creativity is encouraged and celebrated.</p>
            <p>What comes along with the spontaneity is the instability of my schedule, which can be hard. I rarely know when I&rsquo;ll start or finish a job, which makes it challenging to plan holidays and family events.</p>
            <p>Another tricky element to deal with in this world are the egos. I&rsquo;ve come to realise over the years that the bigger their ego, the more insecure the person usually is, and the more love they actually need.</p>
          </div>
          <div className="md:sticky md:top-24 self-start">
            <div className="relative w-full max-w-[750px] aspect-[750/999]">
              <Image
                src={`${imgDir}/Rae-8b.jpg`}
                alt="Rae Morris holding makeup brushes, styled in all black"
                fill
                sizes="(max-width: 768px) 100vw, 550px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Subscribe Band — full-width strip ── */}
      <SubscribeBand />

      {/* ── Pull Quote 2 ── */}
      <div className="max-w-[1200px] mx-auto px-[clamp(20px,3vw,34px)]">
        <blockquote className="max-w-[420px] mx-auto my-20 md:my-28">
          <p
            className="font-serif italic text-chocolate leading-[1.1] tracking-[-0.015em] text-center"
            style={{ fontSize: 'clamp(36px, 5vw, 62px)' }}
          >
            &ldquo;I absolutely love the spontaneity of my work&rdquo;
          </p>
        </blockquote>
      </div>

      {/* ══════════════════════════════════════════════════════════
          PARALLAX 6 — Beauty Philosophy (portrait LEFT)
          ══════════════════════════════════════════════════════════ */}
      <div className="max-w-[1200px] mx-auto px-[clamp(20px,3vw,34px)]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
          <div className="md:sticky md:top-24 self-start order-2 md:order-1">
            <div className="relative w-full max-w-[750px] aspect-[750/1028]">
              <Image
                src={`${imgDir}/Rae-9.jpg`}
                alt="Rae Morris applying makeup, focused concentration"
                fill
                sizes="(max-width: 768px) 100vw, 550px"
                className="object-cover"
              />
            </div>
          </div>
          <div className={`prose prose-lg max-w-none ${h2Style} py-8 md:py-16 order-1 md:order-2`}>
            <h2>The Makeup Trick Every Beginner Should Know</h2>
            <p>My favourite makeup trick is what I call &lsquo;paint it on, clean it up after&rsquo;.</p>
            <p>You can draw the messiest eyeliner ever, then refine it with a brush. You can smudge brows with powder, then clean up the shape with foundation or micellar water. I even do it with lips.</p>
            <p>Makeup isn&rsquo;t about creating a perfect shape in one go. It&rsquo;s about knowing how to fix mistakes and create something that works for you.</p>
            <p>While I do get excited about beauty products, it&rsquo;s the brushes, the instruments, and the precision tools which I treasure the most. Japanese-made tweezers and eyelash curlers are favourites, and of course, <a href="https://raemorris.com/" target="_blank" rel="noopener noreferrer">my own makeup brushes</a>.</p>
          </div>
        </div>
      </div>

      {/* ── Landscape break — rae-14 ── */}
      <div className="my-14 md:my-20 max-w-[1200px] mx-auto">
        <div className="relative w-full aspect-[2/1] overflow-hidden">
          <Image
            src={`${imgDir}/rae-14.jpeg`}
            alt="Rae Morris by a window, hand in her hair, wearing glasses and a black blazer over a burgundy tee"
            fill
            sizes="(max-width: 768px) 100vw, 1200px"
            className="object-cover"
          />
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          PARALLAX 7 — Style (portrait RIGHT)
          ══════════════════════════════════════════════════════════ */}
      <div className="max-w-[1200px] mx-auto px-[clamp(20px,3vw,34px)]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
          <div className={`prose prose-lg max-w-none ${h2Style} py-8 md:py-16`}>
            <h2>Minimalist Style: Japanese Fashion and Androgynous Dressing</h2>
            <p>My work is so messy and most of the time I&rsquo;m covered in makeup. As a result a lot of my wardrobe is black! I gravitate toward minimalist, androgynous looks with subtle Japanese influences.</p>
            <p>I get a lot of inspiration in Japan, especially in Shibuya. <a href="https://www.doverstreetmarket.com/" target="_blank" rel="noopener noreferrer">Dover Street Market</a> is my favourite store. Designers I admire include Celine, Saint Laurent, Issey Miyake, Yohji Yamamoto, Comme des Garcons, and Rick Owens.</p>
            <p>Japanese street style is what I&rsquo;m always drawn to. Comfort is key. I only wear pieces I can actually live in, regardless of the price and designer.</p>
          </div>
          <div className="md:sticky md:top-24 self-start">
            <div className="relative w-full max-w-[750px] aspect-[750/927]">
              <Image
                src={`${imgDir}/Rae-12.jpg`}
                alt="Rae Morris in minimalist black outfit, reflecting her Japanese-influenced style"
                fill
                sizes="(max-width: 768px) 100vw, 550px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Landscape break — rae-6 ── */}
      <div className="my-14 md:my-20 max-w-[1200px] mx-auto">
        <div className="relative w-full aspect-[2/1] overflow-hidden">
          <Image
            src={`${imgDir}/rae-6.jpg`}
            alt="Rae Morris applying lip product while holding a compact mirror, glasses on, with makeup brushes and orchids behind her"
            fill
            sizes="(max-width: 768px) 100vw, 1200px"
            className="object-cover"
          />
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          PARALLAX 8 — Skincare (portrait LEFT)
          ══════════════════════════════════════════════════════════ */}
      <div className="max-w-[1200px] mx-auto px-[clamp(20px,3vw,34px)]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
          <div className="md:sticky md:top-24 self-start order-2 md:order-1">
            <div className="relative w-full max-w-[750px] aspect-[750/979]">
              <Image
                src={`${imgDir}/Rae-13.jpg`}
                alt="Rae Morris with natural makeup, warm light"
                fill
                sizes="(max-width: 768px) 100vw, 550px"
                className="object-cover"
              />
            </div>
          </div>
          <div className={`prose prose-lg max-w-none ${h2Style} py-8 md:py-16 order-1 md:order-2`}>
            <h2>Best Skincare Routine for Pigmentation and Sensitive Skin</h2>
            <p>My hair has become a bit of a living nightmare! It was always thick and wavy, but after having my daughter I lost about 60% of it. Now, about half of it is grey, which means the texture of those sections has also changed to become wiry and curly.</p>
            <p>To try to combat the hair loss, I&rsquo;ve been getting treatments at the <a href="https://odedermatology.com.au/" target="_blank" rel="noopener noreferrer">ODE Clinic</a> with Dr Shammi Theason and am pleased to say I am noticing new growth.</p>
            <p>My skincare is fairly simple. I rotate between a few brands because I find my skin does best when I mix things up. I love <a href="https://bespokeskintechnology.com/dr-katherine-armour/" target="_blank" rel="noopener noreferrer">Bespoke Skin Technology by Dr Katherine Armour</a>, which helps with pigmentation. I&rsquo;m also obsessed with <a href="https://eu.allies.shop/collections/spf" target="_blank" rel="noopener noreferrer">Allies of Skin</a>, especially their sunscreen, and I&rsquo;ve recently rediscovered SkinCeuticals.</p>
          </div>
        </div>
      </div>

      {/* ── Landscape breaks — rae-2 + rae-11 ── */}
      <div className="my-14 md:my-20 max-w-[1200px] mx-auto">
        <div className="relative w-full aspect-[2/1] overflow-hidden">
          <Image
            src={`${imgDir}/rae-2.jpg`}
            alt="Rae Morris seated in a velvet armchair wearing a burgundy sweater, hand to her neck, small dog beside her"
            fill
            sizes="(max-width: 768px) 100vw, 1200px"
            className="object-cover"
          />
        </div>
      </div>
      <div className="mb-14 md:mb-20 max-w-[1200px] mx-auto">
        <div className="relative w-full aspect-[2/1] overflow-hidden">
          <Image
            src={`${imgDir}/rae-11.jpg`}
            alt="Close-up of two Rae Morris makeup brushes with soft white bristles and matte black handles"
            fill
            sizes="(max-width: 768px) 100vw, 1200px"
            className="object-cover"
          />
        </div>
      </div>

      {/* ── Pull Quote 3 ── */}
      <div className="max-w-[1200px] mx-auto px-[clamp(20px,3vw,34px)]">
        <blockquote className="max-w-[420px] mx-auto my-20 md:my-28">
          <p
            className="font-serif italic text-chocolate leading-[1.1] tracking-[-0.015em] text-center"
            style={{ fontSize: 'clamp(36px, 5vw, 62px)' }}
          >
            &ldquo;I have a really positive attitude towards ageing&rdquo;
          </p>
        </blockquote>

        {/* ── Section 9: On Ageing — text only ── */}
        <div className={`max-w-[720px] mx-auto prose prose-lg max-w-none ${h2Style}`}>
          <h2>Ageing Gracefully: Skincare Over Heavy Makeup</h2>
          <p>At 55, I feel blessed to see getting older as being about the importance of staying as well and healthy as possible, rather than being too concerned about external changes.</p>
          <p>My mum is a big influence. She&rsquo;s in her mid-eighties and still incredibly active &mdash; still going to the gym, still running. Seeing her as compared to so many other people her age has made me focus on caring for my body now, hoping it will see me in as good a stead as hers is when I am at that stage myself.</p>
          <p>In terms of how the skin changes as we age, I prefer to focus on good skin health rather than covering up damage with a lot of makeup. I&rsquo;ll do treatments like Botox or peels, but always with the aim of making my skin look and feel great, rather than wanting to change how my face looks.</p>
        </div>

        {/* ── Credits ── */}
        <div className="max-w-[720px] mx-auto">
          <p className="font-sans text-[10px] tracking-[0.2em] uppercase leading-snug my-10 text-charcoal-light/60">
            Story by Zoe Briggs &middot; Images provided
          </p>
        </div>

        {/* ── FAQ + Share ── */}
        <div className="max-w-[720px] mx-auto">
          {f.faqs && f.faqs.length > 0 && (
            <div className="mt-12">
              <FAQPanel faqs={f.faqs} />
            </div>
          )}
          <ShareButtons
            url="/interviews/creatives/rae-morris-interview"
            title={f.title}
            image={f.featured_image}
          />
        </div>
      </div>

      {/* ── Related Posts ── */}
      {related.length > 0 && (
        <div className="border-t border-line">
          <div className="max-w-wide mx-auto px-[clamp(20px,3vw,34px)] py-10">
            <h2 className="mb-8">You might also like</h2>
            <ArticleGrid articles={related as any} />
          </div>
        </div>
      )}
    </article>
  )
}
