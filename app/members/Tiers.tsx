const tiers = [
  {
    name: 'The Edit',
    tagline: "You’re in. The inner circle.",
    reach: "Join and you’re here. Everyone starts on The Edit.",
    unlocks: [
      'Early access to new edits and drops',
      'Occasional sampling',
      'A digital welcome',
    ],
  },
  {
    name: 'The Insiders',
    tagline: 'Trusted, recognised, heard.',
    reach: 'Around 3,000 points (roughly A$600 spent, or spending plus engagement).',
    unlocks: [
      'Everything in The Edit',
      'Priority sampling',
      'Exclusive content',
      'Digital events and Q&As',
      'A personal note from Sig',
      /* Shipping benefit placeholder — do not display until confirmed */
    ],
  },
  {
    name: 'The Icons',
    tagline: 'Part of the brand story.',
    reach: 'Around 10,000 points (roughly A$2,000 spent) or by invitation.',
    unlocks: [
      'Everything above',
      'First-pick sampling',
      'Invitations to real-life events and brand dinners',
      'Reviews quoted in articles',
      'A personal call or DM from Sig',
    ],
  },
]

const TIERS_LIVE = false

export default function Tiers() {
  return (
    <section className="py-20 md:py-28 px-6 bg-parchment">
      <div className="max-w-wide mx-auto">
        <div className="text-center mb-16">
          <span className="block font-sans text-[11px] tracking-[0.34em] uppercase font-medium opacity-50 mb-3">
            The Three Tiers
          </span>
          <h2
            className="font-serif font-normal"
            style={{ fontSize: 'clamp(24px, 3vw, 36px)' }}
          >
            Where you start. Where it goes.
          </h2>
        </div>

        {!TIERS_LIVE && (
          <p className="text-center font-serif italic opacity-60 mb-12 text-[15px]">
            Tiers go live when the club launches. Here&rsquo;s what&rsquo;s coming.
          </p>
        )}

        <div className="grid md:grid-cols-3 gap-8 max-w-[1040px] mx-auto">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className="bg-paper p-8 md:p-10 border border-line"
            >
              <h3 className="font-display text-[20px] mb-1">{tier.name}</h3>
              <p className="font-serif italic text-[15px] opacity-60 mb-5">
                {tier.tagline}
              </p>
              <p className="font-sans text-[12px] tracking-wide uppercase opacity-50 mb-2">
                How you get here
              </p>
              <p className="font-serif text-[14px] leading-relaxed opacity-80 mb-6">
                {tier.reach}
              </p>
              <p className="font-sans text-[12px] tracking-wide uppercase opacity-50 mb-2">
                What it unlocks
              </p>
              <ul className="space-y-2">
                {tier.unlocks.map((item, i) => (
                  <li
                    key={i}
                    className="font-serif text-[14px] leading-relaxed opacity-80 pl-4 relative before:content-['\2013'] before:absolute before:left-0 before:opacity-40"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
