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
        cream: {
          50:  '#fdfcf9',
          100: '#faf7f0',
          200: '#f4ede0',
          DEFAULT: '#f4ede0',
        },
        charcoal: {
          DEFAULT: '#1a1a1a',
          light: '#3d3d3d',
        },
        blush: {
          DEFAULT: '#c9a99a',
          light: '#e8d5cd',
        },
        gold: {
          DEFAULT: '#b8965a',
          light: '#d4b483',
        },
      },
      fontFamily: {
        // Update once brand fonts confirmed
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans:  ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#1a1a1a',
            fontFamily: 'var(--font-serif)',
            fontSize: '1.125rem',
            lineHeight: '1.8',
            a: { color: '#b8965a', '&:hover': { color: '#8a6e3f' } },
            h1: { fontFamily: 'var(--font-serif)', letterSpacing: '-0.02em' },
            h2: { fontFamily: 'var(--font-serif)', letterSpacing: '-0.01em' },
            h3: { fontFamily: 'var(--font-serif)' },
            h4: { fontFamily: 'var(--font-sans)', textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '0.7rem', fontWeight: '300' },
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
