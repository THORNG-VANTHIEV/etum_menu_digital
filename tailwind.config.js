/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // Dark mode is toggled by the `dark` class on <html> (theme button in the header)
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        khmer: ['"Kantumruy Pro"', '"Battambang"', 'system-ui', 'sans-serif'],
        sans: ['"Kantumruy Pro"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      screens: {
        'xs': '360px',
      },
      colors: {
        // Dark-mode surfaces taken from the palm tree in the shop logo (palm-900 = #341C10)
        palm: {
          600: '#7D5538',
          700: '#64402A',
          800: '#4A2A1A',
          900: '#341C10',
          950: '#1C0E07',
        },
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

