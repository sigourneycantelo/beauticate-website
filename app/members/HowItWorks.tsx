const steps = [
  {
    title: 'Shop and earn',
    body: 'Every purchase adds points to your balance. No codes to enter, no hoops. Just shop the way you already do and watch it build.',
  },
  {
    title: 'Climb the club',
    body: 'Points move you through three tiers. The higher you go, the closer you get to the rooms, the people and the access that matter.',
  },
  {
    title: 'Unlock access',
    body: 'Early product drops. Exclusive content. Real-life events and brand dinners. The kind of things that never hit a homepage.',
  },
]

export default function HowItWorks() {
  return (
    <section className="py-20 md:py-28 px-6">
      <div className="max-w-wide mx-auto">
        <div className="text-center mb-16">
          <span className="block font-sans text-[11px] tracking-[0.34em] uppercase font-medium opacity-50 mb-3">
            How It Works
          </span>
          <h2
            className="font-serif font-normal"
            style={{ fontSize: 'clamp(24px, 3vw, 36px)' }}
          >
            Three steps. No fine print.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-12 md:gap-16 max-w-[960px] mx-auto">
          {steps.map((step, i) => (
            <div key={i} className="text-center md:text-left">
              <span className="font-numeral text-[48px] leading-none opacity-20 block mb-3">
                {i + 1}
              </span>
              <h3 className="font-display text-[18px] mb-3">{step.title}</h3>
              <p className="font-serif text-[15px] leading-relaxed opacity-70">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
