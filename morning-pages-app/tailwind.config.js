/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['EB Garamond', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        dark: '#0a0a0b',
        cream: '#e8e6e3',
        muted: '#a89984',
        subtle: '#665c54',
        faint: '#504945',
        gold: '#d79921',
        purple: '#8b5cf6',
        green: '#27ae60',
        red: '#e74c3c',
      },
    },
  },
  plugins: [],
}
