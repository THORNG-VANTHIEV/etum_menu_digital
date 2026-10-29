/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        khmer: ['"Kantumruy Pro"', '"Battambang"', 'system-ui', 'sans-serif'],
        sans: ['"Kantumruy Pro"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      screens: {
        'xs': '360px',
      },
      // `backwards` fill only holds the start frame during a delay, so once an
      // animation ends it no longer overrides hover/active transforms.
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 200ms ease-out backwards',
        'fade-in-slow': 'fade-in 350ms ease-out backwards',
        'fade-in-up': 'fade-in-up 250ms ease-out backwards',
      },
    },
  },
  plugins: [],
}

