import HeroVideo from './HeroVideo'

// Full-bleed video hero with the signature scrim and centred headline.
// Mirrors beauticate.shop's home hero, rendered in Beauticate's editorial type.
export default function ShopHero() {
  return (
    <section className="relative w-full overflow-hidden" style={{ height: 'clamp(440px, 78vh, 760px)' }}>
      <HeroVideo />

      {/* Scrim — the house signature, darkened a touch at the foot for the headline */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,.55) 0%, rgba(0,0,0,.15) 42%, transparent 70%)' }}
      />

      <div className="absolute inset-0 flex flex-col items-center justify-end text-center px-6 pb-[clamp(40px,7vw,88px)]">
        <h1
          className="font-serif font-normal text-white max-w-[16ch]"
          style={{ fontSize: 'clamp(30px, 4.6vw, 60px)', lineHeight: 1.08 }}
        >
          essentials for a <em className="italic">beautiful</em> life.
        </h1>
        <p
          className="font-serif text-white/90 mt-3"
          style={{ fontSize: 'clamp(15px, 1.6vw, 21px)' }}
        >
          curated by editors and experts.
        </p>
      </div>
    </section>
  )
}
