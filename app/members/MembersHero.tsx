export default function MembersHero() {
  return (
    <section className="text-center py-20 md:py-32 px-6">
      <span className="block font-sans text-[11px] tracking-[0.34em] uppercase font-medium opacity-50 mb-4">
        The Members&rsquo; Club
      </span>
      <h1
        className="font-serif font-normal max-w-[720px] mx-auto"
        style={{ fontSize: 'clamp(28px, 4vw, 44px)', lineHeight: 1.2 }}
      >
        You&rsquo;re not a customer.<br />
        You&rsquo;re an insider.
      </h1>
      <p
        className="font-serif mt-6 max-w-[540px] mx-auto opacity-70"
        style={{ fontSize: 'clamp(16px, 1.8vw, 19px)' }}
      >
        The Beauticate Members&rsquo; Club. Where trusted taste comes with access.
      </p>
      <a
        href="#join"
        className="btn-primary mt-10 inline-flex"
      >
        Join the Club
      </a>
    </section>
  )
}
