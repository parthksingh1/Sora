/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'blink': 'blink 4s infinite',
        'talk': 'talk 0.3s infinite'
      },
      keyframes: {
        blink: {
          '0%, 90%, 100%': { height: '44px' },
          '95%': { height: '4px' }
        },
        talk: {
          '0%, 100%': { height: '10px' },
          '50%': { height: '16px' }
        }
      }
    },
  },
  plugins: [],
}
