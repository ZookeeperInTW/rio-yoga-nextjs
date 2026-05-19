import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './context/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        surface2: 'var(--surface2)',
        fg: 'var(--fg)',
        dim: 'var(--dim)',
        line: 'var(--line)',
        accent: 'var(--accent)',
        'accent-soft': 'var(--accent-soft)',
        'accent-ink': 'var(--accent-ink)',
        ok: 'var(--ok)',
        'ok-soft': 'var(--ok-soft)',
        purple: { soft: '#E4DDEE', ink: '#3F2E5C', bar: '#7C5FBA' },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'var(--font-mono)', 'monospace'],
      },
      boxShadow: {
        clay: '0 8px 20px rgba(194,106,74,0.35)',
        modal: '0 30px 80px rgba(0,0,0,0.3)',
      },
    },
  },
  plugins: [],
}

export default config
