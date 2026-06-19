import Image from 'next/image'
import Link from 'next/link'

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
    <section className="bg-charcoal py-16 md:py-20">
      <div className="max-w-wide mx-auto px-4">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-cream/40 mb-2">Meet the team</p>
            <h2 className="font-serif text-3xl md:text-4xl text-cream lowercase">the beauticate collective</h2>
          </div>
          <Link href="/about-beauticate"
            className="hidden md:inline font-sans text-[10px] tracking-[0.2em] uppercase text-cream/40 hover:text-cream transition-colors">
            About us →
          </Link>
        </div>

        {/* Portrait cards — horizontal scroll on mobile, 7-col grid on desktop */}
        <div className="flex gap-3 overflow-x-auto md:overflow-visible md:grid md:grid-cols-7 pb-2 md:pb-0">
          {COLLECTIVE.map(m => (
            <div key={m.name} className="group relative flex-none w-[140px] md:w-auto aspect-[3/4] overflow-hidden bg-charcoal-light cursor-default">
              <Image
                src={m.photo}
                alt={m.name}
                fill
                className="object-cover object-top transition-transform duration-700 group-hover:scale-105 grayscale group-hover:grayscale-0"
                sizes="(max-width: 768px) 140px, 14vw"
              />
              {/* lower-third gradient */}
              <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-charcoal/90 via-charcoal/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="font-sans text-[9px] tracking-[0.16em] uppercase text-cream/50 mb-0.5">{m.role}</p>
                <p className="font-serif text-cream text-sm leading-snug lowercase">{m.name.toLowerCase()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
