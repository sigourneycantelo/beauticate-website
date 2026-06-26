// "The edit, in your inbox" — newsletter capture. Mirrors the shop's newsletter section.
export default function ShopNewsletter() {
  return (
    <section
      className="text-center"
      style={{ background: '#FBF9F4', borderTop: '1px solid rgba(28,26,23,.10)', padding: 'clamp(52px,6vw,84px) clamp(20px,6vw,104px)' }}
    >
      <p className="font-sans" style={{ fontSize: '11px', letterSpacing: '0.34em', textTransform: 'uppercase', opacity: 0.5 }}>
        Join the list
      </p>
      <h2 className="font-serif font-normal mt-3" style={{ fontSize: 'clamp(24px,3vw,38px)' }}>
        The edit, in your <em className="italic">inbox</em>.
      </h2>
      <p className="font-serif mx-auto mt-4 max-w-[52ch]" style={{ fontSize: 'clamp(15px,1.5vw,18px)', lineHeight: 1.6, opacity: 0.72 }}>
        The products our editors and the Beauticate Collective are reaching for right now. Chosen by
        people who've spent decades knowing the difference. No noise, just the good stuff.
      </p>
      <p className="font-serif italic mt-3" style={{ fontSize: 'clamp(14px,1.4vw,17px)', opacity: 0.6 }}>
        We email like we edit. Sparingly, and only when it's worth it.
      </p>

      <form action="/api/subscribe" method="POST" className="flex max-w-[420px] mx-auto mt-7">
        <input
          type="email"
          name="email"
          required
          placeholder="Your email address"
          className="flex-1 font-sans text-[13px] px-4 py-3 bg-white"
          style={{ border: '1px solid #1C1A17', borderRight: 'none' }}
        />
        <button
          type="submit"
          className="font-sans text-[10.5px] tracking-[0.2em] uppercase text-white px-5 cursor-pointer"
          style={{ background: '#1C1A17', border: '1px solid #1C1A17' }}
        >
          Subscribe
        </button>
      </form>
    </section>
  )
}
