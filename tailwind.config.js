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
        brand: {
          DEFAULT: '#0f52ba',
          light: '#1e6be6',
          dark: '#0a3a85',
        },
        primary: {
          50: '#f0f7ff',
          100: '#e0efff',
          200: '#badbff',
          300: '#7db8ff',
          400: '#388eff',
          500: '#0f52ba', // Sapphire Blue
          600: '#0d47a1',
          700: '#0a3a85',
          800: '#082d66',
          900: '#061f47',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

