const COLLECTIVE = [
  { name: 'Sigourney Cantelo', role: 'Founder & Publisher' },
  { name: 'Jocelyn Petroni', role: 'Hair Expert' },
  { name: 'Monique McMahon', role: 'Beauty Director' },
  { name: 'Kate Waterhouse', role: 'Style Editor' },
  { name: 'Brooke Stevenson', role: 'Wellness Editor' },
]

export default function TheCollective() {
  return (
    <section className="max-w-wide mx-auto px-4 py-12 border-t border-cream-200">
      <h2 className="text-center mb-2">The Beauticate Collective</h2>
      <p className="text-center text-charcoal-light text-sm mb-10 max-w-md mx-auto">
        The editors, experts, and trusted voices behind every recommendation.
      </p>
      <div className="flex flex-wrap justify-center gap-8">
        {COLLECTIVE.map(m => (
          <div key={m.name} className="text-center w-32">
            <div className="w-20 h-20 rounded-full bg-cream-100 mx-auto mb-3" />
            <p className="text-sm font-medium">{m.name}</p>
            <p className="text-xs text-charcoal-light">{m.role}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
