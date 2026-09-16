/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Sora', 'sans-serif'],
        body: ['Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      colors: {
        space: {
          950: '#06090f',
          900: '#0b111a',
          850: '#0f1724',
          800: '#152033',
          700: '#1e2d46',
        },
        slate: {
          250: '#c8d5e6',
          350: '#9db4ce',
        },
        ember: {
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
        }
      }
    },
  },
  plugins: [],
}
