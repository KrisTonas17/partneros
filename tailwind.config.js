/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)'],
        display: ['var(--font-display)'],
        mono: ['var(--font-mono)'],
      },
      colors: {
        obsidian: '#0a0a0f',
        surface: '#12121a',
        card: '#1a1a26',
        border: '#2a2a3d',
        accent: '#6366f1',
        'accent-light': '#818cf8',
        gold: '#f59e0b',
        'gold-light': '#fcd34d',
        muted: '#6b7280',
        subtle: '#9ca3af',
      },
    },
  },
  plugins: [],
}
