import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './content/**/*.{mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Beauticate brand colours — update with exact hex once confirmed
        paper:     '#FFFFFF',
        parchment: '#FBF9F4',
        ink:       '#1C1A17',
        eucalypt:  '#8E9A82',
        teal:      '#104760',
        // brand accents — use sparingly
        camel:      '#DBCEB9',
        terracotta: '#B5613A',
        mist:       '#BABED8',
        aqua:       '#BFFFF5',
        // legacy aliases kept so existing components don't break
        cream:    { DEFAULT: '#FFFFFF', 50: '#FFFFFF', 100: '#FBF9F4', 200: '#ebebeb' },
        charcoal: { DEFAULT: '#1C1A17', light: '#3d3d3d' },
      },
      fontFamily: {
        // Update once brand fonts confirmed
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans:  ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#1C1A17',
            fontFamily: 'var(--font-serif)',
            fontSize: '1.125rem',
            lineHeight: '1.8',
            a: { color: '#1C1A17', '&:hover': { color: '#8E9A82' } },
            h1: { fontFamily: 'var(--font-serif)', letterSpacing: '-0.02em' },
            h2: { fontFamily: 'var(--font-serif)', letterSpacing: '-0.01em' },
            h3: { fontFamily: 'var(--font-serif)' },
            h4: { fontFamily: 'var(--font-sans)', textTransform: 'uppercase', letterSpacing: '0.34em', fontSize: '0.7rem', fontWeight: '400' },
            p:  { fontFamily: 'var(--font-serif)' },
          },
        },
      },
      maxWidth: {
        content: '720px',
        wide: '1200px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

export default config
