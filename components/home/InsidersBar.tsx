export default function InsidersBar() {
  return (
    <section
      id="insiders"
      className="reveal text-center"
      style={{
        background: '#FBF9F4',
        borderTop: '1px solid rgba(28,26,23,.10)',
        borderBottom: '1px solid rgba(28,26,23,.10)',
        padding: 'clamp(34px,4vw,52px) clamp(20px,6vw,104px)',
      }}
    >
      <p className="font-serif italic" style={{ fontSize: 'clamp(18px,2vw,24px)' }}>
        fashion. beauty. wellness. living. destinations.
      </p>
      <p className="font-sans mt-2 mb-5" style={{ fontSize: '12.5px', letterSpacing: '.04em', opacity: 0.62 }}>
        One beautifully edited email a week. Delivered to your inbox, every Sunday.
      </p>
      <form action="/api/subscribe" method="POST" className="flex max-w-[420px] mx-auto">
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
