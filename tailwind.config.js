/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        accent: 'var(--accent)',
        secondary: 'var(--secondary)',
        terminal: '#c8ff00',
        dark: {
          bg: '#0a0e27',
          card: '#1a1a2e',
        }
      },
      fontFamily: {
        mono: ['Courier New', 'monospace'],
        serif: ['Lora', 'serif'],
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
