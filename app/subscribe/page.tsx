import InsidersBar from '@/components/home/InsidersBar'

export const metadata = {
  title: 'Join the Beauticate Insiders',
  description: 'One beautifully edited email a week. Delivered to your inbox, every Sunday.',
}

export default function SubscribePage() {
  return (
    <main
      style={{
        background: '#FBF9F4',
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(60px,10vw,120px) clamp(20px,6vw,104px)',
        textAlign: 'center',
      }}
    >
      <span
        className="block font-sans text-[11px] tracking-[0.34em] uppercase font-medium mb-4"
        style={{ opacity: 0.55 }}
      >
        Beauticate Insiders
      </span>
      <h1
        className="font-serif font-normal"
        style={{ fontSize: 'clamp(30px,4vw,52px)', letterSpacing: '-.015em', marginBottom: '12px' }}
      >
        Join the Beauticate Insiders
      </h1>
      <p
        className="font-serif italic"
        style={{ fontSize: 'clamp(15px,1.6vw,20px)', opacity: 0.6, marginBottom: '20px' }}
      >
        fashion. beauty. wellness. living. destinations.
      </p>
      <p
        className="font-sans"
        style={{ fontSize: '14px', opacity: 0.7, maxWidth: '44ch', marginBottom: '36px', lineHeight: 1.6 }}
      >
        One beautifully edited email a week. Delivered to your inbox, every Sunday.
      </p>

      <form
        action="/api/subscribe"
        method="POST"
        className="flex flex-col sm:flex-row gap-3 w-full"
        style={{ maxWidth: '440px' }}
      >
        <input
          type="email"
          name="email"
          required
          placeholder="Your email address"
          className="flex-1 font-sans text-[13px] px-4 py-3 rounded-[1px] outline-none"
          style={{
            border: '1px solid rgba(28,26,23,.25)',
            background: '#fff',
            color: '#1C1A17',
          }}
        />
        <button
          type="submit"
          className="font-sans text-[10.5px] tracking-[0.2em] uppercase font-medium px-6 py-3 rounded-[1px] transition-opacity hover:opacity-80 whitespace-nowrap"
          style={{ background: '#1C1A17', color: '#fff', border: '1px solid #1C1A17' }}
        >
          Subscribe
        </button>
      </form>

      <p
        className="font-sans mt-5"
        style={{ fontSize: '11px', opacity: 0.4 }}
      >
        No spam, ever. Unsubscribe at any time.
      </p>
    </main>
  )
}
