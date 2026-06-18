import Image from 'next/image'

const COLLECTIVE = [
  { name: 'Sigourney Cantelo', role: 'Founder & Publisher', photo: '/images/collective/sigourney-cantelo.jpg' },
  { name: 'Jocelyn Petroni', role: 'Skin Editor', photo: '/images/collective/jocelyn-petroni.png' },
  { name: 'Monique McMahon', role: 'Hair Editor', photo: '/images/collective/monique-mcmahon.png' },
  { name: 'Rae Morris', role: 'Makeup Editor', photo: '/images/collective/rae-morris.png' },
  { name: 'Kate Waterhouse', role: 'Style Editor', photo: '/images/collective/kate-waterhouse.png' },
  { name: 'Camilla Thompson', role: 'Wellness Editor', photo: '/images/collective/camilla-thompson.png' },
  { name: 'Brooke Stevenson', role: 'Mindset Expert', photo: '/images/collective/brooke-stevenson.png' },
  { name: 'Dr Amy Chahal', role: 'Aesthetics Expert', photo: '/images/collective/dr-amy-chahal.png' },
  { name: 'Dr Leanne Girgis', role: 'Health Expert', photo: '/images/collective/dr-leanne-girgis.png' },
  { name: 'Jacqueline Alwill', role: 'Nutrition Expert', photo: '/images/collective/jacqueline-alwill.png' },
  { name: 'Kerrie Gentle', role: 'Beauty Expert', photo: '/images/collective/kerrie-gentle.png' },
  { name: 'Simone Aspinall', role: 'Beauty Expert', photo: '/images/collective/simone-aspinall.png' },
  { name: 'Shentel Lee', role: 'Culture Editor', photo: '/images/collective/shentel-lee.png' },
  { name: 'Jayde Balderston', role: 'Managing Editor, PR & Partnerships', photo: '/images/collective/jayde-balderston.jpg' },
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
          <div key={m.name} className="text-center w-28">
            <div className="w-20 h-20 rounded-full mx-auto mb-3 overflow-hidden bg-cream-100 relative">
              <Image
                src={m.photo}
                alt={m.name}
                fill
                className="object-cover object-top"
                sizes="80px"
              />
            </div>
            <p className="text-sm font-medium leading-snug">{m.name}</p>
            <p className="text-xs text-charcoal-light mt-0.5">{m.role}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
